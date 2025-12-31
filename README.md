# alkanes

![Tests](https://img.shields.io/github/actions/workflow/status/AssemblyScript/assemblyscript/test.yml?branch=main&label=test&logo=github)
![Publish](https://img.shields.io/github/actions/workflow/status/AssemblyScript/assemblyscript/publish.yml?branch=main&label=publish&logo=github)

TypeScript repository for ALKANES metaprotocol testing and development, within client side applications.

**The ALKANES specification is hosted at** 👉🏻👉🏼👉🏽👉🏾👉🏿 [https://github.com/kungfuflex/alkanes/wiki](https://github.com/kungfuflex/alkanes/wiki)

#### NOTE: ALKANES does not have a network token

Protocol fees are accepted in terms of Bitcoin and compute is metered with the wasmi fuel implementation, for protection against DoS.

## Installation

Install docker-ce with docker-compose. On Debian-based systems, a proper installation of docker-ce will include a docker-compose binary at /usr/libexec/docker/cli-plugins/docker-compose.

A complete environment for alkanes development against a live web application can be initialized in one command, invoked at the root of the project:

```sh
docker-compose up -d
```

This will launch a Bitcoin regtest instance, a keydb backend for a database, a metashrew process, and a metashrew-view process, preloaded with the `alkanes.wasm` binary produced from the Rust crate hosted at [https://github.com/kungfuflex/alkanes-rs](https://github.com/kungfuflex/alkanes-rs).

## Usage

A complete example of metaprotocol usage is demonstrated in the sources within `integration/`

To run the live end-to-end tests, simply invoke the following commands with the docker orchestration running in the background.

```sh
ts-node integration/scripts/init.ts
ts-node integration/genesis.spec.ts
```

This will deploy a supplementary copy of the DIESEL token and call a view function to read the total supply of the asset.

The program flow in integration/genesis.spec.ts is the same set of logic and library usage that could be done against a mainnet Bitcoin application on ALKANES, or any other BTC compatible deployment, within a frontend application.


## Author

flex
