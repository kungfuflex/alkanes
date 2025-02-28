"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.encodeOutpointInput = encodeOutpointInput;
exports.decodeRunes = decodeRunes;
exports.decodeOutpointViewBase = decodeOutpointViewBase;
exports.decodeOutpointView = decodeOutpointView;
exports.decodeRunesResponse = decodeRunesResponse;
exports.encodeBlockHeightInput = encodeBlockHeightInput;
exports.encodeProtorunesByHeightInput = encodeProtorunesByHeightInput;
const protorune_1 = require("./proto/protorune");
const utils_1 = require("./utils");
const bytes_1 = require("./bytes");
const { OutpointResponse, Outpoint, BalanceSheet, RunesResponse, ProtorunesByHeightRequest, RunesByHeightRequest } = protorune_1.protorune;
function encodeOutpointInput(txid, pos) {
    const input = {
        txid: Buffer.from(txid, "hex"),
        vout: pos,
    };
    const str = Buffer.from(new Outpoint(input).serializeBinary()).toString("hex");
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
                tx: (0, bytes_1.fromUint128)(d.runeId.txindex)
            },
            name,
            spacedName: spaced_name,
            divisibility: d.divisibility,
            spacers: d.spacers,
            symbol: symbol,
        };
        return {
            rune,
            balance: (0, bytes_1.fromUint128)(balance)
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
                script: Buffer.from(op.output.script).toString("hex")
            }
            : { value: "", script: "" },
        height: op.height,
        txindex: op.txindex,
    };
}
function decodeOutpointView(hex) {
    const bytes = Uint8Array.from(Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex"));
    const op = OutpointResponse.deserializeBinary(bytes);
    return decodeOutpointViewBase(op);
}
function decodeRunesResponse(hex) {
    if (!hex || hex === '0x') {
        return { runes: [] };
    }
    const buffer = Buffer.from((0, utils_1.stripHexPrefix)(hex), "hex");
    if (buffer.length === 0) {
        return { runes: [] };
    }
    const response = RunesResponse.deserializeBinary(buffer);
    return {
        runes: response.runes.map(rune => ({
            runeId: `${rune.runeId?.height || 0}:${rune.runeId?.txindex || 0}`,
            name: Buffer.from(rune.name).toString('utf8'),
            divisibility: rune.divisibility,
            spacers: rune.spacers,
            symbol: rune.symbol
        }))
    };
}
function encodeBlockHeightInput(height) {
    const input = {
        height: height
    };
    const str = Buffer.from(new RunesByHeightRequest(input).serializeBinary()).toString("hex");
    return "0x" + str;
}
function encodeProtorunesByHeightInput(height, protocolTag) {
    const input = {
        height: height,
        protocol_tag: (0, bytes_1.toUint128)(protocolTag)
    };
    const str = Buffer.from(new ProtorunesByHeightRequest(input).serializeBinary()).toString("hex");
    return "0x" + str;
}
//# sourceMappingURL=outpoint.js.map