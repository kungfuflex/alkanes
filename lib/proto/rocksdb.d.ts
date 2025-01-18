import type { BinaryWriteOptions } from "@protobuf-ts/runtime";
import type { IBinaryWriter } from "@protobuf-ts/runtime";
import type { BinaryReadOptions } from "@protobuf-ts/runtime";
import type { IBinaryReader } from "@protobuf-ts/runtime";
import type { PartialMessage } from "@protobuf-ts/runtime";
import { MessageType } from "@protobuf-ts/runtime";
/**
 * @generated from protobuf message rocksdb.RocksDBRequest
 */
export interface RocksDBRequest {
    /**
     * @generated from protobuf field: string prefix = 1;
     */
    prefix: string;
    /**
     * @generated from protobuf field: uint32 limit = 2;
     */
    limit: number;
}
/**
 * @generated from protobuf message rocksdb.RocksDBResponse
 */
export interface RocksDBResponse {
    /**
     * @generated from protobuf field: repeated string keys = 1;
     */
    keys: string[];
    /**
     * @generated from protobuf field: repeated string values = 2;
     */
    values: string[];
}
declare class RocksDBRequest$Type extends MessageType<RocksDBRequest> {
    constructor();
    create(value?: PartialMessage<RocksDBRequest>): RocksDBRequest;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RocksDBRequest): RocksDBRequest;
    internalBinaryWrite(message: RocksDBRequest, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message rocksdb.RocksDBRequest
 */
export declare const RocksDBRequest: RocksDBRequest$Type;
declare class RocksDBResponse$Type extends MessageType<RocksDBResponse> {
    constructor();
    create(value?: PartialMessage<RocksDBResponse>): RocksDBResponse;
    internalBinaryRead(reader: IBinaryReader, length: number, options: BinaryReadOptions, target?: RocksDBResponse): RocksDBResponse;
    internalBinaryWrite(message: RocksDBResponse, writer: IBinaryWriter, options: BinaryWriteOptions): IBinaryWriter;
}
/**
 * @generated MessageType for protobuf message rocksdb.RocksDBResponse
 */
export declare const RocksDBResponse: RocksDBResponse$Type;
export {};
