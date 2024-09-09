@external("env", "__request_context") declare function __request_context(): usize;
@external("env", "__load_context") declare function __load_context(ptr: usize): void;
@external("env", "__request_storage") declare function __request_storage(ptr: usize): usize;
@external("env", "__load_storage") declare function __load_storage(ptr: usize, result: usize): void
@external("env", "__commit") declare function __commit(ptr: usize): void;
@external("env", "__call") declare function __call(cellpack: usize, fuel: u64): usize;
@external("env", "__delegatecall") declare function __delegatecall(cellpack: usize, fuel: u64): usize;
@external("env", "__staticcall") declare function __staticcall(cellpack: usize, fuel: u64): usize;
@external("env", "__sequence") declare function __sequence(ptr: usize): void;
@external("env", "__request_transaction") declare function __request_transaction(): usize;
@external("env", "__load_transaction") declare function __load_transaction(ptr: usize): void;
@external("env", "__request_block") declare function __request_block(): usize;
@external("env", "__load_block") declare function __load_block(ptr: usize): void;
@external("env", "__fuel") declare function __fuel(): u64;

import { fromArrayBuffer } from "metashrew-runes/assembly/utils";

function toU128List(v: ArrayBuffer): Array<u128> {
  const result = new Array<u128>(0);
  const buffer = Box.from(v);
  for (let i: i32 = 0; i < v.byteLength; i += 16) {
    result.push(fromArrayBuffer(buffer.sliceFrom(i).setLength(16).toArrayBuffer()));
  }
  return result;
}

export class ExecutionContext {
  public self: AlkaneId;
  public caller: AlkaneId;
  public runes: Map<string, ExecutionContextIncomingRune>;
  constructor(v: ArrayBuffer) {
    const values = toU128List(v);
    this.runes = new Map<string, ExecutionContextIncomingRune>();
    this.self = AlkaneId.from(values[0], values[1]);
    this.caller = AlkaneId.from(values[2], values[3]);
    for (let i: i32 = 4; i < values.length; i += 3) {
      const thisAlkane = AlkaneId.from(values[i], values[i + 1]);
      thisAlkane.toBytes();
      this.runes.set(Box.from(thisAlkane.toBytes()).toHexString(), values[i + 3])
    }
  }
  static load(): ExecutionContext {
    const buffer = new ArrayBuffer(<i32>__request_context());
    __load_context(changetype<usize>(buffer));
    return new ExecutionContext(buffer);
  }
}

export class AlkaneEnvironment {
  private _block: ArrayBuffer;
  private _transaction: ArrayBuffer;
  private _sequence: u128;
  private _context: AlkanesContext;
  get context(): ExecutionContext {
    if (changetype<usize>(this._context) === 0) this._context = ExecutionContext.load();
    return this._context;
  }
  get block(): ArrayBuffer {
    if (changetype<usize>(this._block) === 0) {
      this._block = new ArrayBuffer(<i32>__request_block());
      __load_block(changetype<usize>(this._block));
    }
    return this._block;
  }
  get transaction(): ArrayBuffer {
    if (changetype<usize>(this._transaction) === 0) {
      this._block = new ArrayBuffer(<i32>__request_transaction());
      __load_block(changetype<usize>(this._transaction));
    }
    return this._transaction;
  }
  get sequence(): u128 {
    const buffer = new ArrayBuffer(16);
    __sequence(changetype<usize>(buffer));
    return fromArrayBuffer(buffer);
  }
}

export const env = new AlkanesEnvironment();
