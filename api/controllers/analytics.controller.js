import Quiz from '../models/quiz.model.js';
import Question from '../models/question.model.js';
import { errorHandler } from '../utils/error.js';

// Get user's performance analytics
export const getUserAnalytics = async (req, res, next) => {
    const { userId } = req.params;
    
    try {
        // Get all completed quiz attempts for the user from the new quiz lifecycle system
        const quizzes = await Quiz.find({ 
            'completedBy.userId': userId
        });
        
        // Extract completion data for the user
        const attempts = [];
        quizzes.forEach(quiz => {
            const userCompletion = quiz.completedBy.find(completion => 
                completion.userId.toString() === userId.toString()
            );
            if (userCompletion) {
                attempts.push({
                    _id: quiz._id,
                    quizId: quiz._id,
                    title: quiz.title,
                    topic: quiz.topic,
                    difficulty: quiz.difficulty,
                    score: userCompletion.score,
                    timeSpent: userCompletion.timeSpent,
                    completedAt: userCompletion.completedAt,
                    answers: userCompletion.answers || []
                });
            }
        });
        
        if (attempts.length === 0) {
            return res.status(200).json({
                message: 'No completed quizzes found',
                analytics: {
                    totalQuizzes: 0,
                    averageScore: 0,
                    totalTimeSpent: 0,
                    topics: [],
                    difficultyBreakdown: {},
                    recentPerformance: [],
                    improvementTrend: 0
                }
            });
        }
        
        // Calculate analytics
        const totalQuizzes = attempts.length;
        const averageScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalQuizzes;
        const totalTimeSpent = attempts.reduce((sum, attempt) => sum + (attempt.timeSpent || 0), 0);
        
        // Topic performance
        const topicPerformance = {};
        const difficultyBreakdown = {};
        
        attempts.forEach(attempt => {
            // Topic performance
            if (!topicPerformance[attempt.topic]) {
                topicPerformance[attempt.topic] = {
                    totalAttempts: 0,
                    totalScore: 0,
                    averageScore: 0
                };
            }
            topicPerformance[attempt.topic].totalAttempts++;
            topicPerformance[attempt.topic].totalScore += attempt.score;
            topicPerformance[attempt.topic].averageScore = 
                topicPerformance[attempt.topic].totalScore / topicPerformance[attempt.topic].totalAttempts;
            
            // Difficulty breakdown
            if (!difficultyBreakdown[attempt.difficulty]) {
                difficultyBreakdown[attempt.difficulty] = {
                    totalAttempts: 0,
                    totalScore: 0,
                    averageScore: 0
                };
            }
            difficultyBreakdown[attempt.difficulty].totalAttempts++;
            difficultyBreakdown[attempt.difficulty].totalScore += attempt.score;
            difficultyBreakdown[attempt.difficulty].averageScore = 
                difficultyBreakdown[attempt.difficulty].totalScore / difficultyBreakdown[attempt.difficulty].totalAttempts;
        });
        
        // Recent performance (last 10 attempts)
        const recentPerformance = attempts
            .sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt))
            .slice(0, 10)
            .map(attempt => ({
                quizTitle: attempt.title || 'Unknown Quiz',
                score: attempt.score,
                completedAt: attempt.completedAt,
                timeTaken: attempt.timeSpent || 0
            }));
        
        // Improvement trend (compare first half vs second half)
        const sortedAttempts = attempts.sort((a, b) => new Date(a.completedAt) - new Date(b.completedAt));
        const midPoint = Math.floor(sortedAttempts.length / 2);
        const firstHalf = sortedAttempts.slice(0, midPoint);
        const secondHalf = sortedAttempts.slice(midPoint);
        
        const firstHalfAvg = firstHalf.reduce((sum, attempt) => sum + attempt.score, 0) / firstHalf.length;
        const secondHalfAvg = secondHalf.reduce((sum, attempt) => sum + attempt.score, 0) / secondHalf.length;
        const improvementTrend = secondHalfAvg - firstHalfAvg;
        
        res.status(200).json({
            analytics: {
                totalQuizzes,
                averageScore: Math.round(averageScore * 100) / 100,
                totalTimeSpent,
                topics: Object.keys(topicPerformance),
                topicPerformance,
                difficultyBreakdown,
                recentPerformance,
                improvementTrend: Math.round(improvementTrend * 100) / 100
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// Get detailed quiz performance analysis
export const getQuizPerformanceAnalysis = async (req, res, next) => {
    const { quizId, userId } = req.params;
    
    try {
        // Get all attempts for this quiz by this user
        const attempts = await QuizStat.find({ 
            quizId: quizId, 
            userId: userId,
            isCompleted: true 
        }).sort({ completedAt: 1 });
        
        if (attempts.length === 0) {
            return next(errorHandler(404, 'No completed attempts found for this quiz'));
        }
        
        // Get quiz details
        const quiz = await Quiz.findById(quizId);
        if (!quiz) {
            return next(errorHandler(404, 'Quiz not found'));
        }
        
        // Get questions for detailed analysis
        const questions = await Question.find({ quizId: quizId });
        
        // Calculate performance metrics
        const totalAttempts = attempts.length;
        const bestScore = Math.max(...attempts.map(a => a.score));
        const worstScore = Math.min(...attempts.map(a => a.score));
        const averageScore = attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts;
        const averageTime = attempts.reduce((sum, attempt) => sum + (attempt.totalTimeTaken || 0), 0) / totalAttempts;
        
        // Question-level analysis
        const questionAnalysis = questions.map(question => {
            const questionAttempts = attempts.map(attempt => {
                const answer = attempt.answers.find(a => a.questionId.toString() === question._id.toString());
                return {
                    isCorrect: answer ? answer.isCorrect : false,
                    timeTaken: answer ? answer.timeTaken : 0,
                    attemptNumber: attempts.indexOf(attempt) + 1
                };
            });
            
            const correctCount = questionAttempts.filter(qa => qa.isCorrect).length;
            const averageTimeForQuestion = questionAttempts.reduce((sum, qa) => sum + qa.timeTaken, 0) / questionAttempts.length;
            
            return {
                questionId: question._id,
                questionText: question.questionsText,
                topic: question.topic,
                difficulty: question.points || 1,
                accuracy: (correctCount / totalAttempts) * 100,
                averageTime: averageTimeForQuestion,
                attempts: questionAttempts
            };
        });
        
        // Performance over time
        const performanceOverTime = attempts.map((attempt, index) => ({
            attemptNumber: index + 1,
            score: attempt.score,
            timeTaken: attempt.totalTimeTaken || 0,
            completedAt: attempt.completedAt,
            correctAnswers: attempt.correctAnswers || 0,
            totalQuestions: attempt.totalQuestions || questions.length
        }));
        
        // Weak areas identification
        const weakAreas = questionAnalysis
            .filter(q => q.accuracy < 60)
            .sort((a, b) => a.accuracy - b.accuracy)
            .slice(0, 5);
        
        // Strong areas identification
        const strongAreas = questionAnalysis
            .filter(q => q.accuracy >= 80)
            .sort((a, b) => b.accuracy - a.accuracy)
            .slice(0, 5);
        
        res.status(200).json({
            quiz: {
                title: quiz.title,
                topic: quiz.topic,
                difficulty: quiz.difficulty,
                totalQuestions: questions.length
            },
            performance: {
                totalAttempts,
                bestScore,
                worstScore,
                averageScore: Math.round(averageScore * 100) / 100,
                averageTime: Math.round(averageTime),
                improvement: totalAttempts > 1 ? 
                    Math.round((attempts[attempts.length - 1].score - attempts[0].score) * 100) / 100 : 0
            },
            questionAnalysis,
            performanceOverTime,
            weakAreas,
            strongAreas
        });
        
    } catch (error) {
        next(error);
    }
};

// Get global quiz statistics (for admin/insights)
export const getGlobalQuizStats = async (req, res, next) => {
    try {
        // Get all completed quiz attempts
        const allAttempts = await QuizStat.find({ isCompleted: true })
            .populate('quizId', 'title topic difficulty');
        
        if (allAttempts.length === 0) {
            return res.status(200).json({
                message: 'No quiz attempts found',
                stats: {
                    totalAttempts: 0,
                    averageScore: 0,
                    mostPopularQuizzes: [],
                    topicDistribution: {},
                    difficultyDistribution: {}
                }
            });
        }
        
        // Basic stats
        const totalAttempts = allAttempts.length;
        const averageScore = allAttempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts;
        
        // Most popular quizzes
        const quizCounts = {};
        allAttempts.forEach(attempt => {
            const quizTitle = attempt.quizId?.title || 'Unknown Quiz';
            quizCounts[quizTitle] = (quizCounts[quizTitle] || 0) + 1;
        });
        
        const mostPopularQuizzes = Object.entries(quizCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 10)
            .map(([title, count]) => ({ title, attempts: count }));
        
        // Topic distribution
        const topicDistribution = {};
        allAttempts.forEach(attempt => {
            const topic = attempt.quizId?.topic || 'Unknown Topic';
            topicDistribution[topic] = (topicDistribution[topic] || 0) + 1;
        });
        
        // Difficulty distribution
        const difficultyDistribution = {};
        allAttempts.forEach(attempt => {
            const difficulty = attempt.quizId?.difficulty || 'Unknown';
            difficultyDistribution[difficulty] = (difficultyDistribution[difficulty] || 0) + 1;
        });
        
        // Score distribution
        const scoreRanges = {
            '0-20': 0,
            '21-40': 0,
            '41-60': 0,
            '61-80': 0,
            '81-100': 0
        };
        
        allAttempts.forEach(attempt => {
            if (attempt.score <= 20) scoreRanges['0-20']++;
            else if (attempt.score <= 40) scoreRanges['21-40']++;
            else if (attempt.score <= 60) scoreRanges['41-60']++;
            else if (attempt.score <= 80) scoreRanges['61-80']++;
            else scoreRanges['81-100']++;
        });
        
        res.status(200).json({
            stats: {
                totalAttempts,
                averageScore: Math.round(averageScore * 100) / 100,
                mostPopularQuizzes,
                topicDistribution,
                difficultyDistribution,
                scoreDistribution: scoreRanges
            }
        });
        
    } catch (error) {
        next(error);
    }
};

// Get user's quiz history
export const getUserQuizHistory = async (req, res, next) => {
    const { userId } = req.params;
    const { limit = 20, offset = 0 } = req.query;
    
    try {
        // Get all completed quiz attempts for the user from the new quiz lifecycle system
        const quizzes = await Quiz.find({ 
            'completedBy.userId': userId
        });
        
        // Extract completion data for the user
        const attempts = [];
        quizzes.forEach(quiz => {
            const userCompletion = quiz.completedBy.find(completion => 
                completion.userId.toString() === userId.toString()
            );
            if (userCompletion) {
                attempts.push({
                    _id: quiz._id,
                    quizId: quiz._id,
                    title: quiz.title,
                    topic: quiz.topic,
                    difficulty: quiz.difficulty,
                    score: userCompletion.score,
                    timeSpent: userCompletion.timeSpent,
                    completedAt: userCompletion.completedAt,
                    answers: userCompletion.answers || []
                });
            }
        });
        
        // Sort by completion date (most recent first)
        attempts.sort((a, b) => new Date(b.completedAt) - new Date(a.completedAt));
        
        const totalCount = attempts.length;
        const paginatedAttempts = attempts.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
        
        const history = paginatedAttempts.map(attempt => ({
            attemptId: attempt._id,
            quizTitle: attempt.title || 'Unknown Quiz',
            topic: attempt.topic || 'Unknown Topic',
            difficulty: attempt.difficulty || 'Unknown',
            score: attempt.score,
            totalQuestions: attempt.answers?.length || 0,
            correctAnswers: Math.round((attempt.score / 100) * (attempt.answers?.length || 0)),
            timeTaken: attempt.timeSpent || 0,
            completedAt: attempt.completedAt
        }));
        
        res.status(200).json({
            history,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                offset: parseInt(offset),
                hasMore: totalCount > parseInt(offset) + parseInt(limit)
            }
        });
        
    } catch (error) {
        next(error);
    }
};
