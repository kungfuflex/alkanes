import { wasmi } from "./wasmi";
import { AlkaneContext } from "./AlkaneContext";
import { AlkaneContextIncomingRune } from "./AlkaneContextIncomingRune";
import { ALKANES_INDEX } from "./tables";
import { IncomingRune } from "protorune/assembly/indexer/protomessage/IncomingRune";
import { ProtoruneRuneId } from "protorune/assembly/indexer/ProtoruneRuneId";
import { AlkaneMessageContext } from "./AlkaneMessageContext";
import { u128 } from "as-bignum/assembly";
import { primitiveToBuffer } from "metashrew-as/assembly/utils/utils";
import { AlkaneGlobalState } from "./AlkaneGlobalState";
import { AlkaneId } from "../AlkaneId";
import { Cellpack } from "../Cellpack";
import { AlkaneTransferParcel } from "../AlkaneTransferParcel";
import { StorageMap } from "../StorageMap";
import { Box } from "metashrew-as/assembly/utils/box";
import { toArrayBuffer } from "metashrew-runes/assembly/utils";
import { console } from "metashrew-as/assembly/utils/logging";

export function readArrayBuffer(caller: wasmi.Caller, ptr: i32): ArrayBuffer {
  return readArrayBufferAtOffset(caller.memory(), ptr);
}

export function readArrayBufferAtOffset(mem: usize, ptr: i32): ArrayBuffer {
  if (ptr < 4) return new ArrayBuffer(0);
  const start = load<u32>(mem + <usize>ptr - 4);
  const buffer = new ArrayBuffer(<i32>start);
  memory.copy(
    changetype<usize>(buffer),
    mem + <usize>ptr,
    <usize>buffer.byteLength,
  );
  return buffer;
}

export function writeMemory(
  caller: wasmi.Caller,
  ptr: i32,
  v: ArrayBuffer,
): void {
  memory.copy(
    changetype<usize>(caller.memory() + <usize>ptr),
    changetype<usize>(v),
    <usize>v.byteLength,
  );
}

export function deref(caller: wasmi.Caller, ptr: i32, i: usize): i32 {
  return load<i32>(caller.memory() + <usize>ptr + <usize>sizeof<i32>() * i);
}

export function pipeStorage(result: ArrayBuffer, target: AlkaneId, state: AlkaneGlobalState): ArrayBuffer {
  const box = Box.from(result);
  state.take(target, StorageMap.consumeToStorageMap(box));
  return box.toArrayBuffer();
}

