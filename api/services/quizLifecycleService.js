import Quiz from '../models/quiz.model.js';
import QuizGenerationService from './quizGenerationService.js';

class QuizLifecycleService {
  constructor() {
    this.quizGenerationService = new QuizGenerationService();
    
    // Configuration for active quiz pools
    this.activeQuizLimits = {
      'practice': 3,        // 3 active practice quizzes
      'exam': 2,            // 2 active exam quizzes  
      'topic-specific': 2,  // 2 per subcategory
      'mixed': 2,           // 2 mixed topic quizzes
      'custom': 5           // 5 custom quizzes per user
    };
    
    // Retention periods (in days)
    this.retentionPeriods = {
      'completed': 90,      // Keep completed quizzes for 90 days
      'archived': 30       // Keep archived quizzes for 30 days
    };
  }

  // Get active quizzes for a specific category/subcategory
  async getActiveQuizzes(category, subcategory = 'general', userId = null) {
    try {
      const filter = {
        status: 'active',
        category: category,
        subcategory: subcategory
      };

      // For custom quizzes, filter by user
      if (category === 'custom' && userId) {
        filter['completedBy.userId'] = { $ne: userId }; // Exclude quizzes already completed by this user
      }

      const activeQuizzes = await Quiz.find(filter)
        .sort({ createdAt: -1 })
        .limit(this.activeQuizLimits[category] || 3);

      return activeQuizzes;
    } catch (error) {
      console.error('Error getting active quizzes:', error);
      throw error;
    }
  }

  // Get user's quiz history
  async getUserQuizHistory(userId, options = {}) {
    try {
      const {
        category = null,
        subcategory = null,
        limit = 20,
        page = 1
      } = options;

      const filter = {
        'completedBy.userId': userId,
        status: { $in: ['completed', 'archived'] }
      };

      if (category) filter.category = category;
      if (subcategory) filter.subcategory = subcategory;

      const skip = (page - 1) * limit;

      const history = await Quiz.find(filter)
        .sort({ 'completedBy.completedAt': -1 })
        .skip(skip)
        .limit(limit)
        .populate('questionIds', 'question options correctAnswer');

      // Transform to include user-specific completion data
      const transformedHistory = history.map(quiz => {
        const userCompletion = quiz.completedBy.find(completion => 
          completion.userId.toString() === userId.toString()
        );
        
        return {
          ...quiz.toObject(),
          userCompletion: userCompletion,
          canRetake: this.canRetakeQuiz(quiz, userId)
        };
      });

      return transformedHistory;
    } catch (error) {
      console.error('Error getting user quiz history:', error);
      throw error;
    }
  }

  // Complete a quiz and move to history
  async completeQuiz(quizId, userId, completionData) {
    try {
      const {
        score,
        timeSpent,
        answers = []
      } = completionData;

      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      if (quiz.status !== 'active') {
        throw new Error('Quiz is not active');
      }

      // Check if user already completed this quiz
      const existingCompletion = quiz.completedBy.find(completion => 
        completion.userId.toString() === userId.toString()
      );

      if (existingCompletion) {
        throw new Error('User has already completed this quiz');
      }

      // Add completion data
      quiz.completedBy.push({
        userId: userId,
        completedAt: new Date(),
        score: score,
        timeSpent: timeSpent,
        answers: answers
      });

      // Move to completed status
      quiz.status = 'completed';

      await quiz.save();

      // Generate new active quiz for this category/subcategory
      await this.ensureActiveQuizPool(quiz.category, quiz.subcategory);

      return {
        success: true,
        message: 'Quiz completed successfully',
        quiz: quiz,
        newQuizGenerated: true
      };

    } catch (error) {
      console.error('Error completing quiz:', error);
      throw error;
    }
  }

  // Ensure there are enough active quizzes in the pool
  async ensureActiveQuizPool(category, subcategory = 'general') {
    try {
      const activeQuizzes = await this.getActiveQuizzes(category, subcategory);
      const limit = this.activeQuizLimits[category] || 3;

      if (activeQuizzes.length < limit) {
        console.log(`Generating new ${category}/${subcategory} quiz (${activeQuizzes.length}/${limit} active)`);
        
        const config = {
          totalQuestions: 30,
          category: category,
          subcategory: subcategory,
          difficulty: 'mixed'
        };

        await this.quizGenerationService.generateRegularQuiz(config);
        
        console.log(`✅ Generated new ${category}/${subcategory} quiz`);
      }

    } catch (error) {
      console.error('Error ensuring active quiz pool:', error);
      throw error;
    }
  }

