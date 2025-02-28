export const CALLDATA_MAGIC = 1;

export class CalldataWrapper {
  serialize(): Buffer {
    throw new Error("Method not implemented");
  }

  serializeToCalldata(): Buffer {
    // Calldata must have magic number 1 at the start and magic number 1 at the end
    const buffers = [];
    const magic = Buffer.alloc(1);
    magic[0] = CALLDATA_MAGIC;

    buffers.push(magic);
    buffers.push(this.serialize());
    buffers.push(magic);
    return Buffer.concat(buffers);
  }
}
