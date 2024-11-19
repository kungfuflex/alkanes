import { OutPoint, RuneOutput } from "metashrew-runes/lib/src.ts/outpoint";
import { MetashrewRunes } from "metashrew-runes/lib/src.ts/rpc";
export declare class AlkanesRpc extends MetashrewRunes {
    protorunesbyaddress({ address, protocolTag }: any): Promise<{
        outpoints: OutPoint[];
        balanceSheet: RuneOutput[];
    }>;
    runesbyaddress({ address }: any): Promise<{
        outpoints: OutPoint[];
        balanceSheet: RuneOutput[];
    }>;
    runesbyheight({ height }: {
        height: number;
    }): Promise<{
        runes: Array<{
            runeId: string;
            name: string;
            divisibility: number;
            spacers: number;
            symbol: string;
        }>;
    }>;
    protorunesbyoutpoint({ txid, vout, protocolTag }: any): Promise<any>;
    simulate({ alkanes, transaction, height, block, inputs, tx, txindex, vout, pointer, refundPointer, }: any): Promise<any>;
    runtime({ protocolTag }: any): Promise<{
        balances: RuneOutput[];
    }>;
    pack({ runes, cellpack, pointer, refundPointer, edicts, }: {
        runes: Rune[];
        cellpack: Buffer;
        pointer: number;
        refundPointer: number;
        edicts: Edict[];
    }): Promise<any>;
}
