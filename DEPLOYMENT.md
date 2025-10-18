# XCELTICS - Excel Analytics Platform Deployment Guide

## 🚀 Deployment Options

### Option 1: Docker Deployment (Recommended for VPS/Cloud)

#### Prerequisites
- Docker and Docker Compose installed
- Server with at least 2GB RAM
- Domain name (optional)

#### Steps:

1. **Clone the repository** (or upload files to server)
   ```bash
   git clone <your-repo-url>
   cd excel-analytics-platform
   ```

2. **Create environment file**
   ```bash
   cp .env.example .env
   ```

3. **Edit .env file** with your credentials:
   ```bash
   nano .env
   ```
   Update:
   - `MONGO_ROOT_PASSWORD` - Strong password for MongoDB
   - `JWT_SECRET` - Random secure string
   - `OPENAI_API_KEY` - (Optional) Your OpenAI API key
   - `CLOUDINARY_*` - (Optional) Cloudinary credentials

4. **Build and start containers**
   ```bash
   docker-compose up -d --build
   ```

5. **Check status**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

6. **Access the application**
   - Frontend: http://your-server-ip
   - Backend API: http://your-server-ip:5000

#### Useful Commands:
```bash
# Stop services
docker-compose down

# View logs
docker-compose logs backend
docker-compose logs frontend

# Restart services
docker-compose restart

# Update application
git pull
docker-compose up -d --build
```

---

### Option 2: Render.com Deployment (Free Tier Available)

#### Prerequisites
- GitHub account
- Render.com account
- MongoDB Atlas account (free tier)

#### Steps:

1. **Setup MongoDB Atlas**
   - Go to https://www.mongodb.com/cloud/atlas
   - Create free cluster
   - Get connection string
   - Whitelist all IPs (0.0.0.0/0) for Render

2. **Push code to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin <your-github-repo-url>
   git push -u origin main
   ```

3. **Deploy on Render**
   - Go to https://render.com
   - Click "New" → "Blueprint"
   - Connect your GitHub repository
   - Render will automatically detect `render.yaml`
   - Add environment variables:
     - `MONGODB_URI` - Your MongoDB Atlas connection string
     - `JWT_SECRET` - Generate a random string
     - `OPENAI_API_KEY` - (Optional)

4. **Wait for deployment** (5-10 minutes)

5. **Access your app** at the provided Render URL

---

### Option 3: Vercel (Frontend) + Render (Backend)

#### Frontend on Vercel:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy frontend**
   ```bash
   cd frontend
   vercel
   ```

3. **Configure environment**
   - Add `VITE_API_URL` pointing to your backend URL

#### Backend on Render:
- Follow Render steps above for backend only

---

### Option 4: Railway.app Deployment

1. **Install Railway CLI**
   ```bash
   npm install -g @railway/cli
   ```

2. **Login and deploy**
   ```bash
   railway login
   railway init
   railway up
   ```

3. **Add environment variables** in Railway dashboard

---

## 🔒 Security Checklist

Before deploying to production:

- [ ] Change all default passwords
- [ ] Use strong JWT_SECRET (min 32 characters)
- [ ] Enable HTTPS (SSL certificate)
- [ ] Set up firewall rules
- [ ] Configure CORS properly
- [ ] Enable MongoDB authentication
- [ ] Set up regular backups
- [ ] Use environment variables (never commit .env)
- [ ] Enable rate limiting (already configured)
- [ ] Review API security headers (Helmet.js enabled)

---

## 📊 MongoDB Configuration

### Local MongoDB:
```
MONGODB_URI=mongodb://localhost:27017/excel-analytics
```

### Docker MongoDB:
```
MONGODB_URI=mongodb://admin:password@mongodb:27017/excel-analytics?authSource=admin
```

### MongoDB Atlas:
```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/excel-analytics?retryWrites=true&w=majority
```

---

## 🌐 Domain Configuration

### With Nginx (Docker):
1. Update `frontend/nginx.conf` with your domain
2. Add SSL certificate using Certbot:
   ```bash
   certbot --nginx -d yourdomain.com
   ```

### With Cloudflare:
1. Point your domain DNS to server IP
2. Enable SSL/TLS in Cloudflare
3. Set SSL mode to "Full"

---

## 📈 Monitoring

### Check Application Health:
```bash
# Backend
curl http://localhost:5000/api/health

# Frontend
curl http://localhost/
```

### View Docker Logs:
```bash
docker-compose logs -f --tail=100
```

### MongoDB Backup:
```bash
docker exec excel-analytics-mongodb mongodump --out /data/backup
```

---

## 🐛 Troubleshooting

### Backend won't start:
- Check MongoDB connection
- Verify environment variables
- Check logs: `docker-compose logs backend`

### Frontend can't connect to backend:
- Check CORS configuration
- Verify API URL in frontend build
- Check network connectivity

### MongoDB connection issues:
- Verify credentials
- Check MongoDB is running
- Whitelist IP addresses (if using Atlas)

---

## 📞 Support

For issues or questions:
- Check logs first
- Review environment variables
- Verify all services are running

---

## 🎉 Post-Deployment

After successful deployment:

1. Create admin user account
2. Test file upload functionality
3. Generate test charts
4. Verify AI insights (if OpenAI configured)
5. Set up monitoring/alerts
6. Configure regular backups

---

## 🔄 Updates

To update the application:

```bash
# Pull latest changes
git pull origin main

# Rebuild containers
docker-compose down
docker-compose up -d --build

# Or for Render/Vercel
# Just push to GitHub - auto-deploys
```

---

## 💡 Performance Tips

1. **Use CDN** for static assets
2. **Enable caching** (already configured)
3. **Optimize images** before upload
4. **Use MongoDB indexes** (check backend models)
5. **Monitor server resources**
6. **Scale horizontally** if needed

---

Good luck with your deployment! 🚀
