import * as bitcoin from "bitcoinjs-lib";
import * as ecc from "tiny-secp256k1";
import BIP32Factory from "bip32";
import * as bip39 from "bip39";

bitcoin.initEccLib(ecc);

const INDEX = process.env.SEED_INDEX;
const bip32 = BIP32Factory(ecc);
const mnemonic = process.env.PRIVATE_KEY;
const seed = bip39.mnemonicToSeedSync(mnemonic.trim());
export const node = bip32.fromSeed(seed);
export const DEFAULT = node.derivePath(`m/86'/0'/0'/0/${INDEX}`);

export const tweakPubkey = (pubKey: Buffer) =>
  pubKey.length === 32 ? pubKey : pubKey.slice(1, 33);
