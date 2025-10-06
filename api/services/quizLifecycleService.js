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
        status: { $in: ['active', 'in-progress'] },
        category: category,
        subcategory: subcategory
      };

      // For custom quizzes, filter by user
      if (category === 'custom' && userId) {
        filter['completedBy.userId'] = { $ne: userId }; // Exclude quizzes already completed by this user
      }

      const quizzes = await Quiz.find(filter)
        .sort({ 
          status: 1, // in-progress first, then active
          createdAt: -1 
        })
        .limit(this.activeQuizLimits[category] || 3);

      // Transform quizzes to include in-progress status for the user
      const transformedQuizzes = quizzes.map(quiz => {
        const userInProgress = quiz.inProgressBy.find(progress => 
          progress.userId.toString() === userId?.toString()
        );

        // Calculate progress information
        let progressInfo = null;
        if (userInProgress) {
          const progressPercentage = Math.round((userInProgress.currentQuestion / quiz.totalQuestions) * 100);
          const timeSpent = Math.round((Date.now() - userInProgress.startedAt.getTime()) / 1000 / 60); // minutes
          const timeRemaining = userInProgress.timeRemaining ? Math.round(userInProgress.timeRemaining / 60) : null; // minutes
          
          progressInfo = {
            currentQuestion: userInProgress.currentQuestion,
            totalQuestions: quiz.totalQuestions,
            progressPercentage,
            timeSpent,
            timeRemaining,
            startedAt: userInProgress.startedAt,
            lastActivity: userInProgress.lastActivity,
            answersCount: userInProgress.answers.length
          };
        }

        return {
          ...quiz.toObject(),
          userInProgress: userInProgress || null,
          isInProgress: !!userInProgress,
          progressInfo,
          statusDisplay: userInProgress ? 'in-progress' : quiz.status,
          statusText: userInProgress ? 'In Progress' : 
                     quiz.status === 'active' ? 'Available' : 
                     quiz.status === 'completed' ? 'Completed' : 
                     quiz.status === 'archived' ? 'Archived' : 'Unknown',
          actionText: userInProgress ? 'Resume Quiz' : 
                     quiz.status === 'active' ? 'Start Quiz' : 
                     quiz.status === 'completed' ? 'View Results' : 
                     quiz.status === 'archived' ? 'View Archived' : 'Unknown',
          actionType: userInProgress ? 'resume' : 
                     quiz.status === 'active' ? 'start' : 
                     quiz.status === 'completed' ? 'view' : 
                     quiz.status === 'archived' ? 'view' : 'unknown'
        };
      });

      return transformedQuizzes;
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

      if (quiz.status !== 'active' && quiz.status !== 'in-progress') {
        throw new Error('Quiz is not available for completion');
      }

      // Check if user already completed this quiz
      const existingCompletion = quiz.completedBy.find(completion => 
        completion.userId.toString() === userId.toString()
      );

      if (existingCompletion) {
        throw new Error('User has already completed this quiz');
      }

      // Remove user from in-progress list
      quiz.inProgressBy = quiz.inProgressBy.filter(progress => 
        progress.userId.toString() !== userId.toString()
      );

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

  // Start a quiz (mark as in-progress)
  async startQuiz(quizId, userId) {
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      if (quiz.status !== 'active' && quiz.status !== 'in-progress') {
        throw new Error('Quiz is not available');
      }

      // Check if user already started this quiz
      const existingProgress = quiz.inProgressBy.find(progress => 
        progress.userId.toString() === userId.toString()
      );

      if (existingProgress) {
        // Update last activity
        existingProgress.lastActivity = new Date();
        await quiz.save();
        return {
          success: true,
          message: 'Resuming existing quiz',
          quiz: quiz,
          progress: existingProgress
        };
      }

      // Start new quiz session
      const timeLimitSeconds = quiz.timeLimit ? quiz.timeLimit * 60 : null;
      
      quiz.inProgressBy.push({
        userId: userId,
        startedAt: new Date(),
        currentQuestion: 0,
        answers: [],
        timeRemaining: timeLimitSeconds,
        lastActivity: new Date()
      });

      // Change status to in-progress if this is the first user
      if (quiz.status === 'active') {
        quiz.status = 'in-progress';
      }

      await quiz.save();

      const newProgress = quiz.inProgressBy[quiz.inProgressBy.length - 1];

      return {
        success: true,
        message: 'Quiz started successfully',
        quiz: quiz,
        progress: newProgress
      };

    } catch (error) {
      console.error('Error starting quiz:', error);
      throw error;
    }
  }

  // Update quiz progress
  async updateQuizProgress(quizId, userId, progressData) {
    try {
      const {
        currentQuestion,
        answers = [],
        timeRemaining
      } = progressData;

      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      const userProgress = quiz.inProgressBy.find(progress => 
        progress.userId.toString() === userId.toString()
      );

      if (!userProgress) {
        throw new Error('User has not started this quiz');
      }

      // Update progress
      userProgress.currentQuestion = currentQuestion;
      userProgress.answers = answers;
      userProgress.timeRemaining = timeRemaining;
      userProgress.lastActivity = new Date();

      await quiz.save();

      return {
        success: true,
        message: 'Quiz progress updated',
        progress: userProgress
      };

    } catch (error) {
      console.error('Error updating quiz progress:', error);
      throw error;
    }
  }

  // Get user's in-progress quizzes
  async getUserInProgressQuizzes(userId) {
    try {
      const inProgressQuizzes = await Quiz.find({
        'inProgressBy.userId': userId,
        status: 'in-progress'
      }).sort({ 'inProgressBy.lastActivity': -1 });

      // Transform to include user-specific progress
      const transformedQuizzes = inProgressQuizzes.map(quiz => {
        const userProgress = quiz.inProgressBy.find(progress => 
          progress.userId.toString() === userId.toString()
        );

        return {
          ...quiz.toObject(),
          userProgress: userProgress,
          progressPercentage: Math.round((userProgress.currentQuestion / quiz.totalQuestions) * 100),
          timeSpent: Math.round((Date.now() - userProgress.startedAt.getTime()) / 1000 / 60), // minutes
          canResume: true,
          actionText: 'Resume Quiz',
          actionType: 'resume',
          statusText: 'In Progress',
          statusDisplay: 'in-progress'
        };
      });

      return transformedQuizzes;
    } catch (error) {
      console.error('Error getting user in-progress quizzes:', error);
      throw error;
    }
  }

  // Abandon a quiz (remove from in-progress)
  async abandonQuiz(quizId, userId) {
    try {
      const quiz = await Quiz.findById(quizId);
      if (!quiz) {
        throw new Error('Quiz not found');
      }

      const userProgressIndex = quiz.inProgressBy.findIndex(progress => 
        progress.userId.toString() === userId.toString()
      );

      if (userProgressIndex === -1) {
        throw new Error('User has not started this quiz');
      }

      // Remove user's progress
      quiz.inProgressBy.splice(userProgressIndex, 1);

      // If no one else is taking this quiz, change status back to active
      if (quiz.inProgressBy.length === 0) {
        quiz.status = 'active';
      }

      await quiz.save();

      return {
        success: true,
        message: 'Quiz abandoned successfully'
      };

    } catch (error) {
      console.error('Error abandoning quiz:', error);
      throw error;
    }
  }

  // Get abandoned quizzes (for manual cleanup if needed)
  async getAbandonedQuizzes() {
    try {
      const abandonDate = new Date();
      abandonDate.setHours(abandonDate.getHours() - 24);

      const abandonedQuizzes = await Quiz.find({
        status: 'in-progress',
        'inProgressBy.lastActivity': { $lt: abandonDate }
      });

      return abandonedQuizzes;
    } catch (error) {
      console.error('Error getting abandoned quizzes:', error);
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
      const inProgressQuizzes = await Quiz.countDocuments({ status: 'in-progress' });
      const completedQuizzes = await Quiz.countDocuments({ status: 'completed' });
      const archivedQuizzes = await Quiz.countDocuments({ status: 'archived' });

      return {
        active: activeQuizzes,
        inProgress: inProgressQuizzes,
        completed: completedQuizzes,
        archived: archivedQuizzes,
        total: activeQuizzes + inProgressQuizzes + completedQuizzes + archivedQuizzes,
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
