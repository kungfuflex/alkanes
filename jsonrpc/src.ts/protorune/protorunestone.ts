import {
  MAX_SCRIPT_ELEMENT_SIZE,
  OP_RETURN,
} from "@magiceden-oss/runestone-lib/dist/src/constants";
import { Edict } from "@magiceden-oss/runestone-lib/dist/src/edict";
import { Tag } from "@magiceden-oss/runestone-lib/dist/src/tag";
import { u128, u32, u64 } from "@magiceden-oss/runestone-lib/dist/src/integer";
import { Option, Some } from "@magiceden-oss/runestone-lib/dist/src/monads";
import { RuneId } from "@magiceden-oss/runestone-lib/dist/src/runeid";
import { script, opcodes } from "@magiceden-oss/runestone-lib/dist/src/script";

export class ProtoRunestone {
  public pointer: Option<u32>;
  public protocolTag: u128;
  public edicts: Edict[];
  constructor({ pointer, edicts, protocolTag }: any) {
    this.pointer = pointer;
    this.edicts = edicts;
    this.protocolTag = protocolTag;
  }

  encipher(): Buffer {
    const payloads: Buffer[] = [];

    payloads.push(Tag.encodeOptionInt(Tag.POINTER, this.pointer.map(u128)));

    if (this.edicts.length) {
      payloads.push(u128.encodeVarInt(u128(Tag.BODY)));

      const edicts = [...this.edicts].sort((x, y) =>
        Number(x.id.block - y.id.block || x.id.tx - y.id.tx),
      );

      let previous = new RuneId(u64(0), u32(0));
      for (const edict of edicts) {
        const [block, tx] = previous.delta(edict.id).unwrap();
        payloads.push(u128.encodeVarInt(block));
        payloads.push(u128.encodeVarInt(tx));
        payloads.push(u128.encodeVarInt(edict.amount));
        payloads.push(u128.encodeVarInt(u128(edict.output)));
        previous = edict.id;
      }
    }

    const stack: (Buffer | number)[] = [];
    stack.push(OP_RETURN);
    stack.push(u128.encodeVarInt(this.protocolTag));

    const payload = Buffer.concat(payloads);
    for (let i = 0; i < payload.length; i += MAX_SCRIPT_ELEMENT_SIZE) {
      stack.push(payload.subarray(i, i + MAX_SCRIPT_ELEMENT_SIZE));
    }

    return script.compile(stack);
  }
}
