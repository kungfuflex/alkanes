import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message alkanes.uint128
 */
export interface uint128 {
    /**
     * @generated from protobuf field: uint64 lo = 1 [jstype = JS_STRING];
     */
    lo: string;
    /**
     * @generated from protobuf field: uint64 hi = 2 [jstype = JS_STRING];
     */
    hi: string;
}
/**
 * @generated from protobuf message alkanes.AlkaneId
 */
export interface AlkaneId {
    /**
     * @generated from protobuf field: alkanes.uint128 block = 1;
     */
    block?: uint128;
    /**
     * @generated from protobuf field: alkanes.uint128 tx = 2;
     */
    tx?: uint128;
}
/**
 * @generated from protobuf message alkanes.AlkaneTransfer
 */
export interface AlkaneTransfer {
    /**
     * @generated from protobuf field: alkanes.AlkaneId id = 1;
     */
    id?: AlkaneId;
    /**
     * @generated from protobuf field: alkanes.uint128 value = 2;
     */
    value?: uint128;
}
/**
 * @generated from protobuf message alkanes.MessageContextParcel
 */
export interface MessageContextParcel {
    /**
     * @generated from protobuf field: repeated alkanes.AlkaneTransfer alkanes = 1;
     */
    alkanes: AlkaneTransfer[];
    /**
     * @generated from protobuf field: bytes transaction = 2;
     */
    transaction: Uint8Array;
    /**
     * @generated from protobuf field: bytes block = 3;
     */
    block: Uint8Array;
    /**
     * @generated from protobuf field: uint64 height = 4;
     */
    height: bigint;
    /**
     * @generated from protobuf field: uint32 txindex = 6;
     */
    txindex: number;
    /**
     * @generated from protobuf field: bytes calldata = 5;
     */
    calldata: Uint8Array;
    /**
     * @generated from protobuf field: uint32 vout = 7;
     */
    vout: number;
    /**
     * @generated from protobuf field: uint32 pointer = 8;
     */
    pointer: number;
    /**
     * @generated from protobuf field: uint32 refund_pointer = 9;
     */
    refundPointer: number;
}
/**
 * @generated from protobuf message alkanes.KeyValuePair
 */
export interface KeyValuePair {
    /**
     * @generated from protobuf field: bytes key = 1;
     */
    key: Uint8Array;
    /**
     * @generated from protobuf field: bytes value = 2;
     */
    value: Uint8Array;
}
/**
 * @generated from protobuf message alkanes.ExtendedCallResponse
 */
export interface ExtendedCallResponse {
    /**
     * @generated from protobuf field: repeated alkanes.AlkaneTransfer alkanes = 1;
     */
    alkanes: AlkaneTransfer[];
    /**
     * @generated from protobuf field: repeated alkanes.KeyValuePair storage = 2;
     */
    storage: KeyValuePair[];
    /**
     * @generated from protobuf field: bytes data = 3;
     */
    data: Uint8Array;
}
/**
 * @generated from protobuf message alkanes.Context
 */
export interface Context {
    /**
     * @generated from protobuf field: alkanes.AlkaneId myself = 1;
     */
    myself?: AlkaneId;
    /**
     * @generated from protobuf field: alkanes.AlkaneId caller = 2;
     */
    caller?: AlkaneId;
    /**
     * @generated from protobuf field: repeated alkanes.uint128 inputs = 3;
     */
    inputs: uint128[];
    /**
     * @generated from protobuf field: uint32 vout = 4;
     */
    vout: number;
    /**
     * @generated from protobuf field: repeated alkanes.AlkaneTransfer incoming_alkanes = 5;
     */
    incomingAlkanes: AlkaneTransfer[];
}
/**
 * @generated from protobuf message alkanes.TraceContext
 */
export interface TraceContext {
    /**
     * @generated from protobuf field: alkanes.Context inner = 1;
     */
    inner?: Context;
    /**
     * @generated from protobuf field: uint64 fuel = 2;
     */
    fuel: bigint;
}
/**
 * @generated from protobuf message alkanes.AlkanesEnterContext
 */
export interface AlkanesEnterContext {
    /**
     * @generated from protobuf field: alkanes.AlkanesTraceCallType call_type = 1;
     */
    callType: AlkanesTraceCallType;
    /**
     * @generated from protobuf field: alkanes.TraceContext context = 2;
     */
    context?: TraceContext;
}
/**
 * @generated from protobuf message alkanes.AlkanesExitContext
 */
export interface AlkanesExitContext {
    /**
     * @generated from protobuf field: alkanes.AlkanesTraceStatusFlag status = 1;
     */
    status: AlkanesTraceStatusFlag;
    /**
     * @generated from protobuf field: alkanes.ExtendedCallResponse response = 2;
     */
    response?: ExtendedCallResponse;
}
/**
 * @generated from protobuf message alkanes.AlkanesCreate
 */
