"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeRocksDBRequest = encodeRocksDBRequest;
exports.decodeRocksDBResponse = decodeRocksDBResponse;
const rocksdb_1 = require("./proto/rocksdb");
function encodeRocksDBRequest(params) {
    const request = rocksdb_1.RocksDBRequest.create({
        prefix: params.prefix || "",
        limit: params.limit || 100
    });
    return "0x" + Buffer.from(rocksdb_1.RocksDBRequest.toBinary(request)).toString("hex");
}
function decodeRocksDBResponse(hexString) {
    const buffer = Buffer.from(hexString.slice(2), "hex");
    const response = rocksdb_1.RocksDBResponse.fromBinary(buffer);
    return {
        keys: response.keys,
        values: response.values
    };
}
//# sourceMappingURL=rocksdb.js.map