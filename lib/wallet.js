"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeProtorunesWalletInput = encodeProtorunesWalletInput;
exports.encodeTransactionId = encodeTransactionId;
exports.encodeWalletInput = encodeWalletInput;
exports.decodeTransactionResult = decodeTransactionResult;
exports.decodeWalletOutput = decodeWalletOutput;
exports.encodeRuntimeInput = encodeRuntimeInput;
exports.decodeRuntimeOutput = decodeRuntimeOutput;
const outpoint_1 = require("./outpoint");
const protobuf = __importStar(require("./proto/protorune"));
const outpoint_2 = require("./outpoint");
const utils_1 = require("./utils");
const bytes_1 = require("./bytes");
const { ProtorunesWalletRequest, TransactionRecord, WalletRequest, WalletResponse, RuntimeInput, Runtime, Outpoint, } = protobuf;
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
    return ("0x" + Buffer.from(ProtorunesWalletRequest.encode(input).finish()).toString("hex"));
}
function encodeTransactionId(txid) {
    return Buffer.from((0, utils_1.stripHexPrefix)(txid), 'hex');
}
function encodeWalletInput(address) {
    const input = {
        wallet: Uint8Array.from(Buffer.from(address, "utf-8")),
    };
    return ("0x" + Buffer.from(WalletRequest.encode(input).finish()).toString("hex"));
}
function decodeTransactionResult(hex) {
    const { transaction, height } = TransactionRecord.decode(Uint8Array.from(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    return {
        transaction: (0, utils_1.addHexPrefix)(Buffer.from(transaction).toString('hex')),
        height: Number(height)
    };
}
function decodeWalletOutput(hex) {
    const wo = WalletResponse.decode(Uint8Array.from(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    return {
        outpoints: wo.outpoints.map((op) => (0, outpoint_2.decodeOutpointViewBase)(op)),
        balanceSheet: (0, outpoint_1.decodeRunes)(wo.balances),
    };
}
function encodeRuntimeInput(protocolTag) {
    const input = {
        protocolTag: encodeProtocolTag(protocolTag),
    };
    return "0x" + Buffer.from(RuntimeInput.encode(input).finish()).toString("hex");
}
function decodeRuntimeOutput(hex) {
    const runtime = Runtime.decode(Uint8Array.from(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    const balances = (0, outpoint_1.decodeRunes)(runtime.balances);
    return {
        balances,
    };
}
//# sourceMappingURL=wallet.js.map