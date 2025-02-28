"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtoruneEdict = void 0;
const monads_1 = require("@magiceden-oss/runestone-lib/dist/src/monads");
const integer_1 = require("@magiceden-oss/runestone-lib/dist/src/integer");
var ProtoruneEdict;
(function (ProtoruneEdict) {
    function fromIntegers(numOutputs, id, amount, output) {
        if (id.block === 0n && id.tx > 0n) {
            return monads_1.None;
        }
        const optionOutputU32 = integer_1.u128.tryIntoU32(output);
        if (optionOutputU32.isNone()) {
            return monads_1.None;
        }
        const outputU32 = optionOutputU32.unwrap();
        if (outputU32 > numOutputs) {
            return monads_1.None;
        }
        return (0, monads_1.Some)({ id, amount, output: outputU32 });
    }
    ProtoruneEdict.fromIntegers = fromIntegers;
})(ProtoruneEdict || (exports.ProtoruneEdict = ProtoruneEdict = {}));
//# sourceMappingURL=protoruneedict.js.map