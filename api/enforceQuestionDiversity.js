import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Question from './models/question.model.js';
import OpenAI from 'openai';

dotenv.config({ path: './.env' });

// Connect to MongoDB
mongoose.connect(process.env.MONGO).then(() => {
    console.log("Connected to MongoDB");
}).catch((err) => {
    console.log(err);
});

// Initialize OpenAI
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// Diversity enforcement system
class DiversityEnforcer {
    constructor() {
        this.forbiddenNumbers = new Set(['1', '0', '5', '2', '3', '4']); // Most overused
        this.forbiddenFunctions = new Set(['calculate_sum', 'sum_numbers', 'find_sum', 'add_numbers']);
        this.forbiddenPatterns = [
            'sum of first n numbers',
            'two sum problem',
            'unsorted array of integers and a target sum',
            'calculates the sum of',
            'function that calculates'
        ];
        
        this.requiredNumbers = ['7', '12', '18', '25', '35', '42', '75', '150', '200', '300'];
        this.requiredFunctions = [
            'analyze_data', 'process_items', 'compute_result', 'find_solution', 
            'sort_elements', 'search_items', 'filter_data', 'transform_values',
            'validate_input', 'optimize_performance', 'calculate_average', 'find_maximum'
        ];
    }
    
    // Check if question violates diversity rules
    checkDiversityViolations(questionText) {
        const violations = [];
        const text = questionText.toLowerCase();
        
        // Check forbidden numbers
        for (const num of this.forbiddenNumbers) {
            if (text.includes(` ${num} `) || text.includes(` ${num},`) || text.includes(` ${num}.`)) {
                violations.push(`Uses forbidden number: ${num}`);
            }
        }
        
        // Check forbidden functions
        for (const func of this.forbiddenFunctions) {
            if (text.includes(func)) {
                violations.push(`Uses forbidden function: ${func}`);
            }
        }
        
        // Check forbidden patterns
        for (const pattern of this.forbiddenPatterns) {
            if (text.includes(pattern)) {
                violations.push(`Contains forbidden pattern: "${pattern}"`);
            }
        }
        
        return violations;
    }
    
    // Generate a diverse question with strict constraints
    async generateDiverseQuestion(questionType, bigIdea, difficulty) {
        const maxAttempts = 5;
        
        for (let attempt = 1; attempt <= maxAttempts; attempt++) {
            console.log(`Attempt ${attempt}/${maxAttempts} for ${questionType} question...`);
            
            // Pick random required elements
            const randomNumber = this.requiredNumbers[Math.floor(Math.random() * this.requiredNumbers.length)];
            const randomFunction = this.requiredFunctions[Math.floor(Math.random() * this.requiredFunctions.length)];
            
            const prompt = `
            Generate a ${questionType} question with STRICT REQUIREMENTS:
            
            MANDATORY ELEMENTS (NO EXCEPTIONS):
            - Use the number ${randomNumber} in your question
            - Use function name: ${randomFunction}
            - Big Idea: ${bigIdea}
            - Difficulty: ${difficulty}
            
            FORBIDDEN ELEMENTS (DO NOT USE):
            - Numbers: 1, 0, 5, 2, 3, 4
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
                "explanation": "Detailed explanation",
                "topic": "specific topic",
                "bigIdea": ${bigIdea},
                "questionType": "${questionType}",
                "difficulty": "${difficulty}",
                "points": 5,
                "tags": ["unique", "diverse", "real-world"]
            }
            `;
            
            try {
                const response = await openai.chat.completions.create({
                    model: "gpt-4o-mini",
                    messages: [{ role: "user", content: prompt }],
                    temperature: 0.8, // Higher temperature for more creativity
                    max_tokens: 1000
                });
                
                const generatedContent = response.choices[0].message.content;
                const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
                
                if (!jsonMatch) {
                    console.log(`No valid JSON in attempt ${attempt}`);
                    continue;
                }
                
                const question = JSON.parse(jsonMatch[0]);
                
                // Check for diversity violations
                const violations = this.checkDiversityViolations(question.questionsText);
                
                if (violations.length === 0) {
                    console.log(`✅ Generated diverse ${questionType} question on attempt ${attempt}`);
                    return question;
                } else {
                    console.log(`❌ Diversity violations in attempt ${attempt}:`, violations);
                    if (attempt === maxAttempts) {
                        console.log(`⚠️ Using question despite violations (max attempts reached)`);
                        return question;
                    }
                }
                
            } catch (error) {
                console.error(`Error in attempt ${attempt}:`, error);
                if (attempt === maxAttempts) throw error;
            }
        }
        
        throw new Error(`Failed to generate diverse ${questionType} question after ${maxAttempts} attempts`);
    }
}

