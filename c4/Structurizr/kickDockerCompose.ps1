# Build (if needed) and start the local Structurizr server in the foreground.
# First run will clone structurizr/structurizr and run `mvnw package` inside
# the builder stage; subsequent runs reuse the cached image.
docker compose up --build
