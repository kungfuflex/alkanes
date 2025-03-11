# Alkanes System Patterns

## System Architecture

The Alkanes TypeScript library follows a layered architecture that separates concerns and provides a clean interface for client applications. The architecture consists of the following layers:

### 1. RPC Layer
The RPC (Remote Procedure Call) layer is the primary interface for client applications to interact with the Bitcoin blockchain and the ALKANES metaprotocol. It handles communication with the blockchain nodes and the metaprotocol indexer.

**Key Components:**
- `BaseRpc`: The foundation class that handles the basic JSON-RPC communication
- `AlkanesRpc`: Extends BaseRpc to provide ALKANES-specific functionality

**Responsibilities:**
- Establish connections to Bitcoin nodes and ALKANES indexers
- Format and send JSON-RPC requests
- Parse and validate responses
- Handle error conditions and retries

### 2. Protocol Layer
The Protocol Layer handles the serialization and deserialization of data using Protocol Buffers. This ensures efficient and type-safe communication between the client and the blockchain.

**Key Components:**
- Protocol Buffer definitions (`protorune.proto`, `alkanes.proto`)
- Generated TypeScript interfaces for protocol messages

**Responsibilities:**
- Define the structure of messages exchanged with the blockchain
- Serialize TypeScript objects to binary format for transmission
- Deserialize binary responses into TypeScript objects

### 3. Wallet Layer
The Wallet Layer manages Bitcoin wallets, keys, and addresses. It provides functionality for creating and managing wallets, signing transactions, and handling cryptographic operations.

**Key Components:**
- Wallet management utilities
- Key generation and management
- Address encoding and decoding

**Responsibilities:**
- Generate and manage cryptographic keys
- Create and validate Bitcoin addresses
- Sign transactions
- Handle wallet-related data encoding and decoding

### 4. Transaction Layer
The Transaction Layer is responsible for building, signing, and broadcasting Bitcoin transactions that contain ALKANES metaprotocol data.

**Key Components:**
- Transaction building utilities
- UTXO management
- Fee calculation

**Responsibilities:**
- Construct valid Bitcoin transactions
- Include ALKANES metaprotocol data in transactions
- Handle transaction signing and verification
- Manage transaction inputs and outputs

### 5. Utility Layer
The Utility Layer provides common functionality used across the library, such as byte manipulation, encoding/decoding, and other helper functions.

**Key Components:**
- Byte manipulation utilities
- Encoding/decoding utilities
- Transaction utilities

**Responsibilities:**
- Provide reusable utility functions
- Handle common operations like hex encoding/decoding
- Implement specialized algorithms and data structures

## Key Technical Decisions

### 1. Protocol Buffers for Data Serialization
The decision to use Protocol Buffers for data serialization provides several benefits:
- **Efficiency**: Protocol Buffers are more compact than JSON or XML
- **Type Safety**: Strong typing helps prevent errors
- **Versioning**: Protocol Buffers handle schema evolution gracefully
- **Cross-language Compatibility**: Generated code works across multiple programming languages

### 2. TypeScript for Type Safety
Using TypeScript provides:
- **Static Type Checking**: Catch errors at compile time rather than runtime
- **Better IDE Support**: Improved autocompletion and documentation
- **Code Maintainability**: Types serve as documentation and help with refactoring

### 3. Docker-based Development Environment
The project uses Docker to create a consistent development environment:
- **Reproducibility**: Ensures all developers work with the same environment
- **Isolation**: Prevents conflicts with other software on the developer's machine
- **Simplicity**: Single command to start the entire development stack

### 4. AssemblyScript for WebAssembly
The use of AssemblyScript for WebAssembly compilation:
- **Performance**: Near-native performance for compute-intensive operations
- **Portability**: WebAssembly runs in browsers and Node.js
- **Security**: Sandboxed execution environment

## Design Patterns in Use

### 1. Builder Pattern
Used for constructing complex objects like transactions. This pattern allows for a step-by-step construction process with a fluent interface.

**Example**: Transaction building in the library follows this pattern, allowing developers to add inputs, outputs, and other transaction components incrementally.

### 2. Factory Pattern
Used for creating protocol-specific objects. This pattern encapsulates the creation logic and provides a consistent interface for object creation.

**Example**: The creation of protocol buffer messages uses factory methods to ensure proper initialization and validation.

### 3. Adapter Pattern
Used to adapt between different interfaces, particularly between the RPC layer and protocol buffers. This pattern allows components with incompatible interfaces to work together.

**Example**: The library adapts between the JSON-RPC interface of Bitcoin nodes and the strongly-typed TypeScript interfaces used by client applications.

### 4. Command Pattern
Used for encapsulating requests as objects. This pattern allows for parameterization of clients with different requests and supports operations like queueing, logging, and undoing.

