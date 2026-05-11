# Test-Function.ps1
# Acquires a delegated token via the OAuth2 device code flow against the
# nygdev-logger app registration, then POSTs it to the HttpTrigger function.
# No modules required - pure Invoke-RestMethod.

$ErrorActionPreference = 'Stop'

# --- Config ---------------------------------------------------------------
$TenantId    = '0533c1fa-9751-48df-b526-d82df80a8797'
$ClientId    = 'b871e062-cdbf-417c-8e91-6d23d0189ce5'    # nygdev-logger app reg
$Scope       = 'api://b871e062-cdbf-417c-8e91-6d23d0189ce5/user_impersonation offline_access'
$FunctionUrl = 'https://func-nygdev-logger.azurewebsites.net/api/HttpTrigger?code=8S5pkBRGisT9B7szi7U4GB_fosipkxYSSlunmMnTI6bfAzFuv1e7dw=='
# --------------------------------------------------------------------------

# 1. Request a device code from Entra
Write-Host 'Requesting device code...' -ForegroundColor Cyan
$dc = Invoke-RestMethod -Method Post `
    -Uri "https://login.microsoftonline.com/$TenantId/oauth2/v2.0/devicecode" `
    -Body @{ client_id = $ClientId; scope = $Scope }

Write-Host ''
Write-Host $dc.message -ForegroundColor Yellow
Write-Host ''

# 2. Poll the token endpoint until the user has signed in (or it times out)
$result = $null
do {
    Start-Sleep -Seconds $dc.interval
    try {
        $result = Invoke-RestMethod -Method Post `
            -Uri "https://login.microsoftonline.com/$TenantId/oauth2/v2.0/token" `
            -Body @{
                client_id   = $ClientId
                grant_type  = 'urn:ietf:params:oauth:grant-type:device_code'
                device_code = $dc.device_code
            }
    }
    catch {
        $err = ($_.ErrorDetails.Message | ConvertFrom-Json).error
        if ($err -ne 'authorization_pending' -and $err -ne 'slow_down') { throw }
    }
} until ($result)

$token = $result.access_token
Write-Host 'Token acquired.' -ForegroundColor Green

# 3. Decode the JWT payload locally so we can show what we're about to send
function Decode-JwtPayload([string]$jwt) {
    $payload = $jwt.Split('.')[1].Replace('-', '+').Replace('_', '/')
    $pad     = (4 - $payload.Length % 4) % 4
    $payload = $payload + ('=' * $pad)
    [Text.Encoding]::UTF8.GetString([Convert]::FromBase64String($payload)) |
        ConvertFrom-Json
}
$claims = Decode-JwtPayload $token
Write-Host ('  appid : {0}' -f $claims.appid)
Write-Host ('  oid   : {0}' -f $claims.oid)
Write-Host ('  uti   : {0}' -f $claims.uti)
Write-Host ('  aud   : {0}' -f $claims.aud)
Write-Host ('  scp   : {0}' -f $claims.scp)

# 4. POST the token to the function
Write-Host ''
Write-Host 'Calling function...' -ForegroundColor Cyan
$response = Invoke-RestMethod -Method Post `
    -Uri $FunctionUrl `
    -Headers @{ Authorization = "Bearer $token" }

Write-Host ''
Write-Host 'Function response:' -ForegroundColor Green
$response | Format-List

Write-Host ''
Write-Host ('Look for document id "{0}" under partition "{1}" in Cosmos db/primary.' `
    -f $response.id, $response.partition) -ForegroundColor DarkGray
