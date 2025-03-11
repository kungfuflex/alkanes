import * as envelope from "alkanes/lib/index.js";
import fs from "fs-extra";
import path from "path";
import { hex } from "@scure/base";
import * as envelope from "../lib/esm/index.js";
import fs from "fs-extra";
import path from "path";
import { hex } from "@scure/base";
import * as btc from "@scure/btc-signer";
import { encodeRunestoneProtostone } from "../lib/esm/protorune/proto_runestone_upgrade.js";
import { encipher } from "../lib/esm/bytes.js";
import { ProtoStone } from "../lib/esm/protorune/protostone.js";
import crypto from "node:crypto";
import { schnorr as secp256k1_schnorr } from "@noble/curves/secp256k1";
import { REGTEST_PARAMS } from "./lib/constants";
import { gzip as _gzip } from "node:zlib";
import { promisify } from "node:util";
import { Client } from "./lib/client";
import { REGTEST_FAUCET } from "./lib/constants";
import { BitcoinBlock } from "bitcoin-block";
import bip39 = require("bip39");
import BIP32Factory from "bip32";
import bitcoin = require("bitcoinjs-lib");
import * as ecc from "tiny-secp256k1";
import * as shim from "./lib/shim";
import { getLogger } from "./lib/logger";

const rpc: any = shim.rpc;
const logger = getLogger("alkanes:wrap-frbtc");
const AUTH_TOKEN_FACTORY_ID = BigInt(0xffee);
const TEST_MULTISIG =
  "bcrt1pys2f8u8yx7nu08txn9kzrstrmlmpvfprdazz9se5qr5rgtuz8htsaz3chd";

const timeout = async (n) =>
  await new Promise((resolve) => setTimeout(resolve, n));

const bip32 = BIP32Factory(ecc);

const client = new Client("regtest");

async function waitForSync(maxAttempts = 60): Promise<void> {
  for (let i = 0; i < maxAttempts; i++) {
    const btcHeight = Number((await client.call("getblockcount")).data.result);
    const msHeight = Number(await rpc.height());
    logger.info("btc: " + btcHeight + "|metashrew: " + msHeight);

    if (msHeight >= btcHeight) {
      return;
    }

    await timeout(1000); // 1 second delay between attempts
  }

  throw new Error("Timeout waiting for Metashrew to sync with Bitcoin height");
}

const gzip = promisify(_gzip);

const getAddress = (node) => {
  return bitcoin.payments.p2wpkh({
    pubkey: node.publicKey,
    network: bitcoin.networks.regtest,
  }).address;
};

