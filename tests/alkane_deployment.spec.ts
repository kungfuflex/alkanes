import {
  buildProgram,
  formatKv,
  TEST_BTC_ADDRESS1,
  TEST_BTC_ADDRESS2,
} from "metashrew-runes/lib/tests/utils/general";
import { DEBUG_WASM } from "./utils/general";
import { expectBalances } from "protorune/lib/tests//utils/matchers";
import { runesbyaddress } from "metashrew-runes/lib/tests/utils/rune-helpers";
import { protorunesbyaddress } from "protorune/lib/tests/utils/view-helpers";
import {
  createMultipleProtomessageFixture,
  createProtoruneFixture,
} from "protorune/lib/tests/utils/fixtures";
import { inspect } from "node:util";

export const DEFAULT_PROTOCOL_TAG = BigInt("0x400000000000000000");

describe("alkane deployments", () => {
  let program: ReturnType<typeof buildProgram>;
  beforeEach(async () => {
    program = buildProgram(DEBUG_WASM);
    program.setBlockHeight(840000);
  });

  const expectRunesBalances = (address: string, index: number) =>
    expectBalances(program, address, index, runesbyaddress);
  const expectProtoRunesBalances = (
    address: string,
    index: number,
    protocol: any
  ) => expectBalances(program, address, index, protorunesbyaddress, protocol);

  it("should test fixture initial values before protoburn", async () => {
    let { block, premineAmount } = await createProtoruneFixture(
      DEFAULT_PROTOCOL_TAG,
      true
    );
    program.setBlock(block.toHex());
    await program.run("_start");
    console.log(formatKv(program.kv));
    await expectRunesBalances(TEST_BTC_ADDRESS1, 1).equals([premineAmount]);
    await expectRunesBalances(TEST_BTC_ADDRESS2, 2).isZero();
    await expectProtoRunesBalances(
      TEST_BTC_ADDRESS2,
      2,
      DEFAULT_PROTOCOL_TAG
    ).isZero();
    await expectProtoRunesBalances(
      TEST_BTC_ADDRESS1,
      1,
      DEFAULT_PROTOCOL_TAG
    ).isZero();
  });
  it("should test fixture initial values protoburn", async () => {
    let { block, premineAmount } =
      await createProtoruneFixture(DEFAULT_PROTOCOL_TAG);
    program.setBlock(block.toHex());
    await program.run("_start");
    /* await expectRunesBalances(TEST_BTC_ADDRESS1, 1).isZero();
    await expectRunesBalances(TEST_BTC_ADDRESS2, 2).isZero();
    await expectProtoRunesBalances(
      TEST_BTC_ADDRESS2,
      2,
      DEFAULT_PROTOCOL_TAG
    ).equals([premineAmount]);
    await expectProtoRunesBalances(
      TEST_BTC_ADDRESS1,
      1,
      DEFAULT_PROTOCOL_TAG
    ).isZero(); */
  });
});
