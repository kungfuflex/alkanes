"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.executeRPC = executeRPC;
const node_path_1 = __importDefault(require("node:path"));
const node_url_1 = __importDefault(require("node:url"));
const utils_1 = require("./utils");
const params_1 = require("./params");
const logger_1 = require("./logger");
const rpc_1 = require("../../lib/rpc");
const logger = (0, logger_1.getLogger)();
async function executeRPC(req, res) {
    try {
        const methodSplit = req.body.method.split("_");
        const namespace = methodSplit[0];
        if (req.body.method === "ord_content") {
            const bytes = await (await (await fetch(node_url_1.default.format({
                protocol: "http:",
                hostname: params_1.ORD_HOST,
                port: params_1.ORD_PORT,
                pathname: node_path_1.default.join("/", "content", req.body.params[0]),
            }), {
                method: "GET",
            })).blob()).arrayBuffer();
            return res.json({
                jsonrpc: "2.0",
                id: req.body.id,
                result: Buffer.from(new Uint8Array(bytes)).toString("base64"),
            });
        }
        switch (namespace) {
            case "alkanes":
                const alkanesRpc = new rpc_1.AlkanesRpc({
                    baseUrl: params_1.METASHREW_URI,
                });
                if (!alkanesRpc[methodSplit[1]]) {
                    throw Error("alkanes method not supported: " + methodSplit[1]);
                }
                const result = (0, utils_1.mapToPrimitives)(await alkanesRpc[methodSplit[1]]((0, utils_1.unmapFromPrimitives)(req.body.params[0] || {})));
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
                            await executeRPC({
                                body: {
                                    method: multiMethod,
                                    params: multiParams,
                                    id: 0,
                                    jsonrpc: "2.0",
                                },
                            }, {
                                json(o) {
                                    const response = { ...o };
                                    delete response.id;
                                    delete response.jsonrpc;
                                    multiResult.push(response);
                                },
                            });
                        }
                        res.json({
                            id: req.body.id,
                            result: multiResult,
                            jsonrpc: "2.0",
                        });
                        break;
                }
                break;
            case "metashrew":
                const metashrewResponse = await (await fetch(params_1.METASHREW_URI, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(req.body),
                })).json();
                res.json({
                    id: req.body.id,
                    result: metashrewResponse.result,
                    jsonrpc: "2.0",
                });
                break;
            case "ord":
            case "esplora":
                const response = await fetch(node_url_1.default.format({
                    protocol: "http:",
                    hostname: methodSplit[0] === 'ord' ? params_1.ORD_HOST : params_1.ESPLORA_HOST,
                    port: methodSplit[0] === 'ord' ? params_1.ORD_PORT : params_1.ESPLORA_PORT,
                    pathname: node_path_1.default.join("/", ...[
                        ...methodSplit[1]
                            .split(":")
                            .concat(Array(methodSplit[1].split(":").filter(Boolean).length +
                            req.body.params.length -
                            methodSplit[1].split(":").length).fill(0))
                            .map((() => {
                            let paramIndex = 0;
                            return (v) => {
                                if (!v)
                                    return req.body.params[paramIndex++];
                                return v;
                            };
                        })()),
                    ].map(String)),
                }), {
                    method: "GET",
                    headers: { accept: "application/json" },
                });
                const responseText = await response.text();
                try {
                    res.json({
                        jsonrpc: "2.0",
                        id: req.body.id,
                        result: JSON.parse(responseText),
                    });
                }
                catch (e) {
                    res.json({
                        jsonrpc: "2.0",
                        id: req.body.id,
                        result: responseText,
                    });
                }
                break;
            default:
                const Authorization = "Basic " + Buffer.from(params_1.RPCAUTH).toString("base64");
                res.json(await (await fetch("http://" + params_1.DAEMON_RPC_ADDR, {
                    method: "POST",
                    body: JSON.stringify(Object.assign({}, req.body, {
                        method: ((ary) => ary[ary.length - 1])(req.body.method.split("_")),
                    })),
                    headers: {
                        "Content-Type": "application/json",
                        Authorization,
                    },
                })).json());
                break;
        }
    }
    catch (err) {
        res.json({
            jsonrpc: "2.0",
            error: { stack: err.stack, message: err.message, code: err.code },
            id: req.body.id,
        });
    }
}
//# sourceMappingURL=execute.js.map