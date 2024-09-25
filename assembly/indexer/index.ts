import { Box } from "metashrew-as/assembly/utils/box";
import { Block } from "metashrew-as/assembly/blockdata/block";
import { console } from "metashrew-as/assembly/utils/logging";
import { parsePrimitive } from "metashrew-as/assembly/utils/utils";
import { _flush, input } from "metashrew-as/assembly/indexer/index";
import { AlkaneIndex } from "./AlkaneIndex";
import { SpendablesIndex } from "metashrew-spendables/assembly/indexer";
import { GENESIS } from "metashrew-runes/assembly/indexer/constants";
import { wasmi } from "./wasmi/bindings";

export function _start(): void {
  const data = input();
  const box = Box.from(data);
  const height = parsePrimitive<u32>(box);
  if (height < GENESIS - 6) {
    _flush();
    return;
  }
  const block = new Block(box);
  if (height >= GENESIS) {
    new SpendablesIndex().indexBlock(height, block);
  }
  new AlkaneIndex().indexBlock(height, block);
  _flush();
}

export function __console(ptr: usize): void {
  console.logUTF8(changetype<ArrayBuffer>(ptr));
}

export * from "protorune/assembly/view";
