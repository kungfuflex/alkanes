# Build stage
FROM rust:1-slim-bookworm as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    pkg-config \
    libclang-dev \
    clang \
    llvm \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Clone specific commit of metashrew
COPY ./submodules/metashrew /build
COPY ./submodules/alkanes-rs /alkanes
WORKDIR /build

# Build release binary
RUN cargo build --release --bin rockshrew-mono
WORKDIR /alkanes
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy binary and entrypoint
COPY --from=builder /build/target/release/rockshrew-mono /usr/local/bin/
COPY --from=builder /alkanes/target/wasm32-unknown-unknown/release/alkanes.wasm /metashrew/indexer.wasm
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Create non-root user
RUN useradd -r -s /bin/false metashrew \
    && mkdir -p /data \
    && chown metashrew:metashrew /data /metashrew

USER metashrew
VOLUME /data

CMD ["bash", "/docker-entrypoint.sh"]
