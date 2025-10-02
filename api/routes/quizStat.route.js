import express from 'express';

const router = express.Router();

router.post('/', createQuizStat);
router.put('/:attemptid/answer', submitAnswerQuizStat);
router.put('/:attemptid/submit', submitQuizStat);
router.get('/:attemptid', getQuizStat);
//router.get('/', getQuizStatResults);




export default router;