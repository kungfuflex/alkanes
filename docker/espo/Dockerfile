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

# Switch to a nightly toolchain that supports edition 2024
RUN rustup default nightly

# Clone espo repository
WORKDIR /build
RUN git clone https://github.com/bitapeslabs/espo.git .

# Build release binary
RUN cargo build --release

# Runtime stage
FROM debian:bookworm-slim

# Install runtime dependencies
RUN apt-get update && apt-get install -y \
    libssl3 \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

# Copy binary
COPY --from=builder /build/target/release/espo /usr/local/bin/

# Create non-root user
RUN useradd -r -s /bin/false espo \
    && mkdir -p /data \
    && chown espo:espo /data

USER espo
VOLUME /data

EXPOSE 8081
ENTRYPOINT ["/usr/local/bin/espo"]