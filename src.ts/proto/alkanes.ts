// @generated by protobuf-ts 2.9.4
// @generated from protobuf file "alkanes.proto" (package "alkanes", syntax proto3)
// tslint:disable
import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import { WireType } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import { UnknownFieldHandler } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { reflectionMergePartial } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message alkanes.uint128
 */
export interface uint128 {
    /**
     * @generated from protobuf field: uint64 lo = 1;
     */
    lo: bigint;
    /**
     * @generated from protobuf field: uint64 hi = 2;
     */
    hi: bigint;
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
// @generated message type with reflection information, may provide speed optimized methods
class uint128$Type extends MessageType<uint128> {
    constructor() {
        super("alkanes.uint128", [
            { no: 1, name: "lo", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 2, name: "hi", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ }
        ]);
    }
    create(value?: PartialMessage<uint128>): uint128 {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.lo = 0n;
        message.hi = 0n;
        if (value !== undefined)
            reflectionMergePartial<uint128>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: uint128): uint128 {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* uint64 lo */ 1:
                    message.lo = reader.uint64().toBigInt();
                    break;
                case /* uint64 hi */ 2:
                    message.hi = reader.uint64().toBigInt();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: uint128, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* uint64 lo = 1; */
        if (message.lo !== 0n)
            writer.tag(1, WireType.Varint).uint64(message.lo);
        /* uint64 hi = 2; */
        if (message.hi !== 0n)
            writer.tag(2, WireType.Varint).uint64(message.hi);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message alkanes.uint128
 */
export const uint128 = new uint128$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AlkaneId$Type extends MessageType<AlkaneId> {
    constructor() {
        super("alkanes.AlkaneId", [
            { no: 1, name: "block", kind: "message", T: () => uint128 },
            { no: 2, name: "tx", kind: "message", T: () => uint128 }
        ]);
    }
    create(value?: PartialMessage<AlkaneId>): AlkaneId {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AlkaneId>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkaneId): AlkaneId {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* alkanes.uint128 block */ 1:
                    message.block = uint128.internalBinaryRead(reader, reader.uint32(), options, message.block);
                    break;
                case /* alkanes.uint128 tx */ 2:
                    message.tx = uint128.internalBinaryRead(reader, reader.uint32(), options, message.tx);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: AlkaneId, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* alkanes.uint128 block = 1; */
        if (message.block)
            uint128.internalBinaryWrite(message.block, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* alkanes.uint128 tx = 2; */
        if (message.tx)
            uint128.internalBinaryWrite(message.tx, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message alkanes.AlkaneId
 */
export const AlkaneId = new AlkaneId$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AlkaneTransfer$Type extends MessageType<AlkaneTransfer> {
    constructor() {
        super("alkanes.AlkaneTransfer", [
            { no: 1, name: "id", kind: "message", T: () => AlkaneId },
            { no: 2, name: "value", kind: "message", T: () => uint128 }
        ]);
    }
    create(value?: PartialMessage<AlkaneTransfer>): AlkaneTransfer {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AlkaneTransfer>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkaneTransfer): AlkaneTransfer {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* alkanes.AlkaneId id */ 1:
                    message.id = AlkaneId.internalBinaryRead(reader, reader.uint32(), options, message.id);
                    break;
                case /* alkanes.uint128 value */ 2:
                    message.value = uint128.internalBinaryRead(reader, reader.uint32(), options, message.value);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: AlkaneTransfer, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* alkanes.AlkaneId id = 1; */
        if (message.id)
            AlkaneId.internalBinaryWrite(message.id, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* alkanes.uint128 value = 2; */
        if (message.value)
            uint128.internalBinaryWrite(message.value, writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message alkanes.AlkaneTransfer
 */
export const AlkaneTransfer = new AlkaneTransfer$Type();
// @generated message type with reflection information, may provide speed optimized methods
class MessageContextParcel$Type extends MessageType<MessageContextParcel> {
    constructor() {
        super("alkanes.MessageContextParcel", [
            { no: 1, name: "alkanes", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => AlkaneTransfer },
            { no: 2, name: "transaction", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 3, name: "block", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 4, name: "height", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 6, name: "txindex", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 5, name: "calldata", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 7, name: "vout", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 8, name: "pointer", kind: "scalar", T: 13 /*ScalarType.UINT32*/ },
            { no: 9, name: "refund_pointer", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
    create(value?: PartialMessage<MessageContextParcel>): MessageContextParcel {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.alkanes = [];
        message.transaction = new Uint8Array(0);
        message.block = new Uint8Array(0);
        message.height = 0n;
        message.txindex = 0;
        message.calldata = new Uint8Array(0);
        message.vout = 0;
        message.pointer = 0;
        message.refundPointer = 0;
        if (value !== undefined)
            reflectionMergePartial<MessageContextParcel>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: MessageContextParcel): MessageContextParcel {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated alkanes.AlkaneTransfer alkanes */ 1:
                    message.alkanes.push(AlkaneTransfer.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bytes transaction */ 2:
                    message.transaction = reader.bytes();
                    break;
                case /* bytes block */ 3:
                    message.block = reader.bytes();
                    break;
                case /* uint64 height */ 4:
                    message.height = reader.uint64().toBigInt();
                    break;
                case /* uint32 txindex */ 6:
                    message.txindex = reader.uint32();
                    break;
                case /* bytes calldata */ 5:
                    message.calldata = reader.bytes();
                    break;
                case /* uint32 vout */ 7:
                    message.vout = reader.uint32();
                    break;
                case /* uint32 pointer */ 8:
                    message.pointer = reader.uint32();
                    break;
                case /* uint32 refund_pointer */ 9:
                    message.refundPointer = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: MessageContextParcel, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated alkanes.AlkaneTransfer alkanes = 1; */
        for (let i = 0; i < message.alkanes.length; i++)
            AlkaneTransfer.internalBinaryWrite(message.alkanes[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* bytes transaction = 2; */
        if (message.transaction.length)
            writer.tag(2, WireType.LengthDelimited).bytes(message.transaction);
        /* bytes block = 3; */
        if (message.block.length)
            writer.tag(3, WireType.LengthDelimited).bytes(message.block);
        /* uint64 height = 4; */
        if (message.height !== 0n)
            writer.tag(4, WireType.Varint).uint64(message.height);
        /* uint32 txindex = 6; */
        if (message.txindex !== 0)
            writer.tag(6, WireType.Varint).uint32(message.txindex);
        /* bytes calldata = 5; */
        if (message.calldata.length)
            writer.tag(5, WireType.LengthDelimited).bytes(message.calldata);
        /* uint32 vout = 7; */
        if (message.vout !== 0)
            writer.tag(7, WireType.Varint).uint32(message.vout);
        /* uint32 pointer = 8; */
        if (message.pointer !== 0)
            writer.tag(8, WireType.Varint).uint32(message.pointer);
        /* uint32 refund_pointer = 9; */
        if (message.refundPointer !== 0)
            writer.tag(9, WireType.Varint).uint32(message.refundPointer);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message alkanes.MessageContextParcel
 */
export const MessageContextParcel = new MessageContextParcel$Type();
// @generated message type with reflection information, may provide speed optimized methods
class KeyValuePair$Type extends MessageType<KeyValuePair> {
    constructor() {
        super("alkanes.KeyValuePair", [
            { no: 1, name: "key", kind: "scalar", T: 12 /*ScalarType.BYTES*/ },
            { no: 2, name: "value", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<KeyValuePair>): KeyValuePair {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.key = new Uint8Array(0);
        message.value = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<KeyValuePair>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: KeyValuePair): KeyValuePair {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* bytes key */ 1:
                    message.key = reader.bytes();
                    break;
                case /* bytes value */ 2:
                    message.value = reader.bytes();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: KeyValuePair, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* bytes key = 1; */
        if (message.key.length)
            writer.tag(1, WireType.LengthDelimited).bytes(message.key);
        /* bytes value = 2; */
        if (message.value.length)
            writer.tag(2, WireType.LengthDelimited).bytes(message.value);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message alkanes.KeyValuePair
 */
export const KeyValuePair = new KeyValuePair$Type();
// @generated message type with reflection information, may provide speed optimized methods
class ExtendedCallResponse$Type extends MessageType<ExtendedCallResponse> {
    constructor() {
        super("alkanes.ExtendedCallResponse", [
            { no: 1, name: "alkanes", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => AlkaneTransfer },
            { no: 2, name: "storage", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => KeyValuePair },
            { no: 3, name: "data", kind: "scalar", T: 12 /*ScalarType.BYTES*/ }
        ]);
    }
    create(value?: PartialMessage<ExtendedCallResponse>): ExtendedCallResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.alkanes = [];
        message.storage = [];
        message.data = new Uint8Array(0);
        if (value !== undefined)
            reflectionMergePartial<ExtendedCallResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: ExtendedCallResponse): ExtendedCallResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated alkanes.AlkaneTransfer alkanes */ 1:
                    message.alkanes.push(AlkaneTransfer.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* repeated alkanes.KeyValuePair storage */ 2:
                    message.storage.push(KeyValuePair.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                case /* bytes data */ 3:
                    message.data = reader.bytes();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: ExtendedCallResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated alkanes.AlkaneTransfer alkanes = 1; */
        for (let i = 0; i < message.alkanes.length; i++)
            AlkaneTransfer.internalBinaryWrite(message.alkanes[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* repeated alkanes.KeyValuePair storage = 2; */
        for (let i = 0; i < message.storage.length; i++)
            KeyValuePair.internalBinaryWrite(message.storage[i], writer.tag(2, WireType.LengthDelimited).fork(), options).join();
        /* bytes data = 3; */
        if (message.data.length)
            writer.tag(3, WireType.LengthDelimited).bytes(message.data);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message alkanes.ExtendedCallResponse
 */
export const ExtendedCallResponse = new ExtendedCallResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class SimulateResponse$Type extends MessageType<SimulateResponse> {
    constructor() {
        super("alkanes.SimulateResponse", [
            { no: 1, name: "execution", kind: "message", T: () => ExtendedCallResponse },
            { no: 2, name: "gas_used", kind: "scalar", T: 4 /*ScalarType.UINT64*/, L: 0 /*LongType.BIGINT*/ },
            { no: 3, name: "error", kind: "scalar", T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value?: PartialMessage<SimulateResponse>): SimulateResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.gasUsed = 0n;
        message.error = "";
        if (value !== undefined)
            reflectionMergePartial<SimulateResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: SimulateResponse): SimulateResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* alkanes.ExtendedCallResponse execution */ 1:
                    message.execution = ExtendedCallResponse.internalBinaryRead(reader, reader.uint32(), options, message.execution);
                    break;
                case /* uint64 gas_used */ 2:
                    message.gasUsed = reader.uint64().toBigInt();
                    break;
                case /* string error */ 3:
                    message.error = reader.string();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: SimulateResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* alkanes.ExtendedCallResponse execution = 1; */
        if (message.execution)
            ExtendedCallResponse.internalBinaryWrite(message.execution, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        /* uint64 gas_used = 2; */
        if (message.gasUsed !== 0n)
            writer.tag(2, WireType.Varint).uint64(message.gasUsed);
        /* string error = 3; */
        if (message.error !== "")
            writer.tag(3, WireType.LengthDelimited).string(message.error);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message alkanes.SimulateResponse
 */
export const SimulateResponse = new SimulateResponse$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AlkaneInventoryRequest$Type extends MessageType<AlkaneInventoryRequest> {
    constructor() {
        super("alkanes.AlkaneInventoryRequest", [
            { no: 1, name: "id", kind: "message", T: () => AlkaneId }
        ]);
    }
    create(value?: PartialMessage<AlkaneInventoryRequest>): AlkaneInventoryRequest {
        const message = globalThis.Object.create((this.messagePrototype!));
        if (value !== undefined)
            reflectionMergePartial<AlkaneInventoryRequest>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkaneInventoryRequest): AlkaneInventoryRequest {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* alkanes.AlkaneId id */ 1:
                    message.id = AlkaneId.internalBinaryRead(reader, reader.uint32(), options, message.id);
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: AlkaneInventoryRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* alkanes.AlkaneId id = 1; */
        if (message.id)
            AlkaneId.internalBinaryWrite(message.id, writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message alkanes.AlkaneInventoryRequest
 */
export const AlkaneInventoryRequest = new AlkaneInventoryRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class AlkaneInventoryResponse$Type extends MessageType<AlkaneInventoryResponse> {
    constructor() {
        super("alkanes.AlkaneInventoryResponse", [
            { no: 1, name: "alkanes", kind: "message", repeat: 1 /*RepeatType.PACKED*/, T: () => AlkaneTransfer }
        ]);
    }
    create(value?: PartialMessage<AlkaneInventoryResponse>): AlkaneInventoryResponse {
        const message = globalThis.Object.create((this.messagePrototype!));
        message.alkanes = [];
        if (value !== undefined)
            reflectionMergePartial<AlkaneInventoryResponse>(this, message, value);
        return message;
    }
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: AlkaneInventoryResponse): AlkaneInventoryResponse {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated alkanes.AlkaneTransfer alkanes */ 1:
                    message.alkanes.push(AlkaneTransfer.internalBinaryRead(reader, reader.uint32(), options));
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message: AlkaneInventoryResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter {
        /* repeated alkanes.AlkaneTransfer alkanes = 1; */
        for (let i = 0; i < message.alkanes.length; i++)
            AlkaneTransfer.internalBinaryWrite(message.alkanes[i], writer.tag(1, WireType.LengthDelimited).fork(), options).join();
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message alkanes.AlkaneInventoryResponse
 */
export const AlkaneInventoryResponse = new AlkaneInventoryResponse$Type();
