import { SandshrewProvider } from "./sandshrew-provider";

export class DogeshrewProvider extends SandshrewProvider {
  async enrichOutput({
    vout,
    txid
  }: {
    vout: number,
    txid: string
  }): Promise<any> {
    throw Error('unsupported method');
  }
  async getBTCOnlyUTXOs(address: string): Promise<GetUTXOsResponse> {
    const utxos = await this.getUTXOs(address);
    return utxos.filter((v) => v.runes.length === 0 && v.output.value > 546);
  }
  async getUTXOs(address: string): Promise<GetUTXOsResponse> {
    return (await this.call('alkanes_protorunesbyaddress', [{ address, protocolTag: '1' }])).outpoints;
  }
}
