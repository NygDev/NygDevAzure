$token = az account get-access-token `
    --resource api://3b099f85-b92c-4f7a-ad5c-addd588d57ac `
    --query accessToken -o tsv

$response = Invoke-RestMethod `
    -Uri "https://func-nygdev-logger.azurewebsites.net/api/HttpTrigger" `
    -Headers @{ Authorization = "Bearer $token" }

Write-Output $response
