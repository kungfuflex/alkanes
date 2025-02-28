import { u128 } from "@magiceden-oss/runestone-lib/dist/src/integer";
import leb128 from "leb128";
import { CalldataWrapper } from "./calldata";

export function lebEncodeU128(inputs: u128[]): Buffer {
  const lebEncoded = inputs.map((v) => {
    return leb128.unsigned.encode(v as any);
  });
  return Buffer.concat(lebEncoded);
}

export type AlkaneTransfer = {
  id: AlkaneId;
  value: bigint;
};

export class AlkaneId {
  public block: u128;
  public tx: u128;

  constructor(block: u128, tx: u128) {
    this.block = block;
    this.tx = tx;
  }

  /**
   * serialize into an leb encoded. The first index is the block and the second is the tx
   */
  serialize(): Buffer {
    return lebEncodeU128([this.block, this.tx]);
  }

  /**
   * serialize into an u128 array. The first index is the block and the second is the tx
   */
  //   serializeToCalldata(): u128[] {
  //     return [this.block, this.tx];
  //   }
}

export class Cellpack extends CalldataWrapper {
  public target: AlkaneId;
  public inputs: Array<u128>;

  constructor(block: u128, tx: u128, inputs: Array<u128>) {
    super();
    this.target = new AlkaneId(block, tx);
    this.inputs = inputs;
  }

  /**
   *
   * @returns Buffer of LEB encoded of the calldata
   */
  serialize(): Buffer {
    const buffers = [];
    buffers.push(this.target.serialize());
    buffers.push(lebEncodeU128(this.inputs));
    return Buffer.concat(buffers);
  }

  /**
   *
   * @returns u128[] of the calldata
   */
  //   serializeToCalldata(): u128[] {
  //     return [...this.target.serializeToCalldata(), ...this.inputs];
  //   }
}
