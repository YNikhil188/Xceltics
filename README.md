# 📊 Xceltics Platform - MERN Stack

A full-stack Excel Analytics Platform built with MongoDB, Express.js, React.js, and Node.js featuring AI-powered insights, dynamic visualizations, and glassmorphic UI design.

## 🌟 Features

### Core Functionality
- ✅ **JWT-based Authentication** - Secure login/signup with role-based access (User/Admin)
- 📤 **Excel File Upload** - Support for .xls, .xlsx files with parsing via SheetJS
- 📊 **Dynamic Visualizations** - Generate 2D charts (Bar, Line, Pie, Scatter) and 3D visualizations
- 🤖 **AI Insights** - OpenAI-powered data analysis and pattern recognition
- 📈 **Interactive Dashboards** - Personal dashboards with upload history and metrics
- 👥 **Admin Panel** - User management and platform-wide analytics
- 💾 **Data Management** - CRUD operations for files, charts, and insights

### Technical Features
- 🔐 Password hashing with bcryptjs
- 🛡️ Rate limiting and Helmet security
- 📱 Fully responsive glassmorphic UI
- ⚡ Redux Toolkit for state management
- 🎨 Tailwind CSS with custom animations
- 🌐 CORS-enabled API
- 📦 File validation and size limits
- 🔄 Real-time error handling

## 🏗️ Project Structure

```
Xceltics/
├── backend/                 # Node.js + Express API
│   ├── config/             # Database configuration
│   ├── controllers/        # Route controllers
│   ├── middleware/         # Auth, upload, error handlers
│   ├── models/            # Mongoose schemas
│   ├── routes/            # API routes
│   ├── uploads/           # Uploaded files storage
│   ├── server.js          # Express app entry
│   └── package.json
│
├── frontend/               # React + Vite application
│   ├── src/
│   │   ├── components/    # Reusable UI components
│   │   ├── pages/         # Route pages
│   │   ├── store/         # Redux store & slices
│   │   ├── utils/         # API utilities
│   │   ├── App.jsx        # Main app component
│   │   └── main.jsx       # React entry point
│   ├── index.html
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── package.json
│
└── README.md
```

## 🚀 Quick Start

### Prerequisites
- Node.js v18+
- MongoDB (local or MongoDB Atlas)
- npm or yarn

### Backend Setup

1. **Navigate to backend directory:**
```bash
cd backend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file:**
```bash
cp .env.example .env
```

4. **Configure environment variables in .env:**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb://localhost:27017/excel-analytics
JWT_SECRET=your_super_secret_jwt_key_here
JWT_EXPIRE=7d
OPENAI_API_KEY=sk-your-openai-key (optional)
CORS_ORIGIN=http://localhost:3000
MAX_FILE_SIZE=10485760
```

5. **Start MongoDB:**
```bash
mongod
```

6. **Run the backend server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

Backend will run on `http://localhost:5000`

### Frontend Setup

1. **Navigate to frontend directory:**
```bash
cd frontend
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create .env file (optional):**
```env
VITE_API_URL=http://localhost:5000/api
```

4. **Start the development server:**
```bash
npm run dev
```

Frontend will run on `http://localhost:3000`

5. **Build for production:**
```bash
npm run build
```

## 📡 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user
- `PUT /api/auth/profile` - Update profile

### Files
- `POST /api/files/upload` - Upload Excel file
- `GET /api/files` - Get user's files
- `GET /api/files/:id` - Get single file
- `DELETE /api/files/:id` - Delete file
- `GET /api/files/stats/summary` - Get statistics

### Charts
- `POST /api/charts/generate` - Generate chart
- `GET /api/charts` - Get user's charts
- `GET /api/charts/:id` - Get single chart
- `DELETE /api/charts/:id` - Delete chart

### Insights (AI)
- `POST /api/insights/:fileId` - Generate AI insights
- `GET /api/insights` - Get user's insights
- `GET /api/insights/:fileId` - Get insight for file

### Admin (Admin role required)
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Platform statistics

## 🎨 Frontend Tech Stack

- **React 18** - UI library
- **Redux Toolkit** - State management
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS
- **Framer Motion** - Animations
- **Chart.js** - 2D charts
- **Three.js** - 3D visualizations
- **React Dropzone** - File uploads
- **Axios** - HTTP client
- **Lucide React** - Icons

## 🔧 Backend Tech Stack

