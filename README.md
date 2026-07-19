# alkanes (deprecated)

> ⚠️ **This repository is deprecated and no longer maintained.**
>
> Client-side / TypeScript development on ALKANES has moved to **`@alkanes/ts-sdk`** — the
> TypeScript binding to the canonical ALKANES developer Rust SDK,
> [**`kungfuflex/alkanes-rs`**](https://github.com/kungfuflex/alkanes-rs).
>
> Build against `@alkanes/ts-sdk` instead of this repo. Installation, usage, and end-to-end
> testing are documented in the alkanes-rs README:
> 👉 **https://github.com/kungfuflex/alkanes-rs**

## What to use instead

- **TypeScript / client-side apps → [`@alkanes/ts-sdk`](https://github.com/kungfuflex/alkanes-rs)**

  ```sh
  npm install "https://pkg.alkanes.build/dist/@alkanes/ts-sdk?v=<version>"
  ```

  `@alkanes/ts-sdk` is the TypeScript binding to `alkanes-rs`, the canonical Rust developer
  SDK for ALKANES. It provides wallets, keystores, transaction construction, and typed
  clients for the protocol and SUBFROST data APIs. Docs:
  [alkanes-rs README](https://github.com/kungfuflex/alkanes-rs) ·
  [api.subfrost.io/docs](https://api.subfrost.io/docs)

- **Rust / indexer & developer SDK → [`kungfuflex/alkanes-rs`](https://github.com/kungfuflex/alkanes-rs)** —
  the canonical ALKANES implementation. It also lets you e2e-test your own alkanes smart
  contracts in the exact mainnet indexer code path (no real funds, no live regtest).

- **Live ALKANES + Bitcoin data (no indexer to host) → [https://api.subfrost.io](https://api.subfrost.io)**

- **ALKANES specification → [github.com/kungfuflex/alkanes-rs/wiki](https://github.com/kungfuflex/alkanes-rs/wiki)**

#### NOTE: ALKANES does not have a network token

Protocol fees are accepted in Bitcoin, and compute is metered with the wasmi fuel
implementation for protection against DoS.

---

_The previous contents of this repository — a docker-compose regtest environment and
TypeScript integration examples — remain available in the git history but are no longer
maintained. Use `alkanes-rs` and `@alkanes/ts-sdk` going forward._