  // Check if user can retake a quiz
  canRetakeQuiz(quiz, userId) {
    const userCompletion = quiz.completedBy.find(completion => 
      completion.userId.toString() === userId.toString()
    );

    if (!userCompletion) return false;

    // Allow retake if completed more than 24 hours ago
    const hoursSinceCompletion = (Date.now() - userCompletion.completedAt.getTime()) / (1000 * 60 * 60);
    return hoursSinceCompletion >= 24;
  }

  // Retake a quiz from history
  async retakeQuiz(quizId, userId) {
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      if (!this.canRetakeQuiz(quiz, userId)) {
        throw new Error('Quiz cannot be retaken yet (24 hour cooldown)');
      }

      // Create a new active quiz with same configuration
      const config = {
        totalQuestions: quiz.totalQuestions,
        category: quiz.category,
        subcategory: quiz.subcategory,
        difficulty: quiz.difficulty,
        title: `${quiz.title} (Retake)`
      };

      const newQuiz = await this.quizGenerationService.generateRegularQuiz(config);
      
      return {
        success: true,
        message: 'Quiz retake generated successfully',
        quiz: newQuiz
      };

    } catch (error) {
      console.error('Error retaking quiz:', error);
      throw error;
    }
  }

  // Archive old completed quizzes
  async archiveOldQuizzes() {
    try {
      const archiveDate = new Date();
      archiveDate.setDate(archiveDate.getDate() - this.retentionPeriods.completed);

      const quizzesToArchive = await Quiz.find({
        status: 'completed',
        'completedBy.completedAt': { $lt: archiveDate }
      });

      for (const quiz of quizzesToArchive) {
        quiz.status = 'archived';
        await quiz.save();
      }

      console.log(`Archived ${quizzesToArchive.length} old completed quizzes`);
      return quizzesToArchive.length;

    } catch (error) {
      console.error('Error archiving old quizzes:', error);
      throw error;
    }
  }

  // Clean up expired quizzes
  async cleanupExpiredQuizzes() {
    try {
      const expiredQuizzes = await Quiz.find({
        expiresAt: { $lt: new Date() }
      });

      const deletedCount = await Quiz.deleteMany({
        expiresAt: { $lt: new Date() }
      });

      console.log(`Cleaned up ${deletedCount.deletedCount} expired quizzes`);
      return deletedCount.deletedCount;

    } catch (error) {
      console.error('Error cleaning up expired quizzes:', error);
      throw error;
    }
  }

  // Get quiz statistics
  async getQuizStats() {
    try {
      const stats = await Quiz.aggregate([
        {
          $group: {
            _id: '$status',
            count: { $sum: 1 },
            categories: { $addToSet: '$category' }
          }
        }
      ]);

      const activeQuizzes = await Quiz.countDocuments({ status: 'active' });
      const completedQuizzes = await Quiz.countDocuments({ status: 'completed' });
      const archivedQuizzes = await Quiz.countDocuments({ status: 'archived' });

      return {
        active: activeQuizzes,
        completed: completedQuizzes,
        archived: archivedQuizzes,
        total: activeQuizzes + completedQuizzes + archivedQuizzes,
        breakdown: stats
      };

    } catch (error) {
      console.error('Error getting quiz stats:', error);
      throw error;
    }
  }

  // Initialize active quiz pools for all categories
  async initializeActiveQuizPools() {
    try {
      console.log('Initializing active quiz pools...');

      const categories = ['practice', 'exam', 'topic-specific', 'mixed'];
      const subcategories = {
        'practice': ['general', 'big-idea-1', 'big-idea-2', 'big-idea-3', 'big-idea-4', 'big-idea-5'],
        'exam': ['general'],
        'topic-specific': ['algorithms', 'data-structures', 'networking', 'impact', 'code-analysis', 'problem-solving'],
        'mixed': ['general']
      };

      for (const category of categories) {
        const categorySubcategories = subcategories[category] || ['general'];
        
        for (const subcategory of categorySubcategories) {
          await this.ensureActiveQuizPool(category, subcategory);
        }
      }

      console.log('✅ Active quiz pools initialized');

    } catch (error) {
      console.error('Error initializing active quiz pools:', error);
      throw error;
    }
  }
}

export default QuizLifecycleService;
