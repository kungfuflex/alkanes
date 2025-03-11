# Alkanes Active Context

## Current Work Focus

The Alkanes TypeScript library is currently focused on providing a stable and well-documented interface for interacting with the ALKANES metaprotocol on the Bitcoin blockchain. The primary areas of focus are:

1. **Core RPC Functionality**: Ensuring the RPC layer provides comprehensive access to all ALKANES metaprotocol features
2. **Transaction Building**: Improving the transaction building utilities to handle all ALKANES metaprotocol operations
3. **Documentation**: Enhancing documentation to make the library more accessible to developers
4. **Testing**: Expanding test coverage to ensure reliability and correctness
5. **Integration Examples**: Providing more examples of how to use the library in real-world scenarios
6. **Protocol Buffer Compatibility**: Ensuring compatibility between TypeScript and Rust protocol buffer definitions
7. **View Function Debugging**: Resolving issues with view functions
8. **Cross-Implementation Compatibility**: Maintaining compatibility between alkanes (TypeScript), alkanes-rs (Rust), and metashrew

## Recent Changes

Based on the repository analysis, the following recent changes have been identified:

1. **Docker Environment Setup**: A complete Docker-based development environment has been set up, including Bitcoin regtest, Metashrew indexer, and other necessary components
2. **Protocol Buffer Definitions**: Protocol buffer definitions for the ALKANES metaprotocol have been implemented and are being used for data serialization
3. **RPC Implementation**: The RPC layer has been implemented with support for various ALKANES metaprotocol operations
4. **Integration Tests**: Integration tests have been added to demonstrate and verify the library's functionality
5. **Wallet Management**: Wallet management utilities have been implemented for handling Bitcoin addresses and keys
6. **Enhanced Debugging**: Added comprehensive logging throughout the RPC call chain to aid in debugging
7. **Protocol Buffer Fixes**: Fixed mismatches between TypeScript and Rust protocol buffer definitions
8. **Encoding/Decoding Improvements**: Enhanced encoding/decoding functions for view function parameters

## Next Steps

The following next steps have been identified for the Alkanes TypeScript library:

1. **API Stabilization**: Finalize the API design to ensure backward compatibility in future releases
2. **Performance Optimization**: Optimize critical paths for better performance, particularly in transaction building and RPC communication
3. **Error Handling Improvements**: Enhance error handling to provide more detailed and actionable error messages
4. **Documentation Expansion**: Expand documentation with more examples and detailed API references
5. **Browser Compatibility**: Ensure the library works well in browser environments, not just Node.js
6. **TypeScript Type Improvements**: Refine TypeScript types for better developer experience and error prevention
7. **Additional Integration Examples**: Create more examples of common use cases to help developers get started
8. **Protocol Buffer Validation**: Implement a validation system to ensure protocol buffer definitions remain consistent across languages
9. **Table Relationship Documentation**: Document the relationships between different tables in the ALKANES system
10. **Cross-Repository Testing**: Establish testing procedures that verify compatibility between TypeScript and Rust implementations

## Active Decisions and Considerations

The following decisions and considerations are currently being evaluated:

### 1. Protocol Buffer Schema Evolution

**Decision Needed**: How to handle backward compatibility as the Protocol Buffer schemas evolve

**Considerations**:
- Protocol Buffers have built-in support for schema evolution
- Need to establish guidelines for making schema changes
- Need to version schemas appropriately
- Need to handle backward compatibility in the TypeScript interfaces
- Need to ensure consistency between TypeScript and Rust implementations

### 2. Error Handling Strategy

**Decision Needed**: Standardize error handling across the library

**Considerations**:
- Different types of errors (RPC errors, validation errors, network errors)
- Error propagation and context
- Error recovery strategies
- Error reporting and logging
- Consistent error handling between TypeScript and Rust implementations

### 3. Testing Strategy

**Decision Needed**: Comprehensive testing approach for the library

**Considerations**:
- Unit testing individual components
- Integration testing with a local Bitcoin regtest network
- End-to-end testing of complete workflows
- Performance testing of critical paths
- Test coverage goals and metrics
- Cross-language testing to ensure compatibility with the Rust implementation
- Testing best practices learned from alkanes-rs (avoiding double indexing, using clear() between tests)

### 4. Documentation Approach

**Decision Needed**: Documentation structure and format

**Considerations**:
- API reference documentation
- Tutorial-style documentation
- Example-based documentation
- Documentation generation tools
- Documentation maintenance process
- Cross-referencing with alkanes-rs documentation

### 5. Versioning and Release Strategy

**Decision Needed**: How to version and release the library

**Considerations**:
- Semantic versioning
- Release frequency
- Changelog management
- Deprecation policy
- Breaking change policy
- Coordination with alkanes-rs releases

### 6. Table Population Strategy

**Decision Needed**: How to ensure consistent table population across different functions

**Considerations**:
- Different tables are populated through different paths
- `RUNE_ID_TO_OUTPOINTS` is only populated for runestone transactions or when edicts are processed
- `OUTPOINTS_FOR_ADDRESS` is populated for all transactions with valid addresses
- Need to ensure both tables are consistently populated for all relevant transactions

### 7. Metashrew Integration Strategy

**Decision Needed**: How to best integrate with the Metashrew indexer framework

**Considerations**:
- Metashrew provides the runtime environment for alkanes-rs
- Need to understand Metashrew's architecture and constraints
- Need to ensure compatibility with Metashrew's JSON-RPC API
- Need to handle Metashrew's append-only database design
- Need to consider Metashrew's stability recommendations (using rockshrew-mono)

