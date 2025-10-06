import Question from '../models/question.model.js';
import Quiz from '../models/quiz.model.js';

// AP CSP Big Ideas and their exam weights
const BIG_IDEAS = {
  1: { name: 'Creative Development', weight: 12, topics: ['programming', 'algorithms', 'abstraction'] },
  2: { name: 'Data', weight: 19, topics: ['data structures', 'data analysis', 'privacy'] },
  3: { name: 'Algorithms & Programming', weight: 32, topics: ['algorithms', 'programming', 'debugging'] },
  4: { name: 'Computer Systems & Networks', weight: 13, topics: ['networks', 'systems', 'security'] },
  5: { name: 'Impact of Computing', weight: 24, topics: ['computing effects', 'digital divide', 'innovation'] }
};

// Question types and their typical distribution
const QUESTION_TYPES = {
  'code_analysis': { weight: 35, description: 'Code tracing and analysis' },
  'algorithm': { weight: 25, description: 'Algorithm design and efficiency' },
  'data_structure': { weight: 20, description: 'Data structure operations' },
  'problem_solving': { weight: 20, description: 'Computational thinking' }
};

// Difficulty levels (time in minutes) - Average 1:15 per question
const DIFFICULTY_LEVELS = {
  'easy': { weight: 40, timePerQuestion: 1.0 }, // 1 minute
  'medium': { weight: 45, timePerQuestion: 1.25 }, // 1 minute 15 seconds  
  'hard': { weight: 15, timePerQuestion: 1.5 } // 1 minute 30 seconds
};

// Question type timing multipliers (based on AP CSP exam patterns)
const QUESTION_TYPE_TIMING = {
  'code_analysis': 1.0,      // Standard time - code reading and analysis
  'algorithm': 1.3,          // 30% more time - requires step-by-step thinking
  'data_structure': 1.2,     // 20% more time - complex data manipulation
  'problem_solving': 1.4,    // 40% more time - creative problem solving
  'robot_navigation': 1.5    // 50% more time - spatial reasoning and simulation
};

// Big idea complexity multipliers (based on AP CSP topic difficulty)
const BIG_IDEA_TIMING = {
  1: 1.0,  // Creative Development - standard
  2: 1.1,  // Data - slightly more complex
  3: 1.3,  // Algorithms & Programming - most complex
  4: 1.0,  // Computer Systems & Networks - standard
  5: 1.2   // Impact of Computing - requires broader thinking
};

class QuizGenerationService {
  constructor() {
    this.defaultConfig = {
      totalQuestions: 30, // Increased from 20 to 30
      timeLimit: null, // Will be calculated based on difficulty
      difficulty: 'mixed', // mixed, easy, medium, hard
      bigIdeaDistribution: 'balanced', // balanced, specific, custom
      questionTypeDistribution: 'balanced',
      topic: 'general', // general, specific topic
      passingScore: 70,
      category: 'practice',
      subcategory: 'general'
    };
  }

  // Quiz category configurations
  getCategoryConfig(category, subcategory = 'general') {
    const configs = {
      'practice': {
        title: 'Practice Quiz',
        description: 'General practice quiz covering all AP CSP topics',
        timeLimit: null, // Will be calculated
        passingScore: 70,
        difficulty: 'mixed',
        bigIdeaDistribution: 'balanced',
        questionTypeDistribution: 'balanced'
      },
      'exam': {
        title: 'AP CSP Practice Exam',
        description: 'Full-length practice exam simulating the real AP CSP test',
        timeLimit: 120, // 2 hours like real exam
        passingScore: 70,
        difficulty: 'mixed',
        bigIdeaDistribution: 'exam', // Based on actual exam weights
        questionTypeDistribution: 'exam'
      },
      'topic-specific': {
        title: `${this.getSubcategoryTitle(subcategory)} Quiz`,
        description: `Focused quiz on ${this.getSubcategoryTitle(subcategory)}`,
        timeLimit: null,
        passingScore: 70,
        difficulty: 'mixed',
        bigIdeaDistribution: this.getSubcategoryDistribution(subcategory),
        questionTypeDistribution: this.getSubcategoryQuestionTypes(subcategory)
      },
      'mixed': {
        title: 'Mixed Topics Quiz',
        description: 'Quiz covering multiple AP CSP topics',
        timeLimit: null,
        passingScore: 70,
        difficulty: 'mixed',
        bigIdeaDistribution: 'balanced',
        questionTypeDistribution: 'balanced'
      },
      'custom': {
        title: 'Custom Quiz',
        description: 'Customized quiz based on your specifications',
        timeLimit: null,
        passingScore: 70,
        difficulty: 'mixed',
        bigIdeaDistribution: 'balanced',
        questionTypeDistribution: 'balanced'
      }
    };

    return configs[category] || configs['practice'];
  }

