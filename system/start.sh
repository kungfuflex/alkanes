#!/bin/bash

# system/start.sh - Start alkanes development environment in tmux
# This script creates a tmux session with bitcoin, metashrew, and jsonrpc services

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
SESSION_NAME="alkanes"
DATA_DIR="$HOME/.alkanes"

# Paths to binaries
BITCOIN_BIN="$SCRIPT_DIR/submodules/bitcoin/build/bin/bitcoind"
METASHREW_BIN="$SCRIPT_DIR/submodules/metashrew/target/release/rockshrew-mono"
ALKANES_WASM="$SCRIPT_DIR/submodules/alkanes-rs/target/wasm32-unknown-unknown/release/alkanes.wasm"
JSONRPC_BIN="$PROJECT_ROOT/jsonrpc/bin/jsonrpc.js"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if tmux session exists
session_exists() {
    tmux has-session -t "$SESSION_NAME" 2>/dev/null
}

# Function to check if binary exists
check_binary() {
    local binary="$1"
    local name="$2"
    
    if [ ! -f "$binary" ]; then
        log "ERROR: $name binary not found at $binary"
        log "Please run ./system/build.sh first to build all components"
        return 1
    fi
    
    if [ ! -x "$binary" ]; then
        log "ERROR: $name binary at $binary is not executable"
        return 1
    fi
    
    log "$name binary found at $binary"
}

