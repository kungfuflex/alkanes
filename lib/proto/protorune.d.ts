import { BinaryReader, BinaryWriter } from "@bufbuild/protobuf/wire";
export declare const protobufPackage = "protorune";
export interface RuneId {
    height: number;
    txindex: number;
}
export interface TransactionRecord {
    height: bigint;
    transaction: Uint8Array;
}
export interface ProtoruneRuneId {
    height: uint128 | undefined;
    txindex: uint128 | undefined;
}
export interface Rune {
    runeId: ProtoruneRuneId | undefined;
    name: string;
    divisibility: number;
    spacers: number;
    symbol: string;
    runesSymbol: number;
}
export interface BalanceSheetItem {
    rune: Rune | undefined;
    balance: uint128 | undefined;
}
export interface BalanceSheet {
    entries: BalanceSheetItem[];
}
export interface Outpoint {
    txid: Uint8Array;
    vout: number;
}
export interface OutpointWithProtocol {
    txid: Uint8Array;
    vout: number;
    protocol: uint128 | undefined;
}
export interface Output {
    script: Uint8Array;
    value: bigint;
}
export interface OutpointResponse {
    balances: BalanceSheet | undefined;
    outpoint: Outpoint | undefined;
    output: Output | undefined;
    height: number;
    txindex: number;
}
export interface PaginationInput {
    start: number;
    end: number;
}
export interface WalletRequest {
    wallet: Uint8Array;
}
export interface WalletResponse {
    outpoints: OutpointResponse[];
    balances: BalanceSheet | undefined;
}
export interface ProtorunesWalletRequest {
    wallet: Uint8Array;
    protocolTag: uint128 | undefined;
}
export interface RunesByHeightRequest {
    height: bigint;
}
export interface RunesResponse {
    runes: Rune[];
}
export interface ProtoBurn {
    protocolTag: uint128 | undefined;
    pointer: number;
}
export interface uint128 {
    lo: bigint;
    hi: bigint;
}
export interface Clause {
    rune: ProtoruneRuneId | undefined;
    amount: uint128 | undefined;
}
export interface Predicate {
    clauses: Clause[];
}
export interface ProtoMessage {
    calldata: Uint8Array;
    predicate: Predicate | undefined;
    pointer: number;
    refundPointer: number;
}
export interface RuntimeInput {
    protocolTag: uint128 | undefined;
}
export interface Runtime {
    balances: BalanceSheet | undefined;
}
export interface ProtorunesByHeightRequest {
    height: bigint;
    protocolTag: uint128 | undefined;
}
export declare const RuneId: MessageFns<RuneId>;
export declare const TransactionRecord: MessageFns<TransactionRecord>;
export declare const ProtoruneRuneId: MessageFns<ProtoruneRuneId>;
export declare const Rune: MessageFns<Rune>;
export declare const BalanceSheetItem: MessageFns<BalanceSheetItem>;
export declare const BalanceSheet: MessageFns<BalanceSheet>;
export declare const Outpoint: MessageFns<Outpoint>;
export declare const OutpointWithProtocol: MessageFns<OutpointWithProtocol>;
export declare const Output: MessageFns<Output>;
export declare const OutpointResponse: MessageFns<OutpointResponse>;
export declare const PaginationInput: MessageFns<PaginationInput>;
export declare const WalletRequest: MessageFns<WalletRequest>;
export declare const WalletResponse: MessageFns<WalletResponse>;
export declare const ProtorunesWalletRequest: MessageFns<ProtorunesWalletRequest>;
export declare const RunesByHeightRequest: MessageFns<RunesByHeightRequest>;
export declare const RunesResponse: MessageFns<RunesResponse>;
export declare const ProtoBurn: MessageFns<ProtoBurn>;
export declare const uint128: MessageFns<uint128>;
export declare const Clause: MessageFns<Clause>;
export declare const Predicate: MessageFns<Predicate>;
export declare const ProtoMessage: MessageFns<ProtoMessage>;
export declare const RuntimeInput: MessageFns<RuntimeInput>;
export declare const Runtime: MessageFns<Runtime>;
export declare const ProtorunesByHeightRequest: MessageFns<ProtorunesByHeightRequest>;
type Builtin = Date | Function | Uint8Array | string | number | boolean | bigint | undefined;
export type DeepPartial<T> = T extends Builtin ? T : T extends globalThis.Array<infer U> ? globalThis.Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>> : T extends {} ? {
    [K in keyof T]?: DeepPartial<T[K]>;
} : Partial<T>;
type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P : P & {
    [K in keyof P]: Exact<P[K], I[K]>;
} & {
    [K in Exclude<keyof I, KeysOfUnion<P>>]: never;
};
export interface MessageFns<T> {
    encode(message: T, writer?: BinaryWriter): BinaryWriter;
    decode(input: BinaryReader | Uint8Array, length?: number): T;
    fromJSON(object: any): T;
    toJSON(message: T): unknown;
    create<I extends Exact<DeepPartial<T>, I>>(base?: I): T;
    fromPartial<I extends Exact<DeepPartial<T>, I>>(object: I): T;
}
export {};
