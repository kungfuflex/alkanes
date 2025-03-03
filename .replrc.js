var redis = new (require("ioredis").Redis)("redis://localhost:7777");
var { SandshrewProvider } = require("./lib/provider");
var provider = new SandshrewProvider("http://localhost:18888");
var FAUCET_ADDRESS = "bcrt1qzr9vhs60g6qlmk7x3dd7g3ja30wyts48sxuemv";
//