# Function to install Node.js via nvm
install_nodejs() {
    log "Installing Node.js via nvm..."
    
    # Install nvm and Node.js
    bash -c 'git clone https://github.com/nvm-sh/nvm ~/.nvm || true; bash ~/.nvm/install.sh; source ~/.nvm/nvm.sh; nvm install node; nvm use node; npm install -g pnpm yarn' || {
        log "ERROR: Failed to install Node.js via nvm"
        return 1
    }
    
    # Source nvm for current session
    export NVM_DIR="$HOME/.nvm"
    [ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh"
    [ -s "$NVM_DIR/bash_completion" ] && \. "$NVM_DIR/bash_completion"
    
    log "Node.js installed successfully via nvm"
}

# Function to create data directories
create_data_dirs() {
    log "Creating data directories..."
    
    mkdir -p "$DATA_DIR/bitcoin"
    mkdir -p "$DATA_DIR/metashrew"
    
    log "Data directories created at $DATA_DIR"
}

# Function to kill existing session
kill_session() {
    if session_exists; then
        log "Killing existing tmux session '$SESSION_NAME'..."
        tmux kill-session -t "$SESSION_NAME"
        sleep 2
    fi
}

# Function to start bitcoin window
start_bitcoin() {
    log "Starting bitcoin window..."
    
    # Create bitcoin window
    tmux new-window -t "$SESSION_NAME" -n "bitcoin" -c "$SCRIPT_DIR"
    
    # Start bitcoind with required flags
    tmux send-keys -t "$SESSION_NAME:bitcoin" \
        "$BITCOIN_BIN -txindex -regtest=1 -printtoconsole -rpcallowip=0.0.0.0/0 -rpcbind=0.0.0.0 -rpcuser=bitcoinrpc -rpcpassword=bitcoinrpc -datadir=$DATA_DIR/bitcoin" \
        Enter
    
    log "Bitcoin started in tmux window 'bitcoin'"
}

# Function to start metashrew window
start_metashrew() {
    log "Starting metashrew window..."
    
    # Create metashrew window
    tmux new-window -t "$SESSION_NAME" -n "metashrew" -c "$SCRIPT_DIR"
    
    # Set environment and start rockshrew-mono
    tmux send-keys -t "$SESSION_NAME:metashrew" \
        "export RUST_LOG=debug" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:metashrew" \
        "$METASHREW_BIN --db-path $DATA_DIR/metashrew --daemon-rpc-url http://localhost:18443 --auth bitcoinrpc:bitcoinrpc --indexer $ALKANES_WASM --host 0.0.0.0 --port 8096 --start-block 0" \
        Enter
    
    log "Metashrew started in tmux window 'metashrew'"
}

# Function to start jsonrpc window
start_jsonrpc() {
    log "Starting jsonrpc window..."
    
    # Create jsonrpc window
    tmux new-window -t "$SESSION_NAME" -n "jsonrpc" -c "$PROJECT_ROOT/jsonrpc"
    
    # Set environment variables and start jsonrpc
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export HOST=0.0.0.0" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export RPCUSER=bitcoinrpc" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export RPCPASSWORD=bitcoinrpc" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export DAEMON_RPC_ADDR=localhost:18443" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export ORD_HOST=localhost" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export ORD_PORT=8090" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export ESPLORA_HOST=localhost" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export ESPLORA_PORT=50010" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export METASHREW_URI=http://localhost:8096" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "export PORT=18888" \
        Enter
    
    tmux send-keys -t "$SESSION_NAME:jsonrpc" \
        "node bin/jsonrpc.js" \
        Enter
    
    log "JSON-RPC started in tmux window 'jsonrpc'"
}

# Function to show session info
show_info() {
    log "Alkanes development environment started successfully!"
    log ""
    log "Tmux session: $SESSION_NAME"
    log "Windows:"
    log "  - bitcoin:  Bitcoin Core (regtest mode)"
    log "  - metashrew: Metashrew indexer"
    log "  - jsonrpc:   JSON-RPC server"
    log ""
    log "Services:"
    log "  - Bitcoin RPC:     http://localhost:18443 (user: bitcoinrpc, pass: bitcoinrpc)"
    log "  - Metashrew API:   http://localhost:8096"
    log "  - JSON-RPC API:    http://localhost:18888"
    log ""
    log "Data directories:"
    log "  - Bitcoin:   $DATA_DIR/bitcoin"
    log "  - Metashrew: $DATA_DIR/metashrew"
    log ""
    log "To attach to the session: tmux attach-session -t $SESSION_NAME"
    log "To list windows: tmux list-windows -t $SESSION_NAME"
    log "To switch windows: Ctrl+b then window number (0, 1, 2)"
    log "To stop all services: ./system/stop.sh"
}

# Main function
main() {
    log "Starting alkanes development environment..."
    
    # Check if tmux is installed
    if ! command -v tmux >/dev/null 2>&1; then
        log "ERROR: tmux is required but not installed"
        log "Install with: sudo apt-get install tmux"
        exit 1
    fi
    
    # Check if Node.js is available for jsonrpc
    if ! command -v node >/dev/null 2>&1; then
        log "Node.js not found, installing via nvm..."
        install_nodejs
    fi
    
    # Check if all binaries exist
    check_binary "$BITCOIN_BIN" "Bitcoin" || exit 1
    check_binary "$METASHREW_BIN" "Metashrew" || exit 1
    
    if [ ! -f "$ALKANES_WASM" ]; then
        log "ERROR: Alkanes WASM not found at $ALKANES_WASM"
        log "Please run ./system/build.sh first to build all components"
        exit 1
    fi
    
    if [ ! -f "$JSONRPC_BIN" ]; then
        log "ERROR: JSON-RPC binary not found at $JSONRPC_BIN"
        log "Please ensure the jsonrpc directory exists and contains bin/jsonrpc.js"
        exit 1
    fi
    
    # Create data directories
    create_data_dirs
    
    # Kill existing session if it exists
    kill_session
    
    # Create new tmux session (detached)
    log "Creating tmux session '$SESSION_NAME'..."
    tmux new-session -d -s "$SESSION_NAME" -c "$SCRIPT_DIR"
    
    # Start bitcoin in the first window
    tmux rename-window -t "$SESSION_NAME:0" "bitcoin"
    tmux send-keys -t "$SESSION_NAME:bitcoin" \
        "$BITCOIN_BIN -txindex -regtest=1 -printtoconsole -rpcallowip=0.0.0.0/0 -rpcbind=0.0.0.0 -rpcuser=bitcoinrpc -rpcpassword=bitcoinrpc -datadir=$DATA_DIR/bitcoin" \
        Enter
    
    # Wait for bitcoin to start
    log "Waiting 10 seconds for bitcoin to initialize..."
    sleep 10
    
    # Start metashrew
    start_metashrew
    
    # Wait a bit for metashrew to start
    log "Waiting 5 seconds for metashrew to initialize..."
    sleep 5
    
    # Start jsonrpc
    start_jsonrpc
    
    # Show information
    show_info
}

# Handle command line arguments
case "${1:-}" in
    --attach)
        if session_exists; then
            log "Attaching to existing session '$SESSION_NAME'..."
            tmux attach-session -t "$SESSION_NAME"
        else
            log "No session '$SESSION_NAME' found. Starting new session..."
            main
            tmux attach-session -t "$SESSION_NAME"
        fi
        ;;
    --status)
        if session_exists; then
            log "Session '$SESSION_NAME' is running"
            tmux list-windows -t "$SESSION_NAME"
        else
            log "Session '$SESSION_NAME' is not running"
            exit 1
        fi
        ;;
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Start alkanes development environment in tmux"
        echo ""
        echo "OPTIONS:"
        echo "  --attach   Start and attach to session (or attach if already running)"
        echo "  --status   Show session status"
        echo "  --help     Show this help message"
        echo ""
        echo "Services started:"
        echo "  - Bitcoin Core (regtest) on port 18443"
        echo "  - Metashrew indexer on port 8096"
        echo "  - JSON-RPC server on port 18888"
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
