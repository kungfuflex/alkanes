import express from "express";
import bodyParser from "body-parser";
import url from "node:url";
import path from "node:path";
import crypto from "node:crypto";
import fs from "fs-extra";
import cors from "cors";
import { logMiddleware } from "./middleware";
import { getLogger } from "./logger";
import { executeRPC } from "./execute";

const logger = getLogger();
export function runServer() {
  const app = express();
  app.use(cors());
  app.use(bodyParser.json({ limit: "100mb" }));
  app.use(logMiddleware);
  app.use(function handleError(err: any, req: express.Request, res: express.Response, next: any): void {
    if (err) {
      res.status(500).end(
        JSON.stringify({
          id: req.body.id,
          error: { message: err.message, code: err.code },
          jsonrpc: "2.0",
        }),
      );
    } else next();
  });
  app.post("*", (req: express.Request, res: express.Response): void => {
    (async () => {
      await executeRPC(req, res);
    })().catch((err) => logger.error(err));
  });
  return new Promise((resolve:any , reject: any): void => {
    app.listen(
      process.env.PORT || 18888,
      process.env.HOST || "0.0.0.0",
      (err: Error) => {
        if (err) reject(err);
        resolve(app);
      },
    );
  });
}