  getSubcategoryTitle(subcategory) {
    const titles = {
      'general': 'General AP CSP',
      'big-idea-1': 'Creative Development',
      'big-idea-2': 'Data',
      'big-idea-3': 'Algorithms & Programming',
      'big-idea-4': 'Computer Systems & Networks',
      'big-idea-5': 'Impact of Computing',
      'algorithms': 'Algorithms',
      'data-structures': 'Data Structures',
      'networking': 'Networking',
      'impact': 'Impact of Computing',
      'code-analysis': 'Code Analysis',
      'problem-solving': 'Problem Solving'
    };
    return titles[subcategory] || 'General AP CSP';
  }

  getSubcategoryDistribution(subcategory) {
    const distributions = {
      'big-idea-1': { 1: 100 },
      'big-idea-2': { 2: 100 },
      'big-idea-3': { 3: 100 },
      'big-idea-4': { 4: 100 },
      'big-idea-5': { 5: 100 },
      'algorithms': { 3: 100 },
      'data-structures': { 2: 100 },
      'networking': { 4: 100 },
      'impact': { 5: 100 },
      'code-analysis': 'balanced',
      'problem-solving': 'balanced',
      'general': 'balanced'
    };
    return distributions[subcategory] || 'balanced';
  }

  getSubcategoryQuestionTypes(subcategory) {
    const questionTypes = {
      'algorithms': { algorithm: 100 },
      'data-structures': { data_structure: 100 },
      'code-analysis': { code_analysis: 100 },
      'problem-solving': { problem_solving: 100 },
      'general': 'balanced'
    };
    return questionTypes[subcategory] || 'balanced';
  }

  generateTags(config) {
    const tags = [config.category];
    if (config.subcategory !== 'general') {
      tags.push(config.subcategory);
    }
    if (config.difficulty !== 'mixed') {
      tags.push(config.difficulty);
    }
    if (config.topic !== 'general') {
      tags.push(config.topic);
    }
    return tags;
  }

  // Generate a regular quiz with balanced AP CSP coverage
  async generateRegularQuiz(config = {}, userPerformance = null) {
    try {
      console.log('Generating regular quiz with config:', config);
      
      const quizConfig = { ...this.defaultConfig, ...config };
      
      // Apply category-specific configuration
      const categoryConfig = this.getCategoryConfig(quizConfig.category, quizConfig.subcategory);
      const finalConfig = { ...quizConfig, ...categoryConfig };
      
      // Calculate question distribution
      const distribution = this.calculateQuestionDistribution(finalConfig);
      console.log('Question distribution:', distribution);
      
      // Select questions from question bank
      const selectedQuestions = await this.selectQuestions(distribution, finalConfig);
      console.log(`Selected ${selectedQuestions.length} questions`);
      
      if (selectedQuestions.length === 0) {
        throw new Error('No questions available in question bank');
      }
      
      // Calculate time limit if not provided
      const timeLimit = this.calculateTimeLimit(selectedQuestions, finalConfig.timeLimit, userPerformance);
      
      // Create quiz metadata
      const quizData = {
        title: this.generateQuizTitle(finalConfig),
        description: this.generateQuizDescription(finalConfig, selectedQuestions),
        topic: finalConfig.topic,
        difficulty: finalConfig.difficulty,
        timeLimit: timeLimit,
        totalQuestions: selectedQuestions.length,
        passingScore: finalConfig.passingScore,
        isActive: true,
        generatedBy: 'system',
        questionIds: selectedQuestions.map(q => q._id),
        category: finalConfig.category,
        subcategory: finalConfig.subcategory,
        tags: this.generateTags(finalConfig),
        metadata: {
          distribution: distribution,
          generatedAt: new Date(),
          questionTypes: [...new Set(selectedQuestions.map(q => q.questionType))],
          bigIdeas: [...new Set(selectedQuestions.map(q => q.bigIdea))],
          difficulties: [...new Set(selectedQuestions.map(q => q.difficulty))]
        }
      };
      
      // Save quiz to database
      const newQuiz = new Quiz(quizData);
      const savedQuiz = await newQuiz.save();
      
      console.log('Quiz generated successfully:', savedQuiz._id);
      
      return {
        success: true,
        quiz: savedQuiz,
        questions: selectedQuestions,
        metadata: {
          totalQuestions: selectedQuestions.length,
          timeLimit: timeLimit,
          distribution: distribution,
          questionTypes: quizData.metadata.questionTypes,
          bigIdeas: quizData.metadata.bigIdeas
        }
      };
      
    } catch (error) {
      console.error('Error generating regular quiz:', error);
      throw error;
    }
  }

