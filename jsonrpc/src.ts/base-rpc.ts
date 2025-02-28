'use strict';

import * as wallet from "./wallet";
import url from "url";
import { decodeRunesResponse, encodeBlockHeightInput, OutPoint, RuneOutput } from "./outpoint";

const addHexPrefix = (s) => s.substr(0, 2) === '0x' ? s : '0x' + s;

let id = 0;

export type BlockTag = string

export class BaseRpc {
  public baseUrl: string;
  public blockTag: BlockTag;
  constructor({
    baseUrl,
    blockTag
  }: any) {
    this.baseUrl = baseUrl || 'http://localhost:8080';
    this.blockTag = blockTag || 'latest';
  }
  async _call({
    method,
    input
  }, blockTag: BlockTag = "latest"): Promise<string> {
    const response = (await (await fetch(url.format({
      ...url.parse(this.baseUrl),
      pathname: '/'
    }), {
      method: 'POST',
      body: JSON.stringify({
        id: id++,
	jsonrpc: '2.0',
	method: 'metashrew_view',
	params: [ method, input, blockTag || this.blockTag ]
      }),
      headers: {
        'Content-Type': 'application/json',
	'Accept': 'application/json'
      }
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

  async runesbyheight ({height}: {height: number}, blockTag: BlockTag = "latest") {
    const payload = encodeBlockHeightInput(height);
    const response = await this._call({
      method: 'runesbyheight',
      input: payload
    }, blockTag);
    const decodedResponse = decodeRunesResponse( response);
    return decodedResponse;
  };
}