## Current Challenges

The following challenges are currently being addressed:

### 1. Bitcoin Network Constraints

The Bitcoin network has inherent constraints that affect the ALKANES metaprotocol:
- Limited block space
- 10-minute block times
- Fee market dynamics
- Script limitations

These constraints need to be carefully considered in the library design and documentation.

### 2. Developer Experience

Balancing power and simplicity in the API design:
- Making common operations simple
- Providing access to advanced features
- Ensuring type safety
- Providing helpful error messages
- Creating comprehensive documentation

### 3. Testing in a Blockchain Environment

Testing blockchain applications presents unique challenges:
- Need for a realistic test environment
- Handling blockchain state in tests
- Testing asynchronous operations
- Simulating different network conditions
- Testing error conditions
- Avoiding double indexing in tests
- Ensuring consistent table population

### 4. Cross-Language Compatibility

Ensuring compatibility between TypeScript and Rust implementations:
- Protocol buffer definitions must match exactly
- Encoding/decoding functions must produce compatible outputs
- Error handling must be consistent
- Table structures and relationships must be understood by both implementations

### 5. Metashrew Integration Challenges

Working with the Metashrew indexer framework presents specific challenges:
- Understanding Metashrew's append-only database design
- Handling chain reorganizations correctly
- Working within Metashrew's WASM runtime constraints
- Dealing with stability issues when running the view layer separately
- Managing database growth due to the append-only design

## Integration Points

The library integrates with several external systems:

1. **Bitcoin Nodes**: Via JSON-RPC for blockchain data and transaction broadcasting
2. **ALKANES Indexer**: For indexing and querying ALKANES metaprotocol data
3. **Client Applications**: Applications that use the library to interact with the ALKANES metaprotocol
4. **Development Tools**: Docker, TypeScript compiler, Protocol Buffer compiler
5. **alkanes-rs**: The Rust implementation of the ALKANES metaprotocol
6. **Metashrew**: The Bitcoin indexer framework that runs alkanes-rs

## The Alkanes Ecosystem: Alkanes, Alkanes-RS, and Metashrew

The ALKANES metaprotocol is implemented through a stack of three main components that work together:

### 1. Alkanes (TypeScript)

- **Role**: Client-side library for application developers
- **Language**: TypeScript
- **Purpose**: Provides a developer-friendly interface for interacting with the ALKANES metaprotocol
- **Responsibilities**:
  - RPC communication with the server
  - Transaction building and signing
  - Wallet management
  - Protocol buffer serialization/deserialization
  - Error handling and reporting

### 2. Alkanes-RS (Rust)

- **Role**: Server-side implementation of the ALKANES metaprotocol
- **Language**: Rust (compiled to WebAssembly)
- **Purpose**: Implements the core logic of the ALKANES metaprotocol
- **Responsibilities**:
  - Processing Bitcoin blocks and transactions
  - Maintaining the state of the ALKANES ecosystem
  - Providing view functions for querying data
  - Handling smart contract execution
  - Managing token balances and transfers

### 3. Metashrew (Rust)

- **Role**: Bitcoin indexer framework with a WebAssembly virtual machine
- **Language**: Rust
- **Purpose**: Provides the runtime environment for executing WASM modules like alkanes-rs
- **Responsibilities**:
  - Fetching blocks from Bitcoin Core
  - Executing WASM modules for each block
  - Maintaining the indexed data in a database
  - Exposing a JSON-RPC API for querying data
  - Handling chain reorganizations

### Communication Flow

The communication between these components follows this pattern:

1. **Client to Server**:
   - Alkanes (TS) sends JSON-RPC requests to the server
   - Requests include method name, hex-encoded parameters, and block tag
   - Parameters are serialized using Protocol Buffers

2. **Server Processing**:
   - Metashrew receives the request and routes it to alkanes-rs
   - alkanes-rs executes the appropriate view function
   - The view function queries the database and processes the data
   - The result is serialized and returned

3. **Server to Client**:
   - The response is sent back to Alkanes (TS) as a hex-encoded string
   - Alkanes (TS) deserializes the response using Protocol Buffers
   - The deserialized data is returned to the application

### Key Integration Challenges

The integration between these components presents several challenges:

1. **Protocol Buffer Compatibility**:
   - Both Alkanes (TS) and alkanes-rs must use compatible Protocol Buffer definitions
   - Changes to one implementation must be reflected in the other
   - Field types, numbers, and optional/required status must match exactly

2. **Table Relationships**:
   - Different view functions in alkanes-rs use different database tables
   - Understanding these relationships is crucial for debugging issues
   - Some tables may need manual population in test environments

3. **Metashrew Constraints**:
   - Metashrew uses an append-only database design
   - This design enables historical queries and chain reorganization handling
   - But it also leads to larger database size and potential performance issues
   - Metashrew recommends using rockshrew-mono for stability

4. **Cross-Implementation Testing**:
   - Testing both implementations together is essential
   - Need to verify that changes to one implementation don't break the other
   - Need to establish testing procedures that cover the entire stack

## Current Status

The library is currently in active development with a focus on stability, debugging, and documentation. The core functionality is implemented and working, but there are still areas that need improvement and expansion.

The Docker-based development environment is fully functional and allows for local testing and development without requiring a connection to the mainnet Bitcoin network.

Integration tests demonstrate the basic functionality of the library, including deploying and interacting with tokens on the ALKANES metaprotocol.

