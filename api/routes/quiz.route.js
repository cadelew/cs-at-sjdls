import express from 'express';
import { getQuizzes, getQuiz } from '../controllers/quiz.controller.js';
const router = express.Router();

router.get('/', getQuizzes);
router.get('/:id', getQuiz);

export default router;