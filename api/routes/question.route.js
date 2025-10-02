import express from 'express';

const router = express.Router();

router.get('/:id/questions', getQuizQuestions);

export default router;