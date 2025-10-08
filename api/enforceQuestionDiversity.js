import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/question.model.js';
import QuestionGenerationService from './services/questionGenerationService.js';

dotenv.config({ path: './.env' });

class DiversityEnforcer {
    constructor() {
        this.commonNumbers = new Set(['1', '0', '5', '2', '3', '4']); // Less common numbers
        this.forbiddenFunctions = new Set(['calculate_sum', 'sum_numbers', 'find_sum', 'add_numbers']);
        this.forbiddenPatterns = [
            'sum of first n numbers',
            'two sum problem',
            'unsorted array of integers and a target sum'
        ];
        
        this.preferredNumbers = ['7', '12', '18', '25', '35', '42', '75', '150', '200', '300']; // Changed from requiredNumbers
        this.requiredFunctions = [
            'analyze_data', 'process_items', 'compute_result', 'find_solution', 
            'sort_elements', 'search_items', 'filter_data', 'transform_values',
            'validate_input', 'optimize_performance', 'calculate_average', 'find_maximum'
        ];
    }
    
    // Check if question uses too many common numbers
    checkDiversityViolations(questionText) {
        const violations = [];
        const text = questionText.toLowerCase();
        
        // Check for missing data references (more specific)
        if ((text.includes('provided dataset') || text.includes('given data')) && 
            !text.includes('[') && !text.includes('{') && !text.includes('=')) {
            violations.push('References data without providing it - include all necessary data in question text');
        }
        
        // Count common numbers usage
        let commonNumberCount = 0;
        for (const num of this.commonNumbers) {
            const matches = (text.match(new RegExp(`\\b${num}\\b`, 'g')) || []).length;
            commonNumberCount += matches;
        }
        
        // If more than 5 common numbers, suggest improvement (more lenient)
        if (commonNumberCount > 5) {
            violations.push(`Uses too many common numbers (${commonNumberCount}): prefer ${this.preferredNumbers.join(', ')}`);
        }
        
        // Check for forbidden functions
        for (const func of this.forbiddenFunctions) {
            if (text.includes(func)) {
                violations.push(`Uses forbidden function: ${func}`);
            }
        }
        
        // Check for forbidden patterns
        for (const pattern of this.forbiddenPatterns) {
            if (text.includes(pattern)) {
                violations.push(`Contains forbidden pattern: ${pattern}`);
            }
        }
        
        return violations;
    }
    
    // Generate a diverse question with strict constraints
    async generateDiverseQuestion(questionType, bigIdea, difficulty) {
        const maxAttempts = 3; // Changed from 5
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            console.log(`Attempt ${attempt}/${maxAttempts} for ${questionType} question...`);
            
            // Pick random preferred elements
            const randomNumber = this.preferredNumbers[Math.floor(Math.random() * this.preferredNumbers.length)]; // Changed from requiredNumbers
            const randomFunction = this.requiredFunctions[Math.floor(Math.random() * this.requiredFunctions.length)];
            
            const prompt = `
            Generate a ${questionType} question with DIVERSITY REQUIREMENTS: // Updated prompt
            
            PREFERRED ELEMENTS (USE THESE): // Updated prompt
            - Use the number ${randomNumber} in your question
            - Use function name: ${randomFunction}
            - Big Idea: ${bigIdea}
            - Difficulty: ${difficulty}
            
            AVOID OVERUSING COMMON NUMBERS: // Updated prompt
            - Minimize use of: 1, 0, 5, 2, 3, 4
            - Prefer: ${this.preferredNumbers.join(', ')}
            
            AVOID THESE PATTERNS:
            - Functions: calculate_sum, sum_numbers, find_sum, add_numbers
            - Patterns: "sum of first n", "two sum problem", "unsorted array and target sum"
            
            REQUIREMENTS:
            - Create a UNIQUE scenario not about basic math operations
            - Use real-world context (data analysis, simulation, optimization, etc.)
            - Include varied programming concepts
            - Make it educational and challenging
            
            Format as JSON:
            {
                "questionsText": "Your unique question here",
                "options": ["Option 1", "Option 2", "Option 3", "Option 4"],
                "correctAnswer": 0,
                "explanation": "Explanation here",
                "bigIdea": "${bigIdea}",
                "questionType": "${questionType}",
                "difficulty": "${difficulty}",
                "tags": ["tag1", "tag2"]
            }
            `;
            
            try {
                const generationService = new QuestionGenerationService();
                const result = await generationService.generateSingleQuestion(questionType, bigIdea, difficulty, prompt);
                
                if (result && result.questionsText) {
                    const violations = this.checkDiversityViolations(result.questionsText);
                    
                    if (violations.length === 0) {
                        console.log(`✅ Generated diverse ${questionType} question (attempt ${attempt})`);
                        return result;
                    } else {
                        console.log(`❌ Diversity violations (attempt ${attempt}):`, violations);
                    }
                }
            } catch (error) {
                console.log(`❌ Generation failed (attempt ${attempt}):`, error.message);
            }
        }
        
