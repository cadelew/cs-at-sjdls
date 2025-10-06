import express from 'express';
import { getQuizzes, getQuiz, createQuiz, generateQuiz, getQuestionBankStats, previewQuiz, generateQuizByCategory, getQuizzesByCategory, getQuizCategories, getActiveQuizzes, getUserQuizHistory, completeQuiz, retakeQuiz, getQuizLifecycleStats, initializeQuizPools, archiveOldQuizzes, cleanupExpiredQuizzes } from '../controllers/quiz.controller.js';
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

// Quiz lifecycle routes
router.get('/active/:category/:subcategory?', getActiveQuizzes);
router.get('/history/user', getUserQuizHistory);
router.post('/:quizId/complete', completeQuiz);
router.post('/:quizId/retake', retakeQuiz);
router.get('/stats/lifecycle', getQuizLifecycleStats);

// Admin routes
router.post('/admin/initialize-pools', initializeQuizPools);
router.post('/admin/archive-old', archiveOldQuizzes);
router.post('/admin/cleanup-expired', cleanupExpiredQuizzes);

export default router;