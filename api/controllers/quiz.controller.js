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
            title = null,
            category = 'practice',
            subcategory = 'general'
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
            title,
            category,
            subcategory
        };

        // Get user performance data for adaptive timing (if user is authenticated)
        const userId = req.user?.id || null;
        const userPerformance = userId ? await quizGenerationService.getUserPerformance(userId) : null;
        
        const result = await quizGenerationService.generateRegularQuiz(config, userPerformance);

        // Add timing breakdown to response
        const timingBreakdown = quizGenerationService.calculateTimingBreakdown(result.questions, userPerformance);

        res.status(201).json({
            success: true,
            message: 'Quiz generated successfully',
            ...result,
            timingBreakdown
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
        
        // Get user performance data for adaptive timing preview
        const userId = req.user?.id || null;
        const userPerformance = userId ? await quizGenerationService.getUserPerformance(userId) : null;
        
        // Calculate estimated time using adaptive timing
        const estimatedTime = quizGenerationService.calculateTimeLimit(
            Array(config.totalQuestions).fill({ 
                difficulty: difficulty === 'mixed' ? 'medium' : difficulty,
                questionType: 'code_analysis', // Default for estimation
                bigIdea: 1 // Default for estimation
            }),
            null,
            userPerformance
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

// Generate quiz by category
export const generateQuizByCategory = async (req, res, next) => {
    try {
        const { category, subcategory = 'general' } = req.params;
        const { totalQuestions = 30, difficulty = 'mixed' } = req.query;

        console.log(`Generating ${category} quiz with subcategory: ${subcategory}`);

        const config = {
            totalQuestions: parseInt(totalQuestions),
            difficulty,
            category,
            subcategory
        };

        // Get user performance data for adaptive timing
        const userId = req.user?.id || null;
        const userPerformance = userId ? await quizGenerationService.getUserPerformance(userId) : null;
        
        const result = await quizGenerationService.generateRegularQuiz(config, userPerformance);

        // Add timing breakdown to response
        const timingBreakdown = quizGenerationService.calculateTimingBreakdown(result.questions, userPerformance);

        res.status(201).json({
            success: true,
            message: `${category} quiz generated successfully`,
            ...result,
            timingBreakdown
        });

    } catch (error) {
        console.error('Error in generateQuizByCategory:', error);
        next(error);
    }
}

// Get quizzes by category with filtering
export const getQuizzesByCategory = async (req, res, next) => {
    try {
        const { category, subcategory, difficulty, tags } = req.query;
        
        // Build filter object
        const filter = { isActive: true };
        
        if (category) {
            filter.category = category;
        }
        
        if (subcategory) {
            filter.subcategory = subcategory;
        }
        
        if (difficulty) {
            filter.difficulty = difficulty;
        }
        
        if (tags) {
            filter.tags = { $in: tags.split(',') };
        }

        const quizzes = await Quiz.find(filter)
            .sort({ createdAt: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            quizzes,
            count: quizzes.length,
            filters: { category, subcategory, difficulty, tags }
        });

    } catch (error) {
        console.error('Error in getQuizzesByCategory:', error);
        next(error);
    }
}

// Get available categories and subcategories
export const getQuizCategories = async (req, res, next) => {
    try {
        const categories = [
            {
                id: 'practice',
                name: 'Practice Quiz',
                description: 'General practice covering all AP CSP topics',
                subcategories: [
                    { id: 'general', name: 'General AP CSP', description: 'All topics' },
                    { id: 'big-idea-1', name: 'Creative Development', description: 'Focus on Big Idea 1' },
                    { id: 'big-idea-2', name: 'Data', description: 'Focus on Big Idea 2' },
                    { id: 'big-idea-3', name: 'Algorithms & Programming', description: 'Focus on Big Idea 3' },
                    { id: 'big-idea-4', name: 'Computer Systems & Networks', description: 'Focus on Big Idea 4' },
                    { id: 'big-idea-5', name: 'Impact of Computing', description: 'Focus on Big Idea 5' }
                ]
            },
            {
                id: 'exam',
                name: 'Practice Exam',
                description: 'Full-length exam simulation',
                subcategories: [
                    { id: 'general', name: 'Full Exam', description: 'Complete AP CSP practice exam' }
                ]
            },
            {
                id: 'topic-specific',
                name: 'Topic-Specific',
                description: 'Focused quizzes on specific topics',
                subcategories: [
                    { id: 'algorithms', name: 'Algorithms', description: 'Algorithm design and analysis' },
                    { id: 'data-structures', name: 'Data Structures', description: 'Data organization and manipulation' },
                    { id: 'networking', name: 'Networking', description: 'Computer networks and protocols' },
                    { id: 'impact', name: 'Impact of Computing', description: 'Social and ethical implications' },
                    { id: 'code-analysis', name: 'Code Analysis', description: 'Reading and understanding code' },
                    { id: 'problem-solving', name: 'Problem Solving', description: 'Computational thinking' }
                ]
            },
            {
                id: 'mixed',
                name: 'Mixed Topics',
                description: 'Quizzes covering multiple topics',
                subcategories: [
                    { id: 'general', name: 'Mixed Topics', description: 'Various AP CSP topics' }
                ]
            },
            {
                id: 'custom',
                name: 'Custom Quiz',
                description: 'Customized quiz based on your specifications',
                subcategories: [
                    { id: 'general', name: 'Custom', description: 'Fully customizable quiz' }
                ]
            }
        ];

        res.status(200).json({
            success: true,
            categories
        });

    } catch (error) {
        console.error('Error in getQuizCategories:', error);
        next(error);
    }
}