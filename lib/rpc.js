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
exports.AlkanesRpc = void 0;
const protowallet = __importStar(require("./wallet"));
const invoke = __importStar(require("./invoke"));
const outpoint_1 = require("./outpoint");
const base_rpc_1 = require("./base-rpc");
const protorune_1 = require("./proto/protorune");
const proto_runestone_upgrade_1 = require("./protorune/proto_runestone_upgrade");
const integer_1 = require("@magiceden-oss/runestone-lib/dist/src/integer");
const protoruneruneid_1 = require("./protorune/protoruneruneid");
const protostone_1 = require("./protorune/protostone");
const bytes_1 = require("./bytes");
const addHexPrefix = (s) => (s.substr(0, 2) === "0x" ? s : "0x" + s);
let id = 0;
class AlkanesRpc extends base_rpc_1.BaseRpc {
    async protorunesbyaddress({ address, protocolTag }, blockTag = "latest") {
        const buffer = protowallet.encodeProtorunesWalletInput(address, protocolTag);
        const byteString = await this._call({
            method: "protorunesbyaddress",
            input: buffer,
        }, blockTag);
        const decoded = protowallet.decodeWalletOutput(byteString);
        return decoded;
    }
    async transactionbyid({ txid }, blockTag = "latest") {
        const buffer = protowallet.encodeTransactionId(txid);
        console.log(buffer);
        const byteString = await this._call({
            method: "transactionbyid",
            input: buffer,
        }, blockTag);
        console.log(byteString);
        const decoded = protowallet.decodeTransactionResult(byteString);
        console.log(decoded);
        return decoded;
    }
    async spendablesbyaddress({ address, protocolTag }, blockTag = "latest") {
        const buffer = protowallet.encodeProtorunesWalletInput(address, protocolTag);
        const byteString = await this._call({
            method: "spendablesbyaddress",
            input: buffer,
        }, blockTag);
        const decoded = protowallet.decodeWalletOutput(byteString);
        return decoded;
    }
    async runesbyaddress({ address }, blockTag = "latest") {
        const buffer = protowallet.encodeWalletInput(address);
        const byteString = await this._call({
            method: "runesbyaddress",
            input: buffer,
        }, blockTag);
        const decoded = protowallet.decodeWalletOutput(byteString);
        return decoded;
    }
    async runesbyheight({ height }, blockTag = "latest") {
        const payload = (0, outpoint_1.encodeBlockHeightInput)(height);
        const response = await this._call({
            method: "runesbyheight",
            input: payload,
        }, blockTag);
        const decodedResponse = (0, outpoint_1.decodeRunesResponse)(response);
        return decodedResponse;
    }
    async protorunesbyheight({ height, protocolTag }, blockTag = "latest") {
        const payload = (0, outpoint_1.encodeProtorunesByHeightInput)(height, protocolTag);
        const response = await this._call({
            method: "protorunesbyheight",
            input: payload,
        }, blockTag);
        const decodedResponse = (0, outpoint_1.decodeRunesResponse)(response);
        return decodedResponse;
    }
    async protorunesbyoutpoint({ txid, vout, protocolTag }, blockTag = "latest") {
        const buffer = "0x" +
            Buffer.from(new protorune_1.protorune.OutpointWithProtocol({
                protocol: (0, bytes_1.toUint128)(protocolTag),
                txid: Buffer.from(txid, "hex"),
                vout,
            }).serializeBinary()).toString("hex");
        return invoke.decodeOutpointResponse(await this._call({
            method: "protorunesbyoutpoint",
            input: buffer,
        }, blockTag));
    }
    async runesbyoutpoint({ txid, vout }, blockTag = "latest") {
        const buffer = "0x" +
            Buffer.from(new protorune_1.protorune.Outpoint({
                txid: Buffer.from(txid, "hex"),
                vout,
            }).serializeBinary()).toString("hex");
        return invoke.decodeOutpointResponse(await this._call({
            method: "protorunesbyoutpoint",
            input: buffer,
        }, blockTag));
    }
    async trace({ txid, vout }, blockTag = "latest") {
        const buffer = invoke.encodeTraceRequest({
            txid,
            vout,
        });
        const byteString = await this._call({
            method: "trace",
            input: buffer,
        }, blockTag);
        const decoded = invoke.decodeTraceResponse(byteString);
        return decoded;
    }
    async simulate({ alkanes, transaction, height, block, txindex, target, inputs, vout, pointer, refundPointer, }, blockTag = "latest") {
        const buffer = invoke.encodeSimulateRequest({
            alkanes,
            transaction,
            height,
            txindex,
            target,
            block,
            inputs,
            vout,
            pointer,
            refundPointer,
        });
        const byteString = await this._call({
            method: "simulate",
            input: buffer,
        }, blockTag);
        const decoded = invoke.decodeSimulateResponse(byteString);
        return decoded;
    }
    async runtime({ protocolTag }, blockTag = "latest") {
        const buffer = protowallet.encodeRuntimeInput(protocolTag);
        const byteString = await this._call({
            method: "protorunesbyaddress",
            input: buffer,
        }, blockTag);
        const decoded = protowallet.decodeRuntimeOutput(byteString);
        return decoded;
    }
    async pack({ runes, cellpack, pointer, refundPointer, edicts, }) {
        const protostone = new protostone_1.ProtoStone({
            message: {
                calldata: cellpack,
                pointer,
                refundPointer,
            },
            protocolTag: BigInt(1),
            edicts,
        });
        return (0, proto_runestone_upgrade_1.encodeRunestoneProtostone)({
            edicts: runes.map((r) => ({
                id: new protoruneruneid_1.ProtoruneRuneId((0, integer_1.u128)(r.id.block), (0, integer_1.u128)(r.id.tx)),
                output: (0, integer_1.u32)(2),
                amount: (0, integer_1.u128)(r.value),
            })),
            pointer: 3,
            protostones: [protostone],
        }).encodedRunestone;
    }
}
exports.AlkanesRpc = AlkanesRpc;
//# sourceMappingURL=rpc.js.map