**Example**: RPC requests are encapsulated as command objects that can be executed, retried, or modified as needed.

### 5. Repository Pattern
Used for abstracting the data access layer. This pattern provides a clean separation between the domain model and the data access logic.

**Example**: The library abstracts the details of querying the blockchain and presents a clean interface for retrieving data.

## Component Relationships

### RPC and Protocol Buffer Integration
The RPC layer uses Protocol Buffers for serialization and deserialization. RPC methods accept TypeScript objects, convert them to Protocol Buffer messages, and then serialize them for transmission. Responses are deserialized into Protocol Buffer messages and then converted back to TypeScript objects.

### Wallet and Transaction Interaction
The Wallet layer provides the cryptographic operations needed by the Transaction layer. When building a transaction, the Transaction layer uses the Wallet layer to generate signatures and validate addresses.

### Utility Layer Dependencies
The Utility layer is used by all other layers. It provides common functionality like byte manipulation and encoding/decoding that is needed throughout the library.

### Client Application Integration
Client applications primarily interact with the RPC layer, which serves as the main entry point to the library. The RPC layer abstracts away the details of the other layers, providing a clean and simple interface for client applications.

## Error Handling Strategy

The library implements a comprehensive error handling strategy:

1. **RPC Errors**: Errors from the JSON-RPC interface are parsed and converted to TypeScript exceptions with meaningful messages
2. **Validation Errors**: Input validation is performed at multiple levels to catch errors early
3. **Type Safety**: TypeScript's type system helps prevent many errors at compile time
4. **Error Propagation**: Errors are propagated up the call stack with additional context added at each level

## Testing Approach

The project includes several types of tests:

1. **Unit Tests**: Test individual components in isolation
2. **Integration Tests**: Test the interaction between components
3. **End-to-End Tests**: Test the entire system in a realistic environment

The testing environment uses a regtest Bitcoin network with Docker, allowing for realistic testing without using real Bitcoin.

## Protocol Buffer Encoding Patterns

The library uses specific patterns for encoding and decoding Protocol Buffer messages, particularly for view functions:

### 1. uint128 Encoding

The `uint128` type is used extensively in the ALKANES protocol for representing large integers like protocol tags, token IDs, and balances. In Protocol Buffers, this is represented as a message with two fields:

```proto
message uint128 {
  uint64 lo = 1 [jstype = JS_STRING];
  uint64 hi = 2 [jstype = JS_STRING];
}
```

The encoding process involves:
1. Converting a JavaScript BigInt to a hexadecimal string
2. Padding the string to 32 characters (16 bytes)
3. Splitting the string into high and low 64-bit parts
4. Creating a uint128 message with these parts

```typescript
export function toUint128(v: bigint): any {
  let hex = leftPad16(v.toString(16));
  return new alkanes_protobuf.uint128({
    hi: BigInt("0x" + hex.substr(0, 16)).toString(10),
    lo: BigInt("0x" + hex.substr(16, 32)).toString(10),
  });
}
```

The decoding process reverses this:

```typescript
export function fromUint128(v: { hi: any; lo: any }): bigint {
  return u128ToBuffer(v);
}

export function u128ToBuffer(v: { hi: any; lo: any }): bigint {
  return BigInt(
    "0x" +
      Buffer.from(
        leftPad8(toHexString(v.hi)) + leftPad8(toHexString(v.lo)),
        "hex",
      ).toString("hex"),
  );
}
```

### 2. View Function Request Encoding

View functions like and `protorunes_by_address` require specific encoding patterns:

1. **Request Object Creation**: Create a TypeScript object with the required parameters
2. **Parameter Conversion**: Convert parameters to the appropriate format (e.g., BigInt to uint128)
3. **Protocol Buffer Serialization**: Serialize the object to a Protocol Buffer message
4. **Hex Encoding**: Convert the binary message to a hex string with "0x" prefix

### 3. View Function Response Decoding

Responses from view functions are decoded using a similar pattern in reverse:

1. **Hex Decoding**: Convert the hex string to a binary buffer
2. **Protocol Buffer Deserialization**: Deserialize the buffer to a Protocol Buffer message
3. **Object Conversion**: Convert the Protocol Buffer message to a TypeScript object
4. **Field Extraction**: Extract the relevant fields from the object

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

### 4. RPC Communication Pattern

The RPC communication follows a standard pattern:

1. **Request Preparation**: Create and encode a request object
2. **RPC Call**: Send the request to the server via JSON-RPC
3. **Response Handling**: Parse and decode the response
4. **Error Handling**: Handle any errors that occur during the process

## Cross-Language Compatibility Patterns

The Alkanes TypeScript library must maintain compatibility with the alkanes-rs Rust implementation. This requires careful attention to several patterns:

### 1. Protocol Buffer Definition Consistency

Protocol Buffer definitions must be identical between the TypeScript and Rust implementations:

