using namespace System.Net
using namespace Azure.Storage.Blobs.Models

param($Request, $TriggerMetadata)

Disable-AzContextAutosave -Scope Process
Connect-AzAccount -Identity

$context = New-AzStorageContext -StorageAccountName "nygdevcdn" -UseConnectedAccount
$blobs   = Get-AzStorageBlob -Context $context -Container "foundry"

$mediaExtensions = "\.(jpg|jpeg|png|gif|webp|mp4|webm|mp3|ogg|wav)$"
$mediaCache      = "max-age=28800"
$updated         = 0

foreach ($blob in $blobs) {
    $name = $blob.Name.ToLower()

    $targetCache = $null
    if ($name -match $mediaExtensions) {
        $targetCache = $mediaCache
    } elseif ($name -match "\.html$") {
        $targetCache = "no-cache"
    }

    if ($null -ne $targetCache -and $blob.BlobProperties.CacheControl -ne $targetCache) {
        $headers             = [BlobHttpHeaders]::new()
        $headers.CacheControl = $targetCache
        $headers.ContentType  = $blob.BlobProperties.ContentType
        $null = $blob.BlobClient.SetHttpHeaders($headers)
        $updated++
    }
}

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body       = "Cache control updated on $updated blob(s)."
})
