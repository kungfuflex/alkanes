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
exports.parseTransaction = parseTransaction;
exports.parseRunestone = parseRunestone;
exports.parseRunestoneFromOpReturnHex = parseRunestoneFromOpReturnHex;
exports.parseRunestoneFromTransaction = parseRunestoneFromTransaction;
exports.parseLeb128Object = parseLeb128Object;
exports.parseProtostones = parseProtostones;
exports.parseProtostone = parseProtostone;
exports.concatField = concatField;
exports.parseProtostonesFromTransaction = parseProtostonesFromTransaction;
exports.parseProtostonesFromTxHex = parseProtostonesFromTxHex;
exports.tryParseProtostonesFromTransaction = tryParseProtostonesFromTransaction;
exports.parseProtostonesFromBlock = parseProtostonesFromBlock;
const bitcoinjs_lib_1 = require("bitcoinjs-lib");
const utils_1 = require("./utils");
const bitcoinjs = __importStar(require("bitcoinjs-lib"));
const bytes = __importStar(require("./bytes"));
function parseTransaction(v) {
    const transaction = bitcoinjs_lib_1.Transaction.fromBuffer(new Uint8Array(Buffer.from((0, utils_1.stripHexPrefix)(v), "hex")), false);
    return transaction;
}
const padLeftEven = (n) => {
    if (n.length % 2 === 0)
        return n;
    return "0" + n;
};
function parseRunestone(v) {
    const tx = parseTransaction(v);
    return parseRunestoneFromTransaction(tx);
}
function parseRunestoneFromOpReturnHex(hex) {
    const script = bitcoinjs.script.decompile(new Uint8Array(Buffer.from(hex, 'hex')));
    const payload = bytes.decipher(Buffer.concat(script.slice(2)));
    const result = parseLeb128Object(payload);
    return result;
}
function parseRunestoneFromTransaction(tx) {
    const script = bitcoinjs.script.decompile(tx.outs.find((v) => (v.value === 0n || v.value === 0)).script);
    if (!(script[0] === 0x6a && script[1] === 0x5d)) {
        throw Error(`transaction ${tx.getId()} does not contain a Runestone`);
    }
    const payload = bytes.decipher(Buffer.concat(script.slice(2)));
    const result = parseLeb128Object(payload);
    return result;
}
function parseLeb128Object(list) {
    return list.reduce((() => {
        let tag = null;
        return (r, v, i) => {
            if (tag !== 0 && (tag === null || i % 2 === 0)) {
                tag = Number(v);
            }
            else {
                if (!r[tag])
                    r[tag] = [];
                r[tag].push(v);
            }
            return r;
        };
    })(), {});
}
function parseProtostones(list) {
    let last = {
        item: null,
        tail: list.slice(),
    };
    const result = [];
    while (last.tail.length) {
        last = parseProtostone(last.tail);
        result.push(last.item);
    }
    return result;
}
function parseProtostone(list) {
    const protocolTag = list[0];
    const length = list[1];
    const item = {
        protocolTag,
        object: parseLeb128Object(list.slice(2, 2 + Number(length))),
    };
    const tail = list.slice(2 + Number(length));
    return {
        item,
        tail,
    };
}
function concatField(v) {
    const values = bytes.decipherPacked(v);
    return values;
}
function parseProtostonesFromTransaction(v) {
    return parseProtostones(concatField(parseRunestoneFromTransaction(v)[0x3fff]));
}
function parseProtostonesFromTxHex(v) {
    return parseProtostonesFromTransaction(parseTransaction(v));
}
function tryParseProtostonesFromTransaction(v) {
    try {
        return parseProtostonesFromTransaction(v);
    }
    catch (e) {
        return null;
    }
}
function parseProtostonesFromBlock(v) {
    const block = bitcoinjs_lib_1.Block.fromHex(v);
    return block.transactions.map((tx) => ({
        txid: tx.getId(),
        protostones: (tryParseProtostonesFromTransaction(tx) || []).map((v, i) => v && ({
            ...v,
            vout: tx.outs.length + 1 + i,
        })).filter(Boolean),
    })).filter((v) => v.protostones.length);
}
//# sourceMappingURL=block.js.map