- **Node.js & Express** - Server framework
- **MongoDB & Mongoose** - Database
- **JWT** - Authentication
- **Bcryptjs** - Password hashing
- **Multer** - File uploads
- **SheetJS (xlsx)** - Excel parsing
- **OpenAI API** - AI insights
- **Helmet** - Security headers
- **Express Rate Limit** - Rate limiting
- **Morgan** - Logging

## 🎯 Key Features Walkthrough

### 1. User Registration & Login
- Users register with name, email, and password
- JWT tokens issued for authentication
- Role-based access (User/Admin)

### 2. File Upload
- Drag-and-drop Excel files
- Automatic parsing to JSON
- Preview of first 10 rows
- Metadata extraction (rows, columns, headers)

### 3. Chart Generation
- Select X and Y axes from uploaded data
- Choose chart type (bar, line, pie, scatter)
- Apply aggregations (sum, avg, count, min, max)
- Generate 2D and 3D visualizations
- Export charts as PNG/PDF

### 4. AI Insights
- Click "Generate Insights" on any dataset
- AI analyzes data patterns and trends
- Displays key findings, recommendations
- Powered by OpenAI GPT-4

### 5. Admin Dashboard
- View all users and their activities
- Manage user accounts (activate/deactivate)
- Platform-wide statistics
- Recent uploads and analytics

## 🌐 Deployment

### Backend Deployment (Render)

1. Push code to GitHub
2. Create new Web Service on Render
3. Connect repository
4. Configure:
   - **Build Command:** `npm install`
   - **Start Command:** `npm start`
   - **Environment:** Add all .env variables
5. Deploy

### Frontend Deployment (Netlify/Vercel)

**Netlify:**
1. Connect GitHub repository
2. Configure build settings:
   - **Build Command:** `npm run build`
   - **Publish Directory:** `dist`
3. Add environment variable: `VITE_API_URL`
4. Deploy

**Vercel:**
1. Import project from GitHub
2. Framework Preset: Vite
3. Add environment variable: `VITE_API_URL`
4. Deploy

### Database (MongoDB Atlas)

1. Create free cluster
2. Create database user
3. Whitelist IP (0.0.0.0/0 for production)
4. Get connection string
5. Add to `MONGODB_URI` environment variable

## 🔒 Security Features

- ✅ Password hashing with salt
- ✅ JWT token authentication
- ✅ Rate limiting (100 requests/15 min)
- ✅ Helmet security headers
- ✅ CORS configuration
- ✅ Input validation
- ✅ File type and size validation
- ✅ SQL injection prevention (NoSQL)
- ✅ XSS protection

## 📝 Environment Variables

### Backend (.env)
```env
PORT=5000
NODE_ENV=production
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/db
JWT_SECRET=your_secret_key
JWT_EXPIRE=7d
OPENAI_API_KEY=sk-xxx (optional)
CLOUDINARY_CLOUD_NAME=xxx (optional)
CLOUDINARY_API_KEY=xxx (optional)
CLOUDINARY_API_SECRET=xxx (optional)
CORS_ORIGIN=https://your-frontend-url.com
MAX_FILE_SIZE=10485760
```

### Frontend (.env)
```env
VITE_API_URL=https://your-backend-url.com/api
```

## 🧪 Testing

```bash
# Backend
cd backend
npm test

# Frontend
cd frontend
npm run lint
npm run build
```

## 📚 Additional Resources

- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
- [Render](https://render.com)
- [Netlify](https://netlify.com)
- [OpenAI API](https://openai.com/api)
- [Tailwind CSS](https://tailwindcss.com)

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit changes (`git commit -m 'Add AmazingFeature'`)
4. Push to branch (`git push origin feature/AmazingFeature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for personal or commercial purposes.

## 👨‍💻 Author

Built with ❤️ using the MERN stack

## 🐛 Known Issues & Roadmap

- [ ] Add real-time collaboration
- [ ] Implement data export to multiple formats
- [ ] Add more chart types (heatmaps, treemaps)
- [ ] Email notifications
- [ ] Data version history
- [ ] Advanced filtering and querying

## 💡 Tips

- Use MongoDB Compass for local database management
- Enable MongoDB indexes for better performance
- Configure Cloudinary for file storage in production
- Set up error tracking (Sentry)
- Use environment-specific configs
- Monitor API rate limits
- Regular database backups

---

**📊Xceltics**
**Smarter Data Smarter Decisions**