- Field types must match exactly (e.g., uint128 vs uint32)
- Field numbers must be consistent
- Optional/required status must be the same
- Custom options must be handled appropriately

For example, a `ProtoruneHoldersRequest` message must have the same definition in both implementations:

```proto
// TypeScript implementation
message ProtoruneHoldersRequest {
  uint128 protocol_tag = 1;
  uint128 height = 2;
  uint128 txindex = 3;
}

// Rust implementation
message ProtoruneHoldersRequest {
  optional Uint128 protocol_tag = 1;
  optional Uint128 height = 2;
  optional Uint128 txindex = 3;
}
```

### 2. Binary Format Compatibility

The binary format of serialized messages must be compatible between implementations:

- TypeScript uses Google's Protocol Buffers library
- Rust uses the `protobuf` crate
- Both must produce compatible wire formats

This requires careful attention to:
- Endianness
- Varint encoding
- Length-delimited field encoding
- Handling of optional fields

### 3. Table Relationship Understanding

Understanding the table relationships in the Rust implementation is crucial for proper TypeScript implementation:

- **OUTPOINT_TO_RUNES**: Maps Bitcoin outpoints to their rune balances
- **RUNE_ID_TO_OUTPOINTS**: Maps rune IDs to the outpoints that hold them
- **OUTPOINTS_FOR_ADDRESS**: Maps addresses to their associated outpoints
- **OUTPOINT_SPENDABLE_BY**: Maps outpoints to the addresses that can spend them


### 4. Error Handling Consistency

Error handling must be consistent between implementations:

- Error codes should have the same meaning
- Error messages should be similar
- Error recovery strategies should be compatible

This ensures that client applications can handle errors consistently regardless of which implementation they're using.

## ALKANES Addressing System

The ALKANES addressing system is a key part of the protocol and must be understood by both implementations:

- Alkanes are addressed by their AlkaneId (block and tx fields)
- Addresses are always `[2, n]` or `[3, n]`, where n is a u128 value
- `[2, 0]` is a special address for the genesis ALKANE
- Alkanes created with `[1, 0]`, `[5, n]`, or `[6, n]` acquire a `[2, n]` address
- If an alkane is instantiated with the `[3, n]` cellpack, the address will be `[4, n]`

This addressing system affects how tokens are identified and how contracts are deployed.

## The ALKANES Ecosystem Architecture

The ALKANES ecosystem consists of three main components that work together to provide a complete solution for Bitcoin-based DeFi:

### 1. Three-Tier Architecture

The ALKANES ecosystem follows a three-tier architecture:

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

1. **Presentation Tier (Alkanes TypeScript)**:
   - Client-side library for application developers
   - Provides a TypeScript interface for interacting with the ALKANES metaprotocol
   - Handles RPC communication, transaction building, and wallet management

2. **Application Tier (Alkanes-RS)**:
   - Server-side implementation of the ALKANES metaprotocol
   - Implements the core logic for the metaprotocol
   - Provides view functions for querying the blockchain
   - Compiled to WebAssembly for execution in Metashrew

3. **Data Tier (Metashrew)**:
   - Bitcoin indexer framework with a WebAssembly virtual machine
   - Provides the runtime environment for executing WASM modules
   - Handles blockchain data retrieval and storage
   - Manages the database and provides a JSON-RPC API

### 2. Component Interaction Patterns

The interaction between these components follows several key patterns:

#### 2.1 Client-Server Pattern

The Alkanes TypeScript library communicates with the server using a client-server pattern:

- **Request-Response**: The client sends a request and waits for a response
- **JSON-RPC Protocol**: Communication follows the JSON-RPC 2.0 protocol
- **Stateless Communication**: Each request is independent and contains all necessary information


#### 2.2 Plugin Architecture

Metashrew uses a plugin architecture to load and execute WASM modules:

- **Module Loading**: WASM modules are loaded at runtime
- **Host Functions**: The host provides functions that WASM modules can call
- **Standardized Interface**: Modules implement a standardized interface

```rust
// Load WASM module
let module = Module::from_file(engine, path)?;
let instance = Instance::new(&mut store, &module, &[])?;

// Execute module
let start = instance.get_func(&mut store, "_start")?;
start.call(&mut store, &[], &mut [])?;
```

#### 2.3 Repository Pattern

The data access layer follows the repository pattern:

- **Data Access Abstraction**: The details of data storage and retrieval are abstracted
- **Query Interface**: A clean interface for querying data
- **Transaction Management**: Transactions ensure data consistency

```rust
// Query data
let outpoints = db.get_outpoints_for_address(address)?;
let balances = db.get_balances_for_outpoints(outpoints)?;
```

#### 2.4 Command Pattern

The RPC layer uses the command pattern:

