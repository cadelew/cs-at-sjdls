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
    isActive: Boolean,
    generatedBy: { type: String, default: 'manual' }, // 'manual', 'system', 'ai'
    questionIds: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }],
    metadata: {
        distribution: {
            bigIdea: mongoose.Schema.Types.Mixed,
            questionType: mongoose.Schema.Types.Mixed,
            difficulty: mongoose.Schema.Types.Mixed
        },
        generatedAt: Date,
        questionTypes: [String],
        bigIdeas: [Number],
        difficulties: [String]
    }
});

export default mongoose.model('Quiz', quizSchema);