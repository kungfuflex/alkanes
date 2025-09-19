import { SeekBuffer } from "./seekbuffer.js";
import * as alkanes_protobuf from "./proto/alkanes";
export declare function toProtobufAlkaneTransfer(v: AlkaneTransfer): alkanes_protobuf.AlkaneTransfer;
/**
 * A little utility type used for nominal typing.
 *
 * See {@link https://michalzalecki.com/nominal-typing-in-typescript/}
 */
type BigTypedNumber<T> = bigint & {
    /**
     * # !!! DO NOT USE THIS PROPERTY IN YOUR CODE !!!
     * ## This is just used to make each `BigTypedNumber` alias unique for Typescript and doesn't actually exist.
     * @ignore
     * @private
     * @readonly
     * @type {undefined}
     */
    readonly __kind__: T;
};
export type AlkaneId = {
    block: bigint;
    tx: bigint;
};
export type AlkaneTransfer = {
    id: AlkaneId;
    value: bigint;
};
/**
 * ## 128-bit unsigned integer
 *
 * - **Value Range:** `0` to `340282366920938463463374607431768211455`
 * - **Size in bytes:** `16`
 * - **Web IDL type:** `bigint`
 * - **Equivalent C type:** `uint128_t`
 */
export type u128 = BigTypedNumber<"u128">;
export declare function unpack(v: Buffer): bigint[];
export declare function leftPad15(v: string): string;
export declare function leftPadByte(v: string): string;
export declare function rightPadByte(v: string): string;
export declare function leftPad16(v: string): string;
export declare function leftPad8(v: string): string;
export declare function toUint128(v: bigint): any;
export declare function fromUint128(v: {
    hi: any;
    lo: any;
}): bigint;
export declare function toHexString(v: any): string;
export declare function u128ToBuffer(v: {
    hi: any;
    lo: any;
}): bigint;
export declare function encodeVarInt(value: bigint): Buffer;
export declare function encipher(values: bigint[]): Buffer;
export declare const toBuffer: (v: number | bigint) => Buffer;
export declare const fromBuffer: (v: Buffer) => bigint;
export declare function decipher(values: Buffer): bigint[];
export declare function decodeVarInt(seekBuffer: SeekBuffer): bigint;
export declare function tryDecodeVarInt(seekBuffer: SeekBuffer): bigint;
export declare function pack(v: bigint[]): Buffer;
export declare function decipherPacked(v: bigint[]): bigint[];
export {};