        console.log(`❌ Failed to generate diverse ${questionType} question after ${maxAttempts} attempts`);
        return null;
    }
}

async function enforceDiversity() {
    try {
        console.log('🚀 Starting Question Diversity Enforcement...\n');
        
        await mongoose.connect(process.env.MONGO);
        console.log('✅ Connected to MongoDB\n');
        
        // Remove all existing questions to start fresh
        console.log('📝 Adding more questions to existing question bank...'); // Changed log message
        const existingCount = await Question.countDocuments();
        console.log(`✅ Current questions: ${existingCount}`);
        
        // Generate diverse questions with strict enforcement
        const questionsToGenerate = 122; // Changed from 50 to 122
        
        const questionTypes = ['code_analysis', 'algorithm', 'data_structure', 'problem_solving'];
        const bigIdeas = ['1', '2', '3', '4', '5'];
        const difficulties = ['easy', 'medium', 'hard'];
        
        const diversityEnforcer = new DiversityEnforcer();
        let generatedCount = 0;
        let failedCount = 0;
        
        console.log(`\n🎯 Generating ${questionsToGenerate} diverse questions...\n`);
        
        for (let i = 0; i < questionsToGenerate; i++) {
            const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            const bigIdea = bigIdeas[Math.floor(Math.random() * bigIdeas.length)];
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            
            console.log(`\n📝 Question ${i + 1}/${questionsToGenerate}: ${questionType} (${bigIdea}, ${difficulty})`);
            
            const question = await diversityEnforcer.generateDiverseQuestion(questionType, bigIdea, difficulty);
            
            if (question) {
                try {
                    const savedQuestion = await Question.create(question);
                    generatedCount++;
                    console.log(`✅ Saved question: ${savedQuestion._id}`);
                } catch (saveError) {
                    console.log(`❌ Failed to save question:`, saveError.message);
                    failedCount++;
                }
            } else {
                failedCount++;
            }
            
            // Add small delay to avoid rate limiting
            await new Promise(resolve => setTimeout(resolve, 1000));
        }
        
        const finalCount = await Question.countDocuments();
        
        console.log(`\n🎉 Diversity enforcement complete!`);
        console.log(`📊 Results:`);
        console.log(`  - Questions generated: ${generatedCount}`);
        console.log(`  - Questions failed: ${failedCount}`);
        console.log(`  - Total questions in DB: ${finalCount}`);
        console.log(`  - Success rate: ${Math.round((generatedCount / questionsToGenerate) * 100)}%`);
        
    } catch (error) {
        console.error('❌ Error during diversity enforcement:', error);
    } finally {
        await mongoose.disconnect();
        console.log('\n🔌 Disconnected from MongoDB');
    }
}

// Export the DiversityEnforcer class
export default DiversityEnforcer;

// Only run if this file is executed directly, not when imported
if (import.meta.url === `file://${process.argv[1]}`) {
    enforceDiversity();
}
