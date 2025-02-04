import { decodeRunes } from "./outpoint";
import { protorune as protobuf } from "./proto/protorune";
import { decodeOutpointViewBase, OutPoint, RuneOutput } from "./outpoint";
import { addHexPrefix, stripHexPrefix } from "./utils";
import leb128 from "leb128";
import { toBuffer, toUint128 } from "./bytes";

const {
  ProtorunesWalletRequest,
  TransactionRecord,
  WalletRequest,
  WalletResponse,
  RuntimeInput,
  Runtime,
  Outpoint,
} = protobuf;

/**
 * Encodes the protocolTag in LEB128 format
 * @param protocolTag
 * @returns the protocolTag in LEB128 format
 */
function encodeProtocolTag(protocolTag: bigint): { hi: string, lo: string } {
  return toUint128(protocolTag);
}

/**
 * Protocol tag needs to be LEB128 encoded to pass into the protocol
 * @param address
 * @param protocolTag
 * @returns ProtorunesWalletRequest protobuf hex buffer
 */
export function encodeProtorunesWalletInput(
  address: string,
  protocolTag: bigint
) {
  const input: any = {
    wallet: Uint8Array.from(Buffer.from(address, "utf-8")),
    protocol_tag: encodeProtocolTag(protocolTag),
  };
  return (
    "0x" + Buffer.from(new ProtorunesWalletRequest(input).serializeBinary()).toString("hex")
  );
}

export function encodeTransactionId(txid: string): Buffer {
  return Buffer.from(stripHexPrefix(txid), 'hex')
}

export function encodeWalletInput(
  address: string,
) {
  const input: any = {
    wallet: Uint8Array.from(Buffer.from(address, "utf-8")),
  };
  return (
    "0x" + Buffer.from(new WalletRequest(input).serializeBinary()).toString("hex")
  );
}

export function decodeTransactionResult(hex: string): {
  transaction: string;
  height: number;
} {
  const { transaction, height } = TransactionRecord.deserializeBinary((Uint8Array as any).from((Buffer as any).from(stripHexPrefix(hex), "hex") as Buffer) as Uint8Array);
  return {
    transaction: addHexPrefix(Buffer.from(transaction).toString('hex')),
    height: Number(height)
  };
}

export function decodeWalletOutput(hex: string): {
  outpoints: OutPoint[];
  balanceSheet: RuneOutput[];
} {
  const wo = WalletResponse.deserializeBinary(
    (Uint8Array as any).from((Buffer as any).from(stripHexPrefix(hex), "hex") as Buffer) as Uint8Array);
  return {
    outpoints: wo.outpoints.map((op) => decodeOutpointViewBase(op)),
    balanceSheet: decodeRunes(wo.balances),
  };
}

export function encodeRuntimeInput(protocolTag: bigint) {
  const input: any = {
    protocolTag: encodeProtocolTag(protocolTag),
  };
  return "0x" + Buffer.from(new RuntimeInput(input).serializeBinary()).toString("hex");
}

export function decodeRuntimeOutput(hex: string) {
  const runtime = Runtime.deserializeBinary(
    Uint8Array.from(Buffer.from(stripHexPrefix(hex), "hex"))
  );
  const balances = decodeRunes(runtime.balances);
  return {
    balances,
  };
}
