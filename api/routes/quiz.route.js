import express from 'express';
import { getQuizzes, getQuiz, createQuiz, generateQuiz, getQuestionBankStats, previewQuiz, generateQuizByCategory, getQuizzesByCategory, getQuizCategories, getActiveQuizzes, getUserQuizHistory, completeQuiz, retakeQuiz, getQuizLifecycleStats, initializeQuizPools, archiveOldQuizzes, cleanupExpiredQuizzes, startQuiz, resumeQuiz, updateQuizProgress, getUserInProgressQuizzes, abandonQuiz, getAbandonedQuizzes } from '../controllers/quiz.controller.js';
import { verifyToken, optionalAuth } from '../utils/verifyUser.js';
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
router.get('/active/:category/:subcategory?', optionalAuth, getActiveQuizzes);
router.get('/history/user', verifyToken, getUserQuizHistory);
router.post('/:quizId/complete', verifyToken, completeQuiz);
router.post('/:quizId/retake', verifyToken, retakeQuiz);
router.get('/stats/lifecycle', getQuizLifecycleStats);

// In-progress quiz routes
router.get('/in-progress/user', verifyToken, getUserInProgressQuizzes);
router.post('/:quizId/start', verifyToken, startQuiz);
router.post('/:quizId/resume', verifyToken, resumeQuiz);
router.put('/:quizId/progress', verifyToken, updateQuizProgress);
router.post('/:quizId/abandon', verifyToken, abandonQuiz);

// Admin routes
router.post('/admin/initialize-pools', initializeQuizPools);
router.post('/admin/archive-old', archiveOldQuizzes);
router.post('/admin/cleanup-expired', cleanupExpiredQuizzes);
router.get('/admin/abandoned', getAbandonedQuizzes);

export default router;