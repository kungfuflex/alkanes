import { ProtoruneRuneId } from "protorune/assembly/indexer/ProtoruneRuneId";
import { u128 } from "as-bignum/assembly";

export class AlkaneId extends ProtoruneRuneId {
  constructor(hi: u64 = 0, lo: u32 = 0) {
    super(hi, lo);
  }
  static fromId(hi: u128, lo: u128): AlkaneId {
    const result = new AlkaneId();
    result.block = hi;
    result.tx = lo;
    return result;
  }
  static parse(v: ArrayBuffer): AlkaneId {
    const box = Box.from(v);
    const hi = parseU128(box);
    return AlkaneId.from(hi, parseU128(box));
  }
  isCreate(): bool {
    return this.block.isZero() && this.tx.isZero();
  }
  isCreateReserved(): bool {
    return this.block === u128.from(1);
  }
}
