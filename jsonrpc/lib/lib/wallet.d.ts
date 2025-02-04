import { OutPoint, RuneOutput } from "./outpoint";
/**
 * Protocol tag needs to be LEB128 encoded to pass into the protocol
 * @param address
 * @param protocolTag
 * @returns ProtorunesWalletRequest protobuf hex buffer
 */
export declare function encodeProtorunesWalletInput(address: string, protocolTag: bigint): string;
export declare function encodeTransactionId(txid: string): Buffer;
export declare function encodeWalletInput(address: string): string;
export declare function decodeTransactionResult(hex: string): {
    transaction: string;
    height: number;
};
export declare function decodeWalletOutput(hex: string): {
    outpoints: OutPoint[];
    balanceSheet: RuneOutput[];
};
export declare function encodeRuntimeInput(protocolTag: bigint): string;
export declare function decodeRuntimeOutput(hex: string): {
    balances: RuneOutput[];
};
