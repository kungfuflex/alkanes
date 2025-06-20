#!/bin/bash

# system/build.sh - Incremental build script for alkanes project components
# This script monitors directory changes and rebuilds components when needed

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
HASH_DIR="$SCRIPT_DIR/.build_hashes"
LOG_FILE="$SCRIPT_DIR/build.log"

# Component directories
BITCOIN_DIR="$SCRIPT_DIR/submodules/bitcoin"
METASHREW_DIR="$SCRIPT_DIR/submodules/metashrew"
ALKANES_RS_DIR="$SCRIPT_DIR/submodules/alkanes-rs"

# Create hash directory if it doesn't exist
mkdir -p "$HASH_DIR"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1" | tee -a "$LOG_FILE"
}

# Function to calculate directory hash (excluding build artifacts)
calculate_hash() {
    local dir="$1"
    local name="$2"
    
    if [ ! -d "$dir" ]; then
        log "ERROR: Directory $dir does not exist"
        return 1
    fi
    
    log "Calculating hash for $name..."
    
    # Calculate hash excluding common build artifacts and git files
    find "$dir" -type f \
        ! -path "*/target/*" \
        ! -path "*/build/*" \
        ! -path "*/.git/*" \
        ! -path "*/node_modules/*" \
        ! -name "*.log" \
        ! -name "*.tmp" \
        ! -name "*.swp" \
        ! -name ".DS_Store" \
        -exec sha256sum {} \; 2>/dev/null | \
    sort | \
    sha256sum | \
    cut -d' ' -f1
}

# Function to get stored hash
get_stored_hash() {
    local component="$1"
    local hash_file="$HASH_DIR/${component}.hash"
    
    if [ -f "$hash_file" ]; then
        cat "$hash_file"
    else
        echo ""
    fi
}

# Function to store hash
store_hash() {
    local component="$1"
    local hash="$2"
    local hash_file="$HASH_DIR/${component}.hash"
    
    echo "$hash" > "$hash_file"
}

# Function to check if component needs rebuild
needs_rebuild() {
    local component="$1"
    local dir="$2"
    
    local current_hash=$(calculate_hash "$dir" "$component")
    local stored_hash=$(get_stored_hash "$component")
    
    if [ "$current_hash" != "$stored_hash" ]; then
        log "$component has changes (hash: $current_hash vs stored: $stored_hash)"
        return 0  # needs rebuild
    else
        log "$component is up to date (hash: $current_hash)"
        return 1  # no rebuild needed
    fi
}

# Function to install bitcoin dependencies
install_bitcoin_deps() {
    log "Checking and installing bitcoin dependencies..."
    
    # Check if we're on Ubuntu/Debian
    if command -v apt-get >/dev/null 2>&1; then
        log "Detected apt package manager, installing dependencies..."
        
        # Update package list
        sudo apt-get update || {
            log "WARNING: Could not update package list, continuing anyway..."
        }
        
        # Install required dependencies
        sudo apt-get install -y \
            build-essential \
            cmake \
            libboost-all-dev \
            libssl-dev \
            libevent-dev \
            libdb++-dev \
            libminiupnpc-dev \
            libzmq3-dev \
            libqrencode-dev \
            libsqlite3-dev \
            pkg-config \
            autoconf \
            libtool \
            automake || {
            log "WARNING: Some dependencies may not have been installed"
        }
        
        log "Dependencies installation completed"
    else
        log "WARNING: Non-apt system detected. Please ensure the following are installed:"
        log "  - build-essential (gcc, g++, make)"
        log "  - cmake"
        log "  - libboost-all-dev (>= 1.73.0)"
        log "  - libssl-dev"
        log "  - libevent-dev"
        log "  - libdb++-dev"
        log "  - libminiupnpc-dev"
        log "  - libzmq3-dev"
        log "  - libqrencode-dev"
        log "  - libsqlite3-dev"
        log "  - pkg-config"
    fi
}

# Function to build bitcoin
build_bitcoin() {
    log "Building bitcoin..."
    
    # Install dependencies first
    install_bitcoin_deps
    
    cd "$BITCOIN_DIR"
    
    # Create build directory if it doesn't exist
    if [ ! -d "build" ]; then
        log "Creating bitcoin build directory..."
        mkdir build
    fi
    
    cd build
    
    # Run cmake if Makefile doesn't exist or if CMakeLists.txt is newer
    if [ ! -f "Makefile" ] || [ "../CMakeLists.txt" -nt "Makefile" ]; then
        log "Running cmake for bitcoin..."
        
        # Configure cmake with specific options for better compatibility
        cmake .. \
            -DCMAKE_BUILD_TYPE=Release \
            -DWITH_GUI=OFF \
            -DENABLE_WALLET=ON \
            -DWITH_QRENCODE=OFF \
            -DWITH_MINIUPNPC=OFF \
            -DWITH_ZMQ=OFF \
            -DBUILD_TESTS=OFF \
            -DBUILD_BENCH=OFF || {
            log "ERROR: cmake failed for bitcoin"
            log "This might be due to missing dependencies. Please check the error above."
            return 1
        }
    fi
    
    # Build
    log "Running make for bitcoin..."
    make -j$(nproc) || {
        log "ERROR: make failed for bitcoin"
        return 1
    }
    
    log "Bitcoin build completed successfully"
}

