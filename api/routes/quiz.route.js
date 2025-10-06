import express from 'express';
import { getQuizzes, getQuiz, createQuiz, generateQuiz, getQuestionBankStats, previewQuiz } from '../controllers/quiz.controller.js';
const router = express.Router();

router.get('/', getQuizzes);
router.get('/:id', getQuiz);
router.post('/', createQuiz);

// Quiz generation routes
router.post('/generate', generateQuiz);
router.get('/stats/question-bank', getQuestionBankStats);
router.post('/preview', previewQuiz);

export default router;