export interface AlkanesCreate {
    /**
     * @generated from protobuf field: alkanes.AlkaneId new_alkane = 1;
     */
    newAlkane?: AlkaneId;
}
/**
 * @generated from protobuf message alkanes.AlkanesTraceEvent
 */
export interface AlkanesTraceEvent {
    /**
     * @generated from protobuf oneof: event
     */
    event: {
        oneofKind: "enterContext";
        /**
         * @generated from protobuf field: alkanes.AlkanesEnterContext enter_context = 1;
         */
        enterContext: AlkanesEnterContext;
    } | {
        oneofKind: "exitContext";
        /**
         * @generated from protobuf field: alkanes.AlkanesExitContext exit_context = 2;
         */
        exitContext: AlkanesExitContext;
    } | {
        oneofKind: "createAlkane";
        /**
         * @generated from protobuf field: alkanes.AlkanesCreate create_alkane = 3;
         */
        createAlkane: AlkanesCreate;
    } | {
        oneofKind: undefined;
    };
}
/**
 * @generated from protobuf message alkanes.AlkanesTrace
 */
export interface AlkanesTrace {
    /**
     * @generated from protobuf field: repeated alkanes.AlkanesTraceEvent events = 1;
     */
    events: AlkanesTraceEvent[];
}
/**
 * @generated from protobuf message alkanes.SimulateResponse
 */
export interface SimulateResponse {
    /**
     * @generated from protobuf field: alkanes.ExtendedCallResponse execution = 1;
     */
    execution?: ExtendedCallResponse;
    /**
     * @generated from protobuf field: uint64 gas_used = 2;
     */
    gasUsed: bigint;
    /**
     * @generated from protobuf field: string error = 3;
     */
    error: string;
}
/**
 * @generated from protobuf message alkanes.AlkaneInventoryRequest
 */
export interface AlkaneInventoryRequest {
    /**
     * @generated from protobuf field: alkanes.AlkaneId id = 1;
     */
    id?: AlkaneId;
}
/**
 * @generated from protobuf message alkanes.AlkaneInventoryResponse
 */
export interface AlkaneInventoryResponse {
    /**
     * @generated from protobuf field: repeated alkanes.AlkaneTransfer alkanes = 1;
     */
    alkanes: AlkaneTransfer[];
}
/**
 * @generated from protobuf enum alkanes.AlkanesTraceCallType
 */
export declare enum AlkanesTraceCallType {
    /**
     * @generated from protobuf enum value: NONE = 0;
     */
    NONE = 0,
    /**
     * @generated from protobuf enum value: CALL = 1;
     */
    CALL = 1,
    /**
     * @generated from protobuf enum value: DELEGATECALL = 2;
     */
    DELEGATECALL = 2,
    /**
     * @generated from protobuf enum value: STATICCALL = 3;
     */
    STATICCALL = 3
}
/**
 * @generated from protobuf enum alkanes.AlkanesTraceStatusFlag
 */
