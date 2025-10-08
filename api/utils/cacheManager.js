class CacheManager {
    constructor() {
        this.cache = new Map();
        console.log('✅ CacheManager initialized');
    }

    async cacheFirstQuery(cacheKey, queryFn, ttl = 300000) {
        const cached = this.cache.get(cacheKey);
        if (cached && Date.now() - cached.timestamp < ttl) {
            return { data: cached.data, source: 'cache', latency: 0 };
        }
        
        const start = Date.now();
        const data = await queryFn();
        const end = Date.now();
        
        this.cache.set(cacheKey, {
            data: data,
            timestamp: Date.now(),
            ttl: ttl
        });
        
        return { data: data, source: 'database', latency: end - start };
    }

    // Ultra-fast question queries
    async getQuestionsByType(type, limit = 10) {
        return this.cacheFirstQuery(
            `questions_${type}`,
            async () => {
                const Question = (await import('../models/question.model.js')).default;
                return Question.find({ 
                    questionType: type,
                    'metadata.isActive': true
                })
                .lean()
                .select('questionsText options correctAnswer explanation difficulty bigIdea')
                .limit(limit);
            },
            300000 // 5 min cache
        );
    }

    // Ultra-fast quiz queries
    async getActiveQuizzes(category = null) {
        const cacheKey = category ? `quizzes_${category}` : 'all_active_quizzes';
        return this.cacheFirstQuery(
            cacheKey,
            async () => {
                const Quiz = (await import('../models/quiz.model.js')).default;
                const filter = { status: 'active' };
                if (category) filter.category = category;
                
                return Quiz.find(filter)
                    .lean()
                    .select('title category subcategory totalQuestions timeLimit status questionIds')
                    .limit(20);
            },
            600000 // 10 min cache
        );
    }

    // Ultra-fast count queries
    async getQuestionCount(type = null) {
        const cacheKey = type ? `count_${type}` : 'total_count';
        return this.cacheFirstQuery(
            cacheKey,
            async () => {
                const Question = (await import('../models/question.model.js')).default;
                const filter = { 'metadata.isActive': true };
                if (type) filter.questionType = type;
                
                return Question.countDocuments(filter);
            },
            300000 // 5 min cache
        );
    }

    // Get cache stats
    getCacheStats() {
        return {
            size: this.cache.size,
            keys: Array.from(this.cache.keys()),
            memoryUsage: JSON.stringify(Array.from(this.cache.entries())).length
        };
    }

    // Clear cache
    clearCache() {
        this.cache.clear();
        console.log('🗑️ Cache cleared');
    }

    // Clean expired entries
    cleanExpiredEntries() {
        const now = Date.now();
        let cleaned = 0;
        
        for (const [key, value] of this.cache.entries()) {
            if (now - value.timestamp > value.ttl) {
                this.cache.delete(key);
                cleaned++;
            }
        }
        
        if (cleaned > 0) {
            console.log(`🧹 Cleaned ${cleaned} expired cache entries`);
        }
        
        return cleaned;
    }
}

// Create singleton instance
const cacheManager = new CacheManager();

// Clean expired entries every 5 minutes
setInterval(() => {
    cacheManager.cleanExpiredEntries();
}, 300000);

export default cacheManager;
