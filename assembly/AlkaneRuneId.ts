import { ProtoruneRuneId } from "protorune/assembly/indexer/ProtoruneRuneId";


export class AlkaneId extends ProtoruneRuneId {
  constructor() {
    super(0, 0);
  }
  static from(hi: u128, lo: u128): AlkaneId {
    const result = new AlkaneId();
    result.block = hi
    result.lo = lo;
  }
}
