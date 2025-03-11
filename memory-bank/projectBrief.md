# Alkanes TypeScript Project Brief

## Project Overview

Alkanes is a TypeScript library designed to interact with the ALKANES metaprotocol running on the Bitcoin blockchain. The project provides a comprehensive set of tools and utilities for client-side applications to connect to RPC instances and interact with the Alkanes indexer. It enables developers to parse requests and responses, manage wallets, and execute transactions on the Bitcoin blockchain using the ALKANES metaprotocol.

The primary goal of this project is to facilitate the development and testing of applications that leverage the ALKANES metaprotocol, providing a robust TypeScript interface for blockchain interactions. The ALKANES specification is hosted at [https://github.com/kungfuflex/alkanes/wiki](https://github.com/kungfuflex/alkanes/wiki).

## Technical Context

### Programming Languages, Frameworks, and Libraries

- **Primary Language**: TypeScript
- **Runtime Environment**: Node.js
- **Build Tools**: 
  - TypeScript Compiler
  - Protocol Buffers (protoc)
  - AssemblyScript

### Dependencies

#### Core Dependencies
- **Blockchain Interaction**:
  - `bitcoinjs-lib`: For Bitcoin transaction creation and manipulation
  - `@scure/btc-signer`: For Bitcoin transaction signing
  - `@scure/base`: For encoding/decoding utilities
  - `@noble/curves`: For cryptographic operations

- **Protocol Buffers**:
  - `@protobuf-ts/runtime`: For Protocol Buffers runtime
  - `@protobuf-ts/protoc`: For Protocol Buffers compilation

- **Cryptography**:
  - `bip32`: For hierarchical deterministic wallets
  - `bip39`: For mnemonic code generation
  - `tiny-secp256k1`: For ECDSA operations

- **Utilities**:
  - `leb128`: For LEB128 encoding/decoding
  - `micro-packed`: For binary data packing
  - `lodash`: For utility functions

#### Development Dependencies
- `ts-node`: For running TypeScript files directly
- `typescript`: For TypeScript compilation
- `mocha`: For testing
- `prettier`: For code formatting
- `assemblyscript`: For WebAssembly compilation

### System Architecture

The Alkanes TypeScript library is structured as a client-side SDK for interacting with the ALKANES metaprotocol. The architecture consists of several key components:

1. **RPC Layer**: Provides communication with the blockchain nodes
   - `AlkanesRpc`: Main RPC client for interacting with the ALKANES metaprotocol
   - `BaseRpc`: Foundation for RPC communication

2. **Protocol Definitions**: Protocol Buffer definitions for data serialization
   - `protorune.proto`: Defines the Protorune protocol messages
   - `alkanes.proto`: Defines the Alkanes protocol messages

3. **Wallet Management**: Tools for managing Bitcoin wallets and transactions
   - Wallet creation and management
   - Transaction building and signing

4. **Utility Functions**: Helper functions for various operations
   - Byte manipulation
   - Encoding/decoding
   - Transaction utilities

5. **Integration Layer**: Examples and tools for integrating with applications

### Design Patterns

- **Builder Pattern**: Used for constructing complex objects like transactions
- **Factory Pattern**: Used for creating protocol-specific objects
- **Adapter Pattern**: Used to adapt between different interfaces (e.g., between RPC and protocol buffers)
- **Command Pattern**: Used for encapsulating requests as objects

## Source Code Modules

### Core Modules

1. **RPC Module** (`src.ts/rpc.ts`, `src.ts/base-rpc.ts`)
   - Implements the JSON-RPC client for communicating with the blockchain
   - Provides methods for querying blockchain data and submitting transactions
   - Handles serialization and deserialization of requests and responses
   - Key methods include:
     - `protorunesbyaddress`: Retrieves protorunes owned by a specific address
     - `runesbyaddress`: Retrieves runes owned by a specific address
     - `runesbyheight`: Retrieves runes created at a specific block height

2. **Wallet Module** (`src.ts/wallet.ts`)
   - Manages wallet operations
   - Handles encoding and decoding of wallet-related data
   - Provides utilities for working with addresses and keys
   - Key functions include:
     - `encodeProtorunesWalletInput`: Encodes wallet input for protorunes
     - `encodeWalletInput`: Encodes wallet input for standard runes

3. **Protocol Buffer Modules** (`proto/`, `src.ts/proto/`)
   - Defines the protocol buffer schemas for data serialization
   - Generated TypeScript interfaces for protocol buffer messages
   - Key message types:
     - `RuneId`: Identifies a specific rune
     - `ProtoruneRuneId`: Identifies a specific protorune
     - `AlkaneId`: Identifies a specific alkane
     - `AlkaneTransfer`: Represents a transfer of alkanes

4. **Utility Modules** (`src.ts/utils/`)
   - Provides helper functions for common operations
   - Includes transaction utilities, byte manipulation, and encoding/decoding functions
   - Key utilities:
     - `stripHexPrefix`/`addHexPrefix`: Manipulate hex string prefixes
     - `getInputsFor`: Retrieves UTXOs for a specific address
     - `decodeRawTx`: Decodes a raw Bitcoin transaction

5. **Protorune Module** (`src.ts/protorune/`)
   - Implements the Protorune protocol
   - Handles Protorune-specific operations and data structures
   - Key components:
     - `ProtoStone`: Represents a Protorune stone
     - `RunestoneProtostoneUpgrade`: Handles upgrades between Runestone and Protostone

6. **Bytes Module** (`src.ts/bytes.ts`)
   - Provides utilities for working with byte arrays and buffers
   - Handles conversion between different data formats
   - Key functions:
     - `toUint128`: Converts a number to a uint128 representation
     - `toBuffer`: Converts various data types to a buffer
     - `leftPadByte`: Pads a byte array from the left

7. **Outpoint Module** (`src.ts/outpoint.ts`)
   - Handles Bitcoin transaction outpoints
   - Provides utilities for working with transaction outputs
   - Key components:
     - `OutPoint`: Represents a Bitcoin transaction output point
     - `RuneOutput`: Represents a rune output

### Integration and Testing

1. **Integration Examples** (`integration/`)
   - Provides examples of how to use the library in real-world scenarios
   - Includes scripts for testing against a local blockchain
   - Key examples:
     - `genesis.spec.ts`: Demonstrates deploying and interacting with a token
     - `deploy-frbtc.ts`: Shows how to deploy a token on the blockchain

2. **Test Suite** (`tests/`)
   - Contains unit and integration tests for the library
   - Ensures the correctness of the implementation

## Deployment and Infrastructure

The project includes Docker configuration for setting up a complete development environment:

- **Docker Compose** (`docker-compose.yaml`):
  - `bitcoind`: Bitcoin regtest node
  - `metashrew`: Blockchain indexer
  - `memshrew`: In-memory blockchain indexer
  - `jsonrpc`: JSON-RPC server
  - `ord`: Ordinals server
  - `esplora`: Blockchain explorer

This setup allows for local development and testing without requiring a connection to the mainnet Bitcoin network. The environment can be initialized with a single command:

```sh
docker-compose up -d
```

## Development Workflow

1. **Setup Environment**:
   - Install dependencies with `npm install` or `pnpm install`
   - Start the Docker environment with `docker-compose up -d`

2. **Build the Project**:
   - Run `npm run build` to compile TypeScript code
   - Run `npm run build:protoc` to generate Protocol Buffer TypeScript files

3. **Testing**:
   - Run integration tests with:
     ```sh
     ts-node integration/scripts/init.ts
     ts-node integration/genesis.spec.ts
     ```

4. **Development**:
   - Modify source files in `src.ts/`
   - Build and test changes
   - Format code with `npm run prettier`

## Documentation and Testing

- **README.md**: Provides basic information about the project and setup instructions
- **Integration Tests**: Demonstrates how to use the library in real-world scenarios
- **Code Comments**: Includes documentation for key functions and components

## Example Usage

Here's a simplified example of how to use the Alkanes library to interact with the blockchain:

```typescript
import { AlkanesRpc } from "alkanes";

// Initialize the RPC client
const rpc = new AlkanesRpc({
  baseUrl: "http://localhost:18888",
  blockTag: "latest"
});

// Query protorunes owned by an address
async function getProtorunes(address, protocolTag) {
  const result = await rpc.protorunesbyaddress({
    address,
    protocolTag
  });
  
  console.log("Outpoints:", result.outpoints);
  console.log("Balance Sheet:", result.balanceSheet);
}

// Example usage
getProtorunes("myBitcoinAddress", BigInt("12345"));
```

## Conclusion

The Alkanes TypeScript library provides a comprehensive set of tools for interacting with the ALKANES metaprotocol on the Bitcoin blockchain. It enables developers to build applications that can connect to RPC instances, parse requests and responses, and execute transactions. The library is designed to be modular, extensible, and easy to integrate into client-side applications. 