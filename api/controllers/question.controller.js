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

// Get questions from question bank based on filters
export const getQuestionBank = async (req, res, next) => {
    try {
        const { 
            topic, 
            bigIdea, 
            questionType, 
            difficulty, 
            tags, 
            limit = 50, 
            skip = 0,
            sortBy = 'createdAt',
            sortOrder = 'desc'
        } = req.query;

        // Build filter object
        const filter = { 'metadata.isActive': true };
        
        if (topic) filter.topic = topic;
        if (bigIdea) filter.bigIdea = parseInt(bigIdea);
        if (questionType) filter.questionType = questionType;
        if (difficulty) filter.difficulty = difficulty;
        if (tags) {
            const tagArray = tags.split(',').map(tag => tag.trim());
            filter.tags = { $in: tagArray };
        }

        // Build sort object
        const sort = {};
        sort[sortBy] = sortOrder === 'desc' ? -1 : 1;

        const questions = await Question.find(filter)
            .sort(sort)
            .limit(parseInt(limit))
            .skip(parseInt(skip));

        // Get total count for pagination
        const totalCount = await Question.countDocuments(filter);

        res.status(200).json({
            questions,
            pagination: {
                total: totalCount,
                limit: parseInt(limit),
                skip: parseInt(skip),
                hasMore: (parseInt(skip) + questions.length) < totalCount
            }
        });
    } catch (error) {
        next(error);
    }
}