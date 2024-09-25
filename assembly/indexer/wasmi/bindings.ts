//@ts-ignore
@external("alkanes_runtime", "__wasmi_caller_memory") declare function __wasmi_caller_memory(
  caller: usize,
): usize;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_caller_context") declare function __wasmi_caller_context(
  caller: usize,
): usize;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_engine_new") declare function __wasmi_engine_new(): usize;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_engine_free") declare function __wasmi_engine_free(
  engine: usize,
): void;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_store_new") declare function __wasmi_store_new(
  engine: usize,
  context: usize,
  memory_limit: usize,
  fuel_limit: u64,
): usize;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_store_free") declare function __wasmi_store_free(
  store: usize,
): void;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_module_new") declare function __wasmi_module_new(
  engine: usize,
  program: usize,
  sz: usize,
): usize;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_module_free") declare function __wasmi_module_free(
  module: usize,
): usize;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_linker_new") declare function __wasmi_linker_new(
  engine: usize,
): usize;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_func_wrap") declare function __wasmi_func_wrap(
  linker: usize,
  module: usize,
  func: usize,
  handler: usize,
): void;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_linker_instantiate") declare function __wasmi_linker_instantiate(
  linker: usize,
  store: usize,
  module: usize,
): usize;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_store_set_fuel") declare function __wasmi_store_set_fuel(
  store: usize,
  fuel: i32,
): void;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_store_get_fuel") declare function __wasmi_store_get_fuel(
  store: usize,
): i32;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_instance_call") declare function __wasmi_instance_call(
  instance: usize,
  store: usize,
  name: usize,
  args: usize,
  len: i32,
  result: usize,
): i32;

//@ts-ignore
@external("alkanes_runtime", "__wasmi_instance_memory") declare function __wasmi_instance_memory(
  instance: usize,
  store: usize,
): usize;

import { console } from "metashrew-as/assembly/utils/logging";

export namespace wasmi {
  export class Result<T> {
    public value: T;
    success: boolean;
    constructor(success: boolean, value: T) {
      this.success = success;
      this.value = value;
    }
    static Ok<T>(value: T): Result<T> {
      return new Result<T>(true, value);
    }
    static Err<T>(): Result<T> {
      return new Result<T>(false, changetype<T>(0));
    }
    isOk(): boolean {
      return this.success;
    }
    unwrap(): T {
      return this.value;
    }
  }

  export function toCStr(v: string): ArrayBuffer {
    const s = String.UTF8.encode(v);
    const result = new ArrayBuffer(s.byteLength + 1);
    memory.copy(
      changetype<usize>(result),
      changetype<usize>(s),
      <usize>s.byteLength,
    );
    store<u8>(changetype<usize>(result) + s.byteLength, <u8>0);
    return result;
  }


  @final
  @unmanaged
  export class Instance {
    [key: string]: number;
    static wrap(v: usize): Instance {
      return changetype<Instance>(v);
    }
    unwrap(): usize {
      return changetype<usize>(this);
    }
    call(store: Store, name: string, args: Array<i32>): Result<i32> {
      const result = new ArrayBuffer(4);
      const hadError = __wasmi_instance_call(
        changetype<usize>(this),
        changetype<usize>(store),
        changetype<usize>(toCStr(name)),
        changetype<usize>(args.dataStart),
        args.length,
        changetype<usize>(result),
      );
      if (hadError !== 0) return Result.Err<i32>();
      return Result.Ok<i32>(load<i32>(changetype<usize>(result)));
    }
    memory(store: Store): usize {
      return __wasmi_instance_memory(this.unwrap(), store.unwrap());
    }
  }


  @final
  @unmanaged
  export class Engine {
    [key: string]: number;
    static wrap(v: usize): Engine {
      return changetype<Engine>(v);
    }
    static default(): Engine {
      return Engine.wrap(__wasmi_engine_new());
    }
    unwrap(): usize {
      return changetype<usize>(this);
    }
    static free(v: Engine): void {
      __wasmi_engine_free(v.unwrap());
    }
    store(context: usize, memoryLimit: usize, fuelLimit: u64): Store {
      return Store.wrap(
        __wasmi_store_new(this.unwrap(), context, memoryLimit, fuelLimit),
      );
    }
    linker(): Linker {
      return Linker.wrap(__wasmi_linker_new(this.unwrap()));
    }
    module(program: ArrayBuffer): Module {
      return Module.wrap(
        __wasmi_module_new(
          this.unwrap(),
          changetype<usize>(program),
          load<u32>(changetype<usize>(program) - 4),
        ),
      );
    }
  }


  @final
  @unmanaged
  export class Store {
    [key: string]: number;
    static wrap(v: usize): Store {
      return changetype<Store>(v);
    }
    unwrap(): usize {
      return changetype<usize>(this);
    }
    static free(v: Store): void {
      __wasmi_store_free(v.unwrap());
    }
    setFuel(fuel: i32): void {
      __wasmi_store_set_fuel(this.unwrap(), fuel);
    }
    fuel(): i32 {
      return __wasmi_store_get_fuel(this.unwrap());
    }
  }


  @final
  @unmanaged
  export class Module {
    [key: string]: number;
    static wrap(v: usize): Module {
      return changetype<Module>(v);
    }
    unwrap(): usize {
      return changetype<usize>(this);
    }
    free(v: Module): void {
      __wasmi_module_free(changetype<usize>(v));
    }
  }


  @final
  @unmanaged
  export class Linker {
    [key: string]: number;
    static wrap(v: usize): Linker {
      return changetype<Linker>(v);
    }
    unwrap(): usize {
      return changetype<usize>(this);
    }
    static free(v: Linker): void {
      __wasmi_linker_free(v.unwrap());
    }
    instantiate(module: Module, store: Store): Instance {
      return Instance.wrap(
        __wasmi_linker_instantiate(
          this.unwrap(),
          changetype<usize>(module),
          changetype<usize>(store),
        ),
      );
    }
    define(
      module: string,
      func: string,
      handler: (caller: usize, ptr: i32) => i32,
    ): Linker {
      console.log("Linker:unwrap:" + this.unwrap().toString(10));
      __wasmi_func_wrap(
        this.unwrap(),
        changetype<usize>(toCStr(module)),
        changetype<usize>(toCStr(func)),
        changetype<usize>(handler),
      );
      return this;
    }
  }

  export class Caller {
    [key: string]: number;
    static wrap(v: usize): Caller {
      return changetype<Caller>(v);
    }
    unwrap(): usize {
      return changetype<usize>(this);
    }
    memory(): usize {
      return __wasmi_caller_memory(this.unwrap());
    }
    context(): usize {
      return __wasmi_caller_context(this.unwrap());
    }
  }
}
