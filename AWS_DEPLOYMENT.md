# AWS Free Tier Deployment Guide

## Prerequisites
- AWS Account (Free Tier eligible)
- AWS CLI configured (optional)

## Cost: $0/month (Free Tier)

---

## Option 1: EC2 with Docker (Recommended)

### Step 1: Launch EC2 Instance

1. **Go to EC2 Dashboard** in AWS Console
2. **Click "Launch Instance"**
3. **Configure:**
   - **Name:** banking-app-server
   - **AMI:** Ubuntu Server 22.04 LTS (Free tier eligible)
   - **Instance Type:** t2.micro (Free tier eligible)
   - **Key Pair:** Create new or use existing (download .pem file)
   - **Network Settings:**
     - ✅ Allow SSH (port 22) from your IP
     - ✅ Allow HTTP (port 80) from anywhere
     - ✅ Allow Custom TCP (port 3000) from anywhere
     - ✅ Allow Custom TCP (port 3001) from anywhere
   - **Storage:** 8-30 GB gp2 (Free tier: 30GB)
4. **Click "Launch Instance"**

### Step 2: Connect to EC2

```bash
# Windows PowerShell
ssh -i "your-key.pem" ubuntu@your-ec2-public-ip

# If permission error on Windows:
# Right-click .pem file → Properties → Security → Advanced
# Disable inheritance, remove all users except yourself
```

### Step 3: Install Docker & Docker Compose

```bash
# Update system
sudo apt update
sudo apt upgrade -y

# Install Docker
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh

# Add user to docker group
sudo usermod -aG docker ubuntu

# Log out and back in for group changes
exit
# Then reconnect via SSH

# Install Docker Compose
sudo curl -L "https://github.com/docker/compose/releases/latest/download/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verify installation
docker --version
docker-compose --version
```

### Step 4: Upload Project Files

**Option A: Using SCP (from your local machine)**
```powershell
# From your project directory
scp -i "your-key.pem" -r C:\React-Projects\React_FullStack_Project ubuntu@your-ec2-public-ip:~/banking-app
```

**Option B: Using Git**
```bash
# On EC2 instance
git clone <your-repository-url> banking-app
cd banking-app
```

**Option C: Manual Upload**
- Use WinSCP or FileZilla to transfer files

### Step 5: Deploy Application

```bash
cd ~/banking-app

# Start services
docker-compose up -d

# Check status
docker-compose ps

# View logs
docker-compose logs -f
```

### Step 6: Access Application

- **Frontend:** http://your-ec2-public-ip:3001
- **Backend API:** http://your-ec2-public-ip:3000/api

---

## Security Group Configuration

| Type       | Port | Source      | Description      |
|------------|------|-------------|------------------|
| SSH        | 22   | Your IP     | SSH access       |
| HTTP       | 80   | 0.0.0.0/0   | Future use       |
| Custom TCP | 3000 | 0.0.0.0/0   | Backend API      |
| Custom TCP | 3001 | 0.0.0.0/0   | Frontend         |

---

## Important Notes

### Free Tier Limits:
- ✅ 750 hours/month of t2.micro (1 instance always on)
- ✅ 30 GB EBS storage
- ✅ 1 GB outbound data transfer/month
- ✅ 15 GB inbound data transfer/month

### Auto-Start on Reboot:
```bash
# Create systemd service
sudo nano /etc/systemd/system/banking-app.service
```

Add:
```ini
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
```

Enable service:
```bash
sudo systemctl enable banking-app.service
sudo systemctl start banking-app.service
```

---

## Troubleshooting

### Check Docker Status:
```bash
sudo systemctl status docker
docker ps
docker-compose ps
```

### View Logs:
```bash
docker-compose logs backend
docker-compose logs frontend
docker-compose logs db
```

### Restart Services:
```bash
docker-compose restart
```

### Free Up Space:
```bash
docker system prune -a
```

---

## Cost Monitoring

1. **Go to AWS Billing Dashboard**
2. **Enable "Free Tier Usage Alerts"**
3. **Set budget alert at $1**

---

## Stop Charges

```bash
# Stop containers (keeps data)
docker-compose down

# On AWS Console: Stop EC2 instance (still charges for EBS)
# Or: Terminate instance (deletes everything)
```

---

## Domain Setup (Optional - Free)

Use **Freenom** or **No-IP** for free domain, then update Route 53 (first hosted zone is free).
