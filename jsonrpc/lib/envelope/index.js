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
exports.__test__ = exports.OutOrdinalReveal = exports.InscriptionId = void 0;
exports.parseInscriptions = parseInscriptions;
exports.parseWitness = parseWitness;
exports.p2tr_ord_reveal = p2tr_ord_reveal;
const base_1 = require("@scure/base");
const P = __importStar(require("micro-packed"));
const btc_signer_1 = require("@scure/btc-signer");
const cbor_js_1 = require("./cbor.js");
const PROTOCOL_ID = /* @__PURE__ */ base_1.utf8.decode("BIN");
function splitChunks(buf) {
    const res = [];
    for (let i = 0; i < buf.length; i += btc_signer_1.MAX_SCRIPT_BYTE_LENGTH)
        res.push(buf.subarray(i, i + btc_signer_1.MAX_SCRIPT_BYTE_LENGTH));
    return res;
}
const RawInscriptionId = /* @__PURE__ */ P.tuple([
    P.bytes(32, true),
    P.apply(P.bigint(4, true, false, false), P.coders.numberBigint),
]);
exports.InscriptionId = {
    encode(data) {
        const [txId, index] = data.split("i", 2);
        if (`${+index}` !== index)
            throw new Error(`InscriptionId wrong index: ${index}`);
        return RawInscriptionId.encode([base_1.hex.decode(txId), +index]);
    },
    decode(data) {
        const [txId, index] = RawInscriptionId.decode(data);
        return `${base_1.hex.encode(txId)}i${index}`;
    },
};
const TagEnum = {
    // Would be simpler to have body tag here,
    // but body chunks don't have body tag near them
    contentType: 1,
    pointer: 2,
    parent: 3,
    metadata: 5,
    metaprotocol: 7,
    contentEncoding: 9,
    delegate: 11,
    rune: 13,
    note: 15,
    // Unrecognized even tag makes inscription unbound
    // unbound: 66,
    // Odd fields are ignored
    // nop: 255,
};
const TagCoderInternal = /* @__PURE__ */ P.map(P.U8, TagEnum);
const TagCoders = /* @__PURE__ */ {
    pointer: P.bigint(8, true, false, false), // U64
    contentType: P.string(null),
    parent: exports.InscriptionId,
    metadata: cbor_js_1.CBOR,
    metaprotocol: P.string(null),
    contentEncoding: P.string(null),
    delegate: exports.InscriptionId,
    rune: P.bigint(16, true, false, false), // U128
    note: P.string(null),
    // unbound: P.bytes(null),
    // nop: P.bytes(null),
};
// We can't use mappedTag here, because tags can be split in chunks
const TagCoder = {
    encode(from) {
        const tmp = {};
        const unknown = [];
        // collect tag parts
        for (const { tag, data } of from) {
            try {
                const tagName = TagCoderInternal.decode(tag);
                if (!tmp[tagName])
                    tmp[tagName] = [];
                tmp[tagName].push(data);
            }
            catch (e) {
                unknown.push([tag, data]);
            }
        }
        const res = {};
        if (unknown.length)
            res.unknown = unknown;
        for (const field in tmp) {
            if (field === "parent" && tmp[field].length > 1) {
                res[field] = tmp[field].map((i) => TagCoders.parent.decode(i));
                continue;
            }
            res[field] = TagCoders[field].decode(btc_signer_1.utils.concatBytes(...tmp[field]));
        }
        return res;
    },
    decode(to) {
        const res = [];
        for (const field in to) {
            if (field === "unknown")
                continue;
            const tagName = TagCoderInternal.encode(field);
            if (field === "parent" && Array.isArray(to.parent)) {
                for (const p of to.parent)
                    res.push({ tag: tagName, data: TagCoders.parent.encode(p) });
                continue;
            }
            const bytes = TagCoders[field].encode(to[field]);
            for (const data of splitChunks(bytes))
                res.push({ tag: tagName, data });
        }
        if (to.unknown) {
            if (!Array.isArray(to.unknown))
                throw new Error("ordinals/TagCoder: unknown should be array");
            for (const [tag, data] of to.unknown)
                res.push({ tag, data });
        }
        return res;
    },
};
const parseEnvelopes = (script, pos = 0) => {
    if (!Number.isSafeInteger(pos))
        throw new Error(`parseInscription: wrong pos=${typeof pos}`);
    const envelopes = [];
    // Inscriptions with broken parsing are called 'cursed' (stutter or pushnum)
    let stutter = false;
    main: for (; pos < script.length; pos++) {
        const instr = script[pos];
        if (instr !== 0)
            continue;
        if (script[pos + 1] !== "IF") {
            if (script[pos + 1] === 0)
                stutter = true;
            continue main;
        }
        if (!btc_signer_1.utils.isBytes(script[pos + 2]) ||
            !P.utils.equalBytes(script[pos + 2], PROTOCOL_ID)) {
            if (script[pos + 2] === 0)
                stutter = true;
            continue main;
        }
        let pushnum = false;
        const payload = []; // bytes or 0
        for (let j = pos + 3; j < script.length; j++) {
            const op = script[j];
            // done
            if (op === "ENDIF") {
                envelopes.push({ start: pos + 3, end: j, pushnum, payload, stutter });
                pos = j;
                break;
            }
            if (op === "1NEGATE") {
                pushnum = true;
                payload.push(new Uint8Array([0x81]));
                continue;
            }
            if (typeof op === "number" && 1 <= op && op <= 16) {
                pushnum = true;
                payload.push(new Uint8Array([op]));
                continue;
            }
            if (btc_signer_1.utils.isBytes(op) || op === 0) {
                payload.push(op);
                continue;
            }
            stutter = false;
            break;
        }
    }
    return envelopes;
};
// Additional API for parsing inscriptions
function parseInscriptions(script, strict = false) {
    if (strict && (!btc_signer_1.utils.isBytes(script[0]) || script[0].length !== 32))
        return;
    if (strict && script[1] !== "CHECKSIG")
        return;
    const envelopes = parseEnvelopes(script);
    const inscriptions = [];
    // Check that all inscriptions are sequential inside script
    let pos = 5;
    for (const envelope of envelopes) {
        if (strict && (envelope.stutter || envelope.pushnum))
            return;
        if (strict && envelope.start !== pos)
            return;
        const { payload } = envelope;
        let i = 0;
        const tags = [];
        for (; i < payload.length && payload[i] !== 0; i += 2) {
            const tag = payload[i];
            const data = payload[i + 1];
            if (!btc_signer_1.utils.isBytes(tag))
                throw new Error("parseInscription: non-bytes tag");
            if (!btc_signer_1.utils.isBytes(data))
                throw new Error("parseInscription: non-bytes tag data");
            tags.push({ tag, data });
        }
        while (payload[i] === 0 && i < payload.length)
            i++;
        const chunks = [];
        for (; i < payload.length; i++) {
            if (!btc_signer_1.utils.isBytes(payload[i]))
                break;
            chunks.push(payload[i]);
        }
        inscriptions.push({
            tags: TagCoder.encode(tags),
            body: btc_signer_1.utils.concatBytes(...chunks),
            cursed: envelope.pushnum || envelope.stutter,
        });
        pos = envelope.end + 4;
    }
    if (pos - 3 !== script.length)
        return;
    return inscriptions;
}
/**
 * Parse inscriptions from reveal tx input witness (tx.inputs[0].finalScriptWitness)
 */
