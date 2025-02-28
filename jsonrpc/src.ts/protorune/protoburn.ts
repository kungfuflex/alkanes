import { ProtoStone } from "./protostone";
import { encodeRunestoneProtostone } from "./runestone_protostone_upgrade";
import { buildRunesTransaction } from "./utils/transaction";

export async function encodeProtoburn(
  runes: {
    id: { block: bigint; tx: number };
    amount: bigint;
  }[],
  protocolTag: bigint,
  address: string,
  output: any,
) {
  // outputs and their meanings:
  //  - output 0: runestone
  //  - output 1: UTXO of address
  //  - output 2: virtual output -- represents the protoburn on our protoburn protocol

  // all runes will go to output 2 -- performing the protoburn
  // all unused runes will be refunded to pointer 1 and retained by the runes protocol
  // the protostone will burn all runes onto the pointer 1 UTXO
  const runestone = encodeRunestoneProtostone({
    edicts: runes.map((r) => ({ ...r, output: 2 })),
    pointer: 3,
    protostones: [ProtoStone.burn({ protocolTag, pointer: 1 })],
  }).encodedRunestone;

  const outs = [
    {
      script: runestone,
      value: 0,
    },
  ];

  return buildRunesTransaction(outs, address, output);
}
