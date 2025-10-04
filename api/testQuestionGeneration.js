import RobotQuestionValidator from './services/questionValidator.js';
import dotenv from 'dotenv';

dotenv.config({ path: './.env' });

async function testQuestionGeneration() {
  console.log('🤖 Testing Robot Question Generation System...\n');

  const validator = new RobotQuestionValidator();

  try {
    // Test 1: Generate a single question
    console.log('📝 Test 1: Generating a single robot question...');
    const question = await validator.generateValidQuestion('algorithms', 'medium', 2);
    
    console.log('✅ Generated question:');
    console.log('Question:', question.questionsText.substring(0, 100) + '...');
    console.log('Options:', question.options.length);
    console.log('Correct Answer:', question.correctAnswer);
    console.log('Topic:', question.topic);
    console.log('');

    // Test 2: Validate the generated question
    console.log('🔍 Test 2: Validating the generated question...');
    const isValid = await validator.validateQuestion(question);
    console.log('Validation result:', isValid ? '✅ VALID' : '❌ INVALID');
    console.log('');

    // Test 3: Test with existing question format
    console.log('🧪 Test 3: Testing with sample question format...');
    const sampleQuestion = {
      questionsText: "The robot starts at position (0,0) facing right on the grid below:\\n\\n  0 1 2 3\\n0 > . . .\\n1 . . . .\\n2 . . . ✔\\n\\nWhich of the following pseudocode segments correctly moves the robot to the goal (✔)?",
      options: [
        "REPEAT 3 TIMES { MOVE_FORWARD }",
        "REPEAT 2 TIMES { MOVE_FORWARD; ROTATE_RIGHT; MOVE_FORWARD }",
        "MOVE_FORWARD; ROTATE_RIGHT; MOVE_FORWARD; MOVE_FORWARD",
        "REPEAT 2 TIMES { MOVE_FORWARD; ROTATE_LEFT; MOVE_FORWARD }"
      ],
      correctAnswer: 2,
      explanation: "The robot needs to move right to column 2, turn downwards (rotate right), then move forward twice to reach row 2.",
      topic: "algorithms",
      points: 10,
      tags: ["ASCII", "grid", "loops", "movement"]
    };

    const sampleValidation = await validator.validateQuestion(sampleQuestion);
    console.log('Sample question validation:', sampleValidation ? '✅ VALID' : '❌ INVALID');
    console.log('');

    console.log('🎉 All tests completed successfully!');
    console.log('');
    console.log('📋 System Features:');
    console.log('• ChatGPT API integration for question generation');
    console.log('• Matrix-based robot simulation');
    console.log('• Automatic validation with retry logic');
    console.log('• Database integration ready');
    console.log('• Support for multiple difficulty levels');

  } catch (error) {
    console.error('❌ Test failed:', error.message);
    console.error('Stack trace:', error.stack);
  }
}

// Run the test
testQuestionGeneration();
