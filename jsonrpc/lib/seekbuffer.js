"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SeekBuffer = void 0;
class SeekBuffer {
    constructor(buffer) {
        this.buffer = buffer;
        this.seekIndex = 0;
    }
    readUInt8() {
        if (this.isFinished()) {
            return undefined;
        }
        return this.buffer.readUInt8(this.seekIndex++);
    }
    isFinished() {
        return this.seekIndex >= this.buffer.length;
    }
}
exports.SeekBuffer = SeekBuffer;
//# sourceMappingURL=seekbuffer.js.map