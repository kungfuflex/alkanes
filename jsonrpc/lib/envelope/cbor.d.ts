import * as P from "micro-packed";
type Bytes = Uint8Array;
export type CborValue = {
    TAG: "uint";
    data: number | bigint;
} | {
    TAG: "negint";
    data: number | bigint;
} | {
    TAG: "simple";
    data: boolean | null | undefined | number;
} | {
    TAG: "string";
    data: string;
} | {
    TAG: "bytes";
    data: Bytes;
} | {
    TAG: "array";
    data: CborValue[];
} | {
    TAG: "map";
    data: [CborValue][];
} | {
    TAG: "tag";
    data: [CborValue, CborValue];
};
export declare const CBOR: P.CoderType<any>;
export {};
