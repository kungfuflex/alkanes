import * as ordinals from "micro-ordinals";
import * as psbt from "@scure/btc-signer/psbt";
export declare const CUSTOM_SCRIPTS: Array<typeof ordinals.OutOrdinalReveal>;
export declare const constructRevealTxInput: (programWasm: Uint8Array, pubKey: Uint8Array, privKey: Uint8Array) => psbt.TransactionInputUpdate;
