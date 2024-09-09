import { Box } from "metashrew-as/assembly/utils/box"
import { _flush, input, get, set, Index } from "metashrew-as/assembly/indexer/index";
import { parsePrimitive } from "metashrew-as/assembly/utils/utils";
import { Block } from "metashrew-as/assembly/blockdata/block";
import { Transaction, Input, Output } from "metashrew-as/assembly/blockdata/transaction";

import { console } from "metashrew-as/assembly/utils/logging";
import { toRLP, RLPItem } from "metashrew-as/assembly/utils/rlp";

import { Protorune } from "protorune/assembly/indexer/index";
import { Protostone } from "protorune/assembly/indexer/Protostone";
import { ProtoruneField as Field } from "protorune/assembly/indexer/fields/ProtoruneField";
import { ProtoruneBalanceSheet } from "protorune/assembly/indexer/ProtoruneBalanceSheet";
import { Edict } from "metashrew-runes/assembly/indexer/Edict";
import { RunestoneMessage } from "metashrew-runes/assembly/indexer/RunestoneMessage";
import { RunesTransaction } from "metashrew-runes/assembly/indexer/RunesTransaction";
import { RunesBlock } from "metashrew-runes/assembly/indexer/RunesBlock";
import { MessageContext } from "protorune/assembly/indexer/protomessage/MessageContext";
import { 
  NumberingMixin, 
  NumberingMixinProtocol, 
  NumberingProtoburn, 
  NumberingProtostone, 
  NumberingRunestone, 
  RuneSource 
} from "quorumgenesisprotorune/assembly/indexer/numbering/index";

import { loadAlkane } from "./vm";

class AlkaneMessageContext extends MessageContext {
  handle(): boolean {
    //TODO: implement handle()
    loadAlkane();
    return true
  }
}

function expandToNumberingAlign(
  v: Array<Protostone>,
  tx: RunesTransaction,
): Array<Protostone> {
  const result = new Array<Protostone>(0);
  for (let i = 0; i < v.length; i++) {
    result.push(NumberingProtostone.fromProtocolMessage(v[i], tx).unwrap());
  }
  return result;
}

class ProtostoneReduce {
  tx: RunesTransaction;
  stones: Array<NumberingProtostone> = new Array<NumberingProtostone>();
  constructor(tx: RunesTransaction) {
    this.tx = tx;
  }
}

class AlkaneIndex extends Protorune<AlkaneMessageContext> {
  processRunestone(
    block: RunesBlock,
    tx: RunesTransaction,
    txid: ArrayBuffer,
    height: u32,
    i: u32,
  ): RunestoneMessage {
    const baseRunestone = tx.runestone();
    if (changetype<usize>(baseRunestone) === 0)
      return changetype<RunestoneMessage>(0);
    const runestone = NumberingRunestone.fromProtocolMessage(baseRunestone, tx);
    const balancesByOutput = changetype<Map<u32, ProtoruneBalanceSheet>>(
      runestone.process(tx, txid, height, i),
    );
    const protostones = Protostone.from(runestone.unwrap()).protostones(
      tx.outs.length + 1,
    );
    const _burns = protostones.burns();
    const burns = new Array<NumberingProtoburn<NumberingRunestone>>();

    for (let i = 0; i < _burns.length; i++) {
      burns.push(NumberingProtoburn.fromBurn(_burns[i], runestone));
    }

    const runestoneOutputIndex = tx.runestoneOutputIndex();
    const edicts = Edict.fromDeltaSeries(runestone.edicts);

    if (burns.length > 0) {
      this.processProtoburns(
        baseRunestone.unallocatedTo,
        balancesByOutput,
        txid,
        runestoneOutputIndex,
        Protostone.from(runestone.unwrap()),
        edicts,
        burns,
      );
    }
    const stones = protostones.flat().reduce((reduce, stone) => {
      reduce.stones.push(
        NumberingProtostone.fromProtocolMessage(stone, reduce.tx),
      );
      return reduce;
    }, new ProtostoneReduce(tx)).stones;
    this.processProtostones(stones, block, height, tx, txid, i);
    return runestone;
  }
}

export function _start(): void {
  const data = input();
  const box = Box.from(data);
  const height = parsePrimitive<u32>(box);
  const block = new Block(box);
  new AlkaneIndex().indexBlock(height, block);
  console.log("got block " + height.toString(10));
  _flush();
}
