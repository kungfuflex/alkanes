"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CalldataWrapper = exports.CALLDATA_MAGIC = void 0;
exports.CALLDATA_MAGIC = 1;
class CalldataWrapper {
    serialize() {
        throw new Error("Method not implemented");
    }
    serializeToCalldata() {
        // Calldata must have magic number 1 at the start and magic number 1 at the end
        const buffers = [];
        const magic = Buffer.alloc(1);
        magic[0] = exports.CALLDATA_MAGIC;
        buffers.push(magic);
        buffers.push(this.serialize());
        buffers.push(magic);
        return Buffer.concat(buffers);
    }
}
exports.CalldataWrapper = CalldataWrapper;
//# sourceMappingURL=calldata.js.map