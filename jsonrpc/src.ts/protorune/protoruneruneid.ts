import {
  None,
  Option,
  Some,
} from "@magiceden-oss/runestone-lib/dist/src/monads";
import { u128 } from "@magiceden-oss/runestone-lib/dist/src/integer";

export class ProtoruneRuneId {
  constructor(
    readonly block: u128,
    readonly tx: u128,
  ) {}

  static new(block: u128, tx: u128): Option<ProtoruneRuneId> {
    const id = new ProtoruneRuneId(block, tx);

    if (id.block === u128(0) && id.tx > u128(0)) {
      return None;
    }

    return Some(id);
  }

  static sort(runeIds: ProtoruneRuneId[]): ProtoruneRuneId[] {
    return [...runeIds].sort((x, y) =>
      Number(x.block - y.block || x.tx - y.tx),
    );
  }

  delta(next: ProtoruneRuneId): Option<[u128, u128]> {
    const optionBlock = u128.checkedSub(next.block, this.block);
    if (optionBlock.isNone()) {
      return None;
    }
    const block = optionBlock.unwrap();

    let tx: u128;
    if (block === 0n) {
      const optionTx = u128.checkedSub(next.tx, this.tx);
      if (optionTx.isNone()) {
        return None;
      }
      tx = optionTx.unwrap();
    } else {
      tx = next.tx;
    }

    return Some([u128(block), u128(tx)]);
  }

  next(block: u128, tx: u128): Option<ProtoruneRuneId> {
    const optionBlock = Some(block);
    const optionTx = Some(tx);

    if (optionBlock.isNone() || optionTx.isNone()) {
      return None;
    }

    const blockU64 = optionBlock.unwrap();
    const txU32 = optionTx.unwrap();

    const nextBlock = u128.checkedAdd(this.block, blockU64);
    if (nextBlock.isNone()) {
      return None;
    }

    let nextTx: u128;
    if (blockU64 === 0n) {
      const optionAdd = u128.checkedAdd(this.tx, txU32);
      if (optionAdd.isNone()) {
        return None;
      }

      nextTx = optionAdd.unwrap();
    } else {
      nextTx = txU32;
    }

    return ProtoruneRuneId.new(nextBlock.unwrap(), nextTx);
  }

  toString() {
    return `${this.block}:${this.tx}`;
  }

  static fromString(s: string) {
    const parts = s.split(":");
    if (parts.length !== 2) {
      throw new Error(`invalid rune ID: ${s}`);
    }

    const [block, tx] = parts;
    if (!/^\d+$/.test(block) || !/^\d+$/.test(tx)) {
      throw new Error(`invalid rune ID: ${s}`);
    }
    return new ProtoruneRuneId(u128(BigInt(block)), u128(BigInt(tx)));
  }
}
