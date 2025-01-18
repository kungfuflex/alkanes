export declare function encodeRocksDBRequest(params: {
    prefix?: string;
    limit?: number;
}): string;
export declare function decodeRocksDBResponse(hexString: string): {
    keys: string[];
    values: string[];
};
