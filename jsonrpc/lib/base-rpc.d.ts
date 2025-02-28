import { OutPoint, RuneOutput } from "./outpoint";
export type BlockTag = string;
export declare class BaseRpc {
    baseUrl: string;
    blockTag: BlockTag;
    constructor({ baseUrl, blockTag }: any);
    _call({ method, input }: {
        method: any;
        input: any;
    }, blockTag?: BlockTag): Promise<string>;
    runesbyaddress({ address: string }: any, blockTag?: BlockTag): Promise<{
        outpoints: OutPoint[];
        balanceSheet: RuneOutput[];
    }>;
    runesbyheight({ height }: {
        height: number;
    }, blockTag?: BlockTag): Promise<{
        runes: Array<{
            runeId: string;
            name: string;
            divisibility: number;
            spacers: number;
            symbol: string;
        }>;
    }>;
}