  // Calculate question distribution based on AP CSP weights
  calculateQuestionDistribution(config) {
    const total = config.totalQuestions;
    const distribution = {
      bigIdea: {},
      questionType: {},
      difficulty: {}
    };
    
    // Big Idea distribution (AP CSP exam weights)
    if (config.bigIdeaDistribution === 'balanced') {
      Object.keys(BIG_IDEAS).forEach(key => {
        distribution.bigIdea[key] = Math.round((BIG_IDEAS[key].weight / 100) * total);
      });
    } else if (config.bigIdeaDistribution === 'specific' && config.specificBigIdea) {
      // Focus on specific Big Idea
      distribution.bigIdea[config.specificBigIdea] = Math.round(total * 0.6);
      // Distribute remaining among other Big Ideas
      const remaining = total - distribution.bigIdea[config.specificBigIdea];
      const otherBigIdeas = Object.keys(BIG_IDEAS).filter(key => key != config.specificBigIdea);
      const perOther = Math.floor(remaining / otherBigIdeas.length);
      otherBigIdeas.forEach(key => {
        distribution.bigIdea[key] = perOther;
      });
    }
    
    // Question type distribution
    if (config.questionTypeDistribution === 'balanced') {
      Object.keys(QUESTION_TYPES).forEach(key => {
        distribution.questionType[key] = Math.round((QUESTION_TYPES[key].weight / 100) * total);
      });
    }
    
    // Difficulty distribution
    if (config.difficulty === 'mixed') {
      Object.keys(DIFFICULTY_LEVELS).forEach(key => {
        distribution.difficulty[key] = Math.round((DIFFICULTY_LEVELS[key].weight / 100) * total);
      });
    } else if (['easy', 'medium', 'hard'].includes(config.difficulty)) {
      distribution.difficulty[config.difficulty] = total;
    }
    
    return distribution;
  }

  // Select questions from question bank based on distribution
  async selectQuestions(distribution, config) {
    const selectedQuestions = [];
    const usedQuestionIds = new Set();
    
    // Select questions for each Big Idea
    for (const [bigIdea, count] of Object.entries(distribution.bigIdea)) {
      if (count > 0) {
        const questions = await this.selectQuestionsByBigIdea(
          parseInt(bigIdea), 
          count, 
          distribution, 
          usedQuestionIds,
          config
        );
        selectedQuestions.push(...questions);
      }
    }
    
    // If we don't have enough questions, fill with any available questions
    if (selectedQuestions.length < config.totalQuestions) {
      const remaining = config.totalQuestions - selectedQuestions.length;
      const additionalQuestions = await this.selectAdditionalQuestions(
        remaining, 
        usedQuestionIds, 
        config
      );
      selectedQuestions.push(...additionalQuestions);
    }
    
    // Shuffle questions to randomize order
    return this.shuffleArray(selectedQuestions);
  }

