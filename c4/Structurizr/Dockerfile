# syntax=docker/dockerfile:1.7
#
# Builds the open-core Structurizr server from source.
# Source: https://github.com/structurizr/structurizr
# Docs:   https://docs.structurizr.com/building
#         https://docs.structurizr.com/server
#
# Usage (from a docker-compose.yml in the same folder):
#   docker compose up -d --build
#
# Build-time arguments (override via `--build-arg` or in compose):
#   STRUCTURIZR_REF  Git ref to build (branch or tag, e.g. v2026.02.01). Defaults to main.
#   APP_REVISION     Value passed as -Dapp.revision. Also determines the WAR filename.
#                    Defaults to 1.0.0 to match the project default.
#
# The build clones the repo on every image build. Use `--build-arg STRUCTURIZR_REF=<tag>`
# to pin a reproducible release.

ARG STRUCTURIZR_REF=main
ARG APP_REVISION=1.0.0

# ---------------------------------------------------------------------------
# Stage 1 - build the WAR with the bundled Maven wrapper
# ---------------------------------------------------------------------------
FROM eclipse-temurin:21-jdk AS builder

ARG STRUCTURIZR_REF
ARG APP_REVISION

RUN apt-get update \
 && apt-get install -y --no-install-recommends git ca-certificates \
 && rm -rf /var/lib/apt/lists/*

WORKDIR /src

# Shallow clone the requested ref so the image build stays fast.
RUN git clone --depth 1 --branch "${STRUCTURIZR_REF}" \
        https://github.com/structurizr/structurizr.git . \
 && git rev-parse HEAD > /src/.git-sha

# Build the consolidated WAR (server + local + export + cli commands).
# Integration tests need a Docker-in-Docker setup, so they are excluded; the
# remaining unit tests are run as a sanity check.
RUN ./mvnw -B -ntp \
        -DexcludedGroups=IntegrationTest \
        -Dapp.revision="${APP_REVISION}" \
        package

# Normalise the artifact name so the runtime stage doesn't need to know the version.
RUN cp structurizr-application/target/structurizr-${APP_REVISION}.war /tmp/structurizr.war

# ---------------------------------------------------------------------------
# Stage 2 - slim runtime
# ---------------------------------------------------------------------------
FROM eclipse-temurin:21-jre-alpine AS runtime

ARG APP_REVISION

LABEL org.opencontainers.image.title="structurizr-server" \
      org.opencontainers.image.description="Open-core Structurizr server, built from source" \
      org.opencontainers.image.source="https://github.com/structurizr/structurizr" \
      org.opencontainers.image.licenses="MIT"

ENV STRUCTURIZR_DATA_DIRECTORY=/usr/local/structurizr \
    JAVA_OPTS="" \
    PORT=8080

RUN addgroup -S structurizr \
 && adduser -S -G structurizr -h "${STRUCTURIZR_DATA_DIRECTORY}" structurizr \
 && mkdir -p "${STRUCTURIZR_DATA_DIRECTORY}" \
 && chown -R structurizr:structurizr "${STRUCTURIZR_DATA_DIRECTORY}"

COPY --from=builder /tmp/structurizr.war        /app/structurizr.war
COPY --from=builder /src/.git-sha               /app/.git-sha

USER structurizr
WORKDIR ${STRUCTURIZR_DATA_DIRECTORY}
EXPOSE 8080
VOLUME ["/usr/local/structurizr"]

# `server` is the consolidated subcommand; the data directory is passed positionally.
# JAVA_OPTS allows callers to inject -Xmx, -Dserver.port, etc. without rebuilding.
ENTRYPOINT ["sh", "-c", "exec java ${JAVA_OPTS} -jar /app/structurizr.war server /usr/local/structurizr"]
