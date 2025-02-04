import { OutPoint, RuneOutput } from "./outpoint";
import { BaseRpc } from "./base-rpc";
import { AlkaneTransfer } from "./alkane";
import { ProtoruneEdict } from "./protorune/protoruneedict";
import { BlockTag } from "./base-rpc";
export declare class AlkanesRpc extends BaseRpc {
    protorunesbyaddress({ address, protocolTag }: any, blockTag?: BlockTag): Promise<{
        outpoints: OutPoint[];
        balanceSheet: RuneOutput[];
    }>;
    transactionbyid({ txid }: any, blockTag?: BlockTag): Promise<{
        height: number;
        transaction: string;
    }>;
    spendablesbyaddress({ address, protocolTag }: any, blockTag?: BlockTag): Promise<{
        outpoints: OutPoint[];
        balanceSheet: RuneOutput[];
    }>;
    runesbyaddress({ address }: any, blockTag?: BlockTag): Promise<{
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
    protorunesbyheight({ height, protocolTag }: {
        height: number;
        protocolTag: bigint;
    }, blockTag?: BlockTag): Promise<{
        runes: Array<{
            runeId: string;
            name: string;
            divisibility: number;
            spacers: number;
            symbol: string;
        }>;
    }>;
    protorunesbyoutpoint({ txid, vout, protocolTag }: {
        txid: any;
        vout: any;
        protocolTag: any;
    }, blockTag?: BlockTag): Promise<any>;
    runesbyoutpoint({ txid, vout }: {
        txid: any;
        vout: any;
    }, blockTag?: BlockTag): Promise<any>;
    trace({ txid, vout }: {
        txid: string;
        vout: number;
    }, blockTag?: BlockTag): Promise<any>;
    simulate({ alkanes, transaction, height, block, txindex, target, inputs, vout, pointer, refundPointer, }: any, blockTag?: BlockTag): Promise<any>;
    runtime({ protocolTag }: any, blockTag?: BlockTag): Promise<{
        balances: RuneOutput[];
    }>;
    pack({ runes, cellpack, pointer, refundPointer, edicts, }: {
        runes: AlkaneTransfer[];
        cellpack: Buffer;
        pointer: number;
        refundPointer: number;
        edicts: ProtoruneEdict[];
    }): Promise<any>;
}
