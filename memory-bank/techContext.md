# Alkanes Technical Context

## Technologies Used

### Core Technologies

#### Programming Languages
- **TypeScript**: The primary language used for development, providing type safety and modern JavaScript features
- **AssemblyScript**: A TypeScript-like language for WebAssembly compilation, used for performance-critical components
- **Protocol Buffers**: Used for data serialization and schema definition

#### Runtime Environment
- **Node.js**: The JavaScript runtime used for executing the library
- **WebAssembly**: Used for high-performance computation within the library

#### Blockchain Technologies
- **Bitcoin**: The underlying blockchain that the ALKANES metaprotocol runs on
- **ALKANES Metaprotocol**: The protocol specification for building applications on Bitcoin
- **Bitcoin JSON-RPC**: The interface used to communicate with Bitcoin nodes

### Key Libraries and Dependencies

#### Core Dependencies
- **bitcoinjs-lib**: For Bitcoin transaction creation and manipulation
- **@scure/btc-signer**: For Bitcoin transaction signing
- **@scure/base**: For encoding/decoding utilities
- **@noble/curves**: For cryptographic operations
- **@protobuf-ts/runtime**: For Protocol Buffers runtime
- **@protobuf-ts/protoc**: For Protocol Buffers compilation
- **bip32**: For hierarchical deterministic wallets
- **bip39**: For mnemonic code generation
- **tiny-secp256k1**: For ECDSA operations
- **leb128**: For LEB128 encoding/decoding
- **micro-packed**: For binary data packing
- **lodash**: For utility functions
- **@magiceden-oss/runestone-lib**: For Runestone protocol integration

#### Development Dependencies
- **ts-node**: For running TypeScript files directly
- **typescript**: For TypeScript compilation
- **mocha**: For testing
- **prettier**: For code formatting
- **assemblyscript**: For WebAssembly compilation
- **chai**: For test assertions
- **cross-env**: For cross-platform environment variables

## Development Setup

### Local Development Environment

The project uses Docker Compose to create a complete development environment with the following components:

1. **bitcoind**: Bitcoin regtest node for local blockchain simulation
2. **metashrew**: Blockchain indexer for ALKANES metaprotocol data
3. **memshrew**: In-memory blockchain indexer for faster development
4. **jsonrpc**: JSON-RPC server for client communication
5. **ord**: Ordinals server for ordinal inscription support
6. **esplora**: Blockchain explorer for debugging and visualization

To set up the development environment:

```sh
# Clone the repository
git clone https://github.com/kungfuflex/alkanes.git
cd alkanes

# Install dependencies
npm install
# or
pnpm install

# Start the Docker environment
docker-compose up -d
```

### Build Process

The build process involves several steps:

1. **Protocol Buffer Compilation**: Generate TypeScript interfaces from Protocol Buffer definitions
   ```sh
   npm run build:protoc
   ```

2. **TypeScript Compilation**: Compile TypeScript code to JavaScript
   ```sh
   npm run build:ts
   ```

3. **AssemblyScript Compilation**: Compile AssemblyScript to WebAssembly
   ```sh
   npm run asbuild:release
   ```

4. **Complete Build**: Run all build steps
   ```sh
   npm run build
   ```

### Testing

The project includes several types of tests:

1. **Unit Tests**: Test individual components
   ```sh
   npm test
   ```

2. **Integration Tests**: Test the interaction with a local Bitcoin regtest network
   ```sh
   ts-node integration/scripts/init.ts
   ts-node integration/genesis.spec.ts
   ```

## Technical Constraints

### Bitcoin Limitations

The ALKANES metaprotocol operates within the constraints of the Bitcoin blockchain:

1. **Block Size Limits**: Bitcoin has limited block space, affecting transaction throughput
2. **Script Limitations**: Bitcoin's script language has limited functionality compared to other blockchains
3. **Confirmation Times**: Bitcoin blocks are mined approximately every 10 minutes, affecting transaction finality
4. **Fee Market**: Transaction fees can vary significantly based on network congestion

### Protocol Buffer Constraints

