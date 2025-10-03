import Question from '../models/question.model.js';
import Quiz from '../models/quiz.model.js';
import QuizStat from '../models/quizStat.model.js';
import { errorHandler } from '../utils/error.js';

export const createQuizStat = async (req, res, next) => {
    const { quizId, userId} = req.body;
    const newQuizStat = new QuizStat({ quizId, userId});
    
    try {
        const quiz = await Quiz.findById(quizId);
        if (!quiz || !quiz.isActive) {
            return next(errorHandler(400, 'Quiz not found or is not active'));
        }
        await newQuizStat.save();
        res.status(201).json(newQuizStat);
    } catch (error) {
        next(error);
    }
}

export const submitAnswerQuizStat = async (req, res, next) => {
    const { attemptid } = req.params;
    const { answer } = req.body;

    try {
        
        if (!answer) {
            return next(errorHandler(400, 'Answer is required'));
        }
        const quizStat = await QuizStat.findById(attemptid);
        if (!quizStat) {
            return next(errorHandler(404, 'Quiz attempt not found'));
        }
        quizStat.answers.push(answer);
        await quizStat.save();
        res.status(200).json(quizStat);
    } catch (error) {
        next(error);
    }
}

export const submitQuizStat = async (req, res, next) => {
    const { attemptid } = req.params;
    const { score, totalTimeTaken, totalQuestions, correctAnswers, incorrectAnswers, skippedQuestions } = req.body;
    
    console.log('Backend submitQuizStat called:', { 
        attemptid, 
        score, 
        totalTimeTaken,
        totalQuestions,
        correctAnswers,
        incorrectAnswers,
        skippedQuestions
    });
    
    try {
        const quizStat = await QuizStat.findById(attemptid);
        if (!quizStat) {
            console.log('Quiz attempt not found:', attemptid);
            return next(errorHandler(404, 'Quiz attempt not found'));
        }
        
        // Update all completion fields
        quizStat.score = score;
        quizStat.totalTimeTaken = totalTimeTaken;
        quizStat.totalQuestions = totalQuestions || quizStat.totalQuestions;
        quizStat.correctAnswers = correctAnswers || quizStat.correctAnswers;
        quizStat.incorrectAnswers = incorrectAnswers || quizStat.incorrectAnswers;
        quizStat.skippedQuestions = skippedQuestions || quizStat.skippedQuestions;
        quizStat.completedAt = new Date();
        quizStat.isCompleted = true; // Mark as completed
        
        await quizStat.save();
        res.status(200).json(quizStat);
    } catch (error) {
        next(error);
    }
}


export const getQuizStats = async (req, res, next) => {
    const { userId } = req.params;
    try {
        const quizStats = await QuizStat.find({ userId: userId });
        res.status(200).json(quizStats);

    } catch (error) {
        next(error);
    }
}

export const getQuizStat = async (req, res, next) => {
    const { attemptid } = req.params;
    try {
        const quizStat = await QuizStat.findById(attemptid);
        if (!quizStat) {
            return next(errorHandler(404, 'Quiz attempt not found'));
        }
        res.status(200).json(quizStat);
    } catch (error) {
        next(error);
    }
}

// Save quiz progress (for resume functionality)
export const saveQuizProgress = async (req, res, next) => {
    const { attemptid } = req.params;
    const { currentQuestion, timeRemaining } = req.body;
    
    try {
        const quizStat = await QuizStat.findById(attemptid);
        if (!quizStat) {
            return next(errorHandler(404, 'Quiz attempt not found'));
        }
        
        // Update progress fields
        quizStat.currentQuestion = currentQuestion;
        quizStat.timeRemaining = timeRemaining;
        quizStat.lastSaved = new Date();
        
        await quizStat.save();
        
        res.status(200).json({ message: 'Progress saved successfully', quizStat });
    } catch (error) {
        next(error);
    }
}

// Get user's quiz attempts for a specific quiz
export const getUserQuizAttempts = async (req, res, next) => {
    const { quizId, userId } = req.params;
    
    try {
        const attempts = await QuizStat.find({ 
            quizId: quizId, 
            userId: userId 
        }).sort({ createdAt: -1 });
        
        res.status(200).json(attempts);
    } catch (error) {
        next(error);
    }
}