  // Select questions for a specific Big Idea
  async selectQuestionsByBigIdea(bigIdea, count, distribution, usedQuestionIds, config) {
    const questions = [];
    
    // Get available questions for this Big Idea
    const availableQuestions = await Question.find({
      bigIdea: bigIdea,
      'metadata.isActive': true,
      _id: { $nin: Array.from(usedQuestionIds) }
    }).limit(count * 3); // Get more than needed for variety
    
    if (availableQuestions.length === 0) {
      console.warn(`No questions available for Big Idea ${bigIdea}`);
      return questions;
    }
    
    // Select questions based on question type and difficulty distribution
    const questionTypeCounts = {};
    const difficultyCounts = {};
    
    for (const question of availableQuestions) {
      if (questions.length >= count) break;
      
      const questionType = question.questionType || 'code_analysis';
      const difficulty = question.difficulty || 'medium';
      
      // Check if we need more of this question type
      const typeLimit = distribution.questionType[questionType] || 0;
      const currentTypeCount = questionTypeCounts[questionType] || 0;
      
      // Check if we need more of this difficulty
      const difficultyLimit = distribution.difficulty[difficulty] || 0;
      const currentDifficultyCount = difficultyCounts[difficulty] || 0;
      
      if (currentTypeCount < typeLimit && currentDifficultyCount < difficultyLimit) {
        questions.push(question);
        usedQuestionIds.add(question._id);
        questionTypeCounts[questionType] = (questionTypeCounts[questionType] || 0) + 1;
        difficultyCounts[difficulty] = (difficultyCounts[difficulty] || 0) + 1;
      }
    }
    
    return questions;
  }

  // Select additional questions if needed
  async selectAdditionalQuestions(count, usedQuestionIds, config) {
    const additionalQuestions = await Question.find({
      'metadata.isActive': true,
      _id: { $nin: Array.from(usedQuestionIds) }
    }).limit(count);
    
    additionalQuestions.forEach(q => usedQuestionIds.add(q._id));
    return additionalQuestions;
  }

  // Calculate time limit based on questions and difficulty (returns minutes)
  calculateTimeLimit(questions, providedTimeLimit, userPerformance = null) {
    if (providedTimeLimit) {
      return providedTimeLimit; // Assume provided time is already in minutes
    }
    
    // Calculate adaptive time based on question characteristics
    let totalTimeMinutes = 0;
    questions.forEach(question => {
      const difficulty = question.difficulty || 'medium';
      const questionType = question.questionType || 'code_analysis';
      const bigIdea = question.bigIdea || 1;
      
      // Base time from difficulty
      let questionTime = DIFFICULTY_LEVELS[difficulty].timePerQuestion;
      
      // Apply question type multiplier
      questionTime *= QUESTION_TYPE_TIMING[questionType] || 1.0;
      
      // Apply big idea complexity multiplier
      questionTime *= BIG_IDEA_TIMING[bigIdea] || 1.0;
      
      // Apply user performance adaptation if available
      if (userPerformance) {
        questionTime = this.applyPerformanceAdaptation(questionTime, question, userPerformance);
      }
      
      totalTimeMinutes += questionTime;
    });
    
    // Add 15% buffer time for review and double-checking
    const bufferTime = totalTimeMinutes * 0.15;
    const totalWithBuffer = totalTimeMinutes + bufferTime;
    
    // Round up to nearest minute, minimum 5 minutes
    return Math.max(5, Math.ceil(totalWithBuffer));
  }

  // Apply user performance adaptation to timing
  applyPerformanceAdaptation(baseTime, question, userPerformance) {
    if (!userPerformance || !userPerformance.byQuestionType || !userPerformance.byDifficulty) {
      return baseTime;
    }
    
    const questionType = question.questionType || 'code_analysis';
    const difficulty = question.difficulty || 'medium';
    
    // Get user's average accuracy for this question type and difficulty
    const typeAccuracy = userPerformance.byQuestionType[questionType]?.accuracy || 0.7;
    const difficultyAccuracy = userPerformance.byDifficulty[difficulty]?.accuracy || 0.7;
    const combinedAccuracy = (typeAccuracy + difficultyAccuracy) / 2;
    
    // Adjust timing based on performance:
    // - High accuracy (>80%): Reduce time by 10-20% (user is fast)
    // - Medium accuracy (60-80%): Keep standard time
    // - Low accuracy (<60%): Increase time by 10-20% (user needs more time)
    
    let timeMultiplier = 1.0;
    if (combinedAccuracy > 0.8) {
      timeMultiplier = 0.85; // 15% faster for high performers
    } else if (combinedAccuracy < 0.6) {
      timeMultiplier = 1.15; // 15% slower for struggling users
    }
    
    return baseTime * timeMultiplier;
  }

