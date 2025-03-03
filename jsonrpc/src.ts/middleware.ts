import { dumpJSONRPCPayload } from "./utils";
import { getLogger } from "./logger";

const logger = getLogger();

export function logMiddleware(req: any, res: any, next: any) {
  const ip = req.get("X-Real-IP");
  logger.info(ip + "|" + dumpJSONRPCPayload(req.body));
  next();
}
