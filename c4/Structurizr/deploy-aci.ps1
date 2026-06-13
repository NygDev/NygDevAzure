# Deploy nygdev-c4 (Structurizr server) to an Azure Container Instance — PoC.
#
# ACI cannot run a locally-built image; it pulls from a registry. So we push the
# image into an Azure Container Registry (ACR), then run ACI from it, mounting the
# existing 'tempcontainerc4' storage account as a file share for workspace data.
#
# Persistence note: the file share works for workspace.json / layout / archives,
# but NOT for Structurizr's Lucene search index (mmap + file locking don't work
# over SMB). We disable search (structurizr.search=none) via JAVA_OPTS so the
# share mount is clean. Trade-off: the in-app search box returns nothing —
# fine for single-workspace internal tooling.
#
# Prereqs: az CLI logged in (`az login`), and for Option B a local Docker daemon.

$ErrorActionPreference = "Stop"

# ---- variables ----
$rg      = "rg-tempcontainerc4"     # RG your storage account lives in
$loc     = "norwayeast"
$acr     = "tempcontainerc4acr"     # globally unique, lowercase alnum, <=50 chars
$img     = "nygdev-c4:v2026.05.16"
$storage = "tempcontainerc4"
$share   = "structurizr-data"
$aci     = "nygdev-c4"
$dns     = "tempcontainerc4-poc"    # -> http://tempcontainerc4-poc.norwayeast.azurecontainer.io:8080
$src     = "D:\repositories\NygDevAzure\c4\Structurizr"   # folder with the Dockerfile

az group create -n $rg -l $loc      # no-op if it already exists

# ---- 1. registry ----
az acr create -g $rg -n $acr --sku Basic --admin-enabled true -l $loc

# ---- 2a. OPTION A: build in the cloud, nothing uploaded from desktop ----
az acr build -r $acr -t $img `
  --build-arg STRUCTURIZR_REF=v2026.05.16 `
  --build-arg APP_REVISION=1.0.0 `
  $src

# ---- 2b. OPTION B: build locally + push from desktop (use instead of 2a) ----
# docker build -t "$acr.azurecr.io/$img" `
#   --build-arg STRUCTURIZR_REF=v2026.05.16 --build-arg APP_REVISION=1.0.0 $src
# az acr login -n $acr
# docker push "$acr.azurecr.io/$img"

# ---- 3. file share for persistence ----
$key = az storage account keys list -g $rg -n $storage --query "[0].value" -o tsv
az storage share create --account-name $storage --account-key $key -n $share | Out-Null

# ---- 4. registry creds ----
$acrUser = az acr credential show -n $acr --query username -o tsv
$acrPass = az acr credential show -n $acr --query "passwords[0].value" -o tsv

# ---- 5. container instance (single create: mount + search disabled) ----
# If re-deploying, delete the old instance first:
#   az container delete -g $rg -n $aci -y
az container create -g $rg -n $aci -l $loc `
  --image "$acr.azurecr.io/$img" `
  --registry-login-server "$acr.azurecr.io" `
  --registry-username $acrUser --registry-password $acrPass `
  --cpu 1 --memory 2 `
  --ports 8080 --dns-name-label $dns `
  --os-type Linux --restart-policy OnFailure `
  --environment-variables JAVA_OPTS="-Dstructurizr.search=none" `
  --azure-file-volume-account-name $storage `
  --azure-file-volume-account-key $key `
  --azure-file-volume-share-name $share `
  --azure-file-volume-mount-path /usr/local/structurizr

# ---- result + verify ----
$fqdn = az container show -g $rg -n $aci --query "ipAddress.fqdn" -o tsv
Write-Host "Structurizr is at: http://$fqdn`:8080"

# State / port / restart count (state is briefly null right after create):
az container show -g $rg -n $aci `
  --query "{state:instanceView.currentState.state, fqdn:ipAddress.fqdn, ip:ipAddress.ip, ports:ipAddress.ports, restarts:containers[0].instanceView.restartCount}" -o jsonc

# Boot log — config dump should now show 'structurizr.search: none'.
# (Console logging stops after the 'Themes:' banner because Structurizr switches
# to file logging; that's normal, not a hang. Verify the socket directly:
#   curl.exe -v http://$fqdn`:8080/  )
az container logs -g $rg -n $aci

# Lifecycle:
#   az container restart -g $rg -n $aci
#   az container delete  -g $rg -n $aci -y
