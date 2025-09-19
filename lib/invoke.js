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
exports.formatKey = formatKey;
exports.toAlkaneTransfer = toAlkaneTransfer;
exports.toBytecodeRequest = toBytecodeRequest;
exports.encodeBlockRequest = encodeBlockRequest;
exports.encodeGetBytecodeRequest = encodeGetBytecodeRequest;
exports.fromCallType = fromCallType;
exports.toAlkaneId = toAlkaneId;
exports.toStorageSlot = toStorageSlot;
exports.toContext = toContext;
exports.toResponse = toResponse;
exports.toEvent = toEvent;
exports.encodeTraceRequest = encodeTraceRequest;
exports.encodeTraceBlockRequest = encodeTraceBlockRequest;
exports.encodeUnwrapsRequest = encodeUnwrapsRequest;
exports.decodeUnwrapsResponse = decodeUnwrapsResponse;
exports.decodeBlockResponse = decodeBlockResponse;
exports.decodeTraceBlockResponse = decodeTraceBlockResponse;
exports.decodeTraceResponse = decodeTraceResponse;
exports.encodeSimulateRequest = encodeSimulateRequest;
exports.decodeSimulateResponse = decodeSimulateResponse;
exports.outpointResponseToObject = outpointResponseToObject;
exports.decodeOutpointResponse = decodeOutpointResponse;
exports.decodeMetaResponse = decodeMetaResponse;
exports.encodeAlkaneInventoryRequest = encodeAlkaneInventoryRequest;
exports.decodeAlkaneInventoryResponse = decodeAlkaneInventoryResponse;
exports.encodeAlkaneStorageRequest = encodeAlkaneStorageRequest;
exports.decodeAlkaneStorageResponse = decodeAlkaneStorageResponse;
const bytes_1 = require("./bytes");
const alkanes_protobuf = __importStar(require("./proto/alkanes"));
const utils_1 = require("./utils");
const protobuf = __importStar(require("./proto/protorune"));
const { SimulateResponse, MessageContextParcel, AlkanesTrace } = alkanes_protobuf;
const SEP = "/".charCodeAt(0);
function formatKey(v) {
    return Array.from(v).reduce((r, v) => {
        if (v === SEP) {
            r.push([]);
            return r;
        }
        else {
            const last = r[r.length - 1];
            last.push(v);
            return r;
        }
    }, [[]])
        .map((v) => {
        const s = Buffer.from(v).toString("utf8");
        if (/^\w+$/.test(s))
            return s;
        else
            return Buffer.from(v).toString("hex");
    })
        .join("/");
}
function toAlkaneTransfer(v) {
    return {
        id: toAlkaneId(v.id),
        value: (0, bytes_1.fromUint128)(v.value),
    };
}
function toBytecodeRequest({ block, tx }) {
    return alkanes_protobuf.BytecodeRequest.create({
        id: alkanes_protobuf.AlkaneId.create({
            block: (0, bytes_1.toUint128)(block),
            tx: (0, bytes_1.toUint128)(tx),
        })
    });
}
function encodeBlockRequest({ height }) {
    return alkanes_protobuf.BlockRequest.create({
        height
    });
}
function encodeGetBytecodeRequest(v) {
    const id = toBytecodeRequest(v);
    return (0, utils_1.addHexPrefix)(Buffer.from(alkanes_protobuf.BytecodeRequest.encode(id).finish()).toString('hex'));
}
function fromCallType(v) {
    switch (v) {
        case 1:
            return "call";
        case 2:
            return "delegatecall";
        case 3:
            return "staticcall";
        default:
            return "unknowncall";
    }
}
function toAlkaneId(v) {
    return {
        block: typeof v.block == "bigint" ? v.block : (0, bytes_1.fromUint128)(v.block),
        tx: typeof v.tx == "bigint" ? v.tx : (0, bytes_1.fromUint128)(v.tx),
    };
}
function toStorageSlot(v) {
    return {
        key: formatKey(v.key),
        value: "0x" + Buffer.from(v.value).toString("hex"),
    };
}
function toContext(v) {
    return {
        myself: toAlkaneId(v.myself),
        caller: toAlkaneId(v.caller),
        inputs: v.inputs.map((v) => (0, bytes_1.fromUint128)(v)),
        incomingAlkanes: v.incoming_alkanes.map((v) => toAlkaneTransfer(v)),
        vout: v.vout,
    };
}
function toResponse(v) {
    return {
        alkanes: v.alkanes.map((v) => toAlkaneTransfer(v)),
        data: "0x" + Buffer.from(v.data).toString("hex"),
        storage: v.storage.map((v) => toStorageSlot(v)),
    };
}
function toEvent(v) {
    let k = Object.keys(v)[0];
    switch (k) {
        case "create_alkane":
            let create_event = {
                event: "create",
                data: toAlkaneId(v[k].new_alkane),
            };
            return create_event;
        case "enter_context":
            let enter_context = {
                event: "invoke",
                data: {
                    type: fromCallType(v[k].call_type),
                    context: toContext(v[k].context.inner),
                    fuel: v[k].context.fuel,
                },
            };
            return enter_context;
        case "exit_context":
            let exit_context = {
                event: "return",
                data: {
                    status: v[k].status == 0 ? "success" : "revert",
                    response: toResponse(v[k].response),
                    //fuelUsed: v[k].response.fuel_used
                },
            };
            return exit_context;
    }
}
function encodeTraceRequest({ txid, vout, }) {
    const input = {
        txid: Buffer.from((0, utils_1.stripHexPrefix)(txid), "hex"),
        vout: vout,
    };
    return ("0x" +
        Buffer.from(protobuf.Outpoint.encode(input).finish()).toString("hex"));
}
function encodeTraceBlockRequest({ block, }) {
    const input = {
        block: BigInt(block),
    };
    return ("0x" +
        Buffer.from(alkanes_protobuf.TraceBlockRequest.encode(input).finish()).toString("hex"));
}
function encodeUnwrapsRequest({ block, }) {
    const input = {
        height: Number(block),
    };
    return ("0x" +
        Buffer.from(alkanes_protobuf.PendingUnwrapsRequest.encode(input).finish()).toString("hex"));
}
function decodeUnwrapsResponse(hex) {
    const res = alkanes_protobuf.PendingUnwrapsResponse.decode(new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    return res.payments.map((p) => ({
        spendable: {
            txid: Buffer.from(p.spendable.txid).toString("hex"),
            vout: p.spendable.vout,
        },
        output: Buffer.from(p.output).toString("hex"),
        fulfilled: p.fulfilled,
    }));
}
function decodeBlockResponse(hex) {
    return (0, utils_1.addHexPrefix)(Buffer.from(alkanes_protobuf.BlockResponse.decode(new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex"))).block).toString("hex"));
}
function decodeTraceBlockResponse(hex) {
    return alkanes_protobuf.TraceBlockResponse.decode(new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex"))).traces.map(({ outpoint, trace }) => {
        return {
            outpoint: {
                txid: Buffer.from(outpoint.txid).toString("hex"),
                vout: outpoint.vout,
            },
            trace: trace.events.map((v) => toEvent(v)),
        };
    });
}
function decodeTraceResponse(hex) {
    const resp = alkanes_protobuf.AlkanesTrace.decode(new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    return resp.events.map((v) => toEvent(v));
}
function encodeSimulateRequest({ alkanes, transaction, height, block, inputs, target, txindex, vout, pointer, refundPointer, }) {
    const input = {
        alkanes: alkanes.map((v) => (0, bytes_1.toProtobufAlkaneTransfer)(v)),
        transaction: Uint8Array.from(Buffer.from(transaction, "hex")),
        height: Number(height),
        txindex,
        calldata: (0, bytes_1.encipher)([target.block, target.tx, ...inputs]),
        block: Uint8Array.from(Buffer.from(block, "hex")),
        vout,
        pointer,
        refund_pointer: refundPointer,
    };
    return ("0x" +
        Buffer.from(alkanes_protobuf.MessageContextParcel.encode(input).finish()).toString("hex"));
}
class ExecutionStatus {
    constructor() { }
}
ExecutionStatus.SUCCESS = 0;
ExecutionStatus.REVERT = 1;
function decodeSimulateResponse(response) {
    const res = alkanes_protobuf.SimulateResponse.decode(new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(response), "hex")));
    if (res.error || !res.execution)
        return {
            status: ExecutionStatus.REVERT,
            gasUsed: 0,
            execution: { alkanes: [], storage: [], data: "0x", error: res.error },
        };
    return {
        status: ExecutionStatus.SUCCESS,
        gasUsed: Number(res.gasUsed),
        execution: {
            alkanes: res.execution.alkanes.map(toAlkaneTransfer),
            storage: res.execution.storage.map(toStorageSlot),
            error: null,
            data: "0x" + Buffer.from(res.execution.data).toString("hex"),
        },
    };
}
function outpointResponseToObject(v) {
    return v.map((item) => ({
        token: {
            id: {
                block: (0, bytes_1.fromUint128)(item.rune.runeId.height),
                tx: (0, bytes_1.fromUint128)(item.rune.runeId.txindex),
            },
            name: item.rune.name,
            symbol: item.rune.symbol,
        },
        value: (0, bytes_1.fromUint128)(item.balance),
    }));
}
function decodeOutpointResponse(result) {
    return outpointResponseToObject(((protobuf.OutpointResponse.decode(new Uint8Array(Buffer.from(result.substr(2), "hex"))) || {}).balances || {}).entries || []);
}
function decodeMetaResponse(response) {
    if (!response || response === "0x") {
        return null;
    }
    const bytes = Buffer.from((0, utils_1.stripHexPrefix)(response), "hex");
    try {
        return JSON.parse(bytes.toString("utf8"));
    }
    catch (e) {
        console.error("Failed to parse meta response as JSON:", e);
        return null;
    }
}
function encodeAlkaneInventoryRequest(block, tx) {
    const input = {
        id: alkanes_protobuf.AlkaneId.create({
            block: (0, bytes_1.toUint128)(block),
            tx: (0, bytes_1.toUint128)(tx),
        }),
    };
    return ("0x" +
        Buffer.from(alkanes_protobuf.AlkaneInventoryRequest.encode(input).finish()).toString("hex"));
}
function decodeAlkaneInventoryResponse(hex) {
    const res = alkanes_protobuf.AlkaneInventoryResponse.decode(new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    return res.alkanes.map(toAlkaneTransfer);
}
function encodeAlkaneStorageRequest({ id, path, }) {
    const input = {
        id: alkanes_protobuf.AlkaneId.create({
            block: (0, bytes_1.toUint128)(id.block),
            tx: (0, bytes_1.toUint128)(id.tx),
        }),
        path,
    };
    return ("0x" +
        Buffer.from(alkanes_protobuf.AlkaneStorageRequest.encode(input).finish()).toString("hex"));
}
function decodeAlkaneStorageResponse(hex) {
    const res = alkanes_protobuf.AlkaneStorageResponse.decode(new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex")));
    return "0x" + Buffer.from(res.value).toString("hex");
}
//# sourceMappingURL=invoke.js.map