The use of Protocol Buffers introduces some constraints:

1. **Schema Evolution**: Changes to Protocol Buffer schemas must be backward compatible
2. **Binary Format**: Protocol Buffer messages are binary, making debugging more challenging
3. **Code Generation**: Protocol Buffer code generation adds complexity to the build process

### TypeScript Constraints

TypeScript introduces some constraints:

1. **Type Definitions**: All external libraries need TypeScript type definitions
2. **Build Process**: TypeScript requires compilation before execution
3. **Runtime Type Erasure**: TypeScript types are not available at runtime

## Dependencies

### Direct Dependencies

The project has the following direct dependencies:

#### Production Dependencies
```json
{
  "@magiceden-oss/runestone-lib": "^1.0.2",
  "@protobuf-ts/protoc": "^2.9.4",
  "@protobuf-ts/runtime": "^2.9.4",
  "@scure/base": "~1.1.5",
  "@scure/btc-signer": "^1.4.0",
  "binaryen": "^118.0.0",
  "bip32": "^5.0.0-rc.0",
  "bip39": "^3.1.0",
  "body-parser": "^1.20.3",
  "cors": "^2.8.5",
  "enquirer": "2.4.1",
  "ethers": "^6.13.4",
  "express": "^4.21.2",
  "google-protobuf": "^3.21.4",
  "lodash": "^4.17.21",
  "micro-packed": "~0.6.2",
  "postinstall": "^0.10.3"
}
```

### Dependency Management

The project uses npm or pnpm for dependency management. The package.json file defines all dependencies and their versions.

To update dependencies:
```sh
npm update
# or
pnpm update
```

## External Services

The library interacts with the following external services:

1. **Bitcoin Nodes**: For blockchain data and transaction broadcasting
2. **ALKANES Indexer**: For indexing and querying ALKANES metaprotocol data
3. **Ordinals Server**: For ordinal inscription support

## Performance Considerations

### Optimization Strategies

The library employs several optimization strategies:

1. **WebAssembly**: Performance-critical code is compiled to WebAssembly for near-native performance
2. **Protocol Buffers**: Efficient binary serialization reduces data size and parsing overhead
3. **Caching**: Frequently used data is cached to reduce redundant blockchain queries
4. **Batch Processing**: Operations are batched where possible to reduce network overhead

## Security Considerations

### Cryptographic Security

The library uses industry-standard cryptographic libraries:

1. **tiny-secp256k1**: For ECDSA operations
2. **@noble/curves**: For cryptographic curves
3. **bip32/bip39**: For wallet key derivation

### Input Validation

All inputs are validated at multiple levels:

1. **TypeScript Type Checking**: At compile time
2. **Runtime Validation**: Before processing sensitive operations
3. **Protocol Buffer Validation**: During serialization and deserialization

### Error Handling

The library implements comprehensive error handling:

1. **Typed Errors**: Different error types for different failure modes
2. **Error Propagation**: Errors are propagated with context
3. **Graceful Degradation**: The library attempts to continue operation when possible

## Deployment Considerations

### Production Deployment

For production deployment, consider:

1. **Bitcoin Node**: A reliable Bitcoin node with sufficient resources
2. **ALKANES Indexer**: A properly configured and synced ALKANES indexer
3. **Backup Strategy**: Regular backups of wallet data and configuration
4. **Monitoring**: Monitoring of node health, transaction status, and system resources

## Protocol Buffer Encoding and Decoding

### Protocol Buffer Message Types

The library uses several key Protocol Buffer message types for communication with the ALKANES indexer:

#### Core Message Types

1. **uint128**: Represents a 128-bit unsigned integer
   ```proto
   message uint128 {
     uint64 lo = 1 [jstype = JS_STRING];
     uint64 hi = 2 [jstype = JS_STRING];
   }
   ```

2. **ProtoruneRuneId**: Identifies a specific protorune
   ```proto
   message ProtoruneRuneId {
     uint128 height = 1;
     uint128 txindex = 2;
   }
   ```

