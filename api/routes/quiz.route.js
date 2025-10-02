import express from 'express';

const router = express.Router();

router.get('/', getQuizzes);
router.get('/:id', getQuiz);

export default router;