export function makeLinker(engine: wasmi.Engine): wasmi.Linker {
  console.log("make linker");
  const linker = engine
    .linker()
    .define("env", "__log", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      console.log(String.UTF8.decode(readArrayBuffer(caller, deref(caller, ptr, 0))));
      return 0;
    });
    console.log("__log");
  linker.define("env", "__request_context", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      const context = changetype<AlkaneContext>(caller.context());
      return context.serialize().byteLength;
    });
    console.log("__request_context");
    linker.define("env", "__load_context", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      const context = changetype<AlkaneContext>(caller.context());
      const mem: usize = caller.memory();
      const serialized = context.serialize();
      const start = mem + <usize>load<i32>(load<usize>(mem + <usize>ptr));
      if (start < mem + 4) return <i32>start - <i32>mem;
      memory.copy(start, changetype<usize>(serialized), serialized.byteLength);
      return <i32>start - <i32>mem;
    })
    .define("env", "__request_storage", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      const context = changetype<AlkaneContext>(caller.context());
      return context.state.lookup(
        AlkaneId.fromOther(context.self),
        AlkaneId.parse(readArrayBuffer(caller, deref(caller, ptr, 0))),
      ).byteLength;
    })
    .define("env", "__load_storage", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      const context = changetype<AlkaneContext>(caller.context());
      writeMemory(
        caller,
        deref(caller, ptr, 1),
        context.state.lookup(
          AlkaneId.fromOther(context.self),
          AlkaneId.parse(readArrayBuffer(caller, deref(caller, ptr, 0))),
        ),
      );
      return 0;
    })
    .define("env", "__balance", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      const context = changetype<AlkaneContext>(caller.context());
      const who = AlkaneId.parse(
        readArrayBuffer(caller, deref(caller, ptr, 0)),
      );
      const what = AlkaneId.parse(
        readArrayBuffer(caller, deref(caller, ptr, 1)),
      );
      writeMemory(
        caller,
        deref(caller, ptr, 2),
        toArrayBuffer(context.state.balance(who, what)),
      );
      return 0;
    })
    .define("env", "__request_transaction", (_caller: usize, ptr: i32): i32 => {
      return <i32>(
        changetype<AlkaneContext>(wasmi.Caller.wrap(_caller).context())
          .messageContext.transaction.bytes.len
      );
    })
    .define("env", "__load_transaction", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      writeMemory(
        caller,
        deref(caller, ptr, 0),
        changetype<AlkaneContext>(
          caller.context(),
        ).messageContext.transaction.bytes.toArrayBuffer(),
      );
      return 0;
    })
    .define("env", "__request_block", (_caller: usize, ptr: i32): i32 => {
      return <i32>(
        changetype<AlkaneContext>(wasmi.Caller.wrap(_caller).context())
          .messageContext.block.bytes.len
      );
    })
    .define("env", "__load_block", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      writeMemory(
        caller,
        deref(caller, ptr, 0),
        changetype<AlkaneContext>(
          wasmi.Caller.wrap(_caller).context(),
        ).messageContext.block.bytes.toArrayBuffer(),
      );
      return 0;
    })
    .define("env", "__sequence", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      writeMemory(
        caller,
        deref(caller, ptr, 0),
        changetype<Uint8Array>(
          changetype<AlkaneContext>(caller.context())
            .messageContext.sequence()
            .toBytes(),
        ).buffer,
      );
      return 0;
    })
    .define("env", "__fuel", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      writeMemory(
        caller,
        deref(caller, ptr, 0),
        primitiveToBuffer<u64>(
          changetype<AlkaneContext>(caller.context()).instance.store.fuel(),
        ),
      );
      return 0;
    })
    .define("env", "__call", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      const context = changetype<AlkaneContext>(caller.context());
      const state = context.state;
      const cellpack = Cellpack.fromArrayBuffer(
        readArrayBuffer(caller, deref(caller, ptr, 0)),
      );
      const incomingRunes = AlkaneTransferParcel.parse(
        readArrayBuffer(caller, deref(caller, ptr, 1)),
      );
      state.checkpoint();
      const storageMap = StorageMap.parseStorageMap(
        readArrayBuffer(caller, deref(caller, ptr, 2)),
      );
      state.take(AlkaneId.fromOther(context.self), storageMap);
      if (!state.transfer(AlkaneId.fromOther(context.self), cellpack.target, incomingRunes)) {
        state.rollback();
        context.returndata = new ArrayBuffer(0);
	return context.returndata.byteLength;
      }
      const instance = new AlkaneInstance(
        context.messageContext,
        cellpack.target,
        context.self,
        AlkaneContextIncomingRune.fromParcel(incomingRunes),
        cellpack.inputs,
        state,
      );
      const result = instance.run();
      if (result.success) {
        context.returndata = pipeStorage(
          readArrayBufferAtOffset(
            instance.instance.memory(instance.store),
            result.value,
          ),
          cellpack.target,
          state,
        );
        state.commit();
      } else {
        context.returndata = new ArrayBuffer(0);
        state.rollback();
      }
      return context.returndata.byteLength;
    })
    .define("env", "__delegatecall", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      const context = changetype<AlkaneContext>(caller.context());
      const state = context.state;
      const cellpack = Cellpack.fromArrayBuffer(
        readArrayBuffer(caller, deref(caller, ptr, 0)),
      );
      const incomingRunes = AlkaneTransferParcel.parse(
        readArrayBuffer(caller, deref(caller, ptr, 1)),
      );
      state.checkpoint();
      const storageMap = StorageMap.parseStorageMap(
        readArrayBuffer(caller, deref(caller, ptr, 2)),
      );
      state.take(AlkaneId.fromOther(context.self), storageMap);
      const instance = new AlkaneInstance(
        context.messageContext,
        context.self,
        context.caller,
        AlkaneContextIncomingRune.fromParcel(incomingRunes),
        cellpack.inputs,
        state,
      );
      instance.module = instance.engine.module(
        ALKANES_INDEX.select(cellpack.target.toBytes()).get(),
      );
      const result = instance.run();
      if (result.success) {
        context.returndata = pipeStorage(
          readArrayBufferAtOffset(
            instance.instance.memory(instance.store),
            result.value,
          ),
          AlkaneId.fromOther(context.self),
          state,
        );
        state.commit();
      } else {
        context.returndata = new ArrayBuffer(0);
        state.rollback();
      }
      return context.returndata.byteLength;
    })
    .define("env", "__staticcall", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      const context = changetype<AlkaneContext>(caller.context());
      const state = context.state;
      const cellpack = Cellpack.fromArrayBuffer(
        readArrayBuffer(caller, deref(caller, ptr, 0)),
      );
      const incomingRunes = AlkaneTransferParcel.parse(
        readArrayBuffer(caller, deref(caller, ptr, 1)),
      );
      state.checkpoint();
      const storageMap = StorageMap.parseStorageMap(
        readArrayBuffer(caller, deref(caller, ptr, 2)),
      );
      state.take(AlkaneId.fromOther(context.self), storageMap);
      if (!state.transfer(AlkaneId.fromOther(context.self), cellpack.target, incomingRunes)) {
        state.rollback();
        context.returndata = new ArrayBuffer(0);
	return context.returndata.byteLength;
      }
      const instance = new AlkaneInstance(
        context.messageContext,
        cellpack.target,
        context.self,
        AlkaneContextIncomingRune.fromParcel(incomingRunes),
        cellpack.inputs,
        state,
      );
      context.messageContext.runtime.checkpoint();
      const result = instance.run();
      if (result.success) {
        context.returndata = pipeStorage(
          readArrayBufferAtOffset(
            instance.instance.memory(instance.store),
            result.value,
          ),
          cellpack.target,
          state,
        );
        state.rollback();
      } else {
        context.returndata = new ArrayBuffer(0);
        state.rollback();
      }
      context.messageContext.runtime.rollback();
      return context.returndata.byteLength;
    })
    .define("env", "__returndatacopy", (_caller: usize, ptr: i32): i32 => {
      const caller = wasmi.Caller.wrap(_caller);
      writeMemory(
        caller,
        deref(caller, ptr, 0),
        changetype<AlkaneContext>(caller.context()).returndata,
      );
      return 0;
    });
    console.log('made linker');
    return linker;
}

