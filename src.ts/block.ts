import { Block, Transaction } from "bitcoinjs-lib";
import { stripHexPrefix } from "./utils";
import * as bitcoinjs from "bitcoinjs-lib";
import * as bytes from "./bytes";

import { MAGIC_NUMBER } from "@magiceden-oss/runestone-lib/dist/src/constants";

export function parseTransaction(v: string): any {
  const transaction = Transaction.fromBuffer(
    Buffer.from(stripHexPrefix(v), "hex"),
    false,
  );
  return transaction;
}

const padLeftEven = (n) => {
  if (n.length % 2 === 0) return n;
  return "0" + n;
};

export function parseRunestone(v: string): any {
  const tx = parseTransaction(v);
  return parseRunestoneFromTransaction(tx);
}

export function parseRunestoneFromTransaction(tx: Transaction): any {
  const script = bitcoinjs.script.decompile(
    tx.outs.find((v: any) => (v.value === 0n || v.value === 0)).script,
  );
  if (!(script[0] === 0x6a && script[1] === 0x5d)) {
    throw Error(`transaction ${tx.getId()} does not contain a Runestone`);
  }
  const payload: any = bytes.decipher(Buffer.concat(script.slice(2) as any));
  const result = parseLeb128Object(payload);
  return result;
}

export function parseLeb128Object(list: bigint[]): any {
  return list.reduce(
    (() => {
      let tag = null;
      return (r: any, v: bigint, i: number): any => {
        if (tag !== 0 && (tag === null || i % 2 === 0)) {
          tag = Number(v);
        } else {
          if (!r[tag]) r[tag] = [];
          r[tag].push(v);
        }
        return r;
      };
    })(),
    {} as any,
  );
}

export function parseProtostones(list: bigint[]): any {
  let last = {
    item: null,
    tail: list.slice(),
  };
  const result = [];
  while (last.tail.length) {
    last = parseProtostone(last.tail);
    result.push(last.item);
  }
  return result;
}

export function parseProtostone(list: bigint[]): any {
  const protocolTag = list[0];
  const length = list[1];
  const item = {
    protocolTag,
    object: parseLeb128Object(list.slice(2, 2 + Number(length))),
  };
  const tail = list.slice(2 + Number(length));
  return {
    item,
    tail,
  };
}

export function concatField(v: bigint[]): bigint[] {
  const values = bytes.decipherPacked(v);
  return values;
}

export function parseProtostonesFromTransaction(v: Transaction): any {
  return parseProtostones(concatField(parseRunestoneFromTransaction(v)[0x3fff]));
}

export function tryParseProtostonesFromTransaction(v: Transaction): any {
  try {
    return parseProtostonesFromTransaction(v);
  } catch (e) {
    return null;
  }
}

export function parseProtostonesFromBlock(v: string): any {
  const block = Block.fromHex(v);
  return block.transactions.map((tx) => ({
    txid: tx.getId(),
    protostones: (tryParseProtostonesFromTransaction(tx) || []).map((v, i) => v && ({
      ...v,
      vout: tx.outs.length + 1 + i,
    })).filter(Boolean),
  })).filter((v) => v.protostones.length);
}
