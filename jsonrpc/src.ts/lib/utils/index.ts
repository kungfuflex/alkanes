export const stripHexPrefix = (s: string) =>
  s.slice(0, 2) == "0x" ? s.slice(2) : s;

export const addHexPrefix = (s: string) => '0x' + stripHexPrefix(s);
