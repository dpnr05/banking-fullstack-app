#!/bin/bash
# AWS EC2 Setup Script - Run this after connecting to EC2

set -e

echo "=========================================="
echo "Banking App - AWS EC2 Setup Script"
echo "=========================================="
echo ""

# Update system
echo "📦 Updating system packages..."
sudo apt update
sudo apt upgrade -y

# Install Docker
echo ""
echo "🐳 Installing Docker..."
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
rm get-docker.sh

# Add user to docker group
echo ""
echo "👤 Adding user to docker group..."
sudo usermod -aG docker ubuntu

# Install Docker Compose
echo ""
echo "🔧 Installing Docker Compose..."
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
echo ""
echo "✅ Verifying installation..."
docker --version
docker-compose --version

# Create app directory
echo ""
echo "📁 Creating application directory..."
mkdir -p ~/banking-app
cd ~/banking-app

# Create systemd service for auto-start
echo ""
echo "⚙️  Creating systemd service for auto-start..."
sudo tee /etc/systemd/system/banking-app.service > /dev/null <<EOF
[Unit]
Description=Banking App Docker Compose
Requires=docker.service
After=docker.service

[Service]
Type=oneshot
RemainAfterExit=yes
WorkingDirectory=/home/ubuntu/banking-app
ExecStart=/usr/local/bin/docker-compose up -d
ExecStop=/usr/local/bin/docker-compose down
User=ubuntu

[Install]
WantedBy=multi-user.target
EOF

sudo systemctl daemon-reload
sudo systemctl enable banking-app.service

echo ""
echo "=========================================="
echo "✅ Setup Complete!"
echo "=========================================="
echo ""
echo "Next steps:"
echo "1. Log out and back in (for docker group changes)"
echo "2. Upload your project files to ~/banking-app"
echo "3. Run: cd ~/banking-app && docker-compose up -d"
echo ""
echo "Or use the quick command:"
echo "  exit"
echo ""
