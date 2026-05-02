using namespace System.Net

param($Request, $TriggerMetadata)

Connect-AzAccount -Identity

$context = New-AzStorageContext -StorageAccountName "nygdevcdn"
$blobs = Get-AzStorageBlob -Context $context -Container "foundry"

$mediaExtensions = "\.(jpg|jpeg|png|gif|webp|mp4|webm|mp3|ogg|wav)$"
$mediaCache = "max-age=28800"
$updated = 0

foreach ($blob in $blobs) {
    $name = $blob.Name.ToLower()
    $current = $blob.ICloudBlob.Properties.CacheControl

    if ($name -match $mediaExtensions) {
        if ($current -ne $mediaCache) {
            $blob.ICloudBlob.Properties.CacheControl = $mediaCache
            $blob.ICloudBlob.SetProperties()
            $updated++
        }
    }
    elseif ($name -match "\.html$") {
        if ($current -ne "no-cache") {
            $blob.ICloudBlob.Properties.CacheControl = "no-cache"
            $blob.ICloudBlob.SetProperties()
            $updated++
        }
    }
}

Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
    StatusCode = [HttpStatusCode]::OK
    Body       = "Cache control updated on $updated blob(s)."
})
