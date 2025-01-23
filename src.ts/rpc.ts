"use strict";

import * as protowallet from "./wallet";
import * as invoke from "./invoke";
import {
  OutPoint,
  RuneOutput,
  decodeRunesResponse,
  encodeBlockHeightInput,
  encodeProtorunesByHeightInput
} from "./outpoint";
import { BaseRpc } from "./base-rpc";
import { protorune as protobuf } from "./proto/protorune";
import {
  RunestoneProtostoneUpgrade,
  encodeRunestoneProtostone,
} from "./protorune/proto_runestone_upgrade";
import { Edict } from "@magiceden-oss/runestone-lib/dist/src/edict.js";
import { AlkaneTransfer } from "./alkane";
import { Rune } from "@magiceden-oss/runestone-lib/dist/src/rune.js";
import { u64, u32, u128 } from "@magiceden-oss/runestone-lib/dist/src/integer";
import { ProtoruneEdict } from "./protorune/protoruneedict";
import { ProtoruneRuneId } from "./protorune/protoruneruneid";

import { Psbt } from "bitcoinjs-lib";
import { ProtoStone } from "./protorune/protostone";
import { toUint128, toBuffer, leftPadByte } from "./bytes";
import { BlockTag } from "./base-rpc";

const addHexPrefix = (s) => (s.substr(0, 2) === "0x" ? s : "0x" + s);

let id = 0;

export class AlkanesRpc extends BaseRpc {
  async protorunesbyaddress({ address, protocolTag }: any, blockTag: BlockTag = "latest"): Promise<{
    outpoints: OutPoint[];
    balanceSheet: RuneOutput[];
  }> {
    const buffer = protowallet.encodeProtorunesWalletInput(
      address,
      protocolTag,
    );
    const byteString = await this._call({
      method: "protorunesbyaddress",
      input: buffer,
    }, blockTag);
    const decoded = protowallet.decodeWalletOutput(byteString);
    return decoded;
  }
  async spendablesbyaddress({ address, protocolTag }: any, blockTag: BlockTag = "latest"): Promise<{
    outpoints: OutPoint[];
    balanceSheet: RuneOutput[];
  }> {
    const buffer = protowallet.encodeProtorunesWalletInput(
      address,
      protocolTag,
    );
    const byteString = await this._call({
      method: "spendablesbyaddress",
      input: buffer,
    }, blockTag);
    const decoded = protowallet.decodeWalletOutput(byteString);
    return decoded;
  }
  async runesbyaddress({ address }: any, blockTag: BlockTag = "latest"): Promise<{
    outpoints: OutPoint[];
    balanceSheet: RuneOutput[];
  }> {
    const buffer = protowallet.encodeWalletInput(address);
    const byteString = await this._call({
      method: "runesbyaddress",
      input: buffer,
    }, blockTag);
    const decoded = protowallet.decodeWalletOutput(byteString);
    return decoded;
  }

  async runesbyheight({ height }: { height: number }, blockTag: BlockTag = "latest") {
    const payload = encodeBlockHeightInput(height);
    const response = await this._call({
      method: "runesbyheight",
      input: payload,
    }, blockTag);
    const decodedResponse = decodeRunesResponse(response);
    return decodedResponse;
  }
  async protorunesbyheight({ height, protocolTag }: { height: number; protocolTag: bigint }, blockTag: BlockTag = "latest") {
    const payload = encodeProtorunesByHeightInput(height, protocolTag);
    const response = await this._call({
      method: "protorunesbyheight",
      input: payload,
    }, blockTag);
    const decodedResponse = decodeRunesResponse(response);
    return decodedResponse;
  }
  async protorunesbyoutpoint({ txid, vout, protocolTag }, blockTag: BlockTag = "latest") {
    const buffer =
      "0x" +
      Buffer.from(
        new protobuf.OutpointWithProtocol({
          protocol: toUint128(protocolTag),
          txid: Buffer.from(txid, "hex"),
          vout,
        }).serializeBinary(),
      ).toString("hex");
    return invoke.decodeOutpointResponse(
      await this._call({
        method: "protorunesbyoutpoint",
        input: buffer,
      }, blockTag),
    );
  }
  async runesbyoutpoint({ txid, vout }, blockTag: BlockTag = "latest") {
    const buffer =
      "0x" +
      Buffer.from(
        new protobuf.Outpoint({
          txid: Buffer.from(txid, "hex"),
          vout,
        }).serializeBinary(),
      ).toString("hex");
    return invoke.decodeOutpointResponse(
      await this._call({
        method: "protorunesbyoutpoint",
        input: buffer,
      }, blockTag),
    );
  }

  async trace({ txid, vout }: { txid: string; vout: number }, blockTag: BlockTag = "latest"): Promise<any> {
    const buffer = invoke.encodeTraceRequest({
      txid,
      vout,
    });
    const byteString = await this._call({
      method: "trace",
      input: buffer,
    }, blockTag);
    const decoded = invoke.decodeTraceResponse(byteString);
    return decoded;
  }
  async simulate({
    alkanes,
    transaction,
    height,
    block,
    txindex,
    target,
    inputs,
    vout,
    pointer,
    refundPointer,
  }: any, blockTag: BlockTag = "latest"): Promise<any> {
    const buffer = invoke.encodeSimulateRequest({
      alkanes,
      transaction,
      height,
      txindex,
      target,
      block,
      inputs,
      vout,
      pointer,
      refundPointer,
    });
    const byteString = await this._call({
      method: "simulate",
      input: buffer,
    }, blockTag);
    const decoded = invoke.decodeSimulateResponse(byteString);
    return decoded;
  }
  async runtime({ protocolTag }: any, blockTag: BlockTag = "latest"): Promise<{
    balances: RuneOutput[];
  }> {
    const buffer = protowallet.encodeRuntimeInput(protocolTag);
    const byteString = await this._call({
      method: "protorunesbyaddress",
      input: buffer,
    }, blockTag);
    const decoded = protowallet.decodeRuntimeOutput(byteString);
    return decoded;
  }

  async pack({
    runes,
    cellpack,
    pointer,
    refundPointer,
    edicts,
  }: {
    runes: AlkaneTransfer[];
    cellpack: Buffer;
    pointer: number;
    refundPointer: number;
    edicts: ProtoruneEdict[];
  }): Promise<any> {
    const protostone = new ProtoStone({
      message: {
        calldata: cellpack,
        pointer,
        refundPointer,
      },
      protocolTag: BigInt(1),
      edicts,
    });
    return encodeRunestoneProtostone({
      edicts: runes.map((r) => ({
        id: new ProtoruneRuneId(u128(r.id.block), u128(r.id.tx)),
        output: u32(2),
        amount: u128(r.value),
      })),
      pointer: 3,
      protostones: [protostone],
    }).encodedRunestone;
  }
}