  // Generate quiz title based on configuration
  generateQuizTitle(config) {
    if (config.title) return config.title;
    
    const difficulty = config.difficulty === 'mixed' ? 'Mixed' : 
                      config.difficulty.charAt(0).toUpperCase() + config.difficulty.slice(1);
    
    if (config.bigIdeaDistribution === 'specific' && config.specificBigIdea) {
      const bigIdeaName = BIG_IDEAS[config.specificBigIdea].name;
      return `${bigIdeaName} Practice Quiz - ${difficulty} Level`;
    }
    
    return `AP CSP Practice Quiz - ${difficulty} Level`;
  }

  // Generate quiz description
  generateQuizDescription(config, questions) {
    const bigIdeas = [...new Set(questions.map(q => q.bigIdea))];
    const bigIdeaNames = bigIdeas.map(id => BIG_IDEAS[id]?.name || `Big Idea ${id}`).join(', ');
    
    return `Comprehensive AP CSP practice quiz covering ${bigIdeaNames}. ` +
           `Contains ${questions.length} questions with balanced difficulty and topic coverage. ` +
           `Perfect for exam preparation and skill assessment.`;
  }

  // Shuffle array to randomize question order
  shuffleArray(array) {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }

  // Get available question counts for planning
  async getQuestionBankStats() {
    const stats = {
      total: await Question.countDocuments({ 'metadata.isActive': true }),
      byBigIdea: {},
      byQuestionType: {},
      byDifficulty: {}
    };
    
    // Count by Big Idea
    for (const bigIdea of Object.keys(BIG_IDEAS)) {
      stats.byBigIdea[bigIdea] = await Question.countDocuments({
        bigIdea: parseInt(bigIdea),
        'metadata.isActive': true
      });
    }
    
    // Count by Question Type
    for (const questionType of Object.keys(QUESTION_TYPES)) {
      stats.byQuestionType[questionType] = await Question.countDocuments({
        questionType: questionType,
        'metadata.isActive': true
      });
    }
    
    // Count by Difficulty
    for (const difficulty of Object.keys(DIFFICULTY_LEVELS)) {
      stats.byDifficulty[difficulty] = await Question.countDocuments({
        difficulty: difficulty,
        'metadata.isActive': true
      });
    }
    
    return stats;
  }

  // Get user performance data for adaptive timing
  async getUserPerformance(userId) {
    try {
      // This would typically query a user performance/analytics table
      // For now, return null to use default timing
      // In a real implementation, you'd query:
      // - User's historical quiz results
      // - Performance by question type
      // - Performance by difficulty level
      // - Average time per question type
      
      return null; // Placeholder - implement when user analytics are available
    } catch (error) {
      console.error('Error getting user performance:', error);
      return null;
    }
  }

  // Calculate timing breakdown for display
  calculateTimingBreakdown(questions, userPerformance = null) {
    const breakdown = {
      byDifficulty: {},
      byQuestionType: {},
      byBigIdea: {},
      total: 0
    };

    questions.forEach(question => {
      const difficulty = question.difficulty || 'medium';
      const questionType = question.questionType || 'code_analysis';
      const bigIdea = question.bigIdea || 1;
      
      // Calculate time for this question
      let questionTime = DIFFICULTY_LEVELS[difficulty].timePerQuestion;
      questionTime *= QUESTION_TYPE_TIMING[questionType] || 1.0;
      questionTime *= BIG_IDEA_TIMING[bigIdea] || 1.0;
      
      if (userPerformance) {
        questionTime = this.applyPerformanceAdaptation(questionTime, question, userPerformance);
      }
      
      // Add to breakdown
      breakdown.byDifficulty[difficulty] = (breakdown.byDifficulty[difficulty] || 0) + questionTime;
      breakdown.byQuestionType[questionType] = (breakdown.byQuestionType[questionType] || 0) + questionTime;
      breakdown.byBigIdea[bigIdea] = (breakdown.byBigIdea[bigIdea] || 0) + questionTime;
      breakdown.total += questionTime;
    });

    // Add buffer time
    const bufferTime = breakdown.total * 0.15;
    breakdown.total = Math.max(5, Math.ceil(breakdown.total + bufferTime));
    breakdown.bufferTime = bufferTime;

    return breakdown;
  }
}

export default QuizGenerationService;
