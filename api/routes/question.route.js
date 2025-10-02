import express from 'express';

const router = express.Router();

router.get('/api/quiz/:id/questions', getQuizQuestions);

export default router;