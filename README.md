# 🏦 Banking Application - Full Stack Project

![Deploy Status](https://img.shields.io/badge/deploy-automated-success)
![Docker](https://img.shields.io/badge/docker-ready-blue)
![AWS](https://img.shields.io/badge/AWS-Free%20Tier-orange)

A full-stack banking application with React frontend, Node.js backend, and MySQL database. Features automated deployment to AWS via GitHub Actions.

## 🌐 Live Demo

**🚀 Try it now:** http://52.15.101.74:3001

- **Frontend Application:** http://52.15.101.74:3001
- **Backend API:** http://52.15.101.74:3000/api
- **Health Check:** http://52.15.101.74:3000/api/health

> **Note:** This is a demonstration project running on AWS Free Tier. The application uses HTTP (not HTTPS) for simplicity.

### Features You Can Try:
- ✅ View all bank accounts
- ✅ Create new accounts
- ✅ Transfer money between accounts
- ✅ Real-time balance updates
- ✅ Transaction history

---

## 🚀 Features

- ✅ Account management (create, view accounts)
- ✅ Fund transfers with transaction safety
- ✅ Real-time balance updates
- ✅ Transaction history
- ✅ Docker containerization
- ✅ CI/CD with GitHub Actions
- ✅ AWS cloud deployment (Free Tier)

## 🛠️ Tech Stack

**Frontend:** React 18, Vite, Axios, Nginx  
**Backend:** Node.js, Express.js, MySQL 8.0  
**DevOps:** Docker, GitHub Actions, AWS EC2

## 🏃 Quick Start

### Local Development
```bash
# With Docker (recommended)
docker-compose up -d

# Or use interactive menu
python menu.py
```

### Access
- **Frontend:** http://localhost:3001
- **Backend:** http://localhost:3000/api
- **MySQL:** localhost:3307

## ☁️ AWS Deployment with GitHub Actions

Complete CI/CD pipeline that auto-deploys on every git push!

### Setup Steps:
1. **Create EC2 instance** (t2.micro - Free Tier)
2. **Add GitHub Secrets** (AWS credentials, SSH key)
3. **Push code** - Automatic deployment!

📖 **Full Guide:** [GITHUB_ACTIONS.md](GITHUB_ACTIONS.md)

### What's Automated:
- ✅ Code checkout
- ✅ Docker build
- ✅ Deploy to EC2
- ✅ Health checks
- ✅ Zero downtime
- ✅ Auto-rollback on failure

## 📁 Project Structure

```
├── backend/              # Node.js Express API
│   ├── index.js         # Main server
│   ├── db.js            # MySQL connection
│   ├── schema.sql       # Database schema
│   └── Dockerfile
├── frontend/            # React application
│   ├── src/
│   │   ├── App.jsx
│   │   ├── api.js
│   │   └── components/
│   ├── nginx.conf
│   └── Dockerfile
├── .github/
│   └── workflows/
│       └── deploy.yml   # CI/CD pipeline
├── docker-compose.yml   # Container orchestration
├── menu.py             # Management tool
├── deploy-to-aws.ps1   # Quick deploy script
└── README.md
```

## 🎯 Project Highlights for Interviews

This project demonstrates expertise in:

### Technical Skills:
- ✅ **Full-Stack Development** - React + Node.js + MySQL
- ✅ **Docker & Containerization** - Multi-container orchestration
- ✅ **CI/CD Pipeline** - GitHub Actions automated deployment
- ✅ **Cloud Infrastructure** - AWS EC2 deployment
- ✅ **Database Design** - ACID transactions, row-level locking
- ✅ **RESTful API Design** - Clean, scalable API architecture
- ✅ **Security Best Practices** - SQL injection prevention, CORS
- ✅ **DevOps** - Infrastructure as Code

### Live Demonstration:
**🌐 Working Application:** http://52.15.101.74:3001

**Key Features to Showcase:**
- Real-time balance updates
- Safe concurrent transactions
- Database transaction integrity
- Auto-deployment on code changes
- Production-ready containerized setup

## 📊 API Endpoints

| Method | Endpoint              | Description          |
|--------|-----------------------|----------------------|
| GET    | /api/health          | Health check         |
| GET    | /api/accounts        | List all accounts    |
| POST   | /api/accounts        | Create new account   |
| POST   | /api/transactions    | Transfer funds       |
| GET    | /api/transactions    | Transaction history  |

## 🐳 Docker Commands

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down

# Rebuild
docker-compose up -d --build
```

## 💻 Management Menu

Interactive Python menu for easy management:

```bash
python menu.py
```

Features:
- Start/stop Docker services
- View logs by service
- MySQL shell access
- Database backups
- Open frontend in browser
- Container status

## 🔐 Security Features

- ✅ SQL injection prevention (prepared statements)
- ✅ Database transactions with row-level locking
- ✅ CORS configuration
- ✅ Environment variable protection
- ✅ GitHub Secrets for credentials

## 📝 Environment Configuration

**Backend (.env):**
```env
DB_HOST=127.0.0.1
DB_PORT=3306
DB_USER=root
DB_PASS=your_password
DB_NAME=banking_sample
PORT=3000
```

**Frontend (.env):**
```env
VITE_API_URL=http://localhost:3000/api
```

## 🎯 Interview Ready

This project demonstrates:
- Full-stack development (React + Node.js)
- Database design & transactions
- Docker containerization
- CI/CD with GitHub Actions
- Cloud deployment (AWS)
- Security best practices
- API design
- State management

## 📚 Documentation

- [AWS Deployment Guide](AWS_DEPLOYMENT.md)
- [GitHub Actions Setup](GITHUB_ACTIONS.md)
- [Docker Compose Configuration](docker-compose.yml)

## 💰 Cost

**100% FREE** with AWS Free Tier:
- EC2 t2.micro: 750 hours/month
- 30 GB storage
- 15 GB bandwidth
- GitHub Actions: 2000 minutes/month

## 🚀 Quick Deploy to AWS

```powershell
.\deploy-to-aws.ps1 -PemFile "your-key.pem" -EC2Host "your-ec2-ip"
```

## 🤝 Contributing

Contributions welcome! Feel free to:
- Report bugs
- Suggest features
- Submit pull requests

## 📈 Future Enhancements

- [ ] User authentication (JWT)
- [ ] Rate limiting
- [ ] TypeScript migration
- [ ] Unit & integration tests
- [ ] Redis caching
- [ ] Monitoring & logging
- [ ] Mobile app

---

**Made with ❤️ for technical interviews and portfolio demonstration**

## Components
- `backend/` - Express API using `mysql2` and simple transactional transfers.
- `frontend/` - Vite + React app that lists accounts and performs transfers.

## Quickstart

### 1. Setup Database
Create a MySQL database and run the schema:

```bash
mysql -u root -p
CREATE DATABASE banking_sample;
EXIT
mysql -u root -p banking_sample < backend/schema.sql
```

### 2. Configure Backend
Copy `backend/.env.example` to `backend/.env` and set your DB credentials.

### 3. Start Backend

```bash
cd backend
npm install
npm start
```

### 4. Start Frontend

```bash
cd frontend
npm install
npm run dev
```

The backend runs on port `3000` by default and the frontend on Vite's default `5173`.

## Notes
- This is a learning sample. Do NOT use it in production without adding proper validation, authentication, and security hardening.
