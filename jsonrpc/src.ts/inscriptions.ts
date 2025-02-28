import * as btc from "@scure/btc-signer";
import * as ordinals from "micro-ordinals";
import * as psbt from "@scure/btc-signer/psbt";

export const CUSTOM_SCRIPTS: Array<typeof ordinals.OutOrdinalReveal> = [ordinals.OutOrdinalReveal];

export const constructRevealTxInput = (
  programWasm: Uint8Array,
  pubKey: Uint8Array,
  privKey: Uint8Array
): psbt.TransactionInputUpdate => {
  // This inscribes on first satoshi of first input (default)
  const inscription = {
    tags: {
      contentType: "application/octet-stream",
      // ContentEncoding: 'br', // compression: only brotli supported
    },
    body: programWasm,
  };

  const revealPayment = btc.p2tr(
    undefined, // internalPubKey
    ordinals.p2tr_ord_reveal(pubKey, [inscription]), // TaprootScriptTree
    undefined, // mainnet or testnet
    false, // allowUnknownOutputs, safety feature
    CUSTOM_SCRIPTS // how to handle custom scripts
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
