import { AbstractProvider } from "./abstract-provider";
import { zipObject } from "lodash";

let id = 0;

export type OutPointResponseOutPoint = {
  txid: string;
  vout: number;
};

export type OutPointResponseOutput = {
  script: string;
  value: number;
};

export type RuneResponse = {
  name: string;
  symbol: string;
  balance: bigint | number;
};

export type OutPointResponse = {
  runes: RuneResponse[];
  outpoint: OutPointResponseOutPoint;
  output: OutPointResponseOutput;
  height: number;
  txindex: number;
};

export type BalanceSheetItem = {
  rune: RuneResponse;
  balance: bigint | number;
};

export type GetUTXOsResponse = OutPointResponse[];

export class SandshrewProvider extends AbstractProvider {
  public url: string;
  constructor(url: string) {
    super();
    this.url = url;
  }
  async call(method: string, params: any[]): Promise<any> {
    const responseText = await (await fetch(this.url, {
      method: 'POST',
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: id++,
        params,
        method
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })).text();
    return JSON.parse(responseText).result;
  }
  async enrichOutput({
    vout,
    txid
  }: {
    vout: number,
    txid: string
  }): Promise<any> {
    return await this.call('ord_output', [`${txid}:${vout}`]);
  }
  async getBTCOnlyUTXOs(address: string): Promise<GetUTXOsResponse> {
    const utxos = await this.getUTXOs(address);
    const { inscriptions } = await this.call('ord_address', [ address ]);
    const map = zipObject(inscriptions, inscriptions);
    return utxos.filter((v) => !map[`${v.outpoint.txid}:${v.outpoint.vout}`] && v.runes.length === 0);
  }
  async getUTXOs(address: string): Promise<GetUTXOsResponse> {
    return (await this.call('alkanes_protorunesbyaddress', [{ address, protocolTag: '1' }])).outpoints;
  }
}
