# NygDev C4 (Structurizr)

C4 model of the NygDevAzure estate, authored as Structurizr DSL and served by a
local Structurizr container. **The `.dsl` files are the source of truth;** the
`workspace.json` the server reads is regenerated output.

Same setup as the IAM\C4 repo, but a fully independent instance: its own image
(`nygdev-c4`), its own container, and host port **8081** so both servers can
run side by side.

## Workspaces

Each workspace lives in a numbered folder under `data/<id>/`. The numeric id is
required by Structurizr (the server and the push script key off it). None are
authored yet — to add the first one:

1. Create `data/1/workspace.dsl`.
2. Run `./updateWorkspaces.ps1` — it discovers every numeric `data/<id>/`
   folder containing a `workspace.dsl`, so no script edit is needed.

The Azure icon set is already in place under `data/themes/Azure/` and can be
referenced from DSL styles via relative paths (`../themes/Azure/...`).

## Build / run

```powershell
# Bring the server up (http://localhost:8081)
docker compose up -d --build

# Render every data/<id>/workspace.dsl into its workspace.json on the server,
# export static sites, and prune old archive snapshots. Re-run after any DSL edit.
./updateWorkspaces.ps1
```

Open `http://localhost:8081/workspace/<id>` to view. The push uses
`-merge true`, so manual diagram layout saved on the server is preserved
across re-pushes.

Helper scripts: `kickDockerCompose.ps1` runs the server in the foreground;
`kickDockerUpdate.ps1` rebuilds the image from the latest upstream source
(`--no-cache --pull`) and restarts detached. The Structurizr release is pinned
in `docker-compose.yml` via `STRUCTURIZR_REF` (currently `v2026.05.16`).

## Layout

```
Structurizr/
  docker-compose.yml          # nygdev-c4 service -> :8081, mounts ./data
  Dockerfile                  # builds Structurizr server from source
  updateWorkspaces.ps1        # push + export + prune (DSL -> JSON)
  kickDockerCompose.ps1
  kickDockerUpdate.ps1
  data/
    structurizr.properties    # server config (archiving disabled)
    themes/Azure/             # SVG icon set referenced by styles
    <id>/                     # one folder per workspace: workspace.dsl is the source
  export/                     # generated static sites
```
