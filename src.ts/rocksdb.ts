import { RocksDBRequest, RocksDBResponse } from "./proto/rocksdb";

export function encodeRocksDBRequest(params: {
  prefix?: string;
  limit?: number;
}): string {
  const request = RocksDBRequest.create({
    prefix: params.prefix || "",
    limit: params.limit || 100
  });
  
  return "0x" + Buffer.from(RocksDBRequest.toBinary(request)).toString("hex");
}

export function decodeRocksDBResponse(hexString: string): {
  keys: string[];
  values: string[];
} {
  const buffer = Buffer.from(hexString.slice(2), "hex");
  const response = RocksDBResponse.fromBinary(buffer);
  
  return {
    keys: response.keys,
    values: response.values
  };
} 