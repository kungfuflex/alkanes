import { AlkaneTransfer, AlkaneId } from "./bytes";
import { alkanes as alkanes_protobuf } from "./proto/alkanes";
export declare function formatKey(v: any): string;
export declare function toAlkaneTransfer(v: any): {
    id: {
        block: any;
        tx: any;
    };
    value: bigint;
};
export declare function toBytecodeRequest({ block, tx }: any): alkanes_protobuf.BytecodeRequest;
export declare function encodeBlockRequest({ height }: any): alkanes_protobuf.BlockRequest;
export declare function encodeGetBytecodeRequest(v: any): string;
export declare function fromCallType(v: number): string;
export declare function toAlkaneId(v: any): {
    block: any;
    tx: any;
};
export declare function toStorageSlot(v: any): {
    key: string;
    value: string;
};
export declare function toContext(v: any): {
    myself: {
        block: any;
        tx: any;
    };
    caller: {
        block: any;
        tx: any;
    };
    inputs: any;
    incomingAlkanes: any;
    vout: any;
};
export declare function toResponse(v: any): {
    alkanes: any;
    data: string;
    storage: any;
};
export declare function toEvent(v: any): {
    event: string;
    data: {
        block: any;
        tx: any;
    };
} | {
    event: string;
    data: {
        type: string;
        context: {
            myself: {
                block: any;
                tx: any;
            };
            caller: {
                block: any;
                tx: any;
            };
            inputs: any;
            incomingAlkanes: any;
            vout: any;
        };
        fuel: any;
    };
} | {
    event: string;
    data: {
        status: string;
        response: {
            alkanes: any;
            data: string;
            storage: any;
        };
    };
} | {
    event: string;
    data: {
        alkanes: any;
    };
};
export declare function encodeTraceRequest({ txid, vout, }: {
    txid: string;
    vout: number;
}): string;
export declare function encodeTraceBlockRequest({ block, }: {
    block: bigint | number;
}): string;
export declare function encodeUnwrapsRequest({ block, }: {
    block: bigint | number;
}): string;
export declare function decodeUnwrapsResponse(hex: string): any;
export declare function decodeBlockResponse(hex: string): any;
export declare function decodeTraceBlockResponse(hex: string): any;
export declare function decodeTraceResponse(hex: string): any;
export declare function encodeSimulateRequest({ alkanes, transaction, height, block, inputs, target, txindex, vout, pointer, refundPointer, }: {
    alkanes: AlkaneTransfer[];
    transaction: string;
    target: AlkaneId;
    inputs: bigint[];
    height: bigint;
    block: string;
    txindex: number;
    vout: number;
    pointer: number;
    refundPointer: number;
}): string;
export type ExecutionResult = {
    error: null | string;
    storage: any[];
    alkanes: any[];
    data: string;
};
export type DecodedSimulateResponse = {
    status: number;
    gasUsed: number;
    execution: ExecutionResult;
};
export declare function decodeSimulateResponse(response: string): DecodedSimulateResponse;
export declare function outpointResponseToObject(v: any[]): any;
export declare function decodeOutpointResponse(result: any): any;
export declare function decodeMetaResponse(response: string): any;
export declare function encodeAlkaneInventoryRequest(block: bigint, tx: bigint): string;
export declare function decodeAlkaneInventoryResponse(hex: string): AlkaneTransfer[];
export declare function encodeAlkaneStorageRequest({ id, path, }: {
    id: AlkaneId;
    path: Uint8Array;
}): string;
export declare function encodeAlkaneStorageRequestString({ id, path, }: {
    id: AlkaneId;
    path: string;
}): string;
export declare function decodeAlkaneStorageResponse(hex: string): string;
