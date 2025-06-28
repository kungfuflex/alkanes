export declare function reverseTxid(txid: string): string;
export declare function isTxidField(fieldName: string): boolean;
export declare function executeInternalRPC(method: string, params: any[]): Promise<any>;
export type OrdBlockHeight = number;
export type MetashewHeight = string;
export interface OrdRune {
    amount: number;
    divisibility: number;
    symbol: string;
}
export interface OrdOutput {
    address: string;
    confirmations: number;
    indexed: boolean;
    inscriptions: string[];
    outpoint: string;
    runes: Record<string, OrdRune>;
    sat_ranges: number[][];
    script_pubkey: string;
    spent: boolean;
    transaction: string;
    value: number;
}
export interface UTXO {
    outpoint: string;
    value: number;
    height?: number;
    runes?: any[];
    inscriptions?: string[];
    ord_runes?: Record<string, OrdRune>;
}
export interface RuneOutpoint {
    outpoint: {
        txid: string;
        vout: number;
    };
    runes: any[];
}
export interface ProtorunesResponse {
    outpoints?: RuneOutpoint[];
}
export interface AddressInfo {
    spendable: UTXO[];
    assets: UTXO[];
    pending: UTXO[];
    ordHeight: number;
    metashrewHeight: number;
}
export interface BalanceRequest {
    address: string;
    protocolTag?: string;
    assetAddress?: string;
}
/**
 * Get comprehensive address information including UTXOs, block count, protorunes, and ord outputs
 * Uses internal RPC calls for efficient data fetching
 * If assetAddress is provided, fetches data for both addresses and combines the results
 */
export declare function getAddressInfo(request: BalanceRequest): Promise<AddressInfo>;
