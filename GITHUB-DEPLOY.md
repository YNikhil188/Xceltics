# 🚀 Deploy to GitHub → Render (Backend) → Vercel (Frontend)

## Step-by-Step Deployment Guide

### Prerequisites
- GitHub account
- Render.com account (free)
- Vercel account (free)
- MongoDB Atlas account (free)

---

## Part 1: Setup MongoDB Atlas (5 minutes)

1. **Create MongoDB Atlas Account**
   - Go to https://www.mongodb.com/cloud/atlas
   - Sign up for free
   - Create a new project: "XCELTICS"

2. **Create Database Cluster**
   - Click "Build a Database"
   - Choose "FREE" tier (M0)
   - Select your preferred region
   - Name cluster: "xceltics-cluster"
   - Click "Create"

3. **Setup Database Access**
   - Go to "Database Access" (left sidebar)
   - Click "Add New Database User"
   - Username: `xceltics_user`
   - Password: Click "Autogenerate Secure Password" (SAVE THIS!)
   - Database User Privileges: "Read and write to any database"
   - Click "Add User"

4. **Setup Network Access**
   - Go to "Network Access" (left sidebar)
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"

5. **Get Connection String**
   - Go to "Database" → "Connect"
   - Choose "Connect your application"
   - Driver: Node.js
   - Copy the connection string
   - Replace `<password>` with your actual password
   - Replace `myFirstDatabase` with `excel-analytics`
   
   Your string should look like:
   ```
   mongodb+srv://xceltics_user:YOUR_PASSWORD@xceltics-cluster.xxxxx.mongodb.net/excel-analytics?retryWrites=true&w=majority
   ```
   **SAVE THIS STRING!** You'll need it for Render.

---

## Part 2: Push to GitHub (3 minutes)

### Option A: Using GitHub Desktop (Easier)
1. Download GitHub Desktop: https://desktop.github.com
2. Open GitHub Desktop
3. File → Add Local Repository
4. Select your project folder
5. Click "Publish Repository"
6. Uncheck "Keep this code private" (or keep private if you prefer)
7. Click "Publish Repository"

### Option B: Using Command Line
```bash
# 1. Initialize git (if not already done)
git init

# 2. Add all files
git add .

# 3. Commit
git commit -m "Initial commit - XCELTICS Excel Analytics Platform"

# 4. Create new repository on GitHub.com
# Go to https://github.com/new
# Name: excel-analytics-platform
# Description: AI-Powered Excel Analytics Platform
# Public or Private (your choice)
# DO NOT initialize with README
# Click "Create repository"

# 5. Add remote and push
git remote add origin https://github.com/YOUR_USERNAME/excel-analytics-platform.git
git branch -M main
git push -u origin main
```

✅ **Your code is now on GitHub!**

---

## Part 3: Deploy Backend on Render (5 minutes)

1. **Go to Render**
   - Visit https://render.com
   - Sign up / Log in (can use GitHub to sign in)

2. **Create New Web Service**
   - Click "New +" button
   - Select "Web Service"

3. **Connect GitHub Repository**
   - Click "Connect account" if needed
   - Find your `excel-analytics-platform` repository
   - Click "Connect"

4. **Configure Service**
   ```
   Name:              xceltics-backend
   Region:            Oregon (US West)
   Branch:            main
   Root Directory:    backend
   Runtime:           Node
   Build Command:     npm install
   Start Command:     npm start
   Instance Type:     Free
   ```

5. **Add Environment Variables**
   Click "Advanced" → "Add Environment Variable"
   
   Add these:
   ```
   NODE_ENV = production
   PORT = 5000
   MONGODB_URI = [Your MongoDB Atlas connection string from Part 1]
   JWT_SECRET = [Generate a random 32+ character string]
   ```
   
   To generate JWT_SECRET:
   ```bash
   # Run in terminal:
   node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
   ```
   
   Optional (if you have them):
   ```
   OPENAI_API_KEY = sk-...
   CLOUDINARY_CLOUD_NAME = ...
   CLOUDINARY_API_KEY = ...
   CLOUDINARY_API_SECRET = ...
   ```

6. **Deploy**
   - Click "Create Web Service"
   - Wait 5-10 minutes for deployment
   - Your backend will be at: `https://xceltics-backend.onrender.com`

7. **Test Backend**
   - Once deployed, visit: `https://your-backend-url.onrender.com`
   - You should see a message or API response

✅ **Backend is now live!** Copy your backend URL.

---

## Part 4: Deploy Frontend on Vercel (3 minutes)

1. **Go to Vercel**
   - Visit https://vercel.com
   - Sign up / Log in (can use GitHub)

2. **Import Project**
   - Click "Add New..." → "Project"
   - Import your GitHub repository
   - Select `excel-analytics-platform`

3. **Configure Project**
   ```
   Framework Preset:  Vite
   Root Directory:    frontend
   Build Command:     npm run build
   Output Directory:  dist
   Install Command:   npm install
   ```

