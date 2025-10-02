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
    const { attemptId } = req.params;
    const { score, totalTimeTaken } = req.body;
    try {
        const quizStat = await QuizStat.findById(attemptId);
        if (!quizStat) {
            return next(errorHandler(404, 'Quiz attempt not found'));
        }
        quizStat.score = score;
        quizStat.totalTimeTaken = totalTimeTaken;
        quizStat.completedAt = new Date();
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
    const { attemptId } = req.params;
    try {
        const quizStat = await QuizStat.findById(attemptId);
        res.status(200).json(quizStat);
    } catch (error) {
        next(error);
    }
}


