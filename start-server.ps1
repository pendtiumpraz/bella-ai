# PowerShell script untuk start server di Windows
Write-Host "Starting Bella AI Server..." -ForegroundColor Green

# Change to Bella directory
Set-Location "D:\AI\Bella"

# Try npx http-server first
Write-Host "Trying to start http-server on port 8000..." -ForegroundColor Yellow
npx http-server -p 8000 -o

# If that fails, try Python
if ($LASTEXITCODE -ne 0) {
    Write-Host "http-server failed, trying Python..." -ForegroundColor Yellow
    python -m http.server 8000
}