import OpenAI from 'openai';
import Question from '../models/question.model.js';
import RobotQuestionValidator from './questionValidator.js';

// Initialize OpenAI client lazily
let openai = null;
const getOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
};

// Question generation prompts for different types
const GENERATION_PROMPTS = {
  // robot_navigation: {
  //   prompt: `Generate a robot grid navigation question with ASCII art showing robot position, direction, and goal. Include 4 pseudocode options with only one correct answer.`,
  //   validator: RobotQuestionValidator
  // },
  
  code_analysis: {
    prompt: `Generate a code analysis question where students must trace through code execution, predict output, or identify bugs. Include 4 multiple choice options.`,
    validator: null // Will implement later
  },
  
  algorithm: {
    prompt: `Generate an algorithm question about sorting, searching, or optimization. Include pseudocode and ask students to analyze efficiency or correctness.`,
    validator: null // Will implement later
  },
  
  data_structure: {
    prompt: `Generate a data structure question about arrays, lists, stacks, or queues. Include operations and ask students to predict results.`,
    validator: null // Will implement later
  },
  
  problem_solving: {
    prompt: `Generate a problem-solving question requiring decomposition, abstraction, or pattern recognition. Include step-by-step solution approach.`,
    validator: null // Will implement later
  }
};

// Big Idea topics
const BIG_IDEAS = {
  1: 'Creative Development',
  2: 'Data',
  3: 'Algorithms & Programming',
  4: 'Computer Systems & Networks',
  5: 'Impact of Computing'
};

class QuestionGenerationService {
  constructor() {
    this.validators = {
      // robot_navigation: new RobotQuestionValidator() // Commented out for now
    };
  }

  // Validate generation request schema
  validateGenerationRequest(request) {
    const errors = [];

    // Check required fields
    if (!request.totalQuestions || typeof request.totalQuestions !== 'number') {
      errors.push('totalQuestions must be a number');
    }

    if (request.totalQuestions < 1 || request.totalQuestions > 1000) {
      errors.push('totalQuestions must be between 1 and 1000');
    }

    // Validate distribution if provided
    if (request.distribution) {
      const distErrors = this.validateDistribution(request.distribution);
      errors.push(...distErrors);
    }

    // Validate validation rules if provided
    if (request.validationRules) {
      const validationErrors = this.validateValidationRules(request.validationRules);
      errors.push(...validationErrors);
    }

    return {
      valid: errors.length === 0,
      errors
    };
  }

  // Validate distribution object
  validateDistribution(distribution) {
    const errors = [];

    if (distribution.bigIdea) {
      const bigIdeaSum = Object.values(distribution.bigIdea).reduce((sum, val) => sum + val, 0);
      if (bigIdeaSum > 100) {
        errors.push('Big Idea distribution percentages cannot exceed 100%');
      }
    }

    if (distribution.questionType) {
      const typeSum = Object.values(distribution.questionType).reduce((sum, val) => sum + val, 0);
      if (typeSum > 100) {
        errors.push('Question type distribution percentages cannot exceed 100%');
      }
    }

    if (distribution.difficulty) {
      const difficultySum = Object.values(distribution.difficulty).reduce((sum, val) => sum + val, 0);
      if (difficultySum > 100) {
        errors.push('Difficulty distribution percentages cannot exceed 100%');
      }
    }

    return errors;
  }

  // Validate validation rules
  validateValidationRules(rules) {
    const errors = [];

    if (rules.minValidationScore && (rules.minValidationScore < 0 || rules.minValidationScore > 1)) {
      errors.push('minValidationScore must be between 0 and 1');
    }

    if (rules.maxRetries && (rules.maxRetries < 1 || rules.maxRetries > 10)) {
      errors.push('maxRetries must be between 1 and 10');
    }

    if (rules.qualityThreshold && (rules.qualityThreshold < 0 || rules.qualityThreshold > 1)) {
      errors.push('qualityThreshold must be between 0 and 1');
    }

    return errors;
  }

