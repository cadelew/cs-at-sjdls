import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/question.model.js';

dotenv.config({ path: './.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

async function analyzeQuestionDiversity() {
    console.log('🔍 Analyzing Question Diversity...\n');
    
    try {
        // Get all questions
        const questions = await Question.find({ 'metadata.isActive': true });
        console.log(`Total questions: ${questions.length}\n`);
        
        // Analyze patterns
        const patterns = {
            numbers: new Set(),
            functions: new Set(),
            variables: new Set(),
            keywords: new Set(),
            similarTexts: []
        };
        
        questions.forEach((question, index) => {
            const text = question.questionsText.toLowerCase();
            
            // Extract numbers
            const numbers = text.match(/\b\d+\b/g);
            if (numbers) {
                numbers.forEach(num => patterns.numbers.add(num));
            }
            
            // Extract function names
            const functions = text.match(/def\s+(\w+)|function\s+(\w+)/g);
            if (functions) {
                functions.forEach(func => patterns.functions.add(func));
            }
            
            // Extract variable names
            const variables = text.match(/\b[a-z][a-z0-9_]*\s*=/g);
            if (variables) {
                variables.forEach(variable => patterns.variables.add(variable.trim()));
            }
            
            // Check for similar question texts
            for (let i = index + 1; i < questions.length; i++) {
                const otherText = questions[i].questionsText.toLowerCase();
                
                // Calculate similarity (simple word overlap)
                const words1 = text.split(/\s+/);
                const words2 = otherText.split(/\s+/);
                const commonWords = words1.filter(word => words2.includes(word));
                const similarity = commonWords.length / Math.max(words1.length, words2.length);
                
                if (similarity > 0.7) { // 70% similarity threshold
                    patterns.similarTexts.push({
                        question1: index,
                        question2: i,
                        similarity: similarity.toFixed(2),
                        text1: question.questionsText.substring(0, 100) + '...',
                        text2: questions[i].questionsText.substring(0, 100) + '...'
                    });
                }
            }
        });
        
        console.log('📊 Pattern Analysis:');
        console.log(`- Unique numbers used: ${patterns.numbers.size}`);
        console.log(`- Unique functions: ${patterns.functions.size}`);
        console.log(`- Unique variables: ${patterns.variables.size}`);
        console.log(`- Similar question pairs: ${patterns.similarTexts.length}`);
        
        console.log('\n🔢 Most common numbers:');
        const numberCounts = {};
        questions.forEach(q => {
            const numbers = q.questionsText.match(/\b\d+\b/g);
            if (numbers) {
                numbers.forEach(num => {
                    numberCounts[num] = (numberCounts[num] || 0) + 1;
                });
            }
        });
        const sortedNumbers = Object.entries(numberCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        sortedNumbers.forEach(([num, count]) => {
            console.log(`  ${num}: used in ${count} questions`);
        });
        
        console.log('\n🔧 Most common functions:');
        const functionCounts = {};
        questions.forEach(q => {
            const functions = q.questionsText.match(/def\s+(\w+)|function\s+(\w+)/g);
            if (functions) {
                functions.forEach(func => {
                    functionCounts[func] = (functionCounts[func] || 0) + 1;
                });
            }
        });
        const sortedFunctions = Object.entries(functionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10);
        sortedFunctions.forEach(([func, count]) => {
            console.log(`  ${func}: used in ${count} questions`);
        });
        
        console.log('\n⚠️ Similar Question Pairs:');
        patterns.similarTexts.slice(0, 5).forEach(pair => {
            console.log(`\nSimilarity: ${pair.similarity}`);
            console.log(`Q${pair.question1}: ${pair.text1}`);
            console.log(`Q${pair.question2}: ${pair.text2}`);
        });
        
        // Analyze by Big Idea and Question Type
        console.log('\n📈 Distribution Analysis:');
        const bigIdeaCounts = {};
        const questionTypeCounts = {};
        const difficultyCounts = {};
        
        questions.forEach(q => {
            bigIdeaCounts[q.bigIdea] = (bigIdeaCounts[q.bigIdea] || 0) + 1;
            questionTypeCounts[q.questionType] = (questionTypeCounts[q.questionType] || 0) + 1;
            difficultyCounts[q.difficulty] = (difficultyCounts[q.difficulty] || 0) + 1;
        });
        
        console.log('\nBig Idea Distribution:');
        Object.entries(bigIdeaCounts).forEach(([bigIdea, count]) => {
            console.log(`  Big Idea ${bigIdea}: ${count} questions`);
        });
        
        console.log('\nQuestion Type Distribution:');
        Object.entries(questionTypeCounts).forEach(([type, count]) => {
            console.log(`  ${type}: ${count} questions`);
        });
        
        console.log('\nDifficulty Distribution:');
        Object.entries(difficultyCounts).forEach(([difficulty, count]) => {
            console.log(`  ${difficulty}: ${count} questions`);
        });
        
        console.log('\n💡 Recommendations:');
        if (patterns.similarTexts.length > 5) {
            console.log('- Consider regenerating questions with more diverse prompts');
        }
        if (patterns.numbers.size < 10) {
            console.log('- Use more varied numbers in questions');
        }
        if (patterns.functions.size < 5) {
            console.log('- Generate questions with more diverse function names');
        }
        
    } catch (error) {
        console.error('❌ Error analyzing questions:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
    }
}

// Run the analysis
analyzeQuestionDiversity();