3. **Rune**: Represents a rune token
   ```proto
   message Rune {
     ProtoruneRuneId runeId = 1;
     string name = 2;
     uint32 divisibility = 3;
     uint32 spacers = 4;
     string symbol = 5;
     uint32 runes_symbol = 6;
   }
   ```

4. **BalanceSheet**: Represents a collection of token balances
   ```proto
   message BalanceSheet {
     repeated BalanceSheetItem entries = 1;
   }
   ```

5. **Outpoint**: Represents a Bitcoin transaction output
   ```proto
   message Outpoint {
     bytes txid = 1;
     uint32 vout = 2;
   }
   ```

#### Request Message Types

1. **ProtorunesWalletRequest**: Request for the `protorunes_by_address` function
   ```proto
   message ProtorunesWalletRequest {
     bytes wallet = 1;
     uint128 protocol_tag = 2;
   }
   ```

2. **WalletRequest**: Request for the `runes_by_address` function
   ```proto
   message WalletRequest {
     bytes wallet = 1;
   }
   ```

#### Response Message Types

1. **WalletResponse**: Response for wallet-related queries
   ```proto
   message WalletResponse {
     repeated OutpointResponse outpoints = 1;
     BalanceSheet balances = 2;
   }
   ```

2. **OutpointResponse**: Information about an outpoint and its balances
   ```proto
   message OutpointResponse {
     BalanceSheet balances = 1;
     Outpoint outpoint = 2;
     Output output = 3;
     uint32 height = 4;
     uint32 txindex = 5;
     bytes address = 6;
   }
   ```

### Encoding Functions

The library provides several functions for encoding data to Protocol Buffer format:

1. **toUint128**: Converts a JavaScript BigInt to a uint128 Protocol Buffer message
   ```typescript
   export function toUint128(v: bigint): any {
     let hex = leftPad16(v.toString(16));
     return new alkanes_protobuf.uint128({
       hi: BigInt("0x" + hex.substr(0, 16)).toString(10),
       lo: BigInt("0x" + hex.substr(16, 32)).toString(10),
     });
   }
   ```

2. **encodeProtocolTag**: Encodes a protocol tag in the format expected by the server
   ```typescript
   function encodeProtocolTag(protocolTag: bigint): { hi: string; lo: string } {
     return toUint128(protocolTag);
   }
   ```

3. **encodeProtorunesWalletInput**: Encodes parameters for the `protorunes_by_address` function
   ```typescript
   export function encodeProtorunesWalletInput(
     address: string,
     protocolTag: bigint
   ) {
     const input: any = {
       wallet: Uint8Array.from(Buffer.from(address, "utf-8")),
       protocol_tag: encodeProtocolTag(protocolTag),
     };
     return (
       "0x" +
       Buffer.from(new ProtorunesWalletRequest(input).serializeBinary()).toString(
         "hex"
       )
     );
   }
   ```

### Decoding Functions

The library also provides functions for decoding Protocol Buffer responses:

1. **fromUint128**: Converts a uint128 Protocol Buffer message to a JavaScript BigInt
   ```typescript
   export function fromUint128(v: { hi: any; lo: any }): bigint {
     return u128ToBuffer(v);
   }
   ```

2. **decodeWalletOutput**: Decodes the response from wallet-related functions
   ```typescript
   export function decodeWalletOutput(hex: string): {
     outpoints: OutPoint[];
     balanceSheet: RuneOutput[];
   } {
     const wo = WalletResponse.deserializeBinary(
       (Uint8Array as any).from(
         (Buffer as any).from(stripHexPrefix(hex), "hex") as Buffer
       ) as Uint8Array
     );
     return {
       outpoints: wo.outpoints.map((op) => decodeOutpointViewBase(op)),
       balanceSheet: decodeRunes(wo.balances),
     };
   }
   ```

3. **decodeRunesResponse**: Decodes the response from runes-related functions
   ```typescript
   export function decodeRunesResponse(hex: string): {
     runes: Rune[];
   } {
     const response = RunesResponse.deserializeBinary(
       (Uint8Array as any).from(
         (Buffer as any).from(stripHexPrefix(hex), "hex") as Buffer
       ) as Uint8Array
     );
     return {
       runes: response.runes.map(decodeRune),
     };
   }
   ```

