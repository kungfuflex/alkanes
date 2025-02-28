"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Tag = void 0;
const integer_1 = require("@magiceden-oss/runestone-lib/dist/src/integer");
const monads_1 = require("@magiceden-oss/runestone-lib/dist/src/monads");
var Tag;
(function (Tag) {
    Tag[Tag["BODY"] = 0] = "BODY";
    Tag[Tag["PROTOCOL"] = 16383] = "PROTOCOL";
    // PROTOTAGS
    Tag[Tag["MESSAGE"] = 81] = "MESSAGE";
    Tag[Tag["BURN"] = 83] = "BURN";
    Tag[Tag["SPLIT"] = 85] = "SPLIT";
    Tag[Tag["POINTER"] = 91] = "POINTER";
    Tag[Tag["REFUND"] = 93] = "REFUND";
    Tag[Tag["FROM"] = 95] = "FROM";
    Tag[Tag["CENOTAPH"] = 126] = "CENOTAPH";
    Tag[Tag["NOP"] = 127] = "NOP";
})(Tag || (exports.Tag = Tag = {}));
(function (Tag) {
    function take(tag, fields, n, withFn) {
        const field = fields.get((0, integer_1.u128)(tag));
        if (field === undefined) {
            return monads_1.None;
        }
        const values = [];
        for (const i of [...Array(n).keys()]) {
            if (field[i] === undefined) {
                return monads_1.None;
            }
            values[i] = field[i];
        }
        const optionValue = withFn(values);
        if (optionValue.isNone()) {
            return monads_1.None;
        }
        field.splice(0, n);
        if (field.length === 0) {
            fields.delete((0, integer_1.u128)(tag));
        }
        return (0, monads_1.Some)(optionValue.unwrap());
    }
    Tag.take = take;
    function encode(tag, values) {
        return Buffer.concat(values
            .map((value) => [
            integer_1.u128.encodeVarInt((0, integer_1.u128)(tag)),
            integer_1.u128.encodeVarInt(value),
        ])
            .flat());
    }
    Tag.encode = encode;
    function encodeOptionInt(tag, value) {
        return value
            .map((value) => Tag.encode(tag, [(0, integer_1.u128)(value)]))
            .unwrapOr(Buffer.alloc(0));
    }
    Tag.encodeOptionInt = encodeOptionInt;
})(Tag || (exports.Tag = Tag = {}));
//# sourceMappingURL=tag.js.map