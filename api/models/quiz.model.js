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
    category: {
        type: String,
        enum: ['practice', 'exam', 'topic-specific', 'mixed', 'custom'],
        default: 'practice'
    },
    subcategory: {
        type: String,
        enum: ['general', 'big-idea-1', 'big-idea-2', 'big-idea-3', 'big-idea-4', 'big-idea-5', 'algorithms', 'data-structures', 'networking', 'impact', 'code-analysis', 'problem-solving'],
        default: 'general'
    },
    tags: [String], // Additional tags for filtering
    status: {
        type: String,
        enum: ['active', 'completed', 'archived'],
        default: 'active'
    },
    completedBy: [{
        userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
        completedAt: { type: Date, default: Date.now },
        score: Number,
        timeSpent: Number, // in minutes
        answers: [{
            questionId: mongoose.Schema.Types.ObjectId,
            selectedAnswer: Number,
            isCorrect: Boolean,
            timeSpent: Number // seconds per question
        }]
    }],
    expiresAt: { type: Date, default: () => new Date(Date.now() + 90 * 24 * 60 * 60 * 1000) }, // 90 days from creation
    metadata: {
        distribution: {
            bigIdea: mongoose.Schema.Types.Mixed,
            questionType: mongoose.Schema.Types.Mixed,
            difficulty: mongoose.Schema.Types.Mixed
        },
        generatedAt: Date,
        questionTypes: [String],
        bigIdeas: [Number],
        difficulties: [String],
        timingBreakdown: mongoose.Schema.Types.Mixed // Store timing breakdown
    }
});

export default mongoose.model('Quiz', quizSchema);