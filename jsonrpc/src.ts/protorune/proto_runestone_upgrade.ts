// file is forked from @magiceden-oss/runestone-lib/src/runestone
// I left comments where I made changes
import {
  MAGIC_NUMBER,
  MAX_DIVISIBILITY,
  MAX_SCRIPT_ELEMENT_SIZE,
  OP_RETURN,
} from "@magiceden-oss/runestone-lib/dist/src/constants";
import { ProtoruneRuneId } from "./protoruneruneid";
import { ProtoruneEdict } from "./protoruneedict";
import { Etching } from "@magiceden-oss/runestone-lib/dist/src/etching";
import { Tag } from "@magiceden-oss/runestone-lib/dist/src/tag";
import { Tag as ProtoTag } from "./tag";
import {
  u128,
  u32,
  u64,
  u8,
} from "@magiceden-oss/runestone-lib/dist/src/integer";
import {
  Option,
  Some,
  None,
} from "@magiceden-oss/runestone-lib/dist/src/monads";
import { Flag } from "@magiceden-oss/runestone-lib/dist/src/flag";
import { script } from "@magiceden-oss/runestone-lib/dist/src/script";
import { Flaw } from "@magiceden-oss/runestone-lib/dist/src/flaw";
import { RuneEtchingSpec } from "@magiceden-oss/runestone-lib/dist/src/indexer";
import { SpacedRune } from "@magiceden-oss/runestone-lib/dist/src/spacedrune";
import { Terms } from "@magiceden-oss/runestone-lib/dist/src/terms";
import { ProtoStone } from "./protostone";
import { unpack, encipher } from "../bytes";

export const MAX_SPACERS = 0b00000111_11111111_11111111_11111111;

export type RunestoneTx = { vout: { scriptPubKey: { hex: string } }[] };

type Payload = Buffer | Flaw;

export function isValidPayload(payload: Payload): payload is Buffer {
  return Buffer.isBuffer(payload);
}

export function encodeOptionInt(
  payloads: Array<any>,
  tag: any,
  opt: Option<any>,
) {
  if (opt.isSome()) {
    payloads.push(tag);
    payloads.push(opt.unwrap());
  }
}

export const MAX_LEB128_BYTES_IN_U128 = 18;

// uint128s -> leb128 max needs 19 bytes, since 128/7 = 18.3, so an extra byte is needed to store the last two bits in the uint128.
// Runes will produce cenotaph if it needs to process more than 18 bytes for any leb128, so we cannot use the upper two bits in a uint128
// Simplest solution is to not use the upper 8 bits (upper byte) of the uint128 so the upper 2 bits can never be set.
// Downside is we miss out on 6 bits of storage before we have to push another tag
export const MAX_U128_BYTES_COMPAT_W_RUNES = 15;

export type RunestoneProtostoneSpec = {
  mint?: {
    block: bigint;
    tx: bigint;
  };
  pointer?: number;
  etching?: RuneEtchingSpec;
  edicts?: ProtoruneEdict[];
  protostones?: ProtoStone[];
};

export class RunestoneProtostoneUpgrade {
  constructor(
    readonly mint: Option<ProtoruneRuneId>,
    readonly pointer: Option<u32>,
    readonly edicts: ProtoruneEdict[],
    readonly etching: Option<Etching>,
    /* BEGIN CODE CHANGE */
    readonly protostones: ProtoStone[],
    /* CODE CHANGE END */
  ) {}

  // removed decipher function -- can add it back if needed

