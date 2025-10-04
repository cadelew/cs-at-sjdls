import express from 'express';
import { getQuizzes, getQuiz, createQuiz } from '../controllers/quiz.controller.js';
const router = express.Router();

router.get('/', getQuizzes);
router.get('/:id', getQuiz);
router.post('/', createQuiz);

export default router;