"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Cellpack = exports.AlkaneId = void 0;
exports.lebEncodeU128 = lebEncodeU128;
const leb128_1 = __importDefault(require("leb128"));
const calldata_1 = require("./calldata");
function lebEncodeU128(inputs) {
    const lebEncoded = inputs.map((v) => {
        return leb128_1.default.unsigned.encode(v);
    });
    return Buffer.concat(lebEncoded);
}
class AlkaneId {
    constructor(block, tx) {
        this.block = block;
        this.tx = tx;
    }
    /**
     * serialize into an leb encoded. The first index is the block and the second is the tx
     */
    serialize() {
        return lebEncodeU128([this.block, this.tx]);
    }
}
exports.AlkaneId = AlkaneId;
class Cellpack extends calldata_1.CalldataWrapper {
    constructor(block, tx, inputs) {
        super();
        this.target = new AlkaneId(block, tx);
        this.inputs = inputs;
    }
    /**
     *
     * @returns Buffer of LEB encoded of the calldata
     */
    serialize() {
        const buffers = [];
        buffers.push(this.target.serialize());
        buffers.push(lebEncodeU128(this.inputs));
        return Buffer.concat(buffers);
    }
}
exports.Cellpack = Cellpack;
//# sourceMappingURL=alkane.js.map