export declare enum AlkanesTraceStatusFlag {
    /**
     * @generated from protobuf enum value: SUCCESS = 0;
     */
    SUCCESS = 0,
    /**
     * @generated from protobuf enum value: FAILURE = 1;
     */
    FAILURE = 1
}
declare class uint128$Type extends MessageType<uint128> {
    constructor();
    create(value?: PartialMessage<uint128>): uint128;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: uint128): uint128;
    internalBinaryWrite(message: uint128, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.uint128
 */
export declare const uint128: uint128$Type;
declare class AlkaneId$Type extends MessageType<AlkaneId> {
    constructor();
    create(value?: PartialMessage<AlkaneId>): AlkaneId;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkaneId): AlkaneId;
    internalBinaryWrite(message: AlkaneId, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.AlkaneId
 */
export declare const AlkaneId: AlkaneId$Type;
declare class AlkaneTransfer$Type extends MessageType<AlkaneTransfer> {
    constructor();
    create(value?: PartialMessage<AlkaneTransfer>): AlkaneTransfer;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkaneTransfer): AlkaneTransfer;
    internalBinaryWrite(message: AlkaneTransfer, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.AlkaneTransfer
 */
export declare const AlkaneTransfer: AlkaneTransfer$Type;
declare class MessageContextParcel$Type extends MessageType<MessageContextParcel> {
    constructor();
    create(value?: PartialMessage<MessageContextParcel>): MessageContextParcel;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MessageContextParcel): MessageContextParcel;
    internalBinaryWrite(message: MessageContextParcel, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.MessageContextParcel
 */
export declare const MessageContextParcel: MessageContextParcel$Type;
declare class KeyValuePair$Type extends MessageType<KeyValuePair> {
    constructor();
    create(value?: PartialMessage<KeyValuePair>): KeyValuePair;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: KeyValuePair): KeyValuePair;
    internalBinaryWrite(message: KeyValuePair, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.KeyValuePair
 */
export declare const KeyValuePair: KeyValuePair$Type;
declare class ExtendedCallResponse$Type extends MessageType<ExtendedCallResponse> {
    constructor();
    create(value?: PartialMessage<ExtendedCallResponse>): ExtendedCallResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExtendedCallResponse): ExtendedCallResponse;
    internalBinaryWrite(message: ExtendedCallResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.ExtendedCallResponse
 */
export declare const ExtendedCallResponse: ExtendedCallResponse$Type;
declare class Context$Type extends MessageType<Context> {
    constructor();
    create(value?: PartialMessage<Context>): Context;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: Context): Context;
    internalBinaryWrite(message: Context, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.Context
 */
export declare const Context: Context$Type;
declare class TraceContext$Type extends MessageType<TraceContext> {
    constructor();
    create(value?: PartialMessage<TraceContext>): TraceContext;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: TraceContext): TraceContext;
    internalBinaryWrite(message: TraceContext, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.TraceContext
 */
export declare const TraceContext: TraceContext$Type;
declare class AlkanesEnterContext$Type extends MessageType<AlkanesEnterContext> {
    constructor();
    create(value?: PartialMessage<AlkanesEnterContext>): AlkanesEnterContext;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkanesEnterContext): AlkanesEnterContext;
    internalBinaryWrite(message: AlkanesEnterContext, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.AlkanesEnterContext
 */
export declare const AlkanesEnterContext: AlkanesEnterContext$Type;
declare class AlkanesExitContext$Type extends MessageType<AlkanesExitContext> {
    constructor();
    create(value?: PartialMessage<AlkanesExitContext>): AlkanesExitContext;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkanesExitContext): AlkanesExitContext;
    internalBinaryWrite(message: AlkanesExitContext, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.AlkanesExitContext
 */
export declare const AlkanesExitContext: AlkanesExitContext$Type;
declare class AlkanesCreate$Type extends MessageType<AlkanesCreate> {
    constructor();
    create(value?: PartialMessage<AlkanesCreate>): AlkanesCreate;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkanesCreate): AlkanesCreate;
    internalBinaryWrite(message: AlkanesCreate, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.AlkanesCreate
 */
export declare const AlkanesCreate: AlkanesCreate$Type;
declare class AlkanesTraceEvent$Type extends MessageType<AlkanesTraceEvent> {
    constructor();
    create(value?: PartialMessage<AlkanesTraceEvent>): AlkanesTraceEvent;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkanesTraceEvent): AlkanesTraceEvent;
    internalBinaryWrite(message: AlkanesTraceEvent, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.AlkanesTraceEvent
 */
export declare const AlkanesTraceEvent: AlkanesTraceEvent$Type;
declare class AlkanesTrace$Type extends MessageType<AlkanesTrace> {
    constructor();
    create(value?: PartialMessage<AlkanesTrace>): AlkanesTrace;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkanesTrace): AlkanesTrace;
    internalBinaryWrite(message: AlkanesTrace, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.AlkanesTrace
 */
export declare const AlkanesTrace: AlkanesTrace$Type;
declare class SimulateResponse$Type extends MessageType<SimulateResponse> {
    constructor();
    create(value?: PartialMessage<SimulateResponse>): SimulateResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SimulateResponse): SimulateResponse;
    internalBinaryWrite(message: SimulateResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.SimulateResponse
 */
export declare const SimulateResponse: SimulateResponse$Type;
declare class AlkaneInventoryRequest$Type extends MessageType<AlkaneInventoryRequest> {
    constructor();
    create(value?: PartialMessage<AlkaneInventoryRequest>): AlkaneInventoryRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkaneInventoryRequest): AlkaneInventoryRequest;
    internalBinaryWrite(message: AlkaneInventoryRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.AlkaneInventoryRequest
 */
export declare const AlkaneInventoryRequest: AlkaneInventoryRequest$Type;
declare class AlkaneInventoryResponse$Type extends MessageType<AlkaneInventoryResponse> {
    constructor();
    create(value?: PartialMessage<AlkaneInventoryResponse>): AlkaneInventoryResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkaneInventoryResponse): AlkaneInventoryResponse;
    internalBinaryWrite(message: AlkaneInventoryResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message alkanes.AlkaneInventoryResponse
 */
export declare const AlkaneInventoryResponse: AlkaneInventoryResponse$Type;
export {};