# Function to install rust dependencies
install_rust_deps() {
    log "Checking Rust installation and dependencies..."
    
    # Check if rustup is available and install if needed
    if ! command -v rustup >/dev/null 2>&1; then
        log "Rust not found, installing via rustup..."
        curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh -s -- -y
        source "$HOME/.cargo/env"
    fi
    
    # Ensure we have the latest stable Rust
    rustup update stable
    rustup default stable
    
    # Add wasm32 target for alkanes-rs
    rustup target add wasm32-unknown-unknown
    
    log "Rust dependencies check completed"
}

# Function to build metashrew (rockshrew-mono)
build_metashrew() {
    log "Building metashrew (rockshrew-mono)..."
    
    # Ensure Rust dependencies are available
    install_rust_deps
    
    cd "$METASHREW_DIR"
    
    # Build rockshrew-mono
    log "Running cargo build for rockshrew-mono..."
    cargo build --release -p rockshrew-mono || {
        log "ERROR: cargo build failed for rockshrew-mono"
        return 1
    }
    
    log "Metashrew build completed successfully"
}

# Function to build alkanes-rs
build_alkanes_rs() {
    log "Building alkanes-rs..."
    
    # Ensure Rust dependencies are available
    install_rust_deps
    
    cd "$ALKANES_RS_DIR"
    
    # Build alkanes-rs
    log "Running cargo build for alkanes-rs..."
    cargo build --release || {
        log "ERROR: cargo build failed for alkanes-rs"
        return 1
    }
    
    log "Alkanes-rs build completed successfully"
}

# Function to build component if needed
build_if_needed() {
    local component="$1"
    local dir="$2"
    local build_func="$3"
    
    if needs_rebuild "$component" "$dir"; then
        log "Building $component..."
        
        if $build_func; then
            local new_hash=$(calculate_hash "$dir" "$component")
            store_hash "$component" "$new_hash"
            log "$component build completed and hash stored"
        else
            log "ERROR: $component build failed"
            return 1
        fi
    else
        log "$component is up to date, skipping build"
    fi
}

# Main function
main() {
    log "Starting incremental build process..."
    log "Project root: $PROJECT_ROOT"
    log "Script directory: $SCRIPT_DIR"
    
    # Check if submodule directories exist
    if [ ! -d "$BITCOIN_DIR" ]; then
        log "ERROR: Bitcoin directory not found at $BITCOIN_DIR"
        log "Please ensure git submodules are initialized: git submodule update --init --recursive"
        exit 1
    fi
    
    if [ ! -d "$METASHREW_DIR" ]; then
        log "ERROR: Metashrew directory not found at $METASHREW_DIR"
        log "Please ensure git submodules are initialized: git submodule update --init --recursive"
        exit 1
    fi
    
    if [ ! -d "$ALKANES_RS_DIR" ]; then
        log "ERROR: Alkanes-rs directory not found at $ALKANES_RS_DIR"
        log "Please ensure git submodules are initialized: git submodule update --init --recursive"
        exit 1
    fi
    
    # Check for required tools
    if ! command -v cmake >/dev/null 2>&1; then
        log "ERROR: cmake is required but not installed"
        exit 1
    fi
    
    if ! command -v make >/dev/null 2>&1; then
        log "ERROR: make is required but not installed"
        exit 1
    fi
    
    if ! command -v cargo >/dev/null 2>&1; then
        log "ERROR: cargo is required but not installed"
        exit 1
    fi
    
    # Build components in dependency order
    build_if_needed "bitcoin" "$BITCOIN_DIR" "build_bitcoin" || exit 1
    build_if_needed "metashrew" "$METASHREW_DIR" "build_metashrew" || exit 1
    build_if_needed "alkanes-rs" "$ALKANES_RS_DIR" "build_alkanes_rs" || exit 1
    
    log "All builds completed successfully!"
}

# Handle command line arguments
case "${1:-}" in
    --force)
        log "Force rebuild requested, removing all stored hashes..."
        rm -f "$HASH_DIR"/*.hash
        main
        ;;
    --clean)
        log "Cleaning build artifacts and hashes..."
        rm -rf "$HASH_DIR"
        [ -d "$BITCOIN_DIR/build" ] && rm -rf "$BITCOIN_DIR/build"
        [ -d "$METASHREW_DIR/target" ] && rm -rf "$METASHREW_DIR/target"
        [ -d "$ALKANES_RS_DIR/target" ] && rm -rf "$ALKANES_RS_DIR/target"
        log "Clean completed"
        ;;
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Incremental build script for alkanes project components"
        echo ""
        echo "OPTIONS:"
        echo "  --force    Force rebuild all components"
        echo "  --clean    Clean all build artifacts and hashes"
        echo "  --help     Show this help message"
        echo ""
        echo "Components built:"
        echo "  - bitcoin: cd bitcoin && mkdir build && cd build && cmake .. && make"
        echo "  - metashrew: cargo build --release -p rockshrew-mono"
        echo "  - alkanes-rs: cargo build --release"
        ;;
    "")
        main
        ;;
    *)
        echo "Unknown option: $1"
        echo "Use --help for usage information"
        exit 1
        ;;
esac