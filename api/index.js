import express from 'express'
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import userRoutes from './routes/user.route.js';

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

app.listen(3000, () => {
    console.log('Server listening on port 3000!');
});

app.use("/api/user", userRoutes);