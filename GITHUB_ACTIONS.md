# GitHub Actions CI/CD Setup Guide

## Overview
Automatic deployment to AWS EC2 when you push code to GitHub.

---

## Step 1: Setup EC2 Instance

Follow the **AWS_DEPLOYMENT.md** guide to create your EC2 instance.

**Important:** Keep your `.pem` key file safe!

---

## Step 2: Create GitHub Repository

```bash
cd C:\React-Projects\React_FullStack_Project

# Initialize git (if not already)
git init

# Add .gitignore
echo "node_modules" > .gitignore
echo "dist" >> .gitignore
echo ".env" >> .gitignore
echo "*.pem" >> .gitignore
echo ".DS_Store" >> .gitignore
echo "backup_*.sql" >> .gitignore

# Add all files
git add .
git commit -m "Initial commit"

# Create GitHub repo and push
# (Create repo on GitHub first, then:)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO.git
git branch -M main
git push -u origin main
```

---

## Step 3: Configure GitHub Secrets

Go to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

Add these 4 secrets:

### 1. **AWS_ACCESS_KEY_ID**
```
Your AWS Access Key ID
```

**How to get:**
1. AWS Console → IAM → Users → Your User
2. Security credentials → Create access key
3. Choose "Command Line Interface (CLI)"
4. Copy Access Key ID

### 2. **AWS_SECRET_ACCESS_KEY**
```
Your AWS Secret Access Key
```
Copy from the same place as Access Key ID

### 3. **AWS_REGION**
```
us-east-1
```
(Or your EC2 region: us-west-2, eu-west-1, etc.)

### 4. **EC2_HOST**
```
your-ec2-public-ip
```
Example: `54.123.45.67`

### 5. **EC2_SSH_PRIVATE_KEY**
```
-----BEGIN RSA PRIVATE KEY-----
[Your entire .pem file content]
-----END RSA PRIVATE KEY-----
```

**How to get:**
- Open your `.pem` file in Notepad
- Copy ALL content including BEGIN/END lines
- Paste into GitHub secret

---

## Step 4: Test Deployment

### Option A: Push Code
```bash
git add .
git commit -m "Test deployment"
git push
```

### Option B: Manual Trigger
1. Go to GitHub repo → **Actions** tab
2. Select **Deploy to AWS EC2** workflow
3. Click **Run workflow** button

---

## Step 5: Monitor Deployment

1. Go to **Actions** tab in GitHub
2. Click on the running workflow
3. Watch real-time deployment logs
4. See success/failure status

---

## Workflow Triggers

The deployment runs automatically when:
- ✅ Push to `main` or `master` branch
- ✅ Manual trigger from Actions tab
- ✅ Pull request merge to main

---

## What Happens During Deployment

1. ✅ Checks out your code
2. ✅ Configures AWS credentials
3. ✅ Connects to EC2 via SSH
4. ✅ Uploads project files
5. ✅ Stops old containers
6. ✅ Rebuilds images
7. ✅ Starts new containers
8. ✅ Verifies deployment
9. ✅ Cleans up old images

**Time:** ~2-3 minutes per deployment

---

## Deployment Status Badge

Add this to your README.md:

```markdown
![Deploy Status](https://github.com/YOUR_USERNAME/YOUR_REPO/workflows/Deploy%20to%20AWS%20EC2/badge.svg)
```

---

## Customization

### Deploy to Different Branch
Edit `.github/workflows/deploy.yml`:
```yaml
on:
  push:
    branches: [ production ]  # Change this
```

### Add Slack Notifications
Add to workflow:
```yaml
- name: Slack Notification
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### Run Tests Before Deploy
Add before deploy step:
```yaml
- name: Run Tests
  run: |
    cd backend
    npm install
    npm test
```

---

## Troubleshooting

### Deployment Fails with "Permission Denied"
- Check EC2_SSH_PRIVATE_KEY is complete with BEGIN/END lines
- Verify EC2 Security Group allows SSH from GitHub IPs

### Connection Timeout
- Check EC2 instance is running
- Verify EC2_HOST has correct public IP
- Check Security Group allows port 22

### Docker Build Fails
- Check Docker is installed on EC2
- Verify enough disk space: `docker system df`
- Clean old images: `docker system prune -a`

### Backend Not Accessible
- Check `.env` file is configured
- Verify MySQL container is running
- Check logs: `docker-compose logs backend`

---

## Security Best Practices

✅ **Never commit:**
- `.pem` files
- `.env` files
- Passwords or API keys

✅ **Always use:**
- GitHub Secrets for credentials
- SSH keys for EC2 access
- Environment variables for configs

✅ **Rotate credentials:**
- AWS keys every 90 days
- EC2 key pairs annually

---

## Cost Monitoring

GitHub Actions Free Tier:
- ✅ 2,000 minutes/month (public repos)
- ✅ Unlimited minutes for public repos
- ✅ Storage for artifacts

AWS Free Tier:
- ✅ 750 hours EC2 t2.micro
- ✅ 30 GB storage
- ✅ 15 GB bandwidth in
- ✅ 1 GB bandwidth out

**Total Cost: $0/month** (with Free Tier)

---

## Advanced: Multi-Environment Setup

Create separate workflows for staging/production:

**.github/workflows/deploy-staging.yml**
```yaml
on:
  push:
    branches: [ develop ]
env:
  EC2_HOST: ${{ secrets.STAGING_EC2_HOST }}
```

**.github/workflows/deploy-production.yml**
```yaml
on:
  push:
    branches: [ main ]
env:
  EC2_HOST: ${{ secrets.PRODUCTION_EC2_HOST }}
```

---

## Next Steps

1. ✅ Set up GitHub Secrets
2. ✅ Push code to trigger deployment
3. ✅ Monitor in Actions tab
4. ✅ Access your app at http://EC2_HOST:3001

🚀 Your CI/CD pipeline is ready!
