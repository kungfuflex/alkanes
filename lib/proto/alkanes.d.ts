import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "alkanes";
export declare enum AlkanesTraceCallType {
    NONE = 0,
    CALL = 1,
    DELEGATECALL = 2,
    STATICCALL = 3,
    UNRECOGNIZED = -1
}
export declare function alkanesTraceCallTypeFromJSON(object: any): AlkanesTraceCallType;
export declare function alkanesTraceCallTypeToJSON(object: AlkanesTraceCallType): string;
export declare enum AlkanesTraceStatusFlag {
    SUCCESS = 0,
    FAILURE = 1,
    UNRECOGNIZED = -1
}
export declare function alkanesTraceStatusFlagFromJSON(object: any): AlkanesTraceStatusFlag;
export declare function alkanesTraceStatusFlagToJSON(object: AlkanesTraceStatusFlag): string;
export interface uint128 {
    lo: bigint;
    hi: bigint;
}
export interface AlkaneId {
    block: uint128 | undefined;
    tx: uint128 | undefined;
}
export interface AlkaneTransfer {
    id: AlkaneId | undefined;
    value: uint128 | undefined;
}
export interface MultiSimulateRequest {
    parcels: MessageContextParcel[];
}
export interface MessageContextParcel {
    alkanes: AlkaneTransfer[];
    transaction: Uint8Array;
    block: Uint8Array;
    height: bigint;
    txindex: number;
    calldata: Uint8Array;
    vout: number;
    pointer: number;
    refundPointer: number;
}
export interface KeyValuePair {
    key: Uint8Array;
    value: Uint8Array;
}
export interface ExtendedCallResponse {
    alkanes: AlkaneTransfer[];
    storage: KeyValuePair[];
    data: Uint8Array;
}
export interface Context {
    myself: AlkaneId | undefined;
    caller: AlkaneId | undefined;
    inputs: uint128[];
    vout: number;
    incomingAlkanes: AlkaneTransfer[];
}
export interface TraceContext {
    inner: Context | undefined;
    fuel: bigint;
}
export interface AlkanesEnterContext {
    callType: AlkanesTraceCallType;
    context: TraceContext | undefined;
}
export interface AlkanesExitContext {
    status: AlkanesTraceStatusFlag;
    response: ExtendedCallResponse | undefined;
}
export interface AlkanesCreate {
    newAlkane: AlkaneId | undefined;
}
export interface AlkanesTraceEvent {
    enterContext?: AlkanesEnterContext | undefined;
    exitContext?: AlkanesExitContext | undefined;
    createAlkane?: AlkanesCreate | undefined;
}
export interface AlkanesBlockEvent {
    traces: AlkanesTrace | undefined;
    outpoint: Outpoint | undefined;
    txindex: bigint;
}
export interface AlkanesBlockTraceEvent {
    events: AlkanesBlockEvent[];
}
export interface AlkanesTrace {
    events: AlkanesTraceEvent[];
}
export interface SimulateResponse {
    execution: ExtendedCallResponse | undefined;
    gasUsed: bigint;
    error: string;
}
export interface MultiSimulateResponse {
    responses: SimulateResponse[];
    error: string;
}
export interface AlkaneInventoryRequest {
    id: AlkaneId | undefined;
}
export interface AlkaneIdToOutpointRequest {
    id: AlkaneId | undefined;
}
export interface AlkaneInventoryResponse {
    alkanes: AlkaneTransfer[];
}
export interface AlkaneStorageRequest {
    id: AlkaneId | undefined;
    path: Uint8Array;
}
export interface AlkaneStorageResponse {
    value: Uint8Array;
}
export interface AlkaneIdToOutpointResponse {
    txid: Uint8Array;
    vout: number;
}
export interface Outpoint {
    txid: Uint8Array;
    vout: number;
}
export interface Trace {
    outpoint: Outpoint | undefined;
    trace: AlkanesTrace | undefined;
}
export interface TraceBlockRequest {
    block: bigint;
}
export interface TraceBlockResponse {
    traces: Trace[];
}
export interface BytecodeRequest {
    id: AlkaneId | undefined;
}
export interface BlockRequest {
    height: number;
}
export interface BlockResponse {
    block: Uint8Array;
    height: number;
}
export interface PendingUnwrapsRequest {
    height: number;
}
export interface Payment {
    spendable: Outpoint | undefined;
    output: Uint8Array;
    fulfilled: boolean;
}
export interface PendingUnwrapsResponse {
    payments: Payment[];
}
export declare const uint128: MessageFns<uint128>;
export declare const AlkaneId: MessageFns<AlkaneId>;
export declare const AlkaneTransfer: MessageFns<AlkaneTransfer>;
export declare const MultiSimulateRequest: MessageFns<MultiSimulateRequest>;
export declare const MessageContextParcel: MessageFns<MessageContextParcel>;
export declare const KeyValuePair: MessageFns<KeyValuePair>;
export declare const ExtendedCallResponse: MessageFns<ExtendedCallResponse>;
export declare const Context: MessageFns<Context>;
export declare const TraceContext: MessageFns<TraceContext>;
export declare const AlkanesEnterContext: MessageFns<AlkanesEnterContext>;
export declare const AlkanesExitContext: MessageFns<AlkanesExitContext>;
export declare const AlkanesCreate: MessageFns<AlkanesCreate>;
export declare const AlkanesTraceEvent: MessageFns<AlkanesTraceEvent>;
export declare const AlkanesBlockEvent: MessageFns<AlkanesBlockEvent>;
export declare const AlkanesBlockTraceEvent: MessageFns<AlkanesBlockTraceEvent>;
export declare const AlkanesTrace: MessageFns<AlkanesTrace>;
export declare const SimulateResponse: MessageFns<SimulateResponse>;
export declare const MultiSimulateResponse: MessageFns<MultiSimulateResponse>;
export declare const AlkaneInventoryRequest: MessageFns<AlkaneInventoryRequest>;
export declare const AlkaneIdToOutpointRequest: MessageFns<AlkaneIdToOutpointRequest>;
export declare const AlkaneInventoryResponse: MessageFns<AlkaneInventoryResponse>;
export declare const AlkaneStorageRequest: MessageFns<AlkaneStorageRequest>;
export declare const AlkaneStorageResponse: MessageFns<AlkaneStorageResponse>;
export declare const AlkaneIdToOutpointResponse: MessageFns<AlkaneIdToOutpointResponse>;
export declare const Outpoint: MessageFns<Outpoint>;
export declare const Trace: MessageFns<Trace>;
export declare const TraceBlockRequest: MessageFns<TraceBlockRequest>;
export declare const TraceBlockResponse: MessageFns<TraceBlockResponse>;
export declare const BytecodeRequest: MessageFns<BytecodeRequest>;
export declare const BlockRequest: MessageFns<BlockRequest>;
export declare const BlockResponse: MessageFns<BlockResponse>;
export declare const PendingUnwrapsRequest: MessageFns<PendingUnwrapsRequest>;
export declare const Payment: MessageFns<Payment>;
export declare const PendingUnwrapsResponse: MessageFns<PendingUnwrapsResponse>;
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
export {};