const getPrivate = (mnemonic) => {
  const seed = bip39.mnemonicToSeedSync(mnemonic);
  const root = bip32.fromSeed(seed, bitcoin.networks.regtest);
  return root.derivePath("m/84'/0'/0'/0/0");
};
export async function wrapBTC() {
  logger.info("Starting BTC wrapping operation");
  const faucetPrivate = getPrivate(REGTEST_FAUCET.mnemonic);
  const faucetAddress = getAddress(faucetPrivate);
  logger.debug(`Using faucet address: ${faucetAddress}`);

  // We need this to enable custom scripts outside
  const customScripts = [envelope.OutOrdinalReveal];
  const blockHash = await client.call("generatetoaddress", 200, faucetAddress);
  logger.info("Generated initial blocks");

  const blockDetails = await client.call(
    "getblock",
    blockHash.data.result[0],
    0,
  );
  const count = (await client.call("getblockcount")).data.result - 101;
  const block = (
    await client.call(
      "getblock",
      (await client.call("getblockhash", count)).data.result - 101,
      0,
    )
  ).data.result;
  const fee = 30000n;
  const decoded = BitcoinBlock.decode(
    Buffer.from(blockDetails.data.result, "hex"),
  );
  const coinbase = decoded.tx[0];

  logger.debug("Setting up funding transaction");
  const fundingTransaction = new btc.Transaction({
    allowLegacyWitnessUtxo: true,
    allowUnknownOutputs: true,
  });
  const coinbaseTxid = Buffer.from(
    Array.from(Buffer.from(coinbase.txid)).reverse(),
  ).toString("hex");
  logger.debug(`Using coinbase txid: ${coinbaseTxid}`);

  const coinbaseTransaction = btc.Transaction.fromRaw(
    new Uint8Array(
      Array.from(
        Buffer.from(
          (await client.call("getrawtransaction", coinbaseTxid)).data.result,
          "hex",
        ),
      ),
    ),
    { allowUnknownOutputs: true },
  );
  fundingTransaction.addInput({
    witnessUtxo: (coinbaseTransaction as any).outputs[0],
    txid: coinbaseTransaction.id,
    sighashType: btc.SigHash.ALL,
    index: 0,
  });
  let revealAmount = (coinbaseTransaction as any).outputs[0].amount - fee;
  const funding = revealAmount;
  logger.debug(`Funding amount: ${funding}`);

  fundingTransaction.addOutputAddress(
    TEST_MULTISIG,
    funding - 546n * 6n,
    REGTEST_PARAMS,
  );
  fundingTransaction.addOutputAddress(faucetAddress, 546n * 3n, REGTEST_PARAMS);
  fundingTransaction.addOutputAddress(faucetAddress, 546n * 3n, REGTEST_PARAMS);
  const script = encodeRunestoneProtostone({
    protostones: [
      ProtoStone.message({
        protocolTag: 1n,
        edicts: [{
          id: {
            block: 4n,
            tx: 0n
          },
          amount: 100000n,
          output: 2
        }],
        pointer: 1,
        refundPointer: 1,
        calldata: encipher([4n, 0n, 77n]),
      }),
    ],
  }).encodedRunestone;
  fundingTransaction.addOutput({
    script,
    amount: 0n,
  });

  logger.info("Signing funding transaction");
  fundingTransaction.sign(
    faucetPrivate.privateKey,
    [btc.SigHash.ALL],
    new Uint8Array(0x20),
  );
  fundingTransaction.finalize();
  const fundingTransactionHex = hex.encode(fundingTransaction.extract());

  logger.info("Broadcasting funding transaction");
  const sendHex = await client.call(
    "sendrawtransaction",
    fundingTransactionHex,
  );
  await client.generateBlock();
  const txid = new Uint8Array(
    Array.from(Buffer.from(sendHex.data.result, "hex")),
  );
  const txidReversed = Buffer.from(
    Array.from(Buffer.from(txid, "hex")).reverse(),
  ).toString("hex");
  logger.debug(`Funding transaction ID: ${txidReversed}`);

  await waitForSync();
  logger.info("Checking balances");
  // Check frBTC balance
  const frbtcBalances = (
    await client.call("alkanes_protorunesbyaddress", {
      protocolTag: "1",
      address: faucetAddress,
    })
  ).data.result.outpoints.filter((v) =>
    v.runes.find((v) => v.rune.name === "SUBFROST BTC")
  );
  logger.info("frBTC balances:", { frbtcBalances });

  // Check AUTH balance separately
  const authBalances = (
    await client.call("alkanes_protorunesbyaddress", {
      protocolTag: "1", 
      address: faucetAddress,
    })
  ).data.result.outpoints.filter((v) =>
    v.runes.find((v) => v.rune.id && v.rune.id.block === "0x2" && v.rune.id.tx === "0x1")
  );
  logger.info("AUTH balances:", { authBalances });
  logger.info("Checking balances");
  const balances = (
    await client.call("alkanes_protorunesbyaddress", {
      protocolTag: "1",
      address: faucetAddress,
    })
  ).data.result.outpoints.filter((v) =>
    v.runes.find((v) => v.rune.name === "SUBFROST BTC"),
  );
  logger.info("Current balances:", { balances });

  logger.debug("Creating unwrap transaction");
  const unwrapTransaction = new btc.Transaction({
    allowLegacyWitnessUtxo: true,
    allowUnknownOutputs: true,
  });
  const input = {
    witnessUtxo: (fundingTransaction as any).outputs[2],
    txid: fundingTransaction.id,
    sighashType: btc.SigHash.ALL,
    index: 2,
  };
  logger.info(input);
  unwrapTransaction.addInput(input);
  unwrapTransaction.addOutputAddress(faucetAddress, 546n, REGTEST_PARAMS);
  unwrapTransaction.addOutputAddress(TEST_MULTISIG, 546n, REGTEST_PARAMS);
  const unwrapScript = encodeRunestoneProtostone({
    protostones: [
      ProtoStone.message({
        protocolTag: 1n,
        edicts: [],
        pointer: 0,
        refundPointer: 0,
        calldata: encipher([4n, 0n, 78n, 1n]),
      }),
    ],
  }).encodedRunestone;
  unwrapTransaction.addOutput({
    script: unwrapScript,
    amount: 0n,
  });
  logger.info("Signing unwrap transaction");
  unwrapTransaction.sign(faucetPrivate.privateKey, [ btc.SigHash.ALL],  new Uint8Array(0x20));
  unwrapTransaction.finalize();
  const unwrapTransactionHex = hex.encode(unwrapTransaction.extract());

  logger.info("Broadcasting unwrap transaction");
  const sendHexUnwrap = await client.call(
    "sendrawtransaction",
    unwrapTransactionHex,
  );
  logger.info(sendHexUnwrap);
  await client.generateBlock();
  await waitForSync();
  let count2 = await client.call("getblockcount");
  for (
    let i = Number(count2.data.result);
    i > Number(count2.data.result) - 1;
    i--
  ) {
    const response = await client.call("alkanes_simulate", {
      alkanes: [],
      transaction: "0x",
      block: "0x",
      height: i,
      txindex: 0,
      target: {
        block: "4",
        tx: "0",
      },
      inputs: ["1001"],
      pointer: 0,
      refundPointer: 0,
      vout: 0,
    });
    logger.info(response);
  }
  await client.generateBlock();
  logger.info("BTC wrapping operation completed");
}

(async () => {
  await wrapBTC();
})().catch((err) => console.error(err));
