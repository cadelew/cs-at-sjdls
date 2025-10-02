import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const quizStatSchema = new mongoose.Schema({
    quizId: ObjectId,
    userId: ObjectId,
    answers: [{
        questionId: ObjectId,
        chosenAnswer: Number,
        isCorrect: Boolean,
        isSkipped: Boolean,
        timeTaken: Number,
        date: Date
    }],
    totalQuestions: Number,
    correctAnswers: Number,
    incorrectAnswers: Number,
    score: Number,
    skippedQuestions: Number,
    totalTimeTaken: Number,
    completedAt: Date,
});

export default mongoose.model('QuizStat', quizStatSchema);