export class AlkaneInstance {
  static FUEL_LIMIT: u64 = 0x10000000;
  static MEMORY_LIMIT: usize = 0x10000000;
  public module: wasmi.Module;
  public instance: wasmi.Instance;
  public store: wasmi.Store;
  public engine: wasmi.Engine;
  public context: AlkaneContext;
  public linker: wasmi.Linker;
  constructor(
    messageContext: AlkaneMessageContext,
    self: ProtoruneRuneId,
    caller: ProtoruneRuneId,
    incomingRunes: Array<AlkaneContextIncomingRune>,
    inputs: Array<u128>,
    state: AlkaneGlobalState,
  ) {
    this.linker = changetype<wasmi.Linker>(0);
    this.module = changetype<wasmi.Module>(0);
    this.instance = changetype<wasmi.Instance>(0);
    const bytecode = ALKANES_INDEX.select(self.toBytes()).get();
    const engine = wasmi.Engine.default();
    this.engine = engine;
    const context = new AlkaneContext(
      messageContext,
      changetype<AlkaneInstance>(0),
      self,
      caller,
      AlkaneInstance.FUEL_LIMIT,
      incomingRunes,
      inputs,
      state,
    );
    const store = (this.store = engine.store(
      context.pointer(),
      AlkaneInstance.MEMORY_LIMIT,
      AlkaneInstance.FUEL_LIMIT,
    ));
    this.context = context;
    const linker = (this.linker = makeLinker(engine));
    const module = (this.module = engine.module(bytecode));
    this.instance = linker.instantiate(module, store);
    this.context.instance = this;
  }
  call(name: string, args: Array<i32>): wasmi.Result<i32> {
    return this.instance.call(this.store, name, args);
  }
  run(): wasmi.Result<i32> {
    const context: AlkaneContext = this.context;
    const cellpack = Cellpack.fromTuple(AlkaneId.fromOther(context.self), context.inputs);
    if (cellpack.target.isCreate()) {
      context.self.block = u128.from(1);
      context.self.tx = context.messageContext.advanceSequence();
      const binary = context.messageContext.findBinary();
      if (changetype<usize>(binary) === 0) {
        return wasmi.Result.Err<i32>();
      } else {
        context.messageContext.runtime.set(ALKANES_INDEX.select(cellpack.target.toBytes()).unwrap(), binary);
      }
    }
    if (cellpack.target.isCreateReserved()) {
      const binary = context.messageContext.findBinary();
      if (
        changetype<usize>(binary) === 0 ||
        context.messageContext.takeCreate1(cellpack.target.tx)
      ) {
        return wasmi.Result.Err<i32>();
      } else {
        cellpack.target.block = u128.from(3);
        context.messageContext.runtime.set(ALKANES_INDEX.select(cellpack.target.toBytes()).unwrap(), binary);
      }
    }
    if (cellpack.target.isFactory()) {
      const binary = context.messageContext.runtime.get(ALKANES_INDEX.select(AlkaneId.fromId(cellpack.target.getFactoryType(), cellpack.target.tx).toBytes()).unwrap())
      if (binary.byteLength === 0) return wasmi.Result.Err<i32>();
      context.self.block = u128.from(0);
      context.self.tx = context.messageContext.advanceSequence();
      context.messageContext.runtime.set(ALKANES_INDEX.select(context.self.toBytes()).unwrap(), binary);
    }
    return this.call("__execute", new Array<i32>());
  }
}