async function enforceDiversity() {
    console.log('🎯 Enforcing Question Diversity with Strict Rules...\n');
    
    const diversityEnforcer = new DiversityEnforcer();
    
    try {
        // Remove all existing questions to start fresh
        console.log('🗑️ Removing all existing questions for fresh start...');
        await Question.deleteMany({});
        console.log('✅ All questions removed');
        
        // Generate diverse questions with strict enforcement
        const questionsToGenerate = 50; // Start with smaller batch
        const questionTypes = ['code_analysis', 'algorithm', 'data_structure', 'problem_solving'];
        const bigIdeas = [1, 2, 3, 4, 5];
        const difficulties = ['easy', 'medium', 'hard'];
        
        const generatedQuestions = [];
        
        for (let i = 0; i < questionsToGenerate; i++) {
            const questionType = questionTypes[Math.floor(Math.random() * questionTypes.length)];
            const bigIdea = bigIdeas[Math.floor(Math.random() * bigIdeas.length)];
            const difficulty = difficulties[Math.floor(Math.random() * difficulties.length)];
            
            console.log(`\n📝 Generating question ${i + 1}/${questionsToGenerate}: ${questionType} (Big Idea ${bigIdea}, ${difficulty})`);
            
            try {
                const question = await diversityEnforcer.generateDiverseQuestion(questionType, bigIdea, difficulty);
                
                // Save to database
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
                        generatedBy: 'AI-diverse',
                        validationScore: 1.0,
                        usageCount: 0,
                        averageScore: 0,
                        isActive: true
                    }
                });
                
                const savedQuestion = await newQuestion.save();
                generatedQuestions.push(savedQuestion);
                
                console.log(`✅ Saved question: ${savedQuestion._id}`);
                
            } catch (error) {
                console.error(`❌ Failed to generate question ${i + 1}:`, error);
                // Continue with other questions
            }
        }
        
        console.log(`\n🎉 Generated ${generatedQuestions.length} diverse questions`);
        
        // Analyze final diversity
        const finalQuestions = await Question.find({ 'metadata.isActive': true });
        console.log(`\n📊 Final Analysis:`);
        console.log(`Total questions: ${finalQuestions.length}`);
        
        const numberCounts = {};
        const functionCounts = {};
        const typeCounts = {};
        
        finalQuestions.forEach(q => {
            // Count numbers
            const numbers = q.questionsText.match(/\b\d+\b/g);
            if (numbers) {
                numbers.forEach(num => {
                    numberCounts[num] = (numberCounts[num] || 0) + 1;
                });
            }
            
            // Count functions
            const functions = q.questionsText.match(/def\s+(\w+)|function\s+(\w+)/g);
            if (functions) {
                functions.forEach(func => {
                    functionCounts[func] = (functionCounts[func] || 0) + 1;
                });
            }
            
            // Count types
            typeCounts[q.questionType] = (typeCounts[q.questionType] || 0) + 1;
        });
        
        console.log('\n🔢 Number Distribution:');
        Object.entries(numberCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([num, count]) => {
                console.log(`  ${num}: ${count} questions`);
            });
        
        console.log('\n🔧 Function Distribution:');
        Object.entries(functionCounts)
            .sort((a, b) => b[1] - a[1])
            .slice(0, 10)
            .forEach(([func, count]) => {
                console.log(`  ${func}: ${count} questions`);
            });
        
        console.log('\n📋 Question Type Distribution:');
        Object.entries(typeCounts).forEach(([type, count]) => {
            console.log(`  ${type}: ${count} questions`);
        });
        
    } catch (error) {
        console.error('❌ Error enforcing diversity:', error);
    } finally {
        mongoose.connection.close();
        console.log('\n🔌 Database connection closed.');
    }
}

// Run the diversity enforcement
enforceDiversity();

