import { env } from "./env";
import { Box } from "metashrew-as/assembly/utils/box";

export function _start(): void {
  console.log(Box.from(env.block).toHexString());
}
