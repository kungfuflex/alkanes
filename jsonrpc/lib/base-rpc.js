'use strict';
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.BaseRpc = void 0;
const wallet = __importStar(require("./wallet"));
const url_1 = __importDefault(require("url"));
const outpoint_1 = require("./outpoint");
const addHexPrefix = (s) => s.substr(0, 2) === '0x' ? s : '0x' + s;
let id = 0;
class BaseRpc {
    constructor({ baseUrl, blockTag }) {
        this.baseUrl = baseUrl || 'http://localhost:8080';
        this.blockTag = blockTag || 'latest';
    }
    async _call({ method, input }, blockTag = "latest") {
        const response = (await (await fetch(url_1.default.format({
            ...url_1.default.parse(this.baseUrl),
            pathname: '/'
        }), {
            method: 'POST',
            body: JSON.stringify({
                id: id++,
                jsonrpc: '2.0',
                method: 'metashrew_view',
                params: [method, input, blockTag || this.blockTag]
            }),
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json'
            }
        })).json());
        return addHexPrefix(response.result);
    }
    async runesbyaddress({ address: string }, blockTag = "latest") {
        const buffer = wallet.encodeWalletInput(string);
        const byteString = await this._call({
            method: 'runesbyaddress',
            input: buffer
        }, blockTag);
        const decoded = wallet.decodeWalletOutput(byteString);
        return decoded;
    }
    async runesbyheight({ height }, blockTag = "latest") {
        const payload = (0, outpoint_1.encodeBlockHeightInput)(height);
        const response = await this._call({
            method: 'runesbyheight',
            input: payload
        }, blockTag);
        const decodedResponse = (0, outpoint_1.decodeRunesResponse)(response);
        return decodedResponse;
    }
    ;
}
exports.BaseRpc = BaseRpc;
//# sourceMappingURL=base-rpc.js.map