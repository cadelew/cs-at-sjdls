import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/question.model.js';
import QuestionGenerationService from './services/questionGenerationService.js';

dotenv.config({ path: './.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

async function improveQuestionDiversity() {
    console.log('🔄 Improving Question Diversity...\n');
    
    const generationService = new QuestionGenerationService();
    
    try {
        // Get all questions
        const questions = await Question.find({ 'metadata.isActive': true });
        console.log(`Current questions: ${questions.length}`);
        
        // Find and remove highly similar questions
        const questionsToRemove = new Set();
        
        for (let i = 0; i < questions.length; i++) {
            if (questionsToRemove.has(i)) continue;
            
            for (let j = i + 1; j < questions.length; j++) {
                if (questionsToRemove.has(j)) continue;
                
                const text1 = questions[i].questionsText.toLowerCase();
                const text2 = questions[j].questionsText.toLowerCase();
                
                // Calculate similarity
                const words1 = text1.split(/\s+/);
                const words2 = text2.split(/\s+/);
                const commonWords = words1.filter(word => words2.includes(word));
                const similarity = commonWords.length / Math.max(words1.length, words2.length);
                
                if (similarity > 0.75) { // 75% similarity threshold
                    console.log(`Removing similar question (${similarity.toFixed(2)} similarity):`);
                    console.log(`  Q${i}: ${questions[i].questionsText.substring(0, 80)}...`);
                    console.log(`  Q${j}: ${questions[j].questionsText.substring(0, 80)}...`);
                    
                    // Remove the second one (keep the first)
                    questionsToRemove.add(j);
                }
            }
        }
        
        console.log(`\n🗑️ Removing ${questionsToRemove.size} similar questions...`);
        
        // Remove similar questions
        const idsToRemove = Array.from(questionsToRemove).map(index => questions[index]._id);
        if (idsToRemove.length > 0) {
            const deleteResult = await Question.deleteMany({ _id: { $in: idsToRemove } });
            console.log(`✅ Removed ${deleteResult.deletedCount} similar questions`);
        }
        
        // Check current question distribution
        const remainingQuestions = await Question.find({ 'metadata.isActive': true });
        console.log(`\n📊 Remaining questions: ${remainingQuestions.length}`);
        
        const typeCounts = {};
        const bigIdeaCounts = {};
        const difficultyCounts = {};
        
        remainingQuestions.forEach(q => {
            typeCounts[q.questionType] = (typeCounts[q.questionType] || 0) + 1;
            bigIdeaCounts[q.bigIdea] = (bigIdeaCounts[q.bigIdea] || 0) + 1;
            difficultyCounts[q.difficulty] = (difficultyCounts[q.difficulty] || 0) + 1;
        });
        
        console.log('\nCurrent distribution:');
        console.log('Question Types:', typeCounts);
        console.log('Big Ideas:', bigIdeaCounts);
        console.log('Difficulties:', difficultyCounts);
        
        // Generate new diverse questions to fill gaps
        console.log('\n🎯 Generating diverse questions to fill gaps...');
        
        const targetTotal = 100; // Target total questions
        const currentTotal = remainingQuestions.length;
        const needToGenerate = Math.max(0, targetTotal - currentTotal);
        
        if (needToGenerate > 0) {
            console.log(`Need to generate ${needToGenerate} more questions`);
            
            // Generate questions with better distribution
            const request = {
                totalQuestions: needToGenerate,
                distribution: {
                    bigIdea: { 
                        1: 12,  // Creative Development (10-13%)
                        2: 19,  // Data (17-22%) 
                        3: 32,  // Algorithms & Programming (30-35%)
                        4: 13,  // Computer Systems & Networks (11-15%)
                        5: 24   // Impact of Computing (21-26%)
                    },
                    questionType: { 
                        code_analysis: 35, 
                        algorithm: 30, 
                        data_structure: 20, 
                        problem_solving: 15 
                    },
                    difficulty: { easy: 40, medium: 45, hard: 15 }
                },
                validationRules: {
                    minValidationScore: 0.8,
                    maxRetries: 3,
                    qualityThreshold: 0.7
                },
                output: {
                    format: 'database',
                    includeQuestions: false,
                    includeMetadata: true
                },
                tags: ['diverse', 'ai-generated', 'improved']
            };
            
            console.log('Generating diverse questions...');
            const result = await generationService.generateBatchQuestions(request);
            
            console.log(`✅ Generated ${result.totalGenerated} new diverse questions`);
            console.log(`📊 New distribution:`, result.distribution);
        }
        
        // Final analysis
        const finalQuestions = await Question.find({ 'metadata.isActive': true });
        console.log(`\n🎉 Final result: ${finalQuestions.length} diverse questions`);
        
        // Quick diversity check
        const finalNumbers = new Set();
        const finalFunctions = new Set();
        
        finalQuestions.forEach(q => {
            const text = q.questionsText.toLowerCase();
            
            // Extract numbers
            const numbers = text.match(/\b\d+\b/g);
            if (numbers) {
                numbers.forEach(num => finalNumbers.add(num));
            }
            
            // Extract functions
            const functions = text.match(/def\s+(\w+)|function\s+(\w+)/g);
            if (functions) {
                functions.forEach(func => finalFunctions.add(func));
            }
        });
        
        console.log(`📈 Diversity metrics:`);
        console.log(`- Unique numbers: ${finalNumbers.size}`);
        console.log(`- Unique functions: ${finalFunctions.size}`);
        console.log(`- Average diversity: ${((finalNumbers.size + finalFunctions.size) / 2).toFixed(1)}`);
        
    } catch (error) {
        console.error('❌ Error improving diversity:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
    }
}

// Run the improvement
improveQuestionDiversity();