4. **Add Environment Variable**
   Click "Environment Variables"
   
   Add:
   ```
   Name:  VITE_API_URL
   Value: https://your-backend-url.onrender.com
   ```
   (Replace with your actual Render backend URL from Part 3)

5. **Deploy**
   - Click "Deploy"
   - Wait 2-3 minutes
   - Your frontend will be at: `https://your-project.vercel.app`

✅ **Frontend is now live!**

---

## Part 5: Configure CORS (Important!)

Your backend needs to allow requests from your Vercel frontend.

1. **Update Backend CORS Configuration**
   
   In your `backend/server.js`, update the CORS configuration:
   
   ```javascript
   const allowedOrigins = [
     'http://localhost:3000',
     'https://your-project.vercel.app',  // Add your Vercel URL
     'https://your-custom-domain.com'    // Add custom domain if you have one
   ];
   
   app.use(cors({
     origin: function(origin, callback) {
       if (!origin || allowedOrigins.indexOf(origin) !== -1) {
         callback(null, true);
       } else {
         callback(new Error('Not allowed by CORS'));
       }
     },
     credentials: true
   }));
   ```

2. **Push Changes to GitHub**
   ```bash
   git add .
   git commit -m "Update CORS for Vercel deployment"
   git push
   ```

3. **Render will auto-deploy** the backend changes (wait 2-3 minutes)

---

## Part 6: Post-Deployment Setup

### 1. Test Your Application
- Visit your Vercel URL: `https://your-project.vercel.app`
- You should see the XCELTICS landing page
- Click "Get Started"
- Register a new account

### 2. Create Admin User
- Register your first user
- Go to MongoDB Atlas
- Browse Collections → users
- Find your user document
- Edit: Change `"role": "user"` to `"role": "admin"`
- Save
- Refresh your app and you'll have admin access!

### 3. Test Features
- ✅ Upload Excel file
- ✅ Generate 2D chart
- ✅ Generate 3D chart
- ✅ Export chart
- ✅ View file details
- ✅ Test AI insights (if OpenAI key configured)
- ✅ Access admin panel

---

## 🎉 Success!

Your XCELTICS platform is now fully deployed!

**Your URLs:**
- Frontend: `https://your-project.vercel.app`
- Backend: `https://xceltics-backend.onrender.com`
- Database: MongoDB Atlas (cloud)

---

## 🔄 Updates & Maintenance

### To Update Your Application:

1. **Make changes locally**
2. **Commit and push to GitHub:**
   ```bash
   git add .
   git commit -m "Update: description of changes"
   git push
   ```
3. **Automatic deployment:**
   - Vercel: Auto-deploys frontend in 2-3 minutes
   - Render: Auto-deploys backend in 5-10 minutes

### Monitor Your Services:
- **Render Dashboard**: View logs, restart service
- **Vercel Dashboard**: View deployments, analytics
- **MongoDB Atlas**: Monitor database usage, backups

---

## 🐛 Troubleshooting

### Frontend can't connect to backend?
1. Check `VITE_API_URL` in Vercel environment variables
2. Verify CORS configuration allows Vercel domain
3. Check backend is running on Render
4. View Render logs for errors

### Backend errors on Render?
1. Check environment variables are set correctly
2. View logs in Render dashboard
3. Verify MongoDB connection string
4. Check MongoDB Atlas network access (0.0.0.0/0)

### Database connection failed?
1. Verify MongoDB Atlas connection string
2. Check username and password are correct
3. Ensure network access allows all IPs (0.0.0.0/0)
4. Database name should be `excel-analytics`

### Deployment taking too long?
- Render free tier: First deployment takes 10-15 minutes
- Subsequent deployments: 5-10 minutes
- Vercel: Usually 2-3 minutes

---

## 💡 Pro Tips

1. **Custom Domain (Optional)**
   - Vercel: Settings → Domains → Add domain
   - Render: Settings → Custom Domain
   - Update CORS after adding domain

2. **Environment Variables**
   - Never commit `.env` files to GitHub
   - Keep secrets secure in platform dashboards
   - Regenerate keys if accidentally exposed

3. **Free Tier Limits**
   - Render: 750 hours/month, sleeps after 15 min inactivity
   - Vercel: Unlimited websites, fair use
   - MongoDB Atlas: 512MB storage, shared cluster

4. **Wake Up Render (Free Tier)**
   - First request after sleep takes 30-60 seconds
   - Consider using a uptime monitor (UptimeRobot) to keep it awake
   - Or upgrade to paid plan ($7/month)

---

## 📞 Need Help?

- **Render Docs**: https://render.com/docs
- **Vercel Docs**: https://vercel.com/docs
- **MongoDB Atlas**: https://docs.atlas.mongodb.com

---

**Congratulations! Your app is live and ready to use! 🎊**
