param($EventGridEvent, $TriggerMetadata)

$subject = $EventGridEvent.subject
$blobName = ($subject -split '/blobs/')[1]

$mediaExtensions = "\.(jpg|jpeg|png|gif|webp|mp4|webm|mp3|ogg|wav)$"
$mediaCache      = "max-age=28800"

$targetCache = $null
if ($blobName.ToLower() -match $mediaExtensions) {
    $targetCache = $mediaCache
} elseif ($blobName.ToLower() -match "\.html$") {
    $targetCache = "no-cache"
}

if ($null -eq $targetCache) { return }

Disable-AzContextAutosave -Scope Process
Connect-AzAccount -Identity

$context = New-AzStorageContext -StorageAccountName "nygdevcdn" -UseConnectedAccount
$blob    = Get-AzStorageBlob -Context $context -Container "foundry" -Blob $blobName

$headers              = [Azure.Storage.Blobs.Models.BlobHttpHeaders]::new()
$headers.CacheControl = $targetCache
$headers.ContentType  = $blob.BlobProperties.ContentType
$null = $blob.BlobClient.SetHttpHeaders($headers)

Write-Host "Set '$targetCache' on $blobName"
