export type AlkaneId = {
  block: bigint;
  tx: bigint;
}

export type Edict = {
  id: AlkaneId;
  amount: bigint;
  output: number;
};
