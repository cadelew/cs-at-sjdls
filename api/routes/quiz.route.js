import express from 'express';

const router = express.Router();

router.get('/api/quiz', getQuizzes);
router.get('/api/quiz/:id', getQuiz);

export default router;