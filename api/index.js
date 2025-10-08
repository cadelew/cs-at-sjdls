import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import compression from 'compression';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import quizRoutes from './routes/quiz.route.js';
import questionRoutes from './routes/question.route.js';
import quizStatRoutes from './routes/quizStat.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';
import cacheManager from './utils/cacheManager.js';

dotenv.config({path: './api/.env'});

 /* if MongoDB is connected, then prints "Connected to MongoDB" */
mongoose.connect(process.env.MONGO, {
    maxPoolSize: 25,        // Higher pool size for concurrency
    minPoolSize: 15,        // Keep more connections ready
    maxIdleTimeMS: 5000,    // Very short idle time
    serverSelectionTimeoutMS: 1000, // Very fast timeout
    socketTimeoutMS: 15000, // Fast socket timeout
    connectTimeoutMS: 5000  // Fast connection timeout
}).then(() => {
    console.log("✅ Connected to MongoDB with sub-25ms optimized settings");
})

/* if MongoDB is not connected, there is an error message */
.catch((err) => {
    console.log("❌ MongoDB connection failed:", err)
})

const app = express();

// Performance monitoring middleware
app.use((req, res, next) => {
    const start = Date.now();
    
    res.on('finish', () => {
        const duration = Date.now() - start;
        const status = duration <= 25 ? '🟢 EXCELLENT' : 
                      duration <= 50 ? '🟡 GOOD' : '🔴 SLOW';
        
        console.log(`${status} ${req.method} ${req.path} - ${duration}ms`);
        
        if (duration > 100) {
            console.warn(`⚠️ SLOW REQUEST: ${req.method} ${req.path} - ${duration}ms`);
        }
    });
    
    next();
});

// Enable compression for faster responses
app.use(compression());

// Add CORS configuration
app.use(cors({
  origin: [
    'http://localhost:5173', // Development
    'https://cs-at-sjdls.vercel.app' // Production
  ],
  credentials: true, // Allow cookies to be sent
}));

app.use(express.json());

app.use(cookieParser());

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}!`);
});

// Add a root route for testing
app.get('/', (req, res) => {
    res.json({ 
        message: 'CS at SJDLS API is running!', 
        status: 'success',
        endpoints: {
            auth: '/api/auth',
            user: '/api/user',
            quiz: '/api/quiz',
            question: '/api/question',
            analytics: '/api/analytics'
        }
    });
});


app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/quiz-stat', quizStatRoutes);
app.use('/api/analytics', analyticsRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
});