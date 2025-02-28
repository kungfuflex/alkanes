"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtoStone = void 0;
const integer_1 = require("@magiceden-oss/runestone-lib/dist/src/integer");
const tag_1 = require("./tag");
const monads_1 = require("@magiceden-oss/runestone-lib/dist/src/monads");
const protoruneruneid_1 = require("./protoruneruneid");
const bytes_1 = require("../bytes");
class ProtoStone {
    constructor({ burn, message, protocolTag, edicts, }) {
        this.protocolTag = (0, integer_1.u128)(protocolTag);
        this.edicts = edicts;
        if (burn) {
            this.burn = {
                pointer: (0, monads_1.Some)((0, integer_1.u32)(burn.pointer)),
                from: burn.from,
            };
        }
        if (message) {
            this.message = {
                calldata: message.calldata,
                pointer: (0, monads_1.Some)((0, integer_1.u32)(message.pointer)),
                refundPointer: (0, monads_1.Some)((0, integer_1.u32)(message.refundPointer)),
            };
        }
    }
    // Enciphering a protostone doesn't make sense, removed this functionality
    // encipher() {
    //   const stack: (Buffer | number)[] = [];
    //   let payloads: Buffer[] = [];
    //   stack.push(OP_RETURN);
    //   if (this.burn) {
    //     payloads.push(
    //       Tag.encodeOptionInt(Tag.POINTER, this.burn.pointer.map(u128)),
    //     );
    //     payloads.push(
    //       Tag.encodeOptionInt(Tag.BURN, Some<u128>(this.protocolTag)),
    //     );
    //     stack.push(opcodes.OP_14);
    //   } else if (this.message) {
    //     payloads.push(u128.encodeVarInt(this.protocolTag));
    //     payloads.push(
    //       Tag.encodeOptionInt(Tag.POINTER, this.message.pointer.map(u128)),
    //     );
    //     payloads.push(
    //       Tag.encodeOptionInt(Tag.REFUND, this.message.refundPointer.map(u128)),
    //     );
    //     payloads.push(Tag.encode(Tag.MESSAGE, this.message.calldata));
    //     stack.push(opcodes.OP_16);
    //   } else if (this.split) {
    //     payloads.push(Tag.encode(Tag.SPLIT, this.split.order.map(u128)));
    //     stack.push(opcodes.OP_16);
    //   } else if (this.chunk) {
    //     payloads.push(this.chunk);
    //     stack.push(opcodes.OP_15);
    //   }
    //   const payload = Buffer.concat(payloads);
    //   for (let i = 0; i < payload.length; i += MAX_SCRIPT_ELEMENT_SIZE) {
    //     stack.push(payload.subarray(i, i + MAX_SCRIPT_ELEMENT_SIZE));
    //   }
    //   return script.compile(stack);
    // }
    encipher_payloads() {
        let payloads = [];
        if (this.burn) {
            payloads.push((0, integer_1.u128)(tag_1.Tag.POINTER));
            payloads.push(this.burn.pointer.map(integer_1.u128).unwrap());
            if (this.burn.from) {
                payloads.push((0, integer_1.u128)(tag_1.Tag.FROM));
                payloads.push(this.burn.from.map(integer_1.u128)[0]);
            }
        }
        else if (this.message) {
            // payloads.push(u128.encodeVarInt(this.protocolTag));
            if (this.message.pointer.isSome()) {
                payloads.push((0, integer_1.u128)(tag_1.Tag.POINTER));
                payloads.push((0, integer_1.u128)(this.message.pointer.map(integer_1.u128).unwrap()));
            }
            if (this.message.refundPointer.isSome()) {
                payloads.push((0, integer_1.u128)(tag_1.Tag.REFUND));
                payloads.push((0, integer_1.u128)(this.message.refundPointer.map(integer_1.u128).unwrap()));
            }
            if (this.message.calldata.length) {
                (0, bytes_1.unpack)(this.message.calldata).forEach((v) => {
                    payloads.push((0, integer_1.u128)(tag_1.Tag.MESSAGE));
                    payloads.push((0, integer_1.u128)(v));
                });
            }
        }
        if (this.edicts && this.edicts.length) {
            payloads.push((0, integer_1.u128)(tag_1.Tag.BODY));
            const edicts = [...this.edicts].sort((x, y) => Number(x.id.block - y.id.block || x.id.tx - y.id.tx));
            let previous = new protoruneruneid_1.ProtoruneRuneId((0, integer_1.u128)(0), (0, integer_1.u128)(0));
            for (const edict of edicts) {
                const [block, tx] = previous.delta(edict.id).unwrap();
                payloads.push(block);
                payloads.push(tx);
                payloads.push(edict.amount);
                payloads.push((0, integer_1.u128)(edict.output));
                previous = edict.id;
            }
        }
        // pushing the protocol_id and len first as per the spec
        const length_payload = payloads.length;
        payloads.unshift((0, integer_1.u128)(length_payload));
        payloads.unshift((0, integer_1.u128)(this.protocolTag));
        return payloads;
    }
    static burn({ protocolTag, edicts, ...burn }) {
        return new ProtoStone({ burn, protocolTag, edicts });
    }
    static message({ protocolTag, edicts, ...message }) {
        return new ProtoStone({ message, protocolTag, edicts });
    }
    static edicts({ protocolTag, edicts, }) {
        return new ProtoStone({ edicts, protocolTag });
    }
}
exports.ProtoStone = ProtoStone;
//# sourceMappingURL=protostone.js.map