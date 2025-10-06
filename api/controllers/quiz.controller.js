import Quiz from '../models/quiz.model.js';
import { errorHandler } from '../utils/error.js';
import QuizGenerationService from '../services/quizGenerationService.js';

const quizGenerationService = new QuizGenerationService();


export const getQuizzes = async (req, res, next) => {
    const { sortBy, order } = req.query;
    const allowedSortBy = ['topic', 'difficulty', 'timeLimit', 'totalQuestions', 'title'];
    const sortField = allowedSortBy.includes(sortBy) ? sortBy : 'title';
    const sortOrder = order === 'asc' ? 1 : -1;
    
    try {
        const quizzes = await Quiz.find({ isActive: true }).sort({ [sortField]: sortOrder });
        res.status(200).json(quizzes);
    } catch (error) {
        next(error);
    }
}

export const getQuiz = async (req, res, next) => {
    const { id } = req.params;
    try {
        const quiz = await Quiz.findById(id);
        if (!quiz) {
            return next(errorHandler(404, 'Quiz not found'));
        }
        res.status(200).json(quiz);
    } catch (error) {
        next(error);
    }
}

export const createQuiz = async (req, res, next) => {
    try {
        const { title, description, topic, difficulty, timeLimit, totalQuestions, isActive } = req.body;
        
        const newQuiz = new Quiz({
            title,
            description,
            topic,
            difficulty,
            timeLimit,
            totalQuestions,
            isActive: isActive !== undefined ? isActive : true
        });
        
        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (error) {
        next(error);
    }
}

// Generate a new quiz from question bank
export const generateQuiz = async (req, res, next) => {
    try {
        const {
            totalQuestions = 30, // Increased default
            timeLimit = null,
            difficulty = 'mixed',
            bigIdeaDistribution = 'balanced',
            questionTypeDistribution = 'balanced',
            topic = 'general',
            passingScore = 70,
            specificBigIdea = null,
            title = null
        } = req.body;

        console.log('Generating quiz with config:', req.body);

        const config = {
            totalQuestions: parseInt(totalQuestions),
            timeLimit: timeLimit ? parseInt(timeLimit) : null,
            difficulty,
            bigIdeaDistribution,
            questionTypeDistribution,
            topic,
            passingScore: parseInt(passingScore),
            specificBigIdea: specificBigIdea ? parseInt(specificBigIdea) : null,
            title
        };

        const result = await quizGenerationService.generateRegularQuiz(config);

        res.status(201).json({
            success: true,
            message: 'Quiz generated successfully',
            ...result
        });

    } catch (error) {
        console.error('Error in generateQuiz:', error);
        next(error);
    }
}

// Get question bank statistics for quiz planning
export const getQuestionBankStats = async (req, res, next) => {
    try {
        const stats = await quizGenerationService.getQuestionBankStats();
        
        res.status(200).json({
            success: true,
            stats: stats
        });

    } catch (error) {
        console.error('Error getting question bank stats:', error);
        next(error);
    }
}

// Preview quiz generation without saving
export const previewQuiz = async (req, res, next) => {
    try {
        const {
            totalQuestions = 30, // Increased default
            difficulty = 'mixed',
            bigIdeaDistribution = 'balanced',
            questionTypeDistribution = 'balanced',
            topic = 'general',
            specificBigIdea = null
        } = req.body;

        const config = {
            totalQuestions: parseInt(totalQuestions),
            difficulty,
            bigIdeaDistribution,
            questionTypeDistribution,
            topic,
            specificBigIdea: specificBigIdea ? parseInt(specificBigIdea) : null,
            preview: true // Flag to indicate this is a preview
        };

        // Calculate distribution without generating quiz
        const distribution = quizGenerationService.calculateQuestionDistribution(config);
        
        // Get available question counts for each category
        const stats = await quizGenerationService.getQuestionBankStats();
        
        // Calculate estimated time (in minutes)
        const estimatedTime = quizGenerationService.calculateTimeLimit(
            Array(config.totalQuestions).fill({ difficulty: difficulty === 'mixed' ? 'medium' : difficulty }),
            null
        );

        res.status(200).json({
            success: true,
            preview: {
                distribution,
                stats,
                estimatedTime,
                config
            }
        });

    } catch (error) {
        console.error('Error in previewQuiz:', error);
        next(error);
    }
}