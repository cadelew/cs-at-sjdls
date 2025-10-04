import Quiz from '../models/quiz.model.js';
import { errorHandler } from '../utils/error.js';


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