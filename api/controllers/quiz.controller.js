import Quiz from '../models/quiz.model.js';
import { errorHandler } from '../utils/error.js';
import QuizGenerationService from '../services/quizGenerationService.js';
import QuizLifecycleService from '../services/quizLifecycleService.js';
import cacheManager from '../utils/cacheManager.js';

const quizGenerationService = new QuizGenerationService();
const quizLifecycleService = new QuizLifecycleService();


export const getQuizzes = async (req, res, next) => {
    const { sortBy, order, category } = req.query;
    const allowedSortBy = ['topic', 'difficulty', 'timeLimit', 'totalQuestions', 'title'];
    const sortField = allowedSortBy.includes(sortBy) ? sortBy : 'title';
    const sortOrder = order === 'asc' ? 1 : -1;
    
    try {
        // Use cache-first strategy for better performance
        const result = await cacheManager.getActiveQuizzes(category);
        
        // Apply sorting to cached or fresh data
        const sortedQuizzes = result.data.sort((a, b) => {
            const aVal = a[sortField] || '';
            const bVal = b[sortField] || '';
            return sortOrder === 1 ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal);
        });
        
        res.status(200).json({
            data: sortedQuizzes,
            source: result.source,
            latency: result.latency,
            cached: result.source === 'cache'
        });
    } catch (error) {
        next(error);
    }
}

export const getQuiz = async (req, res, next) => {
    const { id } = req.params;
    try {
        // Use lean() and select() for faster queries
        const quiz = await Quiz.findById(id)
            .lean()
            .select('title description category subcategory totalQuestions timeLimit status questionIds metadata');
        
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

// Get active quizzes for a category/subcategory
export const getActiveQuizzes = async (req, res, next) => {
    try {
        const { category, subcategory = 'general' } = req.params;
        const userId = req.user?.id || null;

        const activeQuizzes = await quizLifecycleService.getActiveQuizzes(category, subcategory, userId);

        res.status(200).json({
            success: true,
            quizzes: activeQuizzes,
            count: activeQuizzes.length,
            category,
            subcategory
        });

    } catch (error) {
        console.error('Error in getActiveQuizzes:', error);
        next(error);
    }
}

// Get user's quiz history
export const getUserQuizHistory = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const {
            category = null,
            subcategory = null,
            limit = 20,
            page = 1
        } = req.query;

        const history = await quizLifecycleService.getUserQuizHistory(userId, {
            category,
            subcategory,
            limit: parseInt(limit),
            page: parseInt(page)
        });

        res.status(200).json({
            success: true,
            history,
            count: history.length,
            pagination: {
                page: parseInt(page),
                limit: parseInt(limit),
                hasMore: history.length === parseInt(limit)
            }
        });

    } catch (error) {
        console.error('Error in getUserQuizHistory:', error);
        next(error);
    }
}

// Complete a quiz and move to history
export const completeQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const {
            score,
            timeSpent,
            answers = []
        } = req.body;

        if (score === undefined || timeSpent === undefined) {
            return res.status(400).json({
                success: false,
                message: 'Score and timeSpent are required'
            });
        }

        const result = await quizLifecycleService.completeQuiz(quizId, userId, {
            score,
            timeSpent,
            answers
        });

        res.status(200).json(result);

    } catch (error) {
        console.error('Error in completeQuiz:', error);
        next(error);
    }
}

// Retake a quiz from history
export const retakeQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const result = await quizLifecycleService.retakeQuiz(quizId, userId);

        res.status(201).json(result);

    } catch (error) {
        console.error('Error in retakeQuiz:', error);
        next(error);
    }
}

// Get quiz lifecycle statistics
export const getQuizLifecycleStats = async (req, res, next) => {
    try {
        const stats = await quizLifecycleService.getQuizStats();

        res.status(200).json({
            success: true,
            stats
        });

    } catch (error) {
        console.error('Error in getQuizLifecycleStats:', error);
        next(error);
    }
}

