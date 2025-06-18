FROM ubuntu:22.04

RUN apt-get update && apt-get install -y \
    build-essential \
    cmake \
    libtool \
    autotools-dev \
    automake \
    pkg-config \
    bsdmainutils \
    python3 \
    libssl-dev \
    libevent-dev \
    libboost-system-dev \
    libboost-filesystem-dev \
    libboost-chrono-dev \
    libboost-test-dev \
    libboost-thread-dev \
    libminiupnpc-dev \
    libzmq3-dev \
    libdb-dev \
    libdb++-dev \
    libsqlite3-dev \
    git \
    ca-certificates \
    && rm -rf /var/lib/apt/lists/*

RUN groupadd -r bitcoin && useradd -r -m -g bitcoin bitcoin
RUN mkdir -p /home/bitcoin/.bitcoin && chown -R bitcoin:bitcoin /home/bitcoin/.bitcoin

WORKDIR /tmp

# Clone the repository with the reorg functionality
RUN git clone -b reorg https://github.com/kungfuflex/bitcoin.git

WORKDIR /tmp/bitcoin

# Modify MAX_OP_RETURN_RELAY to match the existing Dockerfile
RUN sed -i 's/static const unsigned int MAX_OP_RETURN_RELAY = MAX_STANDARD_TX_WEIGHT \/ WITNESS_SCALE_FACTOR;/static const unsigned int MAX_OP_RETURN_RELAY = MAX_STANDARD_TX_WEIGHT;/' src/policy/policy.h

# Build Bitcoin Core
RUN mkdir -p build && \
    cd build && \
    cmake -DBUILD_BITCOIN_WALLET=OFF -DBUILD_BITCOIN_QT=OFF .. && \
    make -j$(nproc) && \
    make install

RUN rm -rf /tmp/bitcoin

WORKDIR /home/bitcoin

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
