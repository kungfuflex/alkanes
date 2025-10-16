FROM rust:1.79.0 as builder

# Install git
RUN apt-get update && apt-get install -y git

# Clone the repository into a temporary directory
RUN git clone https://github.com/bitapeslabs/espo.git /espo_src

# Set up the working directory
WORKDIR /espo
RUN USER=root cargo new --bin espo
# Copy the cloned source into the cargo project directory
RUN cp -r /espo_src/. .

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