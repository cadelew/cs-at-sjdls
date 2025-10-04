import RobotQuestionValidator from '../services/questionValidator.js';
import QuestionGenerationService from '../services/questionGenerationService.js';
import { errorHandler } from '../utils/error.js';

// Initialize the services
const questionValidator = new RobotQuestionValidator();
const generationService = new QuestionGenerationService();

// Generate and save a new robot question
export const generateRobotQuestion = async (req, res, next) => {
  try {
    const { topic = 'algorithms', difficulty = 'medium', tags = [] } = req.body;

    console.log(`Generating robot question...`);
    
    // Generate, validate, and save the question
    const savedQuestion = await questionValidator.generateAndSaveQuestion(
      topic, 
      difficulty,
      tags
    );

    res.status(201).json({
      success: true,
      message: 'Robot question generated and saved successfully',
      question: savedQuestion
    });

  } catch (error) {
    console.error('Error in generateRobotQuestion:', error);
    next(error);
  }
};

// Test question validation without saving
export const testQuestionValidation = async (req, res, next) => {
  try {
    const { question } = req.body;

    if (!question) {
      return next(errorHandler(400, 'Question object is required'));
    }

    console.log('Testing question validation...');
    
    // Validate the question
    const isValid = await questionValidator.validateQuestion(question);

    res.status(200).json({
      success: true,
      isValid: isValid,
      message: isValid ? 'Question is valid' : 'Question failed validation'
    });

  } catch (error) {
    console.error('Error in testQuestionValidation:', error);
    next(error);
  }
};

// Generate multiple questions
export const generateMultipleQuestions = async (req, res, next) => {
  try {
    const { count = 1, topic = 'algorithms', difficulty = 'medium', tags = [] } = req.body;

    console.log(`Generating ${count} robot questions...`);
    
    const generatedQuestions = [];
    
    for (let i = 0; i < count; i++) {
      try {
        const savedQuestion = await questionValidator.generateAndSaveQuestion(
          topic, 
          difficulty,
          tags
        );
        generatedQuestions.push(savedQuestion);
        console.log(`Question ${i + 1}/${count} generated successfully`);
      } catch (error) {
        console.error(`Failed to generate question ${i + 1}:`, error);
        // Continue with other questions
      }
    }

    res.status(201).json({
      success: true,
      message: `Generated ${generatedQuestions.length}/${count} questions successfully`,
      questions: generatedQuestions
    });

  } catch (error) {
    console.error('Error in generateMultipleQuestions:', error);
    next(error);
  }
};

// Generate batch questions with distribution
export const generateBatchQuestions = async (req, res, next) => {
  try {
    const { 
      totalQuestions = 100,
      distribution = {},
      validationRules = {},
      output = {},
      tags = []
    } = req.body;

    console.log(`Generating ${totalQuestions} questions for question bank...`);
    
    const request = {
      totalQuestions,
      distribution,
      validationRules,
      output: {
        format: 'database',
        includeQuestions: false,
        includeMetadata: true,
        ...output
      },
      tags
    };

    const result = await generationService.generateBatchQuestions(request);

    res.status(201).json({
      success: true,
      message: `Generated ${result.totalGenerated}/${result.totalRequested} questions successfully`,
      ...result
    });

  } catch (error) {
    console.error('Error in generateBatchQuestions:', error);
    next(error);
  }
};
