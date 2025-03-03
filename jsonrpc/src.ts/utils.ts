import { mapValues } from "lodash";
export function bigIntToBase10Recursive(v: any): any {
  if (typeof v === "object") {
    if (Array.isArray(v)) return v.map((item) => bigIntToBase10Recursive(item));
    return mapValues(v, (value) => bigIntToBase10Recursive(value));
  }
  if (typeof v === "bigint") return v.toString(10);
  return v;
}
export const stripHexPrefix = (s: string): string =>
  s.substr(0, 2) === "0x" ? s.substr(2) : s;

export function dumpJSONRPCPayload(payload: any): string {
  if (!payload.method || !payload.params) return "null";
  return payload.method + "/" + payload.params.join("/") + "/";
}

export function mapToPrimitives(v: any): any {
  switch (typeof v) {
    case "bigint":
      return "0x" + v.toString(16);
    case "object":
      if (v === null) return null;
      if (Buffer.isBuffer(v)) return "0x" + v.toString("hex");
      if (Array.isArray(v)) return v.map((v) => mapToPrimitives(v));
      return Object.fromEntries(
        Object.entries(v).map(([key, value]) => [key, mapToPrimitives(value)]),
      );
    default:
      return v;
  }
}

export function unmapFromPrimitives(v: any): any {
  switch (typeof v) {
    case "string":
      if (v !== '0x' && !isNaN(v as any)) return BigInt(v);
      if (v.substr(0, 2) === "0x" || /^[0-9a-f]+$/.test(v)) return Buffer.from(stripHexPrefix(v), "hex");
      return v;
    case "object":
      if (v === null) return null;
      if (Array.isArray(v)) return v.map((item) => unmapFromPrimitives(item));
      return Object.fromEntries(
        Object.entries(v).map(([key, value]) => [
          key,
          unmapFromPrimitives(value),
        ]),
      );
    default:
      return v;
  }
}
