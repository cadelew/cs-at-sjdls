// Test script for small batch generation
import dotenv from 'dotenv';
dotenv.config({ path: './.env' });

import mongoose from 'mongoose';
import QuestionGenerationService from './services/questionGenerationService.js';

mongoose.connect(process.env.MONGO)
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.error("MongoDB connection error:", err));

const testSmallBatch = async () => {
    console.log('🧪 Testing 50 Question Generation...\n');
    
    const generationService = new QuestionGenerationService();
    
    const testRequest = {
        totalQuestions: 50, // Full 50 question generation test
        distribution: {
            bigIdea: { 
                1: 12,  // Creative Development (10-13%)
                2: 19,  // Data (17-22%) 
                3: 32,  // Algorithms & Programming (30-35%)
                4: 13,  // Computer Systems & Networks (11-15%)
                5: 24   // Impact of Computing (21-26%)
            }, // Use official AP CSP exam weights
            questionType: { 
                // robot_navigation: 50, // Commented out for now
                code_analysis: 50, 
                algorithm: 50 
            },
            difficulty: { 
                easy: 40, 
                medium: 60 
            }
        },
        validationRules: {
            minValidationScore: 0.7,
            maxRetries: 2, // Fewer retries for testing
            qualityThreshold: 0.7
        },
        output: {
            format: 'database',
            includeQuestions: true,
            includeMetadata: true
        },
        tags: ['test', 'small-batch']
    };

    try {
        console.log('📊 Test Configuration:');
        console.log(`- Total Questions: ${testRequest.totalQuestions}`);
        console.log(`- Robot Navigation: ${testRequest.distribution.questionType.robot_navigation}%`);
        console.log(`- Code Analysis: ${testRequest.distribution.questionType.code_analysis}%`);
        console.log(`- Algorithm: ${testRequest.distribution.questionType.algorithm}%`);
        console.log(`- Max Retries: ${testRequest.validationRules.maxRetries}`);
        console.log(`- Tags: ${testRequest.tags.join(', ')}\n`);

        const result = await generationService.generateBatchQuestions(testRequest);

        console.log('\n✅ Generation Complete!');
        console.log(`📈 Results:`);
        console.log(`- Requested: ${result.totalRequested}`);
        console.log(`- Generated: ${result.totalGenerated}`);
        console.log(`- Saved: ${result.totalSaved}`);
        console.log(`- Success Rate: ${Math.round((result.totalGenerated / result.totalRequested) * 100)}%`);

        if (result.questions && result.questions.length > 0) {
            console.log('\n📝 Generated Questions:');
            result.questions.forEach((q, i) => {
                console.log(`\n${i + 1}. ${q.questionType.toUpperCase()} (${q.difficulty})`);
                console.log(`   Topic: ${q.topic}`);
                console.log(`   Big Idea: ${q.bigIdea}`);
                console.log(`   Tags: ${q.tags.join(', ')}`);
                console.log(`   Question: ${q.questionsText.substring(0, 100)}...`);
            });
        }

        console.log('\n🎉 Test completed successfully!');
        
    } catch (error) {
        console.error('❌ Test failed:', error);
    } finally {
        mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
};

// Run the test
testSmallBatch();
