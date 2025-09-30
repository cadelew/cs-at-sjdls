import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';
import authRoutes from './routes/auth.route.js';
import cookieParser from 'cookie-parser';
import cors from 'cors';

dotenv.config();

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
  origin: 'http://localhost:5173', // Your Vite dev server URL
  credentials: true, // Allow cookies to be sent
}));

app.use(express.json());

app.use(cookieParser());

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

app.use("/api/user", userRoutes);
app.use('/api/auth', authRoutes);

app.use((err, req, res, next) => {
    const statusCode = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';
    return res.status(statusCode).json({
        success: false,
        message,
        statusCode,
    })
});