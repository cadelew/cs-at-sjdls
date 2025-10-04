import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import quizRoutes from './routes/quiz.route.js';
import questionRoutes from './routes/question.route.js';
import quizStatRoutes from './routes/quizStat.route.js';
import analyticsRoutes from './routes/analytics.route.js';
import questionGenerationRoutes from './routes/questionGeneration.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config({path: './api/.env'});

 /* if MongoDB is connected, then prints "Connected to MongoDB" */
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB");
})

/* if MongoDB is not connected, there is an error message */
.catch((err) => {
    console.log(err)
})

const app = express();

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
            user: '/api/user'
        }
    });
});

app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/quiz', quizRoutes);
app.use('/api/question', questionRoutes);
app.use('/api/quiz-stat', quizStatRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use('/api/question-generation', questionGenerationRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
});