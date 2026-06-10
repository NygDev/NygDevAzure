# Renders every data/<id>/workspace.dsl into the matching workspace.json on the
# running server, using the bundled `push` subcommand inside a throwaway container.
#
# The DSL files are the source of truth. The JSON the server reads is just
# regenerated output - this script rebuilds it whenever you've edited a DSL.
# Run it once after `docker compose up`, and any time you change a DSL.
#
# Each push causes the server to archive the previous JSON as
# data/<id>/workspace-<timestamp>.json. This script also prunes those archive
# files once they are older than $backupMaxAgeHours, so the data/ folder
# doesn't accumulate forever. The active workspace.json is never touched.
#
# Workspaces are discovered dynamically: every numeric data/<id>/ folder that
# contains a workspace.dsl is pushed. To add one, create the folder + DSL and
# re-run - no script edit needed.
#
# Authentication note:
#   This server runs with no authentication configured (default), so the
#   workspace API does not enforce a key. The bundled `push` command treats
#   `-key` as optional in that case - the UI surfaces this on each workspace
#   page as 'API key: (not required)'. If you later enable authentication
#   (structurizr.properties -> structurizr.authentication), pass `-key` here.

$ErrorActionPreference = 'Stop'
Set-Location -LiteralPath (Split-Path -Parent $MyInvocation.MyCommand.Path)

# In-compose DNS name reachable from the helper container; '/api' is required
# by the new push command (the old standalone structurizr-cli used the bare host).
$serverUrl = 'http://nygdev-c4:8080/api'

# Discover workspace ids: numeric folders under data/ containing a workspace.dsl.
# Non-numeric folders (themes/, export/, .structurizr/, etc.) never match, so
# they are skipped automatically.
$ids = Get-ChildItem -LiteralPath 'data' -Directory |
Where-Object { $_.Name -match '^\d+$' -and (Test-Path -LiteralPath (Join-Path $_.FullName 'workspace.dsl')) } |
ForEach-Object { [int]$_.Name } |
Sort-Object

if (-not $ids) {
    Write-Host 'No workspaces found - create data/<id>/workspace.dsl and re-run.'
    return
}
Write-Host "Discovered workspaces: $($ids -join ', ')"

# How long to keep server-generated workspace-<timestamp>.json archives.
$backupMaxAgeHours = 72

function Wait-ForServer {
    param([string]$Url = 'http://localhost:8081', [int]$TimeoutSeconds = 120)
    Write-Host "Waiting for $Url ..."
    $deadline = (Get-Date).AddSeconds($TimeoutSeconds)
    do {
        try {
            $r = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec 5 -ErrorAction Stop
            if ($r.StatusCode -ge 200 -and $r.StatusCode -lt 500) { return }
        }
        catch { }
        Start-Sleep -Seconds 2
    } while ((Get-Date) -lt $deadline)
    throw "Server at $Url did not become reachable within $TimeoutSeconds s. Is `docker compose up` running?"
}

function Invoke-StructurizrPush {
    param([int]$Id)
    $dslHostPath = "data/$Id/workspace.dsl"
    if (-not (Test-Path -LiteralPath $dslHostPath)) {
        throw "$dslHostPath does not exist - nothing to push for workspace $Id"
    }
    $dslContainerPath = "/usr/local/structurizr/$Id/workspace.dsl"

    Write-Host "Pushing workspace $Id from $dslHostPath ..."
    # `docker compose run --rm` inherits volumes (./data -> /usr/local/structurizr)
    # and network from the running service, so the bundled `push` command sees
    # the same files the server does and reaches it by service name.
    #
    # -merge true: preserve the manual layout saved on the server (views use
    # manual positioning, no autolayout) so re-pushing the DSL does not wipe it.
    docker compose run --rm `
        --entrypoint java `
        nygdev-c4 `
        -jar /app/structurizr.war push `
        -url $serverUrl `
        -id  $Id `
        -workspace $dslContainerPath `
        -merge true
    if ($LASTEXITCODE -ne 0) { throw "push for workspace $Id failed (exit $LASTEXITCODE)" }
}

function Remove-OldWorkspaceBackups {
    # Prune server-generated archive snapshots older than $MaxAgeHours. Two
    # filename patterns are produced depending on the server version:
    #   - workspace-<timestamp>.json        (current format)
    #   - structurizr-<id>-<timestamp>.json (legacy format)
    # Archive creation is disabled via data/structurizr.properties
    # (structurizr.maxWorkspaceVersions=0), so this prune is belt-and-braces.
    #
    # The active workspace.json has no hyphen-timestamp and is never matched.
    param([int]$Id, [int]$MaxAgeHours)
    $dir = "data/$Id"
    if (-not (Test-Path -LiteralPath $dir)) { return }

    $cutoff = (Get-Date).AddHours(-$MaxAgeHours)
    $patterns = @('workspace-*.json', "structurizr-$Id-*.json")
    $stale = Get-ChildItem -LiteralPath $dir -File |
    Where-Object {
        $name = $_.Name
        ($patterns | Where-Object { $name -like $_ }) -and
        $_.LastWriteTime -lt $cutoff
    }

    if (-not $stale) {
        Write-Host "No backups older than $MaxAgeHours h in $dir"
        return
    }

    foreach ($f in $stale) {
        Write-Host "Removing $($f.FullName) (last written $($f.LastWriteTime))"
        Remove-Item -LiteralPath $f.FullName -Force
    }
}

function Invoke-StructurizrExport {
    param([int]$Id)

    $dslHostPath = "data/$Id/workspace.dsl"
    if (-not (Test-Path -LiteralPath $dslHostPath)) {
        throw "$dslHostPath does not exist - nothing to export for workspace $Id"
    }

    $dslContainerPath = "/usr/local/structurizr/$Id/workspace.dsl"
    $outputHostPath = "export/$Id"
    $outputContainerPath = "/usr/local/structurizr/export/$Id"

    New-Item -ItemType Directory -Force -Path $outputHostPath | Out-Null
    Write-Host "Exporting static site for workspace $Id ..."

    docker compose run --rm `
        --entrypoint java `
        nygdev-c4 `
        -jar /app/structurizr.war export `
        -workspace $dslContainerPath `
        -format static `
        -output $outputContainerPath

    if ($LASTEXITCODE -ne 0) {
        throw "export for workspace $Id failed (exit $LASTEXITCODE)"
    }
}

Wait-ForServer
foreach ($id in $ids) {
    Invoke-StructurizrPush -Id $id
    Invoke-StructurizrExport -Id $id
    Remove-OldWorkspaceBackups -Id $id -MaxAgeHours $backupMaxAgeHours
}


Write-Host ""
Write-Host "Done. Open http://localhost:8081/workspace/<id> to verify."
