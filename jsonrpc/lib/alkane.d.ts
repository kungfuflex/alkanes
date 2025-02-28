import { u128 } from "@magiceden-oss/runestone-lib/dist/src/integer";
import { CalldataWrapper } from "./calldata";
export declare function lebEncodeU128(inputs: u128[]): Buffer;
export type AlkaneTransfer = {
    id: AlkaneId;
    value: bigint;
};
export declare class AlkaneId {
    block: u128;
    tx: u128;
    constructor(block: u128, tx: u128);
    /**
     * serialize into an leb encoded. The first index is the block and the second is the tx
     */
    serialize(): Buffer;
}
export declare class Cellpack extends CalldataWrapper {
    target: AlkaneId;
    inputs: Array<u128>;
    constructor(block: u128, tx: u128, inputs: Array<u128>);
    /**
     *
     * @returns Buffer of LEB encoded of the calldata
     */
    serialize(): Buffer;
}