## Cross-Implementation Compatibility

### alkanes-rs Integration

The Alkanes TypeScript library is designed to work with the alkanes-rs Rust implementation of the ALKANES metaprotocol. This integration requires careful attention to several technical aspects:

#### Protocol Buffer Compatibility

The Protocol Buffer definitions must be identical between the TypeScript and Rust implementations:

1. **Field Types**: The same field types must be used in both implementations
   - TypeScript: `uint128` for large integers
   - Rust: `Uint128` message type for large integers

2. **Message Structure**: The structure of messages must be consistent
   - Field numbers must match
   - Optional/required status must be the same
   - Nested message types must be structured identically

3. **Wire Format**: The binary wire format must be compatible
   - Both implementations must use the same Protocol Buffer version
   - Both must handle length-delimited fields in the same way
   - Both must encode varints in the same format

#### RPC Communication

The RPC communication between the TypeScript client and the Rust server follows a specific pattern:

1. **JSON-RPC Protocol**: Both use the JSON-RPC 2.0 protocol
   ```json
   {
     "id": 1,
     "jsonrpc": "2.0",
     "method": "metashrew_view",
     "params": ["protorunesbyheight", "0x...", "latest"]
   }
   ```

2. **Binary Parameter Encoding**: Parameters are encoded as hex strings
   - TypeScript: `"0x" + Buffer.from(serialized).toString("hex")`
   - Rust: Expects hex-encoded binary data

3. **Response Format**: Responses are also hex-encoded binary data
   - Rust: Returns hex-encoded Protocol Buffer messages
   - TypeScript: Decodes hex strings back to Protocol Buffer messages

4. **Error Handling**: Error responses follow the JSON-RPC error format
   ```json
   {
     "id": 1,
     "jsonrpc": "2.0",
     "error": {
       "code": -32000,
       "message": "Failed to execute view function 'protorunesbyheight'",
       "data": null
     }
   }
   ```

#### View Function Dependencies

The view functions in the Rust implementation depend on specific database tables:

1. **protorunes_by_address**: Uses the `OUTPOINTS_FOR_ADDRESS` table
   - This table maps addresses to their associated outpoints
   - Populated for all transactions with valid addresses

2. **Table Population**: Different tables are populated through different paths
   - `OUTPOINTS_FOR_ADDRESS`: Populated during normal transaction indexing
   - `RUNE_ID_TO_OUTPOINTS`: Only populated for specific transaction types

Understanding these dependencies is crucial for debugging issues with view functions.

### WASM Runtime Integration

The alkanes-rs implementation uses WebAssembly for smart contract execution:

1. **WASM Compilation**: Smart contracts are compiled to WebAssembly
   - Rust contracts are compiled to `.wasm` files
   - These files are executed in a sandboxed environment

2. **Fuel Metering**: Computation is metered using a fuel system
   - Similar to gas in other blockchain systems
   - Prevents infinite loops and DoS attacks

3. **Message Context**: Execution context is provided to smart contracts
   - Includes transaction data, caller information, and other metadata
   - Allows contracts to make decisions based on context

4. **Storage Access**: Contracts can read and write to persistent storage
   - Key-value storage model
   - Storage is isolated between contracts

Understanding the WASM runtime is important for debugging issues with smart contract execution.

## Relationship Between Alkanes, Alkanes-RS, and Metashrew

### Architecture Overview

The ALKANES ecosystem consists of three main components that work together to provide a complete solution for Bitcoin-based DeFi:

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Alkanes (TS)   │────▶│   Alkanes-RS    │────▶│    Metashrew    │
│  Client Library │     │  Server/Indexer │     │  Indexer Engine │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
        │                       │                       │
        │                       │                       │
        ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│ Client Apps     │     │ WASM Contracts  │     │ Bitcoin Node    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Component Roles

