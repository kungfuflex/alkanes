import { SeekBuffer } from "./seekbuffer.js";
import { alkanes as alkanes_protobuf } from "./proto/alkanes.js";

export function toProtobufAlkaneTransfer(
  v: AlkaneTransfer
): alkanes_protobuf.AlkaneTransfer {
  return new alkanes_protobuf.AlkaneTransfer({
    id: new alkanes_protobuf.AlkaneId({
      block: toUint128(v.id.block),
      tx: toUint128(v.id.tx),
    }),
    value: toUint128(v.value),
  });
}

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

export function leftPad15(v: string): string {
  if (v.length > 30) throw Error("varint in encoding cannot exceed 15 bytes");
  return "0".repeat(30 - v.length) + v;
}

export function leftPadByte(v: string): string {
  if (v.length % 2) {
    return "0" + v;
  }
  return v;
}

export function leftPad16(v: string): string {
  if (v.length > 16) throw Error("varint in encoding cannot exceed 15 bytes");
  return "0".repeat(32 - v.length) + v;
}
export function leftPad8(v: string): string {
  //  if (v.length > 16) throw Error("varint in encoding cannot exceed 15 bytes");
  return "0".repeat(16 - v.length) + v;
}

export function toUint128(v: bigint): any {
  let hex = leftPad16(v.toString(16));
  return new alkanes_protobuf.uint128({
    hi: BigInt("0x" + hex.substr(0, 16)).toString(10),
    lo: BigInt("0x" + hex.substr(16, 32)).toString(10),
  });
}

export function fromUint128(v: { hi: any; lo: any }): bigint {
  return u128ToBuffer(v);
}

export function toHexString(v: any): string {
  return BigInt(v).toString(16);
}

export function u128ToBuffer(v: { hi: any; lo: any }): bigint {
  return BigInt(
    "0x" +
      Buffer.from(
        leftPad8(toHexString(v.hi)) + leftPad8(toHexString(v.lo)),
        "hex"
      ).toString("hex")
  );
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

export const toBuffer = (v: number | bigint) => {
  return Buffer.from(
    Array.from(Buffer.from(leftPad16(v.toString(16)), "hex")).reverse()
  );
};

export const fromBuffer = (v: Buffer): bigint => {
  return BigInt("0x" + Buffer.from(Array.from(v).reverse()).toString("hex"));
};

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
              Buffer.from(leftPadByte(segment.toString(16)), "hex")
            ).reverse()
          ).toString("hex")
        ),
        "hex"
      );
    })
  );
}
