# Excel Analytics Platform - Backend

Production-grade backend for Excel Analytics Platform built with Node.js, Express, and MongoDB.

## Features

- 🔐 JWT-based authentication with role-based access control
- 📊 Excel file upload and parsing using SheetJS
- 📈 Dynamic chart generation with multiple chart types
- 🤖 AI-powered insights using OpenAI API (optional)
- 👥 Admin panel for user management
- 🛡️ Security best practices (Helmet, rate limiting, CORS)
- ⚡ Optimized with compression and caching

## Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or Atlas)
- npm or yarn

## Installation

1. Install dependencies:
```bash
npm install
```

2. Create `.env` file:
```bash
cp .env.example .env
```

3. Configure environment variables in `.env`

4. Start the server:

**Development:**
```bash
npm run dev
```

**Production:**
```bash
npm start
```

## API Endpoints

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
- `GET /api/files/stats/summary` - Get file statistics

### Charts
- `POST /api/charts/generate` - Generate chart
- `GET /api/charts` - Get user's charts
- `GET /api/charts/:id` - Get single chart
- `DELETE /api/charts/:id` - Delete chart

### Insights (AI)
- `POST /api/insights/:fileId` - Generate AI insights
- `GET /api/insights` - Get user's insights
- `GET /api/insights/:fileId` - Get insight for file

### Admin
- `GET /api/admin/users` - Get all users
- `GET /api/admin/users/:id` - Get user details
- `PUT /api/admin/users/:id` - Update user
- `DELETE /api/admin/users/:id` - Delete user
- `GET /api/admin/stats` - Get platform statistics

## Environment Variables

See `.env.example` for all required environment variables.

## Deployment

### Render Deployment

1. Create new Web Service on Render
2. Connect your GitHub repository
3. Configure:
   - Build Command: `npm install`
   - Start Command: `npm start`
4. Add environment variables from `.env.example`
5. Deploy

### MongoDB Atlas

1. Create cluster on MongoDB Atlas
2. Get connection string
3. Add to `MONGODB_URI` environment variable

## Security Features

- Password hashing with bcrypt
- JWT token authentication
- Rate limiting
- Helmet security headers
- CORS configuration
- Input validation
- File type validation

## License

MIT
