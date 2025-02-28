import { FixedArray } from "@magiceden-oss/runestone-lib/dist/src/utils";
import { u128 } from "@magiceden-oss/runestone-lib/dist/src/integer";
import { Option } from "@magiceden-oss/runestone-lib/dist/src/monads";
export declare enum Tag {
    BODY = 0,
    PROTOCOL = 16383,
    MESSAGE = 81,
    BURN = 83,
    SPLIT = 85,
    POINTER = 91,
    REFUND = 93,
    FROM = 95,
    CENOTAPH = 126,
    NOP = 127
}
export declare namespace Tag {
    function take<N extends number, T extends {}>(tag: Tag, fields: Map<u128, u128[]>, n: N, withFn: (values: FixedArray<u128, N>) => Option<T>): Option<T>;
    function encode(tag: Tag, values: u128[]): Buffer;
    function encodeOptionInt(tag: Tag, value: Option<number | bigint>): Buffer;
}