  encipher(): Buffer {
    const payloads: bigint[] = [];

    if (this.etching.isSome()) {
      const etching = this.etching.unwrap();
      let flags = u128(0);
      flags = Flag.set(flags, Flag.ETCHING);

      if (etching.terms.isSome()) {
        flags = Flag.set(flags, Flag.TERMS);
      }

      if (etching.turbo) {
        flags = Flag.set(flags, Flag.TURBO);
      }
      payloads.push(Tag.FLAGS as any);
      payloads.push(flags as any);
      encodeOptionInt(
        payloads,
        Tag.RUNE,
        etching.rune.map((rune) => rune.value),
      );
      encodeOptionInt(
        payloads,
        Tag.DIVISIBILITY,
        etching.divisibility.map(u128),
      );
      encodeOptionInt(payloads, Tag.SYMBOL, etching.spacers.map(u128));
      encodeOptionInt(
        payloads,
        Tag.SYMBOL,
        etching.symbol.map((symbol) => u128(symbol.codePointAt(0)!)),
      );
      encodeOptionInt(payloads, Tag.PREMINE, etching.premine);
      if (etching.terms.isSome()) {
        const terms = etching.terms.unwrap();

        encodeOptionInt(payloads, Tag.AMOUNT, terms.amount);
        encodeOptionInt(payloads, Tag.CAP, terms.cap);
        encodeOptionInt(payloads, Tag.HEIGHT_START, terms.height[0]);
        encodeOptionInt(payloads, Tag.HEIGHT_END, terms.height[1]);
        encodeOptionInt(payloads, Tag.OFFSET_START, terms.offset[0]);
        encodeOptionInt(payloads, Tag.OFFSET_END, terms.offset[1]);
      }
    }

    if (this.mint.isSome()) {
      const claim = this.mint.unwrap();
      payloads.push(Tag.MINT as any);
      payloads.push(u128(claim.block));
      payloads.push(Tag.MINT as any);
      payloads.push(u128(claim.tx));
    }

    encodeOptionInt(payloads, Tag.POINTER, this.pointer.map(u128));

    /* BEGIN CODE CHANGE */
    if (this.protostones.length) {
      // TODO: ORDERING?
      let all_protostone_payloads: bigint[] = [];
      this.protostones.forEach((protostone: ProtoStone) => {
        protostone
          .encipher_payloads()
          .forEach((v) => all_protostone_payloads.push(v));
      });
      unpack(encipher(all_protostone_payloads)).forEach((v) => {
        payloads.push(u128(ProtoTag.PROTOCOL));
        payloads.push(u128(v));
      });
    }
    /* CODE CHANGE END */

    if (this.edicts.length) {
      payloads.push(u128(Tag.BODY));

      const edicts = [...this.edicts].sort((x, y) =>
        Number(x.id.block - y.id.block || x.id.tx - y.id.tx),
      );

      let previous = new ProtoruneRuneId(u128(0), u128(0));
      for (const edict of edicts) {
        const [block, tx] = previous.delta(edict.id).unwrap();

        payloads.push(block);
        payloads.push(tx);
        payloads.push(edict.amount);
        payloads.push(u128(edict.output));
        previous = edict.id;
      }
    }

    const stack: (Buffer | number)[] = [];
    stack.push(OP_RETURN);
    stack.push(MAGIC_NUMBER);

    const payload = encipher(payloads);
    for (let i = 0; i < payload.length; i += MAX_SCRIPT_ELEMENT_SIZE) {
      stack.push(payload.subarray(i, i + MAX_SCRIPT_ELEMENT_SIZE));
    }

    return script.compile(stack);
  }

  // payloads function removed -- searches tx for payloads

  // integers removed -- takes a payload buffer and returns all LEB128s
}

// Helper functions to ensure numbers fit the desired type correctly
const u8Strict = (n: number) => {
  const bigN = BigInt(n);
  if (bigN < 0n || bigN > u8.MAX) {
    throw Error("u8 overflow");
  }
  return u8(bigN);
};
const u32Strict = (n: number) => {
  const bigN = BigInt(n);
  if (bigN < 0n || bigN > u32.MAX) {
    throw Error("u32 overflow");
  }
  return u32(bigN);
};
const u64Strict = (n: bigint) => {
  const bigN = BigInt(n);
  if (bigN < 0n || bigN > u64.MAX) {
    throw Error("u64 overflow");
  }
  return u64(bigN);
};
const u128Strict = (n: bigint) => {
  const bigN = BigInt(n);
  if (bigN < 0n || bigN > u128.MAX) {
    throw Error("u128 overflow");
  }
  return u128(bigN);
};

/**
 * Low level function to allow for encoding runestones without any indexer and transaction checks.
 *
 * @param runestone runestone spec to encode as runestone
 * @returns encoded runestone bytes
 * @throws Error if encoding is detected to be considered a cenotaph
 */
