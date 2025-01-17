"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stripHexPrefix = void 0;
exports.bigIntToBase10Recursive = bigIntToBase10Recursive;
exports.dumpJSONRPCPayload = dumpJSONRPCPayload;
exports.mapToPrimitives = mapToPrimitives;
exports.unmapFromPrimitives = unmapFromPrimitives;
exports.unomapFromPrimitives = unomapFromPrimitives;
const lodash_1 = require("lodash");
function bigIntToBase10Recursive(v) {
    if (typeof v === "object") {
        if (Array.isArray(v))
            return v.map((item) => bigIntToBase10Recursive(item));
        return (0, lodash_1.mapValues)(v, (value) => bigIntToBase10Recursive(value));
    }
    if (typeof v === "bigint")
        return v.toString(10);
    return v;
}
const stripHexPrefix = (s) => s.substr(0, 2) === "0x" ? s.substr(2) : s;
exports.stripHexPrefix = stripHexPrefix;
function dumpJSONRPCPayload(payload) {
    if (!payload.method || !payload.params)
        return "null";
    return payload.method + "/" + payload.params.join("/") + "/";
}
function mapToPrimitives(v) {
    switch (typeof v) {
        case "bigint":
            return "0x" + v.toString(16);
        case "object":
            if (v === null)
                return null;
            if (Buffer.isBuffer(v))
                return "0x" + v.toString("hex");
            if (Array.isArray(v))
                return v.map((v) => mapToPrimitives(v));
            return Object.fromEntries(Object.entries(v).map(([key, value]) => [key, mapToPrimitives(value)]));
        default:
            return v;
    }
}
function unmapFromPrimitives(v) {
    switch (typeof v) {
        case "string":
            if (v.startsWith("0x")) {
                const stripped = (0, exports.stripHexPrefix)(v);
                if (/^[0-9a-fA-F]+$/.test(stripped)) {
                    return BigInt("0x" + stripped);
                }
                return Buffer.from(stripped, "hex");
            }
            if (!isNaN(v))
                return BigInt(v);
            return v;
        case "object":
            if (v === null)
                return null;
            if (Array.isArray(v))
                return v.map((item) => unmapFromPrimitives(item));
            return Object.fromEntries(Object.entries(v).map(([key, value]) => [
                key,
                unmapFromPrimitives(value),
            ]));
        default:
            return v;
    }
}
function unomapFromPrimitives(v) {
    switch (typeof v) {
        case "string":
            if (v.startsWith("0x")) {
                const stripped = (0, exports.stripHexPrefix)(v);
                if (/^[0-9a-fA-F]+$/.test(stripped)) {
                    return BigInt("0x" + stripped);
                }
                return Buffer.from(stripped, "hex");
            }
            if (!isNaN(v))
                return BigInt(v);
            return v;
        case "object":
            if (v === null)
                return null;
            if (Array.isArray(v)) {
                return v.map((item) => unmapFromPrimitives(item));
            }
            return Object.fromEntries(Object.entries(v).map(([key, value]) => [key, unmapFromPrimitives(value)]));
        default:
            return v;
    }
}
//# sourceMappingURL=utils.js.map