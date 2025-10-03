import mongoose from "mongoose";
const { ObjectId } = mongoose.Schema.Types;

const quizStatSchema = new mongoose.Schema({
    quizId: ObjectId,
    userId: String,
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
    // Progress tracking fields
    currentQuestion: { type: Number, default: 0 },
    timeRemaining: Number,
    lastSaved: Date,
    isCompleted: { type: Boolean, default: false }
}, {
    timestamps: true // Adds createdAt and updatedAt automatically
});

export default mongoose.model('QuizStat', quizStatSchema);