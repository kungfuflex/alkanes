import { u128, u32 } from "@magiceden-oss/runestone-lib/dist/src/integer";
import { Option } from "@magiceden-oss/runestone-lib/dist/src/monads";
import { ProtoruneEdict } from "./protoruneedict";
export type ProtoBurn = {
    pointer: Option<u32>;
    from?: Array<u32>;
};
export type ProtoMessage = {
    calldata: Buffer;
    pointer: Option<u32>;
    refundPointer: Option<u32>;
};
export declare class ProtoStone {
    burn?: ProtoBurn;
    message?: ProtoMessage;
    protocolTag: u128;
    edicts?: ProtoruneEdict[];
    constructor({ burn, message, protocolTag, edicts, }: {
        protocolTag: bigint;
        burn?: {
            pointer: number;
            from?: Array<u32>;
        };
        message?: {
            calldata: Buffer;
            pointer: number;
            refundPointer: number;
        };
        edicts?: ProtoruneEdict[];
    });
    encipher_payloads(): bigint[];
    static burn({ protocolTag, edicts, ...burn }: {
        protocolTag: bigint;
        pointer: number;
        from?: Array<u32>;
        edicts?: ProtoruneEdict[];
    }): ProtoStone;
    static message({ protocolTag, edicts, ...message }: {
        calldata: Buffer;
        protocolTag: bigint;
        pointer: number;
        refundPointer: number;
        edicts?: ProtoruneEdict[];
    }): ProtoStone;
    static edicts({ protocolTag, edicts, }: {
        edicts?: ProtoruneEdict[];
        protocolTag: bigint;
    }): ProtoStone;
}
