/**
 * Generated by the protoc-gen-ts.  DO NOT EDIT!
 * compiler version: 6.31.1
 * source: protorune.proto
 * git: https://github.com/thesayyn/protoc-gen-ts */
import * as pb_1 from "google-protobuf";
export declare namespace protorune {
    class RuneId extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            height?: number;
            txindex?: number;
        });
        get height(): number;
        set height(value: number);
        get txindex(): number;
        set txindex(value: number);
        static fromObject(data: {
            height?: number;
            txindex?: number;
        }): RuneId;
        toObject(): {
            height?: number;
            txindex?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RuneId;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): RuneId;
    }
    class TransactionRecord extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            height?: number;
            transaction?: Uint8Array;
        });
        get height(): number;
        set height(value: number);
        get transaction(): Uint8Array;
        set transaction(value: Uint8Array);
        static fromObject(data: {
            height?: number;
            transaction?: Uint8Array;
        }): TransactionRecord;
        toObject(): {
            height?: number;
            transaction?: Uint8Array;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): TransactionRecord;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): TransactionRecord;
    }
    class ProtoruneRuneId extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            height?: uint128;
            txindex?: uint128;
        });
        get height(): uint128;
        set height(value: uint128);
        get has_height(): boolean;
        get txindex(): uint128;
        set txindex(value: uint128);
        get has_txindex(): boolean;
        static fromObject(data: {
            height?: ReturnType<typeof uint128.prototype.toObject>;
            txindex?: ReturnType<typeof uint128.prototype.toObject>;
        }): ProtoruneRuneId;
        toObject(): {
            height?: ReturnType<typeof uint128.prototype.toObject>;
            txindex?: ReturnType<typeof uint128.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ProtoruneRuneId;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): ProtoruneRuneId;
    }
    class Rune extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            runeId?: ProtoruneRuneId;
            name?: string;
            divisibility?: number;
            spacers?: number;
            symbol?: string;
            runes_symbol?: number;
        });
        get runeId(): ProtoruneRuneId;
        set runeId(value: ProtoruneRuneId);
        get has_runeId(): boolean;
        get name(): string;
        set name(value: string);
        get divisibility(): number;
        set divisibility(value: number);
        get spacers(): number;
        set spacers(value: number);
        get symbol(): string;
        set symbol(value: string);
        get runes_symbol(): number;
        set runes_symbol(value: number);
        static fromObject(data: {
            runeId?: ReturnType<typeof ProtoruneRuneId.prototype.toObject>;
            name?: string;
            divisibility?: number;
            spacers?: number;
            symbol?: string;
            runes_symbol?: number;
        }): Rune;
        toObject(): {
            runeId?: ReturnType<typeof ProtoruneRuneId.prototype.toObject>;
            name?: string;
            divisibility?: number;
            spacers?: number;
            symbol?: string;
            runes_symbol?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Rune;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Rune;
    }
    class BalanceSheetItem extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            rune?: Rune;
            balance?: uint128;
        });
        get rune(): Rune;
        set rune(value: Rune);
        get has_rune(): boolean;
        get balance(): uint128;
        set balance(value: uint128);
        get has_balance(): boolean;
        static fromObject(data: {
            rune?: ReturnType<typeof Rune.prototype.toObject>;
            balance?: ReturnType<typeof uint128.prototype.toObject>;
        }): BalanceSheetItem;
        toObject(): {
            rune?: ReturnType<typeof Rune.prototype.toObject>;
            balance?: ReturnType<typeof uint128.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BalanceSheetItem;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): BalanceSheetItem;
    }
    class BalanceSheet extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            entries?: BalanceSheetItem[];
        });
        get entries(): BalanceSheetItem[];
        set entries(value: BalanceSheetItem[]);
        static fromObject(data: {
            entries?: ReturnType<typeof BalanceSheetItem.prototype.toObject>[];
        }): BalanceSheet;
        toObject(): {
            entries?: ReturnType<typeof BalanceSheetItem.prototype.toObject>[];
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): BalanceSheet;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): BalanceSheet;
    }
    class Outpoint extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            txid?: Uint8Array;
            vout?: number;
        });
        get txid(): Uint8Array;
        set txid(value: Uint8Array);
        get vout(): number;
        set vout(value: number);
        static fromObject(data: {
            txid?: Uint8Array;
            vout?: number;
        }): Outpoint;
        toObject(): {
            txid?: Uint8Array;
            vout?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Outpoint;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Outpoint;
    }
    class OutpointWithProtocol extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            txid?: Uint8Array;
            vout?: number;
            protocol?: uint128;
        });
        get txid(): Uint8Array;
        set txid(value: Uint8Array);
        get vout(): number;
        set vout(value: number);
        get protocol(): uint128;
        set protocol(value: uint128);
        get has_protocol(): boolean;
        static fromObject(data: {
            txid?: Uint8Array;
            vout?: number;
            protocol?: ReturnType<typeof uint128.prototype.toObject>;
        }): OutpointWithProtocol;
        toObject(): {
            txid?: Uint8Array;
            vout?: number;
            protocol?: ReturnType<typeof uint128.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): OutpointWithProtocol;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): OutpointWithProtocol;
    }
    class Output extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            script?: Uint8Array;
            value?: number;
        });
        get script(): Uint8Array;
        set script(value: Uint8Array);
        get value(): number;
        set value(value: number);
        static fromObject(data: {
            script?: Uint8Array;
            value?: number;
        }): Output;
        toObject(): {
            script?: Uint8Array;
            value?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Output;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Output;
    }
    class OutpointResponse extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            balances?: BalanceSheet;
            outpoint?: Outpoint;
            output?: Output;
            height?: number;
            txindex?: number;
        });
        get balances(): BalanceSheet;
        set balances(value: BalanceSheet);
        get has_balances(): boolean;
        get outpoint(): Outpoint;
        set outpoint(value: Outpoint);
        get has_outpoint(): boolean;
        get output(): Output;
        set output(value: Output);
        get has_output(): boolean;
        get height(): number;
        set height(value: number);
        get txindex(): number;
        set txindex(value: number);
        static fromObject(data: {
            balances?: ReturnType<typeof BalanceSheet.prototype.toObject>;
            outpoint?: ReturnType<typeof Outpoint.prototype.toObject>;
            output?: ReturnType<typeof Output.prototype.toObject>;
            height?: number;
            txindex?: number;
        }): OutpointResponse;
        toObject(): {
            balances?: ReturnType<typeof BalanceSheet.prototype.toObject>;
            outpoint?: ReturnType<typeof Outpoint.prototype.toObject>;
            output?: ReturnType<typeof Output.prototype.toObject>;
            height?: number;
            txindex?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): OutpointResponse;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): OutpointResponse;
    }
    class PaginationInput extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            start?: number;
            end?: number;
        });
        get start(): number;
        set start(value: number);
        get end(): number;
        set end(value: number);
        static fromObject(data: {
            start?: number;
            end?: number;
        }): PaginationInput;
        toObject(): {
            start?: number;
            end?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): PaginationInput;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): PaginationInput;
    }
    class WalletRequest extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            wallet?: Uint8Array;
        });
        get wallet(): Uint8Array;
        set wallet(value: Uint8Array);
        static fromObject(data: {
            wallet?: Uint8Array;
        }): WalletRequest;
        toObject(): {
            wallet?: Uint8Array;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): WalletRequest;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): WalletRequest;
    }
    class WalletResponse extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            outpoints?: OutpointResponse[];
            balances?: BalanceSheet;
        });
        get outpoints(): OutpointResponse[];
        set outpoints(value: OutpointResponse[]);
        get balances(): BalanceSheet;
        set balances(value: BalanceSheet);
        get has_balances(): boolean;
        static fromObject(data: {
            outpoints?: ReturnType<typeof OutpointResponse.prototype.toObject>[];
            balances?: ReturnType<typeof BalanceSheet.prototype.toObject>;
        }): WalletResponse;
        toObject(): {
            outpoints?: ReturnType<typeof OutpointResponse.prototype.toObject>[];
            balances?: ReturnType<typeof BalanceSheet.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): WalletResponse;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): WalletResponse;
    }
    class ProtorunesWalletRequest extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            wallet?: Uint8Array;
            protocol_tag?: uint128;
        });
        get wallet(): Uint8Array;
        set wallet(value: Uint8Array);
        get protocol_tag(): uint128;
        set protocol_tag(value: uint128);
        get has_protocol_tag(): boolean;
        static fromObject(data: {
            wallet?: Uint8Array;
            protocol_tag?: ReturnType<typeof uint128.prototype.toObject>;
        }): ProtorunesWalletRequest;
        toObject(): {
            wallet?: Uint8Array;
            protocol_tag?: ReturnType<typeof uint128.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ProtorunesWalletRequest;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): ProtorunesWalletRequest;
    }
    class RunesByHeightRequest extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            height?: number;
        });
        get height(): number;
        set height(value: number);
        static fromObject(data: {
            height?: number;
        }): RunesByHeightRequest;
        toObject(): {
            height?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RunesByHeightRequest;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): RunesByHeightRequest;
    }
    class RunesResponse extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            runes?: Rune[];
        });
        get runes(): Rune[];
        set runes(value: Rune[]);
        static fromObject(data: {
            runes?: ReturnType<typeof Rune.prototype.toObject>[];
        }): RunesResponse;
        toObject(): {
            runes?: ReturnType<typeof Rune.prototype.toObject>[];
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RunesResponse;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): RunesResponse;
    }
    class ProtoBurn extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            protocol_tag?: uint128;
            pointer?: number;
        });
        get protocol_tag(): uint128;
        set protocol_tag(value: uint128);
        get has_protocol_tag(): boolean;
        get pointer(): number;
        set pointer(value: number);
        static fromObject(data: {
            protocol_tag?: ReturnType<typeof uint128.prototype.toObject>;
            pointer?: number;
        }): ProtoBurn;
        toObject(): {
            protocol_tag?: ReturnType<typeof uint128.prototype.toObject>;
            pointer?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ProtoBurn;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): ProtoBurn;
    }
    class uint128 extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            lo?: string;
            hi?: string;
        });
        get lo(): string;
        set lo(value: string);
        get hi(): string;
        set hi(value: string);
        static fromObject(data: {
            lo?: string;
            hi?: string;
        }): uint128;
        toObject(): {
            lo?: string;
            hi?: string;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): uint128;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): uint128;
    }
    class Clause extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            rune?: ProtoruneRuneId;
            amount?: uint128;
        });
        get rune(): ProtoruneRuneId;
        set rune(value: ProtoruneRuneId);
        get has_rune(): boolean;
        get amount(): uint128;
        set amount(value: uint128);
        get has_amount(): boolean;
        static fromObject(data: {
            rune?: ReturnType<typeof ProtoruneRuneId.prototype.toObject>;
            amount?: ReturnType<typeof uint128.prototype.toObject>;
        }): Clause;
        toObject(): {
            rune?: ReturnType<typeof ProtoruneRuneId.prototype.toObject>;
            amount?: ReturnType<typeof uint128.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Clause;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Clause;
    }
    class Predicate extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            clauses?: Clause[];
        });
        get clauses(): Clause[];
        set clauses(value: Clause[]);
        static fromObject(data: {
            clauses?: ReturnType<typeof Clause.prototype.toObject>[];
        }): Predicate;
        toObject(): {
            clauses?: ReturnType<typeof Clause.prototype.toObject>[];
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Predicate;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Predicate;
    }
    class ProtoMessage extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            calldata?: Uint8Array;
            predicate?: Predicate;
            pointer?: number;
            refund_pointer?: number;
        });
        get calldata(): Uint8Array;
        set calldata(value: Uint8Array);
        get predicate(): Predicate;
        set predicate(value: Predicate);
        get has_predicate(): boolean;
        get pointer(): number;
        set pointer(value: number);
        get refund_pointer(): number;
        set refund_pointer(value: number);
        static fromObject(data: {
            calldata?: Uint8Array;
            predicate?: ReturnType<typeof Predicate.prototype.toObject>;
            pointer?: number;
            refund_pointer?: number;
        }): ProtoMessage;
        toObject(): {
            calldata?: Uint8Array;
            predicate?: ReturnType<typeof Predicate.prototype.toObject>;
            pointer?: number;
            refund_pointer?: number;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ProtoMessage;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): ProtoMessage;
    }
    class RuntimeInput extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            protocol_tag?: uint128;
        });
        get protocol_tag(): uint128;
        set protocol_tag(value: uint128);
        get has_protocol_tag(): boolean;
        static fromObject(data: {
            protocol_tag?: ReturnType<typeof uint128.prototype.toObject>;
        }): RuntimeInput;
        toObject(): {
            protocol_tag?: ReturnType<typeof uint128.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): RuntimeInput;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): RuntimeInput;
    }
    class Runtime extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            balances?: BalanceSheet;
        });
        get balances(): BalanceSheet;
        set balances(value: BalanceSheet);
        get has_balances(): boolean;
        static fromObject(data: {
            balances?: ReturnType<typeof BalanceSheet.prototype.toObject>;
        }): Runtime;
        toObject(): {
            balances?: ReturnType<typeof BalanceSheet.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): Runtime;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): Runtime;
    }
    class ProtorunesByHeightRequest extends pb_1.Message {
        #private;
        constructor(data?: any[] | {
            height?: number;
            protocol_tag?: uint128;
        });
        get height(): number;
        set height(value: number);
        get protocol_tag(): uint128;
        set protocol_tag(value: uint128);
        get has_protocol_tag(): boolean;
        static fromObject(data: {
            height?: number;
            protocol_tag?: ReturnType<typeof uint128.prototype.toObject>;
        }): ProtorunesByHeightRequest;
        toObject(): {
            height?: number;
            protocol_tag?: ReturnType<typeof uint128.prototype.toObject>;
        };
        serialize(): Uint8Array;
        serialize(w: pb_1.BinaryWriter): void;
        static deserialize(bytes: Uint8Array | pb_1.BinaryReader): ProtorunesByHeightRequest;
        serializeBinary(): Uint8Array;
        static deserializeBinary(bytes: Uint8Array): ProtorunesByHeightRequest;
    }
}
