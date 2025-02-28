"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.formatKey = formatKey;
exports.toAlkaneTransfer = toAlkaneTransfer;
exports.fromCallType = fromCallType;
exports.toAlkaneId = toAlkaneId;
exports.toStorageSlot = toStorageSlot;
exports.toContext = toContext;
exports.toResponse = toResponse;
exports.toEvent = toEvent;
exports.encodeTraceRequest = encodeTraceRequest;
exports.decodeTraceResponse = decodeTraceResponse;
exports.encodeSimulateRequest = encodeSimulateRequest;
exports.decodeSimulateResponse = decodeSimulateResponse;
exports.outpointResponseToObject = outpointResponseToObject;
exports.decodeOutpointResponse = decodeOutpointResponse;
const bytes_1 = require("./bytes");
const alkanes_1 = require("./proto/alkanes");
const utils_1 = require("./utils");
const protorune_1 = require("./proto/protorune");
const { SimulateResponse, MessageContextParcel, AlkanesTrace } = alkanes_1.alkanes;
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
        Buffer.from(new protorune_1.protorune.Outpoint(input).serializeBinary()).toString("hex"));
}
function decodeTraceResponse(hex) {
    const resp = alkanes_1.alkanes.AlkanesTrace.deserializeBinary(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex"));
    return resp.toObject().events.map((v) => toEvent(v));
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
        Buffer.from(new alkanes_1.alkanes.MessageContextParcel(input).serializeBinary()).toString("hex"));
}
class ExecutionStatus {
    constructor() { }
}
ExecutionStatus.SUCCESS = 0;
ExecutionStatus.REVERT = 1;
function decodeSimulateResponse(response) {
    const res = alkanes_1.alkanes.SimulateResponse.deserializeBinary(Buffer.from((0, utils_1.stripHexPrefix)(response), "hex"));
    if (res.error || !res.execution)
        return {
            status: ExecutionStatus.REVERT,
            gasUsed: 0,
            execution: { alkanes: [], storage: [], data: "0x", error: res.error },
        };
    return {
        status: ExecutionStatus.SUCCESS,
        gasUsed: res.gas_used,
        execution: {
            alkanes: res.execution.alkanes,
            storage: res.execution.storage,
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
    return outpointResponseToObject(((protorune_1.protorune.OutpointResponse.deserializeBinary(Buffer.from(result.substr(2), "hex")).toObject() || {}).balances || {}).entries || []);
}
//# sourceMappingURL=invoke.js.map