1. **Alkanes (TypeScript)**:
   - Client-side library for application developers
   - Provides a TypeScript interface for interacting with the ALKANES metaprotocol
   - Handles RPC communication, transaction building, and wallet management
   - Used by frontend applications and tools

2. **Alkanes-RS (Rust)**:
   - Server-side implementation of the ALKANES metaprotocol
   - Implements the core logic for the metaprotocol
   - Provides view functions for querying the blockchain
   - Compiled to WebAssembly for execution in Metashrew

3. **Metashrew (Rust)**:
   - Bitcoin indexer framework with a WebAssembly virtual machine
   - Provides the runtime environment for executing WASM modules
   - Handles blockchain data retrieval and storage
   - Manages the database and provides a JSON-RPC API

### Communication Flow

The communication flow between these components follows this pattern:

1. **Client to Server**:
   - Alkanes (TS) sends JSON-RPC requests to Alkanes-RS
   - Requests include method name, hex-encoded parameters, and block tag
   - Parameters are serialized using Protocol Buffers

2. **Server Processing**:
   - Alkanes-RS receives the request via Metashrew's JSON-RPC API
   - The request is routed to the appropriate view function
   - The view function queries the database and processes the data
   - The result is serialized using Protocol Buffers and returned

3. **Server to Client**:
   - The response is sent back to Alkanes (TS) as a hex-encoded string
   - Alkanes (TS) deserializes the response using Protocol Buffers
   - The deserialized data is returned to the application

### Integration Points

The integration between these components occurs at several key points:

1. **Protocol Buffer Definitions**:
   - Both Alkanes (TS) and Alkanes-RS use the same Protocol Buffer definitions
   - These definitions must be kept in sync to ensure compatibility
   - Changes to one implementation must be reflected in the other

2. **JSON-RPC Interface**:
   - Metashrew provides a JSON-RPC API that Alkanes-RS exposes
   - Alkanes (TS) communicates with this API using standard JSON-RPC calls
   - The API follows the format: `metashrew_view(method, params, blockTag)`

3. **WASM Module Loading**:
   - Alkanes-RS is compiled to WebAssembly and loaded by Metashrew
   - Metashrew provides the runtime environment for executing the WASM module
   - The WASM module implements the required interface functions

4. **Database Access**:
   - Alkanes-RS accesses the database through Metashrew's host functions
   - Metashrew provides a key-value store interface for data storage and retrieval
   - The database is structured as an append-only store with height annotations

### Key Technical Considerations

When working with this architecture, several technical considerations are important:

1. **Protocol Buffer Compatibility**:
   - Ensure Protocol Buffer definitions match exactly between TypeScript and Rust
   - Field types, numbers, and optional/required status must be consistent
   - Test serialization/deserialization in both directions

2. **Table Relationships**:
   - Different view functions use different database tables
   - Understanding these relationships is crucial for debugging
   - Some tables may need manual population in test environments

3. **WASM Runtime Constraints**:
   - WebAssembly has memory and performance constraints
   - Complex operations may hit these constraints
   - Fuel metering prevents infinite loops and DoS attacks

4. **Deployment Stability**:
   - Metashrew recommends using rockshrew-mono for stability
   - Running the view layer separately can cause issues with certain indexers
   - Database size grows over time due to the append-only design

5. **Cross-Implementation Testing**:
   - Test both implementations together to ensure compatibility
   - Verify that changes to one implementation don't break the other
   - Use integration tests that cover the entire stack

### Development Workflow

The typical development workflow across these components involves:

1. **Protocol Definition**:
   - Define or update Protocol Buffer schemas
   - Generate TypeScript and Rust code from these schemas

2. **Rust Implementation**:
   - Implement or update view functions in Alkanes-RS
   - Compile to WebAssembly for testing

3. **TypeScript Implementation**:
   - Update client-side functions to match the Rust implementation
   - Ensure serialization/deserialization is compatible

4. **Integration Testing**:
   - Test the entire stack using a local development environment
   - Verify that all components work together correctly

5. **Deployment**:
   - Deploy updated components to production
   - Monitor for any issues or performance problems

This workflow ensures that all components remain compatible and that changes are properly tested before deployment.