# Quick Deploy Script for Windows
# Run this from your local machine after EC2 setup

param(
    [Parameter(Mandatory=$true)]
    [string]$PemFile,
    
    [Parameter(Mandatory=$true)]
    [string]$EC2Host
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Banking App - AWS Deployment Script" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Upload setup script
Write-Host "📤 Uploading setup script..." -ForegroundColor Yellow
scp -i $PemFile ec2-setup.sh ubuntu@${EC2Host}:~/

# Run setup script
Write-Host ""
Write-Host "⚙️  Running setup on EC2..." -ForegroundColor Yellow
ssh -i $PemFile ubuntu@$EC2Host "chmod +x ~/ec2-setup.sh && ~/ec2-setup.sh"

Write-Host ""
Write-Host "⏳ Waiting for user to reconnect..." -ForegroundColor Yellow
Start-Sleep -Seconds 3

# Upload project files
Write-Host ""
Write-Host "📦 Uploading project files..." -ForegroundColor Yellow
scp -i $PemFile -r backend frontend docker-compose.yml ubuntu@${EC2Host}:~/banking-app/

# Start services
Write-Host ""
Write-Host "🚀 Starting Docker services..." -ForegroundColor Yellow
ssh -i $PemFile ubuntu@$EC2Host "cd ~/banking-app && docker-compose up -d"

Write-Host ""
Write-Host "⏳ Waiting for services to start..." -ForegroundColor Yellow
Start-Sleep -Seconds 10

# Check status
Write-Host ""
Write-Host "📊 Checking container status..." -ForegroundColor Yellow
ssh -i $PemFile ubuntu@$EC2Host "cd ~/banking-app && docker-compose ps"

Write-Host ""
Write-Host "========================================" -ForegroundColor Green
Write-Host "✅ Deployment Complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Green
Write-Host ""
Write-Host "🌐 Access your application:" -ForegroundColor Cyan
Write-Host "   Frontend:  http://${EC2Host}:3001" -ForegroundColor White
Write-Host "   Backend:   http://${EC2Host}:3000/api" -ForegroundColor White
Write-Host ""
Write-Host "📝 To view logs:" -ForegroundColor Cyan
Write-Host "   ssh -i `"$PemFile`" ubuntu@$EC2Host" -ForegroundColor White
Write-Host "   cd ~/banking-app && docker-compose logs -f" -ForegroundColor White
Write-Host ""

# Open browser
$response = Read-Host "Open frontend in browser? (y/n)"
if ($response -eq 'y') {
    Start-Process "http://${EC2Host}:3001"
}
