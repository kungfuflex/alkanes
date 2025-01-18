"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.RocksDBResponse = exports.RocksDBRequest = void 0;
const runtime_1 = require("@protobuf-ts/runtime");
const runtime_2 = require("@protobuf-ts/runtime");
const runtime_3 = require("@protobuf-ts/runtime");
const runtime_4 = require("@protobuf-ts/runtime");
// @generated message type with reflection information, may provide speed optimized methods
class RocksDBRequest$Type extends runtime_4.MessageType {
    constructor() {
        super("rocksdb.RocksDBRequest", [
            { no: 1, name: "prefix", kind: "scalar", T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "limit", kind: "scalar", T: 13 /*ScalarType.UINT32*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.prefix = "";
        message.limit = 0;
        if (value !== undefined)
            (0, runtime_3.reflectionMergePartial)(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* string prefix */ 1:
                    message.prefix = reader.string();
                    break;
                case /* uint32 limit */ 2:
                    message.limit = reader.uint32();
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? runtime_2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* string prefix = 1; */
        if (message.prefix !== "")
            writer.tag(1, runtime_1.WireType.LengthDelimited).string(message.prefix);
        /* uint32 limit = 2; */
        if (message.limit !== 0)
            writer.tag(2, runtime_1.WireType.Varint).uint32(message.limit);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? runtime_2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message rocksdb.RocksDBRequest
 */
exports.RocksDBRequest = new RocksDBRequest$Type();
// @generated message type with reflection information, may provide speed optimized methods
class RocksDBResponse$Type extends runtime_4.MessageType {
    constructor() {
        super("rocksdb.RocksDBResponse", [
            { no: 1, name: "keys", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ },
            { no: 2, name: "values", kind: "scalar", repeat: 2 /*RepeatType.UNPACKED*/, T: 9 /*ScalarType.STRING*/ }
        ]);
    }
    create(value) {
        const message = globalThis.Object.create((this.messagePrototype));
        message.keys = [];
        message.values = [];
        if (value !== undefined)
            (0, runtime_3.reflectionMergePartial)(this, message, value);
        return message;
    }
    internalBinaryRead(reader, length, options, target) {
        let message = target ?? this.create(), end = reader.pos + length;
        while (reader.pos < end) {
            let [fieldNo, wireType] = reader.tag();
            switch (fieldNo) {
                case /* repeated string keys */ 1:
                    message.keys.push(reader.string());
                    break;
                case /* repeated string values */ 2:
                    message.values.push(reader.string());
                    break;
                default:
                    let u = options.readUnknownField;
                    if (u === "throw")
                        throw new globalThis.Error(`Unknown field ${fieldNo} (wire type ${wireType}) for ${this.typeName}`);
                    let d = reader.skip(wireType);
                    if (u !== false)
                        (u === true ? runtime_2.UnknownFieldHandler.onRead : u)(this.typeName, message, fieldNo, wireType, d);
            }
        }
        return message;
    }
    internalBinaryWrite(message, writer, options) {
        /* repeated string keys = 1; */
        for (let i = 0; i < message.keys.length; i++)
            writer.tag(1, runtime_1.WireType.LengthDelimited).string(message.keys[i]);
        /* repeated string values = 2; */
        for (let i = 0; i < message.values.length; i++)
            writer.tag(2, runtime_1.WireType.LengthDelimited).string(message.values[i]);
        let u = options.writeUnknownFields;
        if (u !== false)
            (u == true ? runtime_2.UnknownFieldHandler.onWrite : u)(this.typeName, message, writer);
        return writer;
    }
}
/**
 * @generated MessageType for protobuf message rocksdb.RocksDBResponse
 */
exports.RocksDBResponse = new RocksDBResponse$Type();
//# sourceMappingURL=rocksdb.js.map