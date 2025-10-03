import express from 'express';
import { 
    getUserAnalytics, 
    getQuizPerformanceAnalysis, 
    getGlobalQuizStats, 
    getUserQuizHistory 
} from '../controllers/analytics.controller.js';

const router = express.Router();

// User analytics routes
router.get('/user/:userId', getUserAnalytics);
router.get('/user/:userId/history', getUserQuizHistory);
router.get('/quiz/:quizId/user/:userId', getQuizPerformanceAnalysis);

// Global analytics routes (admin)
router.get('/global', getGlobalQuizStats);

export default router;
