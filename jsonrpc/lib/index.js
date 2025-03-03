"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.runServer = runServer;
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const middleware_1 = require("./middleware");
const logger_1 = require("./logger");
const execute_1 = require("./execute");
const logger = (0, logger_1.getLogger)();
function runServer() {
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(body_parser_1.default.json({ limit: "100mb" }));
    app.use(middleware_1.logMiddleware);
    app.use(function handleError(err, req, res, next) {
        if (err) {
            res.status(500).end(JSON.stringify({
                id: req.body.id,
                error: { message: err.message, code: err.code },
                jsonrpc: "2.0",
            }));
        }
        else
            next();
    });
    app.post("*", (req, res) => {
        (async () => {
            await (0, execute_1.executeRPC)(req, res);
        })().catch((err) => logger.error(err));
    });
    return new Promise((resolve, reject) => {
        app.listen(process.env.PORT || 18888, process.env.HOST || "0.0.0.0", (err) => {
            if (err)
                reject(err);
            resolve(app);
        });
    });
}
//# sourceMappingURL=index.js.map