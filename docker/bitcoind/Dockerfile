FROM ruimarinho/bitcoin-core:24.0.1-alpine

USER root
RUN apk add --no-cache curl

COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh
RUN chmod +x /usr/local/bin/docker-entrypoint.sh

ENTRYPOINT ["/usr/local/bin/docker-entrypoint.sh"]
