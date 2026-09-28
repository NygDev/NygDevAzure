using namespace System.Net

param($Request, $TriggerMetadata)

Import-Module FoundryCache

# The sweep: every blob in the container brought in line with the same rule the
# Event Grid function applies on upload, for anything that predates it or
# slipped past it.
try {
    $updated = 0

    foreach ($blob in Get-FoundryBlobs) {
        $cacheControl = Get-FoundryCacheControl -Name $blob.Name

        if ($cacheControl -and $blob.CacheControl -ne $cacheControl) {
            if (Set-FoundryBlobHeaders -Name $blob.Name -CacheControl $cacheControl -ContentType $blob.ContentType) {
                $updated++
            }
        }
    }

    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
        StatusCode = [HttpStatusCode]::OK
        Body       = "Cache control updated on $updated blob(s)."
    })
}
catch {
    Push-OutputBinding -Name Response -Value ([HttpResponseContext]@{
        StatusCode = [HttpStatusCode]::InternalServerError
        Body       = "Error: $($_.Exception.Message) | Stack: $($_.ScriptStackTrace)"
    })
}
