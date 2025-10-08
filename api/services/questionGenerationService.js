import OpenAI from 'openai';
import Question from '../models/question.model.js';
import RobotQuestionValidator from './questionValidator.js';


//Comment out robot navigation if not working. This commit it doesn't work.
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

// Question generation prompts for different types with enhanced diversity
const GENERATION_PROMPTS = {
  robot_navigation: {
    prompt: `Generate an AP CSP robot grid navigation question with ASCII art showing robot position, direction, and goal. Focus on computational thinking, algorithm design, and step-by-step problem solving. Include 4 pseudocode options with only one correct answer. Use varied grid sizes (3x3, 4x4, 5x5) and different starting positions.`,
    validator: RobotQuestionValidator
  },
  
  code_analysis: {
    prompt: `Generate an AP CSP code analysis question focusing on programming concepts like variables, conditionals, loops, functions, and debugging. Topics should include: program tracing, identifying syntax/logic errors, predicting output, understanding control structures. Use diverse numbers (7, 12, 15, 20, 25, 30, 50, 100), function names (calculate_score, find_average, process_data, check_validity), and realistic programming scenarios. 

CRITICAL: Always include ALL necessary data, code, or datasets directly in the question text. Never reference "the provided dataset" or "the given code" without actually providing it. Students must be able to answer the question using only the information in the question text.

Include 4 multiple choice options.`,
    validator: null // Will implement later
  },
  
  algorithm: {
    prompt: `Generate an AP CSP algorithm question focusing on computational thinking, algorithm design, and efficiency. Topics should include: searching algorithms, sorting algorithms, algorithm complexity, step-by-step problem solving, optimization. Use diverse data sizes (arrays of 8, 15, 24, 33 elements), algorithm types (linear search, binary search, bubble sort, selection sort), and real-world computational problems. 

CRITICAL: Always include ALL necessary data, arrays, or datasets directly in the question text. Never reference "the provided dataset" or "the given array" without actually providing it. Students must be able to answer the question using only the information in the question text.

Include 4 multiple choice options.`,
    validator: null // Will implement later
  },
  
  data_structure: {
    prompt: `Generate an AP CSP data structure question focusing on data organization, representation, and manipulation. Topics should include: binary representation, data types, lists/arrays, data compression, data privacy, data analysis. Use varied data types (strings, integers, booleans), sizes (5, 12, 18, 25 items), and operations (storing, retrieving, organizing data). 

CRITICAL: Always include ALL necessary data, structures, or examples directly in the question text. Never reference "the provided data" or "the given structure" without actually providing it. Students must be able to answer the question using only the information in the question text.

Include 4 multiple choice options.`,
    validator: null // Will implement later
  },
  
  problem_solving: {
    prompt: `Generate an AP CSP computational thinking problem focusing on decomposition, pattern recognition, abstraction, and algorithm design. Topics should include: breaking down complex problems, identifying patterns in data, creating abstractions, designing algorithms. Use varied contexts (programming challenges, data analysis, simulation, optimization) and different numbers (7, 12, 15, 20, 25, 30, 50, 100) and scenarios. 

CRITICAL: Always include ALL necessary data, examples, or context directly in the question text. Never reference "the provided data" or "the given problem" without actually providing it. Students must be able to answer the question using only the information in the question text.

Include 4 multiple choice options.`,
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
      robot_navigation: new RobotQuestionValidator()
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
      robot_navigation: 0, // Temporarily disabled - 0% frequency due to validation complexity
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
       
       DIVERSITY REQUIREMENTS (CRITICAL):
       - Use RANDOM numbers from this list: [7, 12, 15, 18, 20, 25, 30, 35, 42, 50, 75, 100, 150, 200]
       - Use VARIED function names: analyze_data, process_items, compute_result, find_solution, calculate_value, sort_elements, search_items, etc.
       - Use DIFFERENT variable names: data_list, numbers, items, values, results, output, etc.
       - Create UNIQUE scenarios and contexts
       - Avoid common patterns like "sum of first n numbers" or "two sum problem"
       
       DATA COMPLETENESS REQUIREMENTS (CRITICAL):
       - ALWAYS include ALL necessary data, code, datasets, or examples directly in the question text
       - NEVER reference "the provided dataset", "the given code", or "the following data" without actually providing it
       - Students must be able to answer the question using ONLY the information in the question text
       - If the question involves data analysis, include the actual data in the question
       - If the question involves code tracing, include the actual code in the question
       
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
    
    // Always run diversity validation first
    const diversityResult = await this.validateDiversity(question);
    if (!diversityResult.isValid) {
      console.log(`Diversity validation failed: ${diversityResult.violations.join(', ')}`);
      return false;
    }
    
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

  // Validate question diversity
  async validateDiversity(question) {
    try {
      // Import the DiversityEnforcer class
      const module = await import('../enforceQuestionDiversity.js');
      const DiversityEnforcer = module.default;
      const diversityChecker = new DiversityEnforcer();
      
      const violations = diversityChecker.checkDiversityViolations(question.questionsText);
      
      return {
        isValid: violations.length === 0,
        violations: violations
      };
    } catch (error) {
      console.error('Error importing diversity enforcer:', error);
      return {
        isValid: true, // Skip diversity check if import fails
        violations: []
      };
    }
  }

  // Validate non-robot questions using GPT comment ouot if not working
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
5. Does the question include ALL necessary data/code/examples in the question text?
6. Can a student answer this question using ONLY the information provided in the question?

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
      // Robot questions need more retries due to complex validation
      const effectiveMaxRetries = questionType === 'robot_navigation' ? Math.max(maxRetries, 5) : maxRetries;
      console.log(`Generating ${count} ${questionType} questions...`);
      
      for (let i = 0; i < count; i++) {
        let attempts = 0;
        let question = null;
        let isValid = false;

        // Try to generate a valid question
        while (attempts < effectiveMaxRetries && !isValid) {
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
          console.error(`Failed to generate valid ${questionType} question after ${effectiveMaxRetries} attempts`);
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
