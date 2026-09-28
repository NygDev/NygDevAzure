# Cache-Control for the Foundry media on nygdevcdn, set over the Blob REST API
# as this app's system-assigned identity.
#
# REST rather than Az.Storage, and that is most of this app's cost. Importing
# Az.Accounts and Az.Storage takes seconds on a quarter-core Flex instance
# before Connect-AzAccount has made a single call, and both functions paid it
# on every run that touched a blob — while what either of them needs is one
# token and one PUT. It also takes tens of megabytes of modules out of the
# deployment package, which the instance fetches on every cold start.
#
# Both functions share the rule and the plumbing from here, so the list of
# media extensions is written down once.

$script:Container  = 'foundry'
$script:Endpoint   = "https://nygdevcdn.blob.core.windows.net/$script:Container"
$script:ApiVersion = '2024-11-04'

$script:Token          = $null
$script:TokenExpiresAt = [DateTimeOffset]::MinValue

# The Cache-Control a blob should carry, or $null to leave it as uploaded.
# Media is cached for eight hours; HTML revalidates on every load so a changed
# page is seen at once. -match is case-insensitive, so .PNG counts.
function Get-FoundryCacheControl {
    param([Parameter(Mandatory)][string] $Name)

    if ($Name -match '\.(jpg|jpeg|png|gif|webp|mp4|webm|mp3|ogg|wav)$') { return 'max-age=28800' }
    if ($Name -match '\.html$') { return 'no-cache' }

    return $null
}

# The blob name out of a BlobCreated event's subject, or $null when the blob is
# in another container on the account — those are not this app's to touch.
function Get-FoundryBlobName {
    param([string] $Subject)

    $prefix = "/blobServices/default/containers/$script:Container/blobs/"

    if ($Subject -and $Subject.StartsWith($prefix, [StringComparison]::Ordinal)) {
        return $Subject.Substring($prefix.Length)
    }

    return $null
}

# A storage token for the app's identity, from the endpoint the platform gives
# every function app. Held for the life of the runspace, which outlives an
# invocation, so a warm instance asks for one an hour rather than one a blob.
function Get-StorageToken {
    if ($script:Token -and [DateTimeOffset]::UtcNow -lt $script:TokenExpiresAt.AddMinutes(-5)) {
        return $script:Token
    }

    if (-not $env:IDENTITY_ENDPOINT) {
        throw 'IDENTITY_ENDPOINT is not set: this runs as the function app''s managed identity and has no local fallback.'
    }

    $response = Invoke-RestMethod `
        -Uri "$($env:IDENTITY_ENDPOINT)?resource=https://storage.azure.com/&api-version=2019-08-01" `
        -Headers @{ 'X-IDENTITY-HEADER' = $env:IDENTITY_HEADER }

    $script:Token          = $response.access_token
    $script:TokenExpiresAt = [DateTimeOffset]::FromUnixTimeSeconds([long]$response.expires_on)

    return $script:Token
}

function Get-StorageHeaders {
    @{
        Authorization  = "Bearer $(Get-StorageToken)"
        'x-ms-version' = $script:ApiVersion
        'x-ms-date'    = [DateTime]::UtcNow.ToString('R')
    }
}

# Each path segment escaped on its own, so a name with a space or a '#' reaches
# the service as that name and its folders stay folders.
function Get-FoundryBlobUrl {
    param([Parameter(Mandatory)][string] $Name)

    $path = ($Name -split '/' | ForEach-Object { [Uri]::EscapeDataString($_) }) -join '/'

    return "$script:Endpoint/$path"
}

# One read of a blob's Content-Type, for an event that did not carry it.
function Get-FoundryBlobContentType {
    param([Parameter(Mandatory)][string] $Name)

    $response = Invoke-WebRequest -Method Head -Uri (Get-FoundryBlobUrl $Name) -Headers (Get-StorageHeaders)

    return $response.Headers['Content-Type'] | Select-Object -First 1
}

# Every blob in the container with the two headers the sweep compares, a page
# of up to 5000 at a time.
function Get-FoundryBlobs {
    $marker = $null

    do {
        $uri = "$($script:Endpoint)?restype=container&comp=list&maxresults=5000"

        if ($marker) { $uri += "&marker=$([Uri]::EscapeDataString($marker))" }

        $response = Invoke-WebRequest -Uri $uri -Headers (Get-StorageHeaders)

        # Loaded from the raw bytes rather than cast from .Content: the service
        # starts the body with a UTF-8 byte order mark, which the XML reader
        # understands from a stream and an [xml] cast of the string refuses.
        $response.RawContentStream.Position = 0
        $xml = [Xml.XmlDocument]::new()
        $xml.Load($response.RawContentStream)

        # The indexer rather than the adapter's dotted properties, because a
        # <Name> child and XmlElement's own Name are otherwise one typo apart.
        foreach ($blob in $xml.DocumentElement['Blobs'].ChildNodes) {
            [pscustomobject]@{
                Name         = $blob['Name'].InnerText
                CacheControl = $blob['Properties']['Cache-Control'].InnerText
                ContentType  = $blob['Properties']['Content-Type'].InnerText
            }
        }

        $marker = $xml.DocumentElement['NextMarker'].InnerText
    } while ($marker)
}

# Sets Cache-Control and Content-Type together. Set Blob Properties replaces
# every HTTP header a blob has at once, so a Content-Type left off the request
# is a Content-Type cleared — and the blob then serves as octet-stream.
#
# True when the headers were set, false when the blob has gone since whatever
# pointed at it. Anything else throws, which for the Event Grid function means a
# failed invocation that Event Grid retries.
function Set-FoundryBlobHeaders {
    param(
        [Parameter(Mandatory)][string] $Name,
        [Parameter(Mandatory)][string] $CacheControl,
        [string] $ContentType
    )

    $headers = Get-StorageHeaders
    $headers['x-ms-blob-cache-control'] = $CacheControl

    if ($ContentType) { $headers['x-ms-blob-content-type'] = $ContentType }

    $response = Invoke-WebRequest -Method Put -Uri "$(Get-FoundryBlobUrl $Name)?comp=properties" `
        -Headers $headers -SkipHttpErrorCheck

    if ($response.StatusCode -eq 404) { return $false }

    if ($response.StatusCode -ge 300) {
        throw "Setting headers on $Name failed with $($response.StatusCode): $($response.Content)"
    }

    return $true
}

Export-ModuleMember -Function Get-FoundryCacheControl, Get-FoundryBlobName, Get-FoundryBlobContentType, Get-FoundryBlobs, Set-FoundryBlobHeaders
