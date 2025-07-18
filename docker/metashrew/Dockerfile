# Build stage
FROM rust:1-slim-bookworm as builder

# Install build dependencies
RUN apt-get update && apt-get install -y \
    build-essential \
    git \
    pkg-config \
    libclang-dev \
    libssl-dev \
    && rm -rf /var/lib/apt/lists/*

# Clone specific commit of metashrew
WORKDIR /build
RUN git clone https://github.com/sandshrewmetaprotocols/metashrew -b v9.0.1-alpha.1 .

# Build release binary
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
COPY docker-entrypoint.sh /docker-entrypoint.sh
COPY vendor/alkanes.wasm /metashrew/indexer.wasm

# Create non-root user
RUN useradd -r -s /bin/false metashrew \
    && mkdir -p /data \
    && chown metashrew:metashrew /data /metashrew

USER metashrew
VOLUME /data

CMD ["bash", "/docker-entrypoint.sh"]