export function encodeRunestoneProtostone(runestone: RunestoneProtostoneSpec): {
  encodedRunestone: Buffer;
  etchingCommitment?: Buffer;
} {
  const mint = runestone.mint
    ? Some(
        new ProtoruneRuneId(
          u128(runestone.mint.block),
          u128(runestone.mint.tx),
        ),
      )
    : None;

  const pointer =
    runestone.pointer !== undefined
      ? Some(runestone.pointer).map(u32Strict)
      : None;

  const edicts: ProtoruneEdict[] = (runestone.edicts ?? []).map((edict) => ({
    id: new ProtoruneRuneId(u128(edict.id.block), u128(edict.id.tx)),
    amount: u128Strict(edict.amount),
    output: edict.output,
  }));

  const protostones = runestone.protostones ?? [];

  let etching: Option<Etching> = None;
  let etchingCommitment: Buffer | undefined = undefined;
  if (runestone.etching) {
    const etchingSpec = runestone.etching;

    const spacedRune = etchingSpec.runeName
      ? SpacedRune.fromString(etchingSpec.runeName)
      : undefined;
    const rune = spacedRune?.rune !== undefined ? Some(spacedRune.rune) : None;

    if (
      etchingSpec.symbol &&
      !(
        etchingSpec.symbol.length === 1 ||
        (etchingSpec.symbol.length === 2 &&
          etchingSpec.symbol.codePointAt(0)! >= 0x10000)
      )
    ) {
      throw Error("Symbol must be one code point");
    }

    const divisibility =
      etchingSpec.divisibility !== undefined
        ? Some(etchingSpec.divisibility).map(u8Strict)
        : None;
    const premine =
      etchingSpec.premine !== undefined
        ? Some(etchingSpec.premine).map(u128Strict)
        : None;
    const spacers =
      spacedRune?.spacers !== undefined && spacedRune.spacers !== 0
        ? Some(u32Strict(spacedRune.spacers))
        : None;
    const symbol = etchingSpec.symbol ? Some(etchingSpec.symbol) : None;

    if (divisibility.isSome() && divisibility.unwrap() > MAX_DIVISIBILITY) {
      throw Error(
        `Divisibility is greater than protocol max ${MAX_DIVISIBILITY}`,
      );
    }

    let terms: Option<Terms> = None;
    if (etchingSpec.terms) {
      const termsSpec = etchingSpec.terms;

      const amount =
        termsSpec.amount !== undefined
          ? Some(termsSpec.amount).map(u128Strict)
          : None;
      const cap =
        termsSpec.cap !== undefined
          ? Some(termsSpec.cap).map(u128Strict)
          : None;
      const height: [Option<u64>, Option<u64>] = termsSpec.height
        ? [
            termsSpec.height.start !== undefined
              ? Some(termsSpec.height.start).map(u64Strict)
              : None,
            termsSpec.height.end !== undefined
              ? Some(termsSpec.height.end).map(u64Strict)
              : None,
          ]
        : [None, None];
      const offset: [Option<u64>, Option<u64>] = termsSpec.offset
        ? [
            termsSpec.offset.start !== undefined
              ? Some(termsSpec.offset.start).map(u64Strict)
              : None,
            termsSpec.offset.end !== undefined
              ? Some(termsSpec.offset.end).map(u64Strict)
              : None,
          ]
        : [None, None];

      if (
        amount.isSome() &&
        cap.isSome() &&
        amount.unwrap() * cap.unwrap() > u128.MAX
      ) {
        throw Error("Terms overflow with amount times cap");
      }

      terms = Some({ amount, cap, height, offset });
    }

    const turbo = etchingSpec.turbo ?? false;

    etching = Some(
      new Etching(divisibility, rune, spacers, symbol, terms, premine, turbo),
    );
    etchingCommitment = rune.isSome() ? rune.unwrap().commitment : undefined;
  }

  return {
    encodedRunestone: new RunestoneProtostoneUpgrade(
      mint,
      pointer,
      edicts,
      etching,
      protostones,
    ).encipher(),
    etchingCommitment,
  };
}
