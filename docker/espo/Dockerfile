FROM rust:1.79.0 as builder

RUN USER=root cargo new --bin espo
WORKDIR /espo

# Clone the repository
RUN apt-get update && apt-get install -y git && \
    git clone https://github.com/bitapeslabs/espo.git .

# Build the binary
RUN cargo build --release

# Final stage
FROM debian:bullseye-slim

# Copy the built binary from the builder stage
COPY --from=builder /espo/target/release/espo /usr/local/bin/espo

# Install any runtime dependencies
RUN apt-get update && apt-get install -y ca-certificates && rm -rf /var/lib/apt/lists/*

# Set up a non-root user
RUN useradd -ms /bin/bash user
USER user
WORKDIR /home/user

# Expose the default port (adjust if needed)
EXPOSE 8081

# Set the entrypoint
ENTRYPOINT ["/usr/local/bin/espo"]