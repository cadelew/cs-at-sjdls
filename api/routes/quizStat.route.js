import express from 'express';

const router = express.Router();

router.post('/', createQuizStat);
router.put('/api/quizStat/:attemptid/answer', submitAnswerQuizStat);
router.put('/api/quizStat/:attemptid/submit', submitQuizStat);
router.get('/api/quizStat/:attemptid', getQuizStat);
router.get('/', getQuizStatResults);




export default router;