// Initialize active quiz pools (admin endpoint)
export const initializeQuizPools = async (req, res, next) => {
    try {
        await quizLifecycleService.initializeActiveQuizPools();

        res.status(200).json({
            success: true,
            message: 'Active quiz pools initialized successfully'
        });

    } catch (error) {
        console.error('Error in initializeQuizPools:', error);
        next(error);
    }
}

// Archive old quizzes (admin endpoint)
export const archiveOldQuizzes = async (req, res, next) => {
    try {
        const archivedCount = await quizLifecycleService.archiveOldQuizzes();

        res.status(200).json({
            success: true,
            message: `Archived ${archivedCount} old quizzes`,
            archivedCount
        });

    } catch (error) {
        console.error('Error in archiveOldQuizzes:', error);
        next(error);
    }
}

// Cleanup expired quizzes (admin endpoint)
export const cleanupExpiredQuizzes = async (req, res, next) => {
    try {
        const deletedCount = await quizLifecycleService.cleanupExpiredQuizzes();

        res.status(200).json({
            success: true,
            message: `Cleaned up ${deletedCount} expired quizzes`,
            deletedCount
        });

    } catch (error) {
        console.error('Error in cleanupExpiredQuizzes:', error);
        next(error);
    }
}

// Start a quiz (mark as in-progress)
export const startQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const result = await quizLifecycleService.startQuiz(quizId, userId);

        res.status(200).json(result);

    } catch (error) {
        console.error('Error in startQuiz:', error);
        next(error);
    }
}

// Resume a quiz (same as start, but clearer semantics)
export const resumeQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const result = await quizLifecycleService.startQuiz(quizId, userId);
        
        // Update the message to be more specific for resume
        if (result.message === 'Resuming existing quiz') {
            result.message = 'Quiz resumed successfully';
        }

        res.status(200).json(result);

    } catch (error) {
        console.error('Error in resumeQuiz:', error);
        next(error);
    }
}

// Update quiz progress
export const updateQuizProgress = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const {
            currentQuestion,
            answers = [],
            timeRemaining
        } = req.body;

        const result = await quizLifecycleService.updateQuizProgress(quizId, userId, {
            currentQuestion,
            answers,
            timeRemaining
        });

        res.status(200).json(result);

    } catch (error) {
        console.error('Error in updateQuizProgress:', error);
        next(error);
    }
}

// Get user's in-progress quizzes
export const getUserInProgressQuizzes = async (req, res, next) => {
    try {
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const inProgressQuizzes = await quizLifecycleService.getUserInProgressQuizzes(userId);

        res.status(200).json({
            success: true,
            quizzes: inProgressQuizzes,
            count: inProgressQuizzes.length
        });

    } catch (error) {
        console.error('Error in getUserInProgressQuizzes:', error);
        next(error);
    }
}

// Abandon a quiz
export const abandonQuiz = async (req, res, next) => {
    try {
        const { quizId } = req.params;
        const userId = req.user?.id;
        
        if (!userId) {
            return res.status(401).json({
                success: false,
                message: 'User authentication required'
            });
        }

        const result = await quizLifecycleService.abandonQuiz(quizId, userId);

        res.status(200).json(result);

    } catch (error) {
        console.error('Error in abandonQuiz:', error);
        next(error);
    }
}

// Get abandoned quizzes (admin endpoint)
export const getAbandonedQuizzes = async (req, res, next) => {
    try {
        const abandonedQuizzes = await quizLifecycleService.getAbandonedQuizzes();

        res.status(200).json({
            success: true,
            quizzes: abandonedQuizzes,
            count: abandonedQuizzes.length,
            message: 'Abandoned quizzes retrieved (manual cleanup required)'
        });

    } catch (error) {
        console.error('Error in getAbandonedQuizzes:', error);
        next(error);
    }
}