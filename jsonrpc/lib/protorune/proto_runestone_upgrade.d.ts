import { ProtoruneRuneId } from "./protoruneruneid";
import { ProtoruneEdict } from "./protoruneedict";
import { Etching } from "@magiceden-oss/runestone-lib/dist/src/etching";
import { u32 } from "@magiceden-oss/runestone-lib/dist/src/integer";
import { Option } from "@magiceden-oss/runestone-lib/dist/src/monads";
import { Flaw } from "@magiceden-oss/runestone-lib/dist/src/flaw";
import { RuneEtchingSpec } from "@magiceden-oss/runestone-lib/dist/src/indexer";
import { ProtoStone } from "./protostone";
export declare const MAX_SPACERS = 134217727;
export type RunestoneTx = {
    vout: {
        scriptPubKey: {
            hex: string;
        };
    }[];
};
type Payload = Buffer | Flaw;
export declare function isValidPayload(payload: Payload): payload is Buffer;
export declare function encodeOptionInt(payloads: Array<any>, tag: any, opt: Option<any>): void;
export declare const MAX_LEB128_BYTES_IN_U128 = 18;
export declare const MAX_U128_BYTES_COMPAT_W_RUNES = 15;
export type RunestoneProtostoneSpec = {
    mint?: {
        block: bigint;
        tx: bigint;
    };
    pointer?: number;
    etching?: RuneEtchingSpec;
    edicts?: ProtoruneEdict[];
    protostones?: ProtoStone[];
};
export declare class RunestoneProtostoneUpgrade {
    readonly mint: Option<ProtoruneRuneId>;
    readonly pointer: Option<u32>;
    readonly edicts: ProtoruneEdict[];
    readonly etching: Option<Etching>;
    readonly protostones: ProtoStone[];
    constructor(mint: Option<ProtoruneRuneId>, pointer: Option<u32>, edicts: ProtoruneEdict[], etching: Option<Etching>, protostones: ProtoStone[]);
    encipher(): Buffer;
}
/**
 * Low level function to allow for encoding runestones without any indexer and transaction checks.
 *
 * @param runestone runestone spec to encode as runestone
 * @returns encoded runestone bytes
 * @throws Error if encoding is detected to be considered a cenotaph
 */
export declare function encodeRunestoneProtostone(runestone: RunestoneProtostoneSpec): {
    encodedRunestone: Buffer;
    etchingCommitment?: Buffer;
};
export {};
