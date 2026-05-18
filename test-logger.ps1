$token = ConvertFrom-SecureString -SecureString (Get-AzAccessToken -ResourceUrl "api://b871e062-cdbf-417c-8e91-6d23d0189ce5").Token -AsPlainText

$response = Invoke-RestMethod `
    -Uri "https://func-nygdev-logger.azurewebsites.net/api/HttpTrigger" `
    -Method Post `
    -Headers @{ Authorization = "Bearer $token" } `
    -ContentType "application/json" `
    -Body '{"id":"test-from-ps"}'

Write-Output $response