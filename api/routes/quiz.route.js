import express from 'express';
import { getQuizzes, getQuiz, createQuiz, generateQuiz, getQuestionBankStats, previewQuiz, generateQuizByCategory, getQuizzesByCategory, getQuizCategories } from '../controllers/quiz.controller.js';
const router = express.Router();

router.get('/', getQuizzes);
router.get('/:id', getQuiz);
router.post('/', createQuiz);

// Quiz generation routes
router.post('/generate', generateQuiz);
router.get('/stats/question-bank', getQuestionBankStats);
router.post('/preview', previewQuiz);

// Category-based routes
router.get('/categories', getQuizCategories);
router.get('/category/:category/:subcategory?', generateQuizByCategory);
router.get('/filter/category', getQuizzesByCategory);

export default router;