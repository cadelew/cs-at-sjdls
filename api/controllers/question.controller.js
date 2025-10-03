import Question from '../models/question.model.js';
import { errorHandler } from '../utils/error.js';

export const getQuestions = async (req, res, next) => {
    const { id } = req.params;
    try {
        const questions = await Question.find({ quizId: id});
        if (questions.length === 0) {
            return next(errorHandler(404, 'Questions not found'));
        }
        res.status(200).json(questions);
    } catch (error) {
        next(error);
    }
}