import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;


const quizSchema = new mongoose.Schema({
    title: String,
    description: String,
    topic: String,
    difficulty: String,
    timeLimit: Number,
    totalQuestions: Number,
    passingScore: Number,
    isActive: Boolean
});

export default mongoose.model('Quiz', quizSchema);