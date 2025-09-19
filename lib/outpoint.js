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
exports.encodeOutpointInput = encodeOutpointInput;
exports.decodeRunes = decodeRunes;
exports.decodeOutpointViewBase = decodeOutpointViewBase;
exports.decodeOutpointView = decodeOutpointView;
exports.decodeRunesResponse = decodeRunesResponse;
exports.encodeBlockHeightInput = encodeBlockHeightInput;
exports.encodeProtorunesByHeightInput = encodeProtorunesByHeightInput;
exports.encodeAlkanesIdToOutpointInput = encodeAlkanesIdToOutpointInput;
exports.decodeAlkanesIdToOutpointResponse = decodeAlkanesIdToOutpointResponse;
const protobuf = __importStar(require("./proto/protorune"));
const utils_1 = require("./utils");
const bytes_1 = require("./bytes");
const { OutpointResponse, Outpoint, BalanceSheet, RunesResponse, ProtorunesByHeightRequest, RunesByHeightRequest, } = protobuf;
const alkanes_protobuf = __importStar(require("./proto/alkanes"));
function encodeOutpointInput(txid, pos) {
    const input = {
        txid: Buffer.from(txid, "hex"),
        vout: pos,
    };
    const str = Buffer.from(Outpoint.encode(input).finish()).toString("hex");
    return "0x" + str;
}
function decodeRunes(balances) {
    if (!balances)
        return [];
    return balances.entries.map((entry) => {
        const balance = entry.balance;
        const d = entry.rune;
        const spacer = "•";
        const bitField = d.spacers.toString(2);
        let name = d.name;
        let spaced_name = name;
        const symbol = d.symbol;
        let x = 0;
        bitField
            .split("")
            .reverse()
            .map((d, i) => {
            if (d == "1") {
                spaced_name = `${spaced_name.slice(0, i + 1 + x)}${spacer}${spaced_name.slice(i + 1 + x)}`;
                x++;
            }
        });
        const rune = {
            id: {
                block: (0, bytes_1.fromUint128)(d.runeId.height),
                tx: (0, bytes_1.fromUint128)(d.runeId.txindex),
            },
            name,
            spacedName: spaced_name,
            divisibility: d.divisibility,
            spacers: d.spacers,
            symbol: symbol,
        };
        return {
            rune,
            balance: (0, bytes_1.fromUint128)(balance),
        };
    });
}
function decodeOutpointViewBase(op) {
    return {
        runes: decodeRunes(op.balances),
        outpoint: {
            txid: Buffer.from(op.outpoint.txid).toString("hex"),
            vout: op.outpoint.vout,
        },
        output: op.output
            ? {
                value: op.output.value,
                script: Buffer
                    .from(op.output.script)
                    .toString("hex"),
            }
            : { value: "", script: "" },
        height: op.height,
        txindex: op.txindex,
    };
}
function decodeOutpointView(hex) {
    const bytes = Uint8Array.from(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex"));
    const op = OutpointResponse.decode(bytes);
    return decodeOutpointViewBase(op);
}
function decodeRunesResponse(hex) {
    if (!hex || hex === "0x") {
        return { runes: [] };
    }
    const buffer = new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex"));
    if (buffer.length === 0) {
        return { runes: [] };
    }
    const response = RunesResponse.decode(buffer);
    return {
        runes: response.runes.map((rune) => ({
            runeId: `${rune.runeId?.height || 0}:${rune.runeId?.txindex || 0}`,
            name: Buffer.from(rune.name).toString("utf8"),
            divisibility: rune.divisibility,
            spacers: rune.spacers,
            symbol: rune.symbol,
        })),
    };
}
function encodeBlockHeightInput(height) {
    const input = {
        height: height,
    };
    const str = Buffer.from(RunesByHeightRequest.encode(input).finish()).toString("hex");
    return "0x" + str;
}
function encodeProtorunesByHeightInput(height, protocolTag) {
    const input = {
        height: height,
        protocol_tag: (0, bytes_1.toUint128)(protocolTag),
    };
    const str = Buffer.from(ProtorunesByHeightRequest.encode(input).finish()).toString("hex");
    return "0x" + str;
}
function encodeAlkanesIdToOutpointInput(block, tx) {
    const alkane_id = alkanes_protobuf.AlkaneId.create({
        block: (0, bytes_1.toUint128)(block),
        tx: (0, bytes_1.toUint128)(tx),
    });
    const str = Buffer.from(alkanes_protobuf.AlkaneIdToOutpointRequest.encode({
        id: alkane_id,
    }).finish()).toString("hex");
    return "0x" + str;
}
function decodeAlkanesIdToOutpointResponse(hex) {
    if (!hex || hex === "0x") {
        return { outpoint: {} };
    }
    const buffer = new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex"));
    if (buffer.length === 0) {
        return { outpoint: {} };
    }
    const response = alkanes_protobuf.AlkaneIdToOutpointResponse.decode(buffer);
    return {
        outpoint: {
            txid: Buffer.from(response.txid).toString("hex"),
            vout: response.vout,
        },
    };
}
//# sourceMappingURL=outpoint.js.map