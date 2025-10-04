import express from 'express';
import { getQuestions, getQuestionBank } from '../controllers/question.controller.js';

const router = express.Router();

router.get('/:id/questions', getQuestions);
router.get('/bank/search', getQuestionBank);

export default router;