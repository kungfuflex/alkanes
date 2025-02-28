import { Coder } from "@scure/base";
import * as P from "micro-packed";
import { ScriptType, OptScript, CustomScript } from "@scure/btc-signer";
type Bytes = Uint8Array;
export declare const InscriptionId: P.Coder<string, Bytes>;
type TagRaw = {
    tag: Bytes;
    data: Bytes;
};
declare const TagCoders: {
    pointer: P.CoderType<bigint>;
    contentType: P.CoderType<string>;
    parent: P.Coder<string, Uint8Array>;
    metadata: P.CoderType<any>;
    metaprotocol: P.CoderType<string>;
    contentEncoding: P.CoderType<string>;
    delegate: P.Coder<string, Uint8Array>;
    rune: P.CoderType<bigint>;
    note: P.CoderType<string>;
};
export type Tags = Partial<{
    [K in keyof typeof TagCoders]: P.UnwrapCoder<(typeof TagCoders)[K]>;
}> & {
    unknown?: [Bytes, Bytes][];
};
export type Inscription = {
    tags: Tags;
    body: Bytes;
    cursed?: boolean;
};
type OutOrdinalRevealType = {
    type: "tr_ord_reveal";
    pubkey: Bytes;
    inscriptions: Inscription[];
};
export declare function parseInscriptions(script: ScriptType, strict?: boolean): Inscription[] | undefined;
/**
 * Parse inscriptions from reveal tx input witness (tx.inputs[0].finalScriptWitness)
 */
export declare function parseWitness(witness: Bytes[]): Inscription[] | undefined;
export declare const OutOrdinalReveal: Coder<OptScript, OutOrdinalRevealType | undefined> & CustomScript;
/**
 * Create reveal transaction. Inscription created on spending output from this address by
 * revealing taproot script.
 */
export declare function p2tr_ord_reveal(pubkey: Bytes, inscriptions: Inscription[]): {
    type: string;
    script: Uint8Array;
};
export declare const __test__: {
    TagCoders: {
        pointer: P.CoderType<bigint>;
        contentType: P.CoderType<string>;
        parent: P.Coder<string, Uint8Array>;
        metadata: P.CoderType<any>;
        metaprotocol: P.CoderType<string>;
        contentEncoding: P.CoderType<string>;
        delegate: P.Coder<string, Uint8Array>;
        rune: P.CoderType<bigint>;
        note: P.CoderType<string>;
    };
    TagCoder: P.Coder<TagRaw[], Tags>;
    parseEnvelopes: (script: ScriptType, pos?: number) => any[];
};
export {};
