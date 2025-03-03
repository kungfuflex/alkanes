import path from "node:path";
import url from "node:url";
import {
  bigIntToBase10Recursive,
  unmapFromPrimitives,
  mapToPrimitives,
  stripHexPrefix,
} from "./utils";
import {
  METASHREW_URI,
  MEMSHREW_URI,
  RPCAUTH,
  ORD_PORT,
  ORD_HOST,
  ESPLORA_HOST,
  ESPLORA_PORT,
  DAEMON_RPC_ADDR,
} from "./params";
import { getLogger } from "./logger";
import { AlkanesRpc } from "./lib/rpc";

const logger = getLogger();
export async function executeRPC(req, res) {
  try {
    const methodSplit = req.body.method.split("_");
    const namespace = methodSplit[0];
    if (req.body.method === "ord_content") {
      const bytes = await (
        await (
          await fetch(
            url.format({
              protocol: "http:",
              hostname: ORD_HOST,
              port: ORD_PORT,
              pathname: path.join("/", "content", req.body.params[0]),
            }),
            {
              method: "GET",
            },
          )
        ).blob()
      ).arrayBuffer();
      return res.json({
        jsonrpc: "2.0",
        id: req.body.id,
        result: Buffer.from(new Uint8Array(bytes)).toString("base64"),
      });
    }
    switch (namespace) {
      case "alkanes":
        const alkanesRpc = new AlkanesRpc({
          baseUrl: METASHREW_URI,
        });
        if (!alkanesRpc[methodSplit[1]]) {
          throw Error("alkanes method not supported: " + methodSplit[1]);
        }
        const result = mapToPrimitives(
          await alkanesRpc[methodSplit[1]](
            unmapFromPrimitives(req.body.params[0] || {}),
          ),
        );
        return res.json({
          result,
          id: req.body.id,
          jsonrpc: "2.0",
        });
        break;
      case "sandshrew":
        switch (methodSplit[1]) {
          case "multicall":
            const multiResult = [];
            for (const [multiMethod, multiParams] of req.body.params) {
              await executeRPC(
                {
                  body: {
                    method: multiMethod,
                    params: multiParams,
                    id: 0,
                    jsonrpc: "2.0",
                  },
                },
                {
                  json(o) {
                    const response = { ...o };
                    delete response.id;
                    delete response.jsonrpc;
                    multiResult.push(response);
                  },
                },
              );
            }
            res.json({
              id: req.body.id,
              result: multiResult,
              jsonrpc: "2.0",
            });
            break;
        }
        break;
      case "memshrew":
        const memshrewResponse = await (
          await fetch(MEMSHREW_URI, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
          })
        ).json();
        res.json({
          id: req.body.id,
          result: memshrewResponse.result,
          jsonrpc: "2.0",
        });
        break;
      case "metashrew":
        const metashrewResponse = await (
          await fetch(METASHREW_URI, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify(req.body),
          })
        ).json();
        if (metashrewResponse.error) res.json({
          id: req.body.id,
          error: metashrewResponse.error,
          jsonrpc: "2.0",
        });
        else res.json({
          id: req.body.id,
          result: metashrewResponse.result,
          jsonrpc: "2.0"
        });
        break;
      case "ord":
      case "esplora":
        const response = await fetch(
          url.format({
            protocol: "http:",
            hostname: methodSplit[0] === 'ord' ? ORD_HOST : ESPLORA_HOST,
            port: methodSplit[0] === 'ord' ? ORD_PORT : ESPLORA_PORT,
            pathname: path.join(
              "/",
              ...[
                ...methodSplit[1]
                  .split(":")
                  .concat(
                    Array(
                      methodSplit[1].split(":").filter(Boolean).length +
                        req.body.params.length -
                        methodSplit[1].split(":").length,
                    ).fill(0),
                  )
                  .map(
                    (() => {
                      let paramIndex = 0;
                      return (v) => {
                        if (!v) return req.body.params[paramIndex++];
                        return v;
                      };
                    })(),
                  ),
              ].map(String),
            ),
          }),
          {
            method: "GET",
            headers: { accept: "application/json" },
          },
        );
        const responseText = await response.text();
        try {
          res.json({
            jsonrpc: "2.0",
            id: req.body.id,
            result: JSON.parse(responseText),
          });
        } catch (e) {
          res.json({
            jsonrpc: "2.0",
            id: req.body.id,
            result: responseText,
          });
        }
        break;
      default:
        const Authorization =
          "Basic " + Buffer.from(RPCAUTH).toString("base64");
        res.json(
          await (
            await fetch("http://" + DAEMON_RPC_ADDR, {
              method: "POST",
              body: JSON.stringify(
                Object.assign({}, req.body, {
                  method: ((ary) => ary[ary.length - 1])(
                    req.body.method.split("_"),
                  ),
                }),
              ),
              headers: {
                "Content-Type": "application/json",
                Authorization,
              },
            })
          ).json(),
        );
        break;
    }
  } catch (err) {
    res.json({
      jsonrpc: "2.0",
      error: { stack: err.stack, message: err.message, code: err.code },
      id: req.body.id,
    });
  }
}
