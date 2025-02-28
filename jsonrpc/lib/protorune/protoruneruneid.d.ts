import { Option } from "@magiceden-oss/runestone-lib/dist/src/monads";
import { u128 } from "@magiceden-oss/runestone-lib/dist/src/integer";
export declare class ProtoruneRuneId {
    readonly block: u128;
    readonly tx: u128;
    constructor(block: u128, tx: u128);
    static new(block: u128, tx: u128): Option<ProtoruneRuneId>;
    static sort(runeIds: ProtoruneRuneId[]): ProtoruneRuneId[];
    delta(next: ProtoruneRuneId): Option<[u128, u128]>;
    next(block: u128, tx: u128): Option<ProtoruneRuneId>;
    toString(): string;
    static fromString(s: string): ProtoruneRuneId;
}
