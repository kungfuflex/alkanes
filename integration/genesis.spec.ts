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
import { AlkanesRpc } from "../lib/rpc";
import { getLogger } from "./lib/logger";
import * as shim from "./lib/shim";

const rpc: any = shim.rpc;

const logger = getLogger("alkanes:run");

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

export async function deployGenesis(): Promise<void> {
  const binary = new Uint8Array(
    Array.from(
      await fs.readFile(
        path.join(__dirname, "..", "vendor", "alkanes_std_genesis_alkane.wasm"),
      ),
    ),
  );
  const privKey = hex.decode(
    "0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a0a",
  );
  const faucetPrivate = getPrivate(REGTEST_FAUCET.mnemonic);
  const faucetAddress = getAddress(faucetPrivate);
  const pubKey = secp256k1_schnorr.getPublicKey(privKey);
  // We need this to enable custom scripts outside
  const customScripts = [envelope.OutOrdinalReveal];
  const payload = {
    body: await gzip(binary, { level: 9 }),
    cursed: false,
    tags: { contentType: "" },
  };
  logger.info(payload.body.toString("hex").substr(0, 20));
  const revealPayment = btc.p2tr(
    undefined,
    envelope.p2tr_ord_reveal(pubKey, [payload]),
    REGTEST_PARAMS,
    false,
    customScripts,
  );
  const blockHash = await client.call("generatetoaddress", 200, faucetAddress);
  const hash = blockHash.data.result[0];
  logger.info("blockhash with payment: " + hash);
  await timeout(2000);
  await waitForSync();
  const blockDetails = await client.call("getblock", hash, 0);
  const count = (await client.call("getblockcount")).data.result - 101;
  const block = (
    await client.call(
      "getblock",
      (await client.call("getblockhash", count)).data.result - 101,
      0,
    )
  ).data.result;
  const fee = 20000n;
  const decoded = BitcoinBlock.decode(
    Buffer.from(blockDetails.data.result, "hex"),
  );
  const coinbase = decoded.tx[0];
  const fundingTransaction = new btc.Transaction({
    allowLegacyWitnessUtxo: true,
    allowUnknownOutputs: true,
  });
  const coinbaseTxid = Buffer.from(
    Array.from(Buffer.from(coinbase.txid)).reverse(),
  ).toString("hex");
  logger.info("wait 5s");
  await timeout(5000);
  await waitForSync();
  logger.info(
    (await client.call("getrawtransaction", coinbaseTxid)).data.result,
  );
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
  logger.info("coinbase:");
  logger.info(coinbaseTransaction);
  fundingTransaction.addInput({
    witnessUtxo: (coinbaseTransaction as any).outputs[0],
    txid: coinbaseTransaction.id,
    sighashType: btc.SigHash.ALL,
    index: 0,
  });
  let revealAmount = (coinbaseTransaction as any).outputs[0].amount - fee;
  const funding = revealAmount;
  fundingTransaction.addOutput({
    script: revealPayment.script,
    amount: funding,
  });
  fundingTransaction.sign(
    faucetPrivate.privateKey,
    [btc.SigHash.ALL],
    new Uint8Array(0x20),
  ); //, undefined, new Uint9Array(32));
  fundingTransaction.finalize();

  const fundingTransactionHex = hex.encode(fundingTransaction.extract());
  const sendHex = await client.call(
    "sendrawtransaction",
    fundingTransactionHex,
  );
  await client.generateBlock();
  await waitForSync();
  const txid = new Uint8Array(
    Array.from(Buffer.from(sendHex.data.result, "hex")),
  );
  const changeAddr = faucetAddress;
  const tx = new btc.Transaction({ customScripts, allowUnknownOutputs: true });
  tx.addInput({
    ...revealPayment,
    txid: fundingTransaction.id,
    index: 0,
    witnessUtxo: { script: revealPayment.script, amount: revealAmount },
  });
  tx.addOutputAddress(changeAddr, revealAmount - fee, REGTEST_PARAMS);
  const script = encodeRunestoneProtostone({
    protostones: [
      ProtoStone.message({
        protocolTag: 1n,
        edicts: [],
        pointer: 0,
        refundPointer: 0,
        calldata: encipher([1n, 0n, 0n]),
      }),
    ],
  }).encodedRunestone;
  tx.addOutput({
    script,
    amount: 0n,
  });
  tx.sign(privKey, undefined, new Uint8Array(32));
  tx.finalize();
  const txHex = hex.encode(tx.extract());
  /*const rpc = new AlkanesRpc({
    baseUrl: "http://localhost:8080",
    blockTag: "latest",
  }); */
  const revealTxSend = await client.call("sendrawtransaction", txHex);
  await client.generateBlock();
  await waitForSync();
  const revealTxid = revealTxSend.data.result;
  const revealTransactionFromRegtest = btc.Transaction.fromRaw(
    new Uint8Array(
      Array.from(
        Buffer.from(
          (await client.call("getrawtransaction", revealTxid as string)).data
            .result,
          "hex",
        ),
      ),
    ),
    { allowUnknownOutputs: true },
  );
  logger.info("reveal tx:");
  logger.info(revealTransactionFromRegtest);
  logger.info("wait 20s...");
  await timeout(1000);
  await waitForSync();
  const revealTxidReversed = Buffer.from(
    Array.from(Buffer.from(revealTxid, "hex")).reverse(),
  ).toString("hex");
  const balancesProtobuf = await rpc.protorunesbyoutpoint({
    protocolTag: 1n,
    txid: revealTxidReversed,
    vout: 0,
  });
  logger.info("balance sheet on " + revealTxidReversed + ":" + String(0));
  logger.info(balancesProtobuf);
  const balances = balancesProtobuf;
  logger.info(
    "call view opcode 101 on " +
      balances[0].token.id.block.toString(10) +
      ":" +
      balances[0].token.id.tx.toString(10),
  );
  logger.info(
    await rpc.simulate({
      alkanes: [],
      transaction: "0x",
      block: "0x",
      height: 20000n,
      txindex: 0,
      target: {
        block: balances[0].token.id.block,
        tx: balances[0].token.id.tx,
      },
      inputs: [101n],
      pointer: 0,
      refundPointer: 0,
      vout: 0,
    }),
  );
  logger.info("protorunes on address " + changeAddr + ":");
  logger.info(
    await rpc.protorunesbyaddress({ address: changeAddr, protocolTag: 1n }),
    { colors: true, depth: 15 },
  );
  logger.info(await rpc.trace({ txid: revealTxidReversed, vout: 3 }));
}

(async () => {
  await deployGenesis();
})().catch((err) => console.error(err));
