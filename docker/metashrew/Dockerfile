# Build stage
FROM rust:1-slim-bookworm as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    pkg-config \
    libclang-dev \
    libssl-dev \
    clang \
    && rm -rf /var/lib/apt/lists/*

ARG ALKANES_FEATURES=""

# Build alkanes.wasm in an isolated directory
WORKDIR /alkanes-build
COPY submodules/alkanes-rs /alkanes-build
RUN cargo build --release -p alkanes $ALKANES_FEATURES

# Build rockshrew-mono
WORKDIR /build
COPY submodules/metashrew /build
RUN cargo build --release -p rockshrew-mono

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy binary and entrypoint
COPY --from=builder /build/target/release/rockshrew-mono /usr/local/bin/
COPY docker/metashrew/docker-entrypoint.sh /docker-entrypoint.sh
COPY --from=builder /alkanes-build/target/wasm32-unknown-unknown/release/alkanes.wasm /metashrew/indexer.wasm

# Create non-root user
RUN useradd -r -s /bin/false metashrew \
    && mkdir -p /data /metashrew \
    && chown metashrew:metashrew /data /metashrew

USER metashrew
VOLUME /data

CMD ["bash", "/docker-entrypoint.sh"]
