"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.constructRevealTxInput = exports.CUSTOM_SCRIPTS = void 0;
const btc = __importStar(require("@scure/btc-signer"));
const ordinals = __importStar(require("micro-ordinals"));
exports.CUSTOM_SCRIPTS = [ordinals.OutOrdinalReveal];
const constructRevealTxInput = (programWasm, pubKey, privKey) => {
    // This inscribes on first satoshi of first input (default)
    const inscription = {
        tags: {
            contentType: "application/octet-stream",
            // ContentEncoding: 'br', // compression: only brotli supported
        },
        body: programWasm,
    };
    const revealPayment = btc.p2tr(undefined, // internalPubKey
    ordinals.p2tr_ord_reveal(pubKey, [inscription]), // TaprootScriptTree
    undefined, // mainnet or testnet
    false, // allowUnknownOutputs, safety feature
    exports.CUSTOM_SCRIPTS // how to handle custom scripts
    );
    // We need to send some bitcoins to this address before reveal.
    // Also, there should be enough to cover reveal tx fee.
    // Be extra careful: it's possible to accidentally send an inscription as a fee.
    // Also, rarity is only available with ordinal wallet.
    // But you can parse other inscriptions and create a common one using this.
    const changeAddr = revealPayment.address; // can be different
    const revealAmount = 2000n;
    const fee = 500n;
    return {
        ...revealPayment,
        // This is txid of tx with bitcoins we sent (replace)
        txid: "75ddabb27b8845f5247975c8a5ba7c6f336c4570708ebe230caf6db5217ae858",
        index: 0,
        witnessUtxo: { script: revealPayment.script, amount: revealAmount },
    };
    //   tx.addInput({
    //     ...revealPayment,
    //     // This is txid of tx with bitcoins we sent (replace)
    //     txid: "75ddabb27b8845f5247975c8a5ba7c6f336c4570708ebe230caf6db5217ae858",
    //     index: 0,
    //     witnessUtxo: { script: revealPayment.script, amount: revealAmount },
    //   });
    //   tx.addOutputAddress(changeAddr, revealAmount - fee);
    //   tx.sign(privKey, undefined, new Uint8Array(32));
    //   tx.finalize();
    //   return tx;
};
exports.constructRevealTxInput = constructRevealTxInput;
//# sourceMappingURL=inscriptions.js.map