export type Rune = {
    id: string;
    name: string;
    spacedName: string;
    divisibility: number;
    spacers: number;
    symbol: string;
};
export type RuneOutput = {
    rune: Rune;
    balance: BigInt;
};
export type OutPoint = {
    runes: RuneOutput[];
    outpoint: {
        txid: string;
        vout: number;
    };
    output: {
        value: any;
        script: string;
    };
    height: number;
    txindex: number;
};
export declare function encodeOutpointInput(txid: string, pos: number): string;
export declare function decodeRunes(balances: any): RuneOutput[];
export declare function decodeOutpointViewBase(op: any): OutPoint;
export declare function decodeOutpointView(hex: string): OutPoint;
export declare function decodeRunesResponse(hex: string): {
    runes: Array<{
        runeId: string;
        name: string;
        divisibility: number;
        spacers: number;
        symbol: string;
    }>;
};
export declare function encodeBlockHeightInput(height: number): string;
export declare function encodeProtorunesByHeightInput(height: number, protocolTag: bigint): string;
