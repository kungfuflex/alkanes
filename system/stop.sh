#!/bin/bash

# system/stop.sh - Stop alkanes development environment
# This script stops the tmux session and all running services

set -e

# Configuration
SESSION_NAME="alkanes"

# Logging function
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Function to check if tmux session exists
session_exists() {
    tmux has-session -t "$SESSION_NAME" 2>/dev/null
}

# Function to kill processes by port
kill_by_port() {
    local port="$1"
    local name="$2"
    
    local pid=$(lsof -ti:$port 2>/dev/null || true)
    if [ -n "$pid" ]; then
        log "Killing $name process on port $port (PID: $pid)..."
        kill -TERM $pid 2>/dev/null || true
        sleep 2
        # Force kill if still running
        if kill -0 $pid 2>/dev/null; then
            log "Force killing $name process..."
            kill -KILL $pid 2>/dev/null || true
        fi
    fi
}

# Main function
main() {
    log "Stopping alkanes development environment..."
    
    if session_exists; then
        log "Killing tmux session '$SESSION_NAME'..."
        tmux kill-session -t "$SESSION_NAME"
        log "Session '$SESSION_NAME' stopped successfully"
    else
        log "Session '$SESSION_NAME' is not running"
    fi
    
    # Also kill any remaining processes on known ports
    log "Checking for remaining processes on known ports..."
    kill_by_port 18443 "Bitcoin"
    kill_by_port 8096 "Metashrew"
    kill_by_port 18888 "JSON-RPC"
    
    # Kill any remaining bitcoind processes
    local bitcoin_pids=$(pgrep -f "bitcoind.*regtest" 2>/dev/null || true)
    if [ -n "$bitcoin_pids" ]; then
        log "Killing remaining bitcoind processes..."
        echo "$bitcoin_pids" | xargs kill -TERM 2>/dev/null || true
        sleep 2
        # Force kill if still running
        bitcoin_pids=$(pgrep -f "bitcoind.*regtest" 2>/dev/null || true)
        if [ -n "$bitcoin_pids" ]; then
            echo "$bitcoin_pids" | xargs kill -KILL 2>/dev/null || true
        fi
    fi
    
    # Kill any remaining rockshrew-mono processes
    local metashrew_pids=$(pgrep -f "rockshrew-mono" 2>/dev/null || true)
    if [ -n "$metashrew_pids" ]; then
        log "Killing remaining metashrew processes..."
        echo "$metashrew_pids" | xargs kill -TERM 2>/dev/null || true
        sleep 2
        # Force kill if still running
        metashrew_pids=$(pgrep -f "rockshrew-mono" 2>/dev/null || true)
        if [ -n "$metashrew_pids" ]; then
            echo "$metashrew_pids" | xargs kill -KILL 2>/dev/null || true
        fi
    fi
    
    # Kill any remaining jsonrpc processes
    local jsonrpc_pids=$(pgrep -f "jsonrpc.js" 2>/dev/null || true)
    if [ -n "$jsonrpc_pids" ]; then
        log "Killing remaining JSON-RPC processes..."
        echo "$jsonrpc_pids" | xargs kill -TERM 2>/dev/null || true
        sleep 2
        # Force kill if still running
        jsonrpc_pids=$(pgrep -f "jsonrpc.js" 2>/dev/null || true)
        if [ -n "$jsonrpc_pids" ]; then
            echo "$jsonrpc_pids" | xargs kill -KILL 2>/dev/null || true
        fi
    fi
    
    log "All alkanes services stopped"
}

# Handle command line arguments
case "${1:-}" in
    --force)
        log "Force stopping all processes..."
        # Kill processes more aggressively
        pkill -f "bitcoind.*regtest" 2>/dev/null || true
        pkill -f "rockshrew-mono" 2>/dev/null || true
        pkill -f "jsonrpc.js" 2>/dev/null || true
        
        if session_exists; then
            tmux kill-session -t "$SESSION_NAME"
        fi
        
        log "Force stop completed"
        ;;
    --help|-h)
        echo "Usage: $0 [OPTIONS]"
        echo ""
        echo "Stop alkanes development environment"
        echo ""
        echo "OPTIONS:"
        echo "  --force    Force kill all processes"
        echo "  --help     Show this help message"
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