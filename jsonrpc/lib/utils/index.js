"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHexPrefix = exports.stripHexPrefix = void 0;
const stripHexPrefix = (s) => s.slice(0, 2) == "0x" ? s.slice(2) : s;
exports.stripHexPrefix = stripHexPrefix;
const addHexPrefix = (s) => '0x' + (0, exports.stripHexPrefix)(s);
exports.addHexPrefix = addHexPrefix;
//# sourceMappingURL=index.js.map