  // Calculate question distribution
  calculateDistribution(request) {
    const total = request.totalQuestions;
    const distribution = request.distribution || {};

    // Default distributions - Based on official AP CSP exam weights
    const defaultBigIdea = { 
      1: 12,  // Creative Development (10-13%)
      2: 19,  // Data (17-22%) 
      3: 32,  // Algorithms & Programming (30-35%)
      4: 13,  // Computer Systems & Networks (11-15%)
      5: 24   // Impact of Computing (21-26%)
    };
    const defaultQuestionType = { 
      // robot_navigation: 40, // Commented out for now
      code_analysis: 40, 
      algorithm: 30, 
      data_structure: 20, 
      problem_solving: 10 
    };
    const defaultDifficulty = { easy: 40, medium: 45, hard: 15 };

    // Calculate actual counts
    const bigIdeaDistribution = this.normalizeDistribution(distribution.bigIdea || defaultBigIdea, total);
    const questionTypeDistribution = this.normalizeDistribution(distribution.questionType || defaultQuestionType, total);
    const difficultyDistribution = this.normalizeDistribution(distribution.difficulty || defaultDifficulty, total);

    return {
      total,
      bigIdea: bigIdeaDistribution,
      questionType: questionTypeDistribution,
      difficulty: difficultyDistribution
    };
  }

  // Normalize distribution percentages to actual counts
  normalizeDistribution(distribution, total) {
    const normalized = {};
    const percentages = Object.values(distribution);
    const sum = percentages.reduce((sum, val) => sum + val, 0);

    // If percentages don't sum to 100, normalize them
    if (sum !== 100) {
      const factor = 100 / sum;
      Object.keys(distribution).forEach(key => {
        normalized[key] = Math.round(distribution[key] * factor * total / 100);
      });
    } else {
      Object.keys(distribution).forEach(key => {
        normalized[key] = Math.round(distribution[key] * total / 100);
      });
    }

    return normalized;
  }

  // Generate a single question
  async generateSingleQuestion(questionType, bigIdea, difficulty, topic) {
    const promptConfig = GENERATION_PROMPTS[questionType];
    
    if (!promptConfig) {
      throw new Error(`Unsupported question type: ${questionType}`);
    }

    const prompt = `
${promptConfig.prompt}

Requirements:
- Topic: ${topic || BIG_IDEAS[bigIdea]}
- Difficulty: ${difficulty}
- Big Idea: ${bigIdea} - ${BIG_IDEAS[bigIdea]}

Format the response as JSON:
{
  "questionsText": "Question text here",
  "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
  "correctAnswer": 0,
  "explanation": "Explanation of the correct answer",
  "topic": "${topic || BIG_IDEAS[bigIdea]}",
  "bigIdea": ${bigIdea},
  "questionType": "${questionType}",
  "difficulty": "${difficulty}",
  "points": 5,
  "tags": ["tag1", "tag2", "tag3"]
}
`;

    try {
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      const generatedContent = response.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating question:', error);
      throw error;
    }
  }

  // Validate a generated question
  async validateQuestion(question, validationRules = {}) {
    const { minValidationScore = 0.8, maxRetries = 3 } = validationRules;
    
    const validator = this.validators[question.questionType];
    
    if (!validator) {
      console.log(`No validator available for ${question.questionType}, using GPT validation...`);
      return await this.validateQuestionWithGPT(question);
    }

    try {
      const isValid = await validator.validateQuestion(question);
      return isValid;
    } catch (error) {
      console.error('Error validating question:', error);
      return false;
    }
  }

  // Validate non-robot questions using GPT
  async validateQuestionWithGPT(question) {
    try {
      const prompt = `
Please validate this multiple-choice question for correctness and quality.

Question: ${question.questionsText}

Options:
${question.options.map((opt, i) => `${i}: ${opt}`).join('\n')}

Correct Answer Index: ${question.correctAnswer}
Explanation: ${question.explanation}

Please check:
1. Is the correct answer actually correct?
2. Are the incorrect options reasonable but wrong?
3. Is the explanation accurate?
4. Is the question clear and unambiguous?

Respond with ONLY valid JSON (no markdown, no code blocks):
{
  "isValid": true/false,
  "confidence": 0.0-1.0,
  "issues": ["list of any issues found"],
  "suggestions": ["list of improvement suggestions"]
}`;

      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.1, // Low temperature for consistent validation
        max_tokens: 500
      });

      const generatedContent = response.choices[0].message.content;
      
