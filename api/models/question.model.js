import mongoose from "mongoose";

const questionSchema = new mongoose.Schema({
    questionsText: String,
    options: [String],
    correctAnswer: Number,
    explanation: String,
    topic: String,
    bigIdea: Number,
    questionType: String,
    difficulty: String,
    points: { type: Number, default: 5 },
    tags: [String],
    metadata: {
        generatedBy: { type: String, default: 'human' },
        validationScore: { type: Number, default: 1.0 },
        usageCount: { type: Number, default: 0 },
        averageScore: { type: Number, default: 0 },
        createdAt: { type: Date, default: Date.now },
        lastUsed: Date,
        isActive: { type: Boolean, default: true }
    }
});


export default mongoose.model('Question', questionSchema);

