import express from 'express';
import { generateRobotQuestion, testQuestionValidation, generateMultipleQuestions, generateBatchQuestions } from '../controllers/questionGeneration.controller.js';

const router = express.Router();

// Generate a single robot question
router.post('/generate', generateRobotQuestion);

// Test question validation
router.post('/validate', testQuestionValidation);

// Generate multiple questions
router.post('/generate-multiple', generateMultipleQuestions);

// Generate batch questions with distribution
router.post('/generate-batch', generateBatchQuestions);

export default router;