- **Command Encapsulation**: Requests are encapsulated as command objects
- **Command Execution**: Commands are executed by the appropriate handler
- **Result Handling**: Results are returned to the caller

```typescript
// Command encapsulation
const command = {
  method: "protorunesbyaddress",
  input: buffer,
};

// Command execution
const result = await this._call(command, blockTag);
```

### 3. Data Flow Architecture

The data flow through the ALKANES ecosystem follows a specific pattern:

#### 3.1 Indexing Flow

```
1. Bitcoin Node produces a new block
2. Metashrew fetches the block
3. Metashrew executes the Alkanes-RS WASM module for the block
4. Alkanes-RS processes the block and updates the state
5. State changes are stored in the database
```

#### 3.2 Query Flow

```
1. Client application calls a method on the Alkanes TypeScript library
2. Alkanes TypeScript serializes the request using Protocol Buffers
3. Request is sent to the server via JSON-RPC
4. Metashrew routes the request to the appropriate view function in Alkanes-RS
5. Alkanes-RS executes the view function and queries the database
6. Result is serialized and returned to the client
7. Alkanes TypeScript deserializes the response and returns it to the application
```

#### 3.3 Transaction Flow

```
1. Client application builds a transaction using the Alkanes TypeScript library
2. Transaction is signed and broadcast to the Bitcoin network
3. Bitcoin node includes the transaction in a block
4. Block is processed by the indexing flow
5. State changes are reflected in the database
6. Client can query the updated state
```

### 4. Database Architecture

The database architecture is based on Metashrew's append-only design:

#### 4.1 Key-Value Store

- **RocksDB**: The primary storage backend is RocksDB
- **Key-Value Pairs**: Data is stored as key-value pairs
- **Namespaces**: Keys are organized into namespaces for different types of data

#### 4.2 Append-Only Design

- **No Overwrites**: Values are never overwritten; instead, new versions are appended
- **Height Annotation**: Values are annotated with block height for historical queries
- **Chain Reorganization Handling**: This design enables efficient handling of chain reorganizations

#### 4.3 Table Structure

- **OUTPOINT_TO_RUNES**: Maps Bitcoin outpoints to their rune balances
- **RUNE_ID_TO_OUTPOINTS**: Maps rune IDs to the outpoints that hold them
- **OUTPOINTS_FOR_ADDRESS**: Maps addresses to their associated outpoints
- **OUTPOINT_SPENDABLE_BY**: Maps outpoints to the addresses that can spend them

### 5. Integration Patterns

The integration between these components uses several patterns:

#### 5.1 Protocol Buffer Integration

- **Shared Definitions**: Protocol Buffer definitions are shared between TypeScript and Rust
- **Code Generation**: TypeScript and Rust code is generated from these definitions
- **Binary Compatibility**: The binary format is compatible between implementations

#### 5.2 JSON-RPC Integration

- **Standard Protocol**: JSON-RPC 2.0 is used for communication
- **Method Routing**: Requests are routed to the appropriate handler
- **Error Handling**: Errors are returned in a standardized format

#### 5.3 WebAssembly Integration

- **Module Loading**: WASM modules are loaded at runtime
- **Host Functions**: The host provides functions for the module to call
- **Memory Management**: Memory is shared between the host and the module

#### 5.4 Docker Integration

- **Containerization**: Components are packaged as Docker containers
- **Orchestration**: Docker Compose is used for orchestration
- **Volume Mounting**: Data is persisted using volume mounts


### 6. Security Architecture

The security architecture includes several layers:

#### 6.1 WebAssembly Sandboxing

- **Memory Isolation**: WASM modules have isolated memory
- **Limited Capabilities**: Modules can only call provided host functions
- **Fuel Metering**: Computation is metered to prevent DoS attacks

#### 6.2 RPC Security

- **No Built-in Authentication**: The JSON-RPC API has no built-in authentication
- **Reverse Proxy**: Should be deployed behind a reverse proxy for production
- **TLS Encryption**: Communication should be encrypted using TLS

#### 6.3 Bitcoin Node Security

- **Dedicated Instance**: Should use a dedicated Bitcoin node
- **Limited Capabilities**: Node should have limited capabilities
- **Secure Credentials**: RPC credentials should be kept secure

### 7. Error Handling Architecture

The error handling architecture includes:

#### 7.1 Error Propagation

- **Context Enrichment**: Errors are enriched with context as they propagate
- **Error Types**: Different error types for different failure modes
- **Error Codes**: Standardized error codes for common errors

#### 7.2 Error Recovery

- **Graceful Degradation**: The system attempts to continue operation when possible
- **Retry Logic**: Transient errors are retried with backoff
- **Fallback Mechanisms**: Alternative paths are used when primary paths fail

#### 7.3 Error Reporting

- **Logging**: Errors are logged with context
- **Monitoring**: Error rates are monitored
- **Alerting**: High error rates trigger alerts