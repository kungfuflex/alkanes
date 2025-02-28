"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Signer = void 0;
const abstract_signer_1 = require("./abstract-signer");
class Signer extends abstract_signer_1.AbstractSigner {
    static from(signer) {
        return new this(signer, null);
    }
    connect(provider) {
        return new (this.constructor)(this._target, provider);
    }
    constructor(signer, provider) {
        super();
        this._target = signer;
        this._provider = provider;
    }
    get provider() {
        return this._provider;
    }
    async signPsbt(...args) {
        return await this._target.signPsbt(...args);
    }
    async signMessage(...args) {
        return await this._target.signMessage(...args);
    }
}
exports.Signer = Signer;
//# sourceMappingURL=signer.js.map