import express from 'express';
import { getQuizQuestions } from '../controllers/question.controller.js';


const router = express.Router();

router.get('/:id/questions', getQuizQuestions);

export default router;