'use strict';

import * as wallet from "./wallet";
import url from "url";
import { decodeRunesResponse, encodeBlockHeightInput, OutPoint, RuneOutput } from "./outpoint";

const addHexPrefix = (s) => {
  if (s === undefined) return s;
  return s.substr(0, 2) === '0x' ? s : '0x' + s;
};

let id = 0;

export type BlockTag = string

export class BaseRpc {
  public baseUrl: string;
  public memshrewUrl: string;
  public blockTag: BlockTag;
  public headers: {
    [key: string]: string
  };
  constructor({
    baseUrl,
    memshrewUrl,
    headers,
    blockTag
  }: any) {
    this.baseUrl = baseUrl || 'http://localhost:8080';
    this.memshrewUrl = memshrewUrl || baseUrl;
    this.blockTag = blockTag || 'latest';
    this.headers = headers || {};
  }
  async _preview({
    method,
    input
  }): Promise<string> {
    const buildResult = await (await fetch(url.format({
      ...url.parse(this.memshrewUrl || this.baseUrl),
      pathname: '/'
    }), {
    })).json();
    if (buildResult.error) {
      const err = new Error(buildResult.error.message);
      (err as any).code = buildResult.error.code;
      throw err;
    }
    if (buildResult.length === 0) {
      throw Error('no mempool block built by memshrew');
    }
    const blockHex = buildResult.result[0];
    const response = (await (await fetch(url.format({
      ...url.parse(this.baseUrl),
      pathname: '/'
    }), {
      method: 'POST',
      body: JSON.stringify({
        id: id++,
        jsonrpc: '2.0',
        method: 'metashrew_preview',
        params: [blockHex, method, input, "latest"]
      }),
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    })).json());
    return addHexPrefix(response.result);
  }
  async _call({
    method,
    input
  }, blockTag: BlockTag = "latest"): Promise<string> {
    if (blockTag === "pending") {
      return await this._preview({ method, input });
    }
    const response = (await (await fetch(this.baseUrl, {
      method: 'POST',
      body: JSON.stringify({
        id: id++,
        jsonrpc: '2.0',
        method: 'metashrew_view',
        params: [method, input, blockTag || this.blockTag]
      }),
      headers: Object.assign({}, {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }, this.headers)
    })).json());
    return addHexPrefix(response.result);
  }

  async runesbyaddress({
    address: string
  }: any, blockTag: BlockTag = "latest"): Promise<{
    outpoints: OutPoint[];
    balanceSheet: RuneOutput[];
  }> {
    const buffer = wallet.encodeWalletInput(string);
    const byteString = await this._call({
      method: 'runesbyaddress',
      input: buffer
    }, blockTag);
    const decoded = wallet.decodeWalletOutput(byteString);
    return decoded;
  }

  async runesbyheight({ height }: { height: number }, blockTag: BlockTag = "latest") {
    const payload = encodeBlockHeightInput(height);
    const response = await this._call({
      method: 'runesbyheight',
      input: payload
    }, blockTag);
    const decodedResponse = decodeRunesResponse(response);
    return decodedResponse;
  };
}
