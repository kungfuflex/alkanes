# System Scripts

This directory contains build and runtime scripts for the alkanes project components.

## Overview

The system directory provides three main scripts:

1. **`build.sh`** - Incremental building for all components
2. **`start.sh`** - Start development environment in tmux
3. **`stop.sh`** - Stop all running services

### Components

1. **Bitcoin** - Bitcoin Core with CMake build system
2. **Metashrew** - Blockchain indexer framework (rockshrew-mono package)
3. **Alkanes-RS** - ALKANES metaprotocol implementation in Rust

## Quick Start

```bash
# 1. Build all components
./system/build.sh

# 2. Start development environment
./system/start.sh

# 3. Stop all services
./system/stop.sh
```

## Build Script Features

- **Incremental builds**: Only rebuilds components when source files change
- **Hash-based change detection**: Uses SHA256 hashes to detect changes
- **Dependency management**: Automatically installs required dependencies on Ubuntu/Debian
- **Logging**: Comprehensive logging of all build activities
- **Clean builds**: Options to force rebuild or clean all artifacts

## Development Environment Features

- **Tmux session management**: All services run in organized tmux windows
- **Automatic service startup**: Bitcoin, Metashrew, and JSON-RPC start in sequence
- **Data persistence**: All data stored in `$HOME/.alkanes/`
- **Port management**: Services run on standard development ports
- **Process cleanup**: Clean shutdown of all services

## Usage

### Building Components

```bash
# Run incremental build (only builds changed components)
./system/build.sh

# Force rebuild all components
./system/build.sh --force

# Clean all build artifacts and hashes
./system/build.sh --clean

# Show help
./system/build.sh --help
```

### Development Environment

```bash
# Start all services in tmux
./system/start.sh

# Start and attach to session
./system/start.sh --attach

# Check session status
./system/start.sh --status

# Stop all services
./system/stop.sh

# Force stop all processes
./system/stop.sh --force
```

### Service Endpoints

Once started, the following services are available:

- **Bitcoin RPC**: `http://localhost:18443` (user: `bitcoinrpc`, pass: `bitcoinrpc`)
- **Metashrew API**: `http://localhost:8096`
- **JSON-RPC API**: `http://localhost:18888`

### Tmux Session Management

```bash
# Attach to running session
tmux attach-session -t alkanes

# List windows
tmux list-windows -t alkanes

# Switch between windows (inside tmux)
Ctrl+b + 0  # Bitcoin window
Ctrl+b + 1  # Metashrew window
Ctrl+b + 2  # JSON-RPC window

# Detach from session
Ctrl+b + d
```

### Build Process

The script builds components in dependency order:

1. **Bitcoin**: 
   - Installs dependencies (boost, cmake, etc.)
   - Creates `build/` directory
   - Runs `cmake ..` with optimized settings
   - Runs `make -j$(nproc)`

2. **Metashrew**:
   - Ensures Rust toolchain is installed
   - Runs `cargo build --release -p rockshrew-mono`

3. **Alkanes-RS**:
   - Ensures Rust toolchain and wasm32 target
   - Runs `cargo build --release`

### Dependencies

The script automatically handles dependency installation on Ubuntu/Debian systems:

#### Bitcoin Dependencies
- build-essential (gcc, g++, make)
- cmake
- libboost-all-dev (>= 1.73.0)
- libssl-dev
- libevent-dev
- libdb++-dev
- libminiupnpc-dev
- libzmq3-dev
- libqrencode-dev
- libsqlite3-dev
- pkg-config

#### Rust Dependencies
- Rust toolchain (installed via rustup if not present)
- wasm32-unknown-unknown target

#### Node.js Dependencies
- Node.js (installed via nvm if not present)
- pnpm and yarn (installed globally via npm)

### Hash Storage

The script stores SHA256 hashes of each component's source files in:
```
system/.build_hashes/
├── bitcoin.hash
├── metashrew.hash
└── alkanes-rs.hash
```

### Logs

Build logs are stored in:
```
system/build.log
```

## Data Storage

All persistent data is stored in `$HOME/.alkanes/`:

```
$HOME/.alkanes/
├── bitcoin/              # Bitcoin regtest data
│   ├── regtest/
│   │   ├── blocks/
│   │   ├── chainstate/
│   │   └── ...
└── metashrew/            # Metashrew indexer data
    ├── rocksdb/
    └── ...
```

## Troubleshooting

### Common Issues

**Tmux session already exists**:
```bash
./system/stop.sh
./system/start.sh
```

**Port conflicts**:
```bash
# Check what's using the ports
lsof -i :18443  # Bitcoin
lsof -i :8096   # Metashrew
lsof -i :18888  # JSON-RPC

# Force stop everything
./system/stop.sh --force
```

**Build failures**:
```bash
# Clean and rebuild
./system/build.sh --clean
./system/build.sh --force
```

### Bitcoin Build Issues

If Bitcoin build fails with Boost errors:
```bash
# Install Boost manually
sudo apt-get update
sudo apt-get install libboost-all-dev

# Force rebuild
./system/build.sh --force
```

### Rust Build Issues

If Rust builds fail:
```bash
# Update Rust toolchain
rustup update stable
rustup target add wasm32-unknown-unknown

# Force rebuild
./system/build.sh --force
```

### Permission Issues

If you get permission errors:
```bash
# Make scripts executable
chmod +x system/build.sh system/start.sh system/stop.sh

# For dependency installation, ensure sudo access
sudo -v
```

### Missing Dependencies

The build script will attempt to install them automatically:
```bash
./system/build.sh
```

### Node.js Issues

If Node.js is not found, the start script will install it automatically via nvm:
```bash
# Manual installation if needed
bash -c 'git clone https://github.com/nvm-sh/nvm ~/.nvm; bash ~/.nvm/install.sh; source ~/.nvm/nvm.sh; nvm install node; npm install -g pnpm yarn'

# Then restart your shell or source nvm
source ~/.nvm/nvm.sh
```

## File Structure

```
system/
├── build.sh              # Main build script
├── start.sh              # Start development environment
├── stop.sh               # Stop all services
├── README.md             # This file
├── .build_hashes/        # Hash storage (created automatically)
│   ├── bitcoin.hash
│   ├── metashrew.hash
│   └── alkanes-rs.hash
├── build.log             # Build logs
└── submodules/           # Git submodules
    ├── bitcoin/          # Bitcoin Core source
    ├── metashrew/        # Metashrew indexer source
    └── alkanes-rs/       # Alkanes-RS source
```

## Integration

These scripts are designed to work with the broader alkanes project development workflow. They can be integrated into:

- CI/CD pipelines
- Development scripts
- Docker builds
- Local development environments
- IDE integration

## Contributing

When modifying these scripts:

1. Test on a clean Ubuntu system
2. Ensure all three components build successfully
3. Verify the tmux session starts correctly
4. Test service connectivity
5. Update this README if adding new features