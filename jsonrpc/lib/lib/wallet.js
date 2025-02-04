"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeProtorunesWalletInput = encodeProtorunesWalletInput;
exports.encodeTransactionId = encodeTransactionId;
exports.encodeWalletInput = encodeWalletInput;
exports.decodeTransactionResult = decodeTransactionResult;
exports.decodeWalletOutput = decodeWalletOutput;
exports.encodeRuntimeInput = encodeRuntimeInput;
exports.decodeRuntimeOutput = decodeRuntimeOutput;
const outpoint_1 = require("./outpoint");
const protorune_1 = require("./proto/protorune");
const outpoint_2 = require("./outpoint");
const utils_1 = require("./utils");
const bytes_1 = require("./bytes");
const { ProtorunesWalletRequest, TransactionRecord, WalletRequest, WalletResponse, RuntimeInput, Runtime, Outpoint, } = protorune_1.protorune;
/**
 * Encodes the protocolTag in LEB128 format
 * @param protocolTag
 * @returns the protocolTag in LEB128 format
 */
function encodeProtocolTag(protocolTag) {
    return (0, bytes_1.toUint128)(protocolTag);
}
/**
 * Protocol tag needs to be LEB128 encoded to pass into the protocol
 * @param address
 * @param protocolTag
 * @returns ProtorunesWalletRequest protobuf hex buffer
 */
function encodeProtorunesWalletInput(address, protocolTag) {
    const input = {
        wallet: Uint8Array.from(Buffer.from(address, "utf-8")),
        protocol_tag: encodeProtocolTag(protocolTag),
    };
    return ("0x" + Buffer.from(new ProtorunesWalletRequest(input).serializeBinary()).toString("hex"));
}
function encodeTransactionId(txid) {
    return Buffer.from((0, utils_1.stripHexPrefix)(txid), 'hex');
}
function encodeWalletInput(address) {
    const input = {
        wallet: Uint8Array.from(Buffer.from(address, "utf-8")),
    };
    return ("0x" + Buffer.from(new WalletRequest(input).serializeBinary()).toString("hex"));
}
function decodeTransactionResult(hex) {
    const { transaction, height } = TransactionRecord.deserializeBinary(Uint8Array.from(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    return {
        transaction: (0, utils_1.addHexPrefix)(Buffer.from(transaction).toString('hex')),
        height: Number(height)
    };
}
function decodeWalletOutput(hex) {
    const wo = WalletResponse.deserializeBinary(Uint8Array.from(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    return {
        outpoints: wo.outpoints.map((op) => (0, outpoint_2.decodeOutpointViewBase)(op)),
        balanceSheet: (0, outpoint_1.decodeRunes)(wo.balances),
    };
}
function encodeRuntimeInput(protocolTag) {
    const input = {
        protocolTag: encodeProtocolTag(protocolTag),
    };
    return "0x" + Buffer.from(new RuntimeInput(input).serializeBinary()).toString("hex");
}
function decodeRuntimeOutput(hex) {
    const runtime = Runtime.deserializeBinary(Uint8Array.from(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    const balances = (0, outpoint_1.decodeRunes)(runtime.balances);
    return {
        balances,
    };
}
//# sourceMappingURL=wallet.js.map