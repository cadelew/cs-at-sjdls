import express from 'express';
import { getQuestions, getQuestionBank, getQuestionsByType } from '../controllers/question.controller.js';

const router = express.Router();

router.get('/:id/questions', getQuestions);
router.get('/bank/search', getQuestionBank);
router.get('/type', getQuestionsByType);

export default router;