function parseWitness(witness) {
    if (witness.length !== 3)
        throw new Error("Wrong witness");
    // We don't validate other parts of witness here since we want to parse
    // as much stuff as possible. When creating inscription, it is done more strictly
    return parseInscriptions(btc_signer_1.Script.decode(witness[1]));
}
exports.OutOrdinalReveal = {
    encode(from) {
        const res = { type: "tr_ord_reveal" };
        try {
            res.inscriptions = parseInscriptions(from, true);
            res.pubkey = from[0];
        }
        catch (e) {
            return;
        }
        return res;
    },
    decode: (to) => {
        if (to.type !== "tr_ord_reveal")
            return;
        const out = [to.pubkey, "CHECKSIG"];
        for (const { tags, body } of to.inscriptions) {
            out.push(0, "IF", PROTOCOL_ID);
            const rawTags = TagCoder.decode(tags);
            for (const tag of rawTags)
                out.push(tag.tag, tag.data);
            // Body
            out.push(0);
            for (const c of splitChunks(body))
                out.push(c);
            out.push("ENDIF");
        }
        return out;
    },
    finalizeTaproot: (script, parsed, signatures) => {
        if (signatures.length !== 1)
            throw new Error("tr_ord_reveal/finalize: wrong signatures array");
        const [{ pubKey }, sig] = signatures[0];
        if (!P.utils.equalBytes(pubKey, parsed.pubkey))
            return;
        return [sig, script];
    },
};
/**
 * Create reveal transaction. Inscription created on spending output from this address by
 * revealing taproot script.
 */
function p2tr_ord_reveal(pubkey, inscriptions) {
    return {
        type: "tr_ord_reveal",
        script: P.apply(btc_signer_1.Script, P.coders.match([exports.OutOrdinalReveal])).encode({
            type: "tr_ord_reveal",
            pubkey,
            inscriptions,
        }),
    };
}
// Internal methods for tests
exports.__test__ = { TagCoders, TagCoder, parseEnvelopes };
//# sourceMappingURL=index.js.map