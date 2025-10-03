import express from 'express';
import { createQuizStat, submitAnswerQuizStat, submitQuizStat, getQuizStat, getQuizStats, saveQuizProgress, getUserQuizAttempts } from '../controllers/quizStat.controller.js';

const router = express.Router();

router.post('/', createQuizStat);
router.put('/:attemptid/answer', submitAnswerQuizStat);
router.put('/:attemptid/submit', submitQuizStat);
router.put('/:attemptid/save', saveQuizProgress);
router.get('/:attemptid', getQuizStat);
router.get('/quiz/:quizId/user/:userId', getUserQuizAttempts);
router.get('/', getQuizStats);




export default router;