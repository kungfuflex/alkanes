import { SeekBuffer } from "./seekbuffer.js";

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

/**
 * ## 128-bit unsigned integer
 *
 * - **Value Range:** `0` to `340282366920938463463374607431768211455`
 * - **Size in bytes:** `16`
 * - **Web IDL type:** `bigint`
 * - **Equivalent C type:** `uint128_t`
 */
export type u128 = BigTypedNumber<"u128">;

export function unpack(v: Buffer): bigint[] {
  return Array.from(v)
    .reduce((r: number[][], v: number, i) => {
      if (i % 15 === 0) {
        r.push([]);
      }
      r[r.length - 1].push(v);
      return r;
    }, [])
    .map((v) => BigInt("0x" + Buffer.from(v.reverse()).toString("hex")));
}

function leftPad15(v: string): string {
  if (v.length > 30) throw Error("varint in encoding cannot exceed 15 bytes");
  return "0".repeat(30 - v.length) + v;
}

function leftPadByte(v: string): string {
  if (v.length % 2) {
    return "0" + v;
  }
  return v;
}
export function encodeVarInt(value: bigint): Buffer {
  const v: number[] = [];
  while (value >> 7n > 0n) {
    v.push(Number(value & 0xffn) | 0b1000_0000);
    value = BigInt(value >> 7n);
  }
  v.push(Number(value & 0xffn));

  return Buffer.from(v);
}

export function encipher(values: bigint[]): Buffer {
  return Buffer.concat(values.map((v) => encodeVarInt(v)));
}

export function decipher(values: Buffer): bigint[] {
  let seekBuffer = new SeekBuffer(values);
  let v = null;
  const result: bigint[] = [];
  while ((v = decodeVarInt(seekBuffer)) !== BigInt(-1)) {
    result.push(v);
  }
  return result;
}

export function decodeVarInt(seekBuffer: SeekBuffer): bigint {
  try {
    return tryDecodeVarInt(seekBuffer);
  } catch (e) {
    return BigInt(-1);
  }
}

export function tryDecodeVarInt(seekBuffer: SeekBuffer): bigint {
  let result = BigInt(0);
  for (let i = 0; i <= 18; i++) {
    const byte = seekBuffer.readUInt8();
    if (byte === undefined) {
      throw new Error("Unterminated");
    }

    const value = BigInt(byte) & 0b0111_1111n;

    if (i === 18 && (value & 0b0111_1100n) !== 0n) {
      throw new Error("Overflow");
    }

    result = BigInt(result | (value << BigInt(7 * i)));

    if ((byte & 0b1000_0000) === 0) {
      return result;
    }
  }

  throw new Error("Overlong");
}

export function pack(v: bigint[]): Buffer {
  return Buffer.concat(
    v.map((segment) => {
      return Buffer.from(
        leftPad15(
          Buffer.from(
            Array.from(
              Buffer.from(leftPadByte(segment.toString(16)), "hex"),
            ).reverse(),
          ).toString("hex"),
        ),
        "hex",
      );
    }),
  );
}