      // Extract JSON from response (handle markdown code blocks)
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in validation response');
      }
      
      const validationResult = JSON.parse(jsonMatch[0]);
      
      console.log(`GPT Validation for ${question.questionType}: ${validationResult.isValid ? 'VALID' : 'INVALID'} (confidence: ${validationResult.confidence})`);
      
      if (validationResult.issues && validationResult.issues.length > 0) {
        console.log('Issues found:', validationResult.issues);
      }
      
      return validationResult.isValid && validationResult.confidence > 0.7;
    } catch (error) {
      console.error('Error in GPT validation:', error);
      return false; // Fail validation if GPT validation fails
    }
  }

  // Generate questions according to distribution
  async generateQuestions(distribution, validationRules = {}) {
    const questions = [];
    const { maxRetries = 3 } = validationRules;

    // Generate questions for each question type
    for (const [questionType, count] of Object.entries(distribution.questionType)) {
      console.log(`Generating ${count} ${questionType} questions...`);
      
      for (let i = 0; i < count; i++) {
        let attempts = 0;
        let question = null;
        let isValid = false;

        // Try to generate a valid question
        while (attempts < maxRetries && !isValid) {
          attempts++;
          
          try {
            // Select random big idea and difficulty for variety
            const bigIdeas = Object.keys(distribution.bigIdea).filter(bi => distribution.bigIdea[bi] > 0);
            const difficulties = Object.keys(distribution.difficulty).filter(d => distribution.difficulty[d] > 0);
            
            const randomBigIdea = bigIdeas[Math.floor(Math.random() * bigIdeas.length)];
            const randomDifficulty = difficulties[Math.floor(Math.random() * difficulties.length)];

            question = await this.generateSingleQuestion(questionType, parseInt(randomBigIdea), randomDifficulty);
            isValid = await this.validateQuestion(question, validationRules);
            
            if (isValid) {
              console.log(`Generated valid ${questionType} question (attempt ${attempts})`);
            } else {
              console.log(`Question validation failed (attempt ${attempts}), retrying...`);
            }
          } catch (error) {
            console.error(`Error generating question (attempt ${attempts}):`, error);
          }
        }

        if (question && isValid) {
          questions.push(question);
        } else {
          console.error(`Failed to generate valid ${questionType} question after ${maxRetries} attempts`);
        }
      }
    }

    return questions;
  }

  // Save questions to database
  async saveQuestions(questions) {
    const savedQuestions = [];
    
    for (const question of questions) {
      try {
        const newQuestion = new Question({
          questionsText: question.questionsText,
          options: question.options,
          correctAnswer: question.correctAnswer,
          explanation: question.explanation,
          topic: question.topic,
          bigIdea: question.bigIdea,
          questionType: question.questionType,
          difficulty: question.difficulty,
          points: question.points,
          tags: question.tags,
          metadata: {
            generatedBy: 'AI',
            validationScore: 1.0,
            usageCount: 0,
            averageScore: 0,
            isActive: true
          }
        });

        const savedQuestion = await newQuestion.save();
        savedQuestions.push(savedQuestion);
        console.log(`Saved question: ${savedQuestion._id}`);
      } catch (error) {
        console.error('Error saving question:', error);
      }
    }

    return savedQuestions;
  }

  // Main method to generate questions according to request
  async generateBatchQuestions(request) {
    try {
      console.log('Starting batch question generation...');
      
      // Validate request
      const validation = this.validateGenerationRequest(request);
      if (!validation.valid) {
        throw new Error(`Invalid request: ${validation.errors.join(', ')}`);
      }

      // Calculate distribution
      const distribution = this.calculateDistribution(request);
      console.log('Distribution calculated:', distribution);

      // Generate questions
      const questions = await this.generateQuestions(distribution, request.validationRules);
      console.log(`Generated ${questions.length}/${distribution.total} questions`);

      // Save to database if requested
      let savedQuestions = [];
      if (request.output && request.output.format === 'database') {
        savedQuestions = await this.saveQuestions(questions);
        console.log(`Saved ${savedQuestions.length} questions to database`);
      }

      return {
        requestId: this.generateRequestId(),
        totalRequested: request.totalQuestions,
        totalGenerated: questions.length,
        totalSaved: savedQuestions.length,
        distribution: distribution,
        questions: request.output && request.output.includeQuestions ? questions : [],
        savedQuestions: savedQuestions
      };

    } catch (error) {
      console.error('Error in generateBatchQuestions:', error);
      throw error;
    }
  }

  // Generate unique request ID
  generateRequestId() {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}

export default QuestionGenerationService;
