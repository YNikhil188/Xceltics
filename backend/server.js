import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import connectDB from './config/database.js';
import authRoutes from './routes/auth.routes.js';
import fileRoutes from './routes/file.routes.js';
import chartRoutes from './routes/chart.routes.js';
import insightRoutes from './routes/insight.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { errorHandler } from './middleware/errorHandler.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// CORS configuration - MUST BE FIRST (before helmet and other middleware)
const allowedOrigins = [
  'http://localhost:3000',
  'http://localhost:5173',
  'https://xceltics.vercel.app',
  'https://xceltics-nine.vercel.app',
  process.env.FRONTEND_URL
].filter(Boolean);

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps, Postman, curl, server-to-server)
    if (!origin) return callback(null, true);
    
    // Check if origin is in allowed list
    if (allowedOrigins.some(allowed => origin === allowed || origin.startsWith(allowed))) {
      callback(null, true);
    } else {
      console.log('CORS blocked origin:', origin);
      callback(null, true); // Allow all origins for now during testing
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept'],
  exposedHeaders: ['Content-Range', 'X-Content-Range']
};

app.use(cors(corsOptions));

// Handle preflight requests explicitly BEFORE other middleware
app.options('*', cors(corsOptions));

// Security middleware (AFTER CORS)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" },
  crossOriginOpenerPolicy: { policy: "same-origin-allow-popups" }
}));
app.use(compression());

// Rate limiting (AFTER CORS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.'
});
app.use('/api/', limiter);

// Body parser middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
if (process.env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Root route
app.get('/', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'XCELTICS API Server',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      auth: '/api/auth',
      files: '/api/files',
      charts: '/api/charts',
      insights: '/api/insights',
      admin: '/api/admin'
    }
  });
});

// Health check
app.get('/health', (req, res) => {
  res.status(200).json({ 
    success: true, 
    message: 'Server is running',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/files', fileRoutes);
app.use('/api/charts', chartRoutes);
app.use('/api/insights', insightRoutes);
app.use('/api/admin', adminRoutes);

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Error handler middleware (must be last)
app.use(errorHandler);

// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
});

export default app;
