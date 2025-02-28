import { Option } from "@magiceden-oss/runestone-lib/dist/src/monads";
import { u32, u128 } from "@magiceden-oss/runestone-lib/dist/src/integer";
import { ProtoruneRuneId } from "./protoruneruneid";
export type ProtoruneEdict = {
    id: ProtoruneRuneId;
    amount: u128;
    output: u32;
};
export declare namespace ProtoruneEdict {
    function fromIntegers(numOutputs: number, id: ProtoruneRuneId, amount: u128, output: u128): Option<ProtoruneEdict>;
}
