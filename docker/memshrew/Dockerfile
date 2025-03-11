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
RUN git clone https://github.com/sandshrewmetaprotocols/metashrew.git . \
    && git checkout 34eaed247d3912a32db10dbfcb3e0f40f9c5527b

# Build release binary
RUN cargo build --release --bin memshrew-p2p

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy binary and entrypoint
COPY --from=builder /build/target/release/memshrew-p2p /usr/local/bin/
COPY docker-entrypoint.sh /docker-entrypoint.sh

# Create non-root user
RUN useradd -r -s /bin/false metashrew \
    && mkdir -p /data \
    && mkdir -p /metashrew \
    && chown metashrew:metashrew /data /metashrew

USER metashrew
VOLUME /data

CMD ["bash", "/docker-entrypoint.sh"]
