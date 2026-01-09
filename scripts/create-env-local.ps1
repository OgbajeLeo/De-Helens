# PowerShell script to create .env.local file
# Run with: powershell -ExecutionPolicy Bypass -File scripts/create-env-local.ps1

$envFile = Join-Path $PSScriptRoot "..\.env.local"
$templateFile = Join-Path $PSScriptRoot "..\env.local.template"

Write-Host "🔧 Creating .env.local file..." -ForegroundColor Cyan

# Check if .env.local already exists
if (Test-Path $envFile) {
    Write-Host "⚠️  .env.local already exists!" -ForegroundColor Yellow
    $overwrite = Read-Host "Do you want to overwrite it? (y/n)"
    if ($overwrite -ne "y") {
        Write-Host "❌ Cancelled" -ForegroundColor Red
        exit
    }
}

# Check if template exists
if (Test-Path $templateFile) {
    Copy-Item $templateFile $envFile
    Write-Host "✅ Created .env.local from template" -ForegroundColor Green
} else {
    # Create from scratch
    $content = @"
# MongoDB Connection String
MONGODB_URI=mongodb+srv://helensadmin:YourPassword%401@helens.yg3qnuu.mongodb.net/helens-taste?retryWrites=true&w=majority

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=change-this-to-a-random-secret-key-in-production

# Admin Portal Credentials
ADMIN_USERNAME=admin
ADMIN_PASSWORD=admin123

# WhatsApp Number
NEXT_PUBLIC_OWNER_WHATSAPP_NUMBER=1234567890
"@
    Set-Content -Path $envFile -Value $content
    Write-Host "✅ Created .env.local file" -ForegroundColor Green
}

Write-Host ""
Write-Host "📝 IMPORTANT: Update the MONGODB_URI with your actual password!" -ForegroundColor Yellow
Write-Host "   If your password has special characters, URL-encode them:" -ForegroundColor Yellow
Write-Host "   @ becomes %40, # becomes %23, etc." -ForegroundColor Yellow
Write-Host ""
Write-Host "✅ File created at: $envFile" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Open .env.local and update MONGODB_URI with your actual credentials" -ForegroundColor White
Write-Host "2. Run: node scripts/check-env.js" -ForegroundColor White
Write-Host "3. Run: node scripts/test-connection.js" -ForegroundColor White
