param($EventGridEvent, $TriggerMetadata)

Import-Module FoundryCache

# Another container on the account, or a file type that is left as uploaded.
# Both return before a token is fetched, so they cost the invocation and
# nothing else.
$name = Get-FoundryBlobName -Subject $EventGridEvent.subject
if (-not $name) { return }

$cacheControl = Get-FoundryCacheControl -Name $name
if (-not $cacheControl) { return }

# BlobCreated carries the content type the blob was written with, which is what
# saves a read in front of the write. The read is kept as a fallback because
# the write clears whatever it is not given.
$contentType = $EventGridEvent.data.contentType
if (-not $contentType) { $contentType = Get-FoundryBlobContentType -Name $name }

if (Set-FoundryBlobHeaders -Name $name -CacheControl $cacheControl -ContentType $contentType) {
    Write-Host "Set '$cacheControl' on $name"
}
else {
    Write-Host "$name was deleted before its headers could be set"
}
