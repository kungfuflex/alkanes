import * as fs from "fs";

export const loadWasmFile = (filePath: string): Uint8Array => {
  const buffer = fs.readFileSync(filePath);
  return new Uint8Array(buffer);
};
