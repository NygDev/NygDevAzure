# Refresh the locally-built image from the latest Structurizr source, then
# restart the container detached. Use this when you want to pick up upstream
# changes; for everyday use, `docker compose up -d --build` is enough.
docker compose build --no-cache --pull
docker compose up -d
