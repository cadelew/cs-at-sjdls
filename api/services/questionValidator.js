import OpenAI from 'openai';
import Question from '../models/question.model.js';

// Initialize OpenAI client lazily
let openai = null;
const getOpenAI = () => {
  if (!openai) {
    openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY
    });
  }
  return openai;
};

// Robot directions: 0=right(>), 1=down(v), 2=left(<), 3=up(^)
const DIRECTIONS = {
  '>': 0, 'right': 0,
  'v': 1, 'down': 1,
  '<': 2, 'left': 2,
  '^': 3, 'up': 3
};

const DIRECTION_SYMBOLS = ['>', 'v', '<', '^'];

class RobotQuestionValidator {
  constructor() {
    this.grid = [];
    this.robotPosition = { x: 0, y: 0 };
    this.robotDirection = 0;
    this.goalPosition = { x: 0, y: 0 };
  }

  // Generate a robot question using ChatGPT
  async generateRobotQuestion(topic = 'algorithms', difficulty = 'medium') {
    const prompt = `
You are a robot question generator. You MUST follow these instructions EXACTLY without any variation.

Generate a robot grid navigation question with these specifications:

Topic: ${topic}
Difficulty: ${difficulty}

MANDATORY FORMAT - COPY THIS EXACTLY:

{
  "questionsText": "A robot is on a 4x4 grid. The robot starts at position (x, y) facing direction on the grid below:\\n\\n  0 1 2 3\\n0 . . > .\\n1 . . . .\\n2 . . . ✔\\n3 . . . .\\n\\nWhich of the following pseudocode segments correctly moves the robot to the goal (✔)?",
  "options": [
    "MOVE_FORWARD; MOVE_FORWARD; ROTATE_RIGHT; MOVE_FORWARD",
    "ROTATE_RIGHT; MOVE_FORWARD; MOVE_FORWARD; MOVE_FORWARD",
    "MOVE_FORWARD; ROTATE_LEFT; MOVE_FORWARD; MOVE_FORWARD",
    "REPEAT 3 TIMES { MOVE_FORWARD }"
  ],
  "correctAnswer": 1,
  "explanation": "The robot needs to move right twice, turn down, then move forward twice to reach the goal.",
  "topic": "${topic}",
  "points": 5,
  "tags": ["robot", "grid", "algorithms"]
}

CRITICAL RULES - NO EXCEPTIONS:
1. Grid MUST be exactly: "  0 1 2 3\\n0 . . > .\\n1 . . . .\\n2 . . . ✔\\n3 . . . ."
2. Robot MUST use direction symbols: >, v, <, ^ (NEVER use R)
3. Goal MUST use ✔ (NEVER use G)
4. Commands MUST be: MOVE_FORWARD, ROTATE_LEFT, ROTATE_RIGHT
5. Commands MUST be separated by "; "
6. Only ONE option should reach the goal
7. Generate a valid path that actually reaches the goal

DO NOT:
- Use different grid formats
- Use R for robot or G for goal
- Use different command names
- Use different separators
- Create impossible paths

Generate the question following this EXACT template.
`;

    try {
      const response = await getOpenAI().chat.completions.create({
        model: "gpt-4o-mini",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.7,
        max_tokens: 1000
      });

      const generatedContent = response.choices[0].message.content;
      
      // Extract JSON from response
      const jsonMatch = generatedContent.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        throw new Error('No valid JSON found in response');
      }

      return JSON.parse(jsonMatch[0]);
    } catch (error) {
      console.error('Error generating question:', error);
      throw error;
    }
  }

  // Parse the ASCII grid from question text
  parseGrid(questionText) {
    console.log('Parsing grid from text:', questionText.substring(0, 200) + '...');
    
    // Split by actual newlines, not escaped newlines
    const lines = questionText.split('\n');
    const gridLines = [];
    let robotPos = null;
    let goalPos = null;
    let direction = 0;

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i].trim();
      
      // Skip coordinate lines and empty lines
      if (line.match(/^\s*[0-9\s]+$/) || line === '') {
        continue;
      }

      // Skip lines that don't look like grid rows (contain letters but not in grid format)
      if (line.includes('robot') || line.includes('goal') || line.includes('position') || line.includes('Legend') || line.includes('Where')) {
        continue;
      }

      // Check for robot position - look for direction symbols OR 'R'
      let robotMatch = line.match(/([><v^])/);
      if (robotMatch) {
        const symbol = robotMatch[1];
        direction = DIRECTIONS[symbol];
        // Calculate position more accurately - split by spaces and find the symbol
        const parts = line.split(/\s+/);
        const x = parts.findIndex(part => part.includes(symbol));
        if (x !== -1) {
          robotPos = { x: x, y: gridLines.length };
          console.log(`Found robot at (${x}, ${gridLines.length}) facing ${symbol}`);
        }
      } else if (line.includes('R')) {
        // Handle 'R' format for robot
        const parts = line.split(/\s+/);
        const x = parts.findIndex(part => part.includes('R'));
        if (x !== -1) {
          direction = 0; // Default to facing right
          robotPos = { x: x, y: gridLines.length };
          console.log(`Found robot (R) at (${x}, ${gridLines.length})`);
        }
      }

      // Check for goal position - look for ✔ OR 'G'
      let goalMatch = line.match(/✔/);
      if (goalMatch) {
        const parts = line.split(/\s+/);
        const x = parts.findIndex(part => part.includes('✔'));
        if (x !== -1) {
          goalPos = { x: x, y: gridLines.length };
          console.log(`Found goal (✔) at (${x}, ${gridLines.length})`);
        }
      } else if (line.includes('G')) {
        const parts = line.split(/\s+/);
        const x = parts.findIndex(part => part.includes('G'));
        if (x !== -1) {
          goalPos = { x: x, y: gridLines.length };
          console.log(`Found goal (G) at (${x}, ${gridLines.length})`);
        }
      }

      gridLines.push(line);
    }

    console.log('Parse result:', { robotPos, goalPos, direction, gridLines });

    if (!robotPos || !goalPos) {
      throw new Error(`Could not parse robot or goal position. Robot: ${robotPos}, Goal: ${goalPos}`);
    }

    return {
      grid: gridLines,
      robotPosition: robotPos,
      robotDirection: direction,
      goalPosition: goalPos
    };
  }

  // Simulate robot movement for a given pseudocode
  simulateRobotMovement(pseudocode, startPos, startDir, goalPos, gridSize = { width: 4, height: 4 }) {
    let position = { ...startPos };
    let direction = startDir;

    console.log(`Starting simulation: pos(${position.x}, ${position.y}) dir(${direction}) goal(${goalPos.x}, ${goalPos.y})`);

    // Parse pseudocode commands
    const commands = this.parsePseudocode(pseudocode);
    console.log('Parsed commands:', commands);

    for (const command of commands) {
      switch (command.type) {
        case 'ROTATE_LEFT':
          direction = (direction + 3) % 4; // Rotate left (counter-clockwise)
          console.log(`Rotate left -> direction: ${direction}`);
          break;
        case 'ROTATE_RIGHT':
          direction = (direction + 1) % 4; // Rotate right (clockwise)
          console.log(`Rotate right -> direction: ${direction}`);
          break;
        case 'MOVE_FORWARD':
          const newPos = this.moveForward(position, direction, gridSize);
          if (newPos) {
            position = newPos;
            console.log(`Move forward -> pos(${position.x}, ${position.y})`);
          } else {
            console.log('Move forward -> out of bounds');
            return false; // Out of bounds
          }
          break;
        case 'REPEAT':
          for (let i = 0; i < command.times; i++) {
            for (const subCommand of command.commands) {
              switch (subCommand.type) {
                case 'ROTATE_LEFT':
                  direction = (direction + 3) % 4;
                  break;
                case 'ROTATE_RIGHT':
                  direction = (direction + 1) % 4;
                  break;
                case 'MOVE_FORWARD':
                  const newPos = this.moveForward(position, direction, gridSize);
                  if (newPos) {
                    position = newPos;
                  } else {
                    return false; // Out of bounds
                  }
                  break;
              }
            }
          }
          break;
      }

      // Check if we reached the goal
      if (position.x === goalPos.x && position.y === goalPos.y) {
        console.log('Reached goal!');
        return true;
      }
    }

    console.log(`Final position: (${position.x}, ${position.y}) - Goal: (${goalPos.x}, ${goalPos.y})`);
    return false;
  }

  // Parse pseudocode into command objects
  parsePseudocode(code) {
    console.log('Parsing pseudocode:', code);
    const commands = [];
    
    // Split by semicolons and newlines, then clean up
    const parts = code.split(/[;\n]/).map(part => part.trim()).filter(part => part.length > 0);
    
    console.log('Pseudocode parts:', parts);

    for (const part of parts) {
      const trimmed = part.trim();
      
      if (trimmed.includes('REPEAT')) {
        // Handle REPEAT blocks
        const match = trimmed.match(/REPEAT\s+(\d+)\s+TIMES\s*\{([^}]+)\}/);
        if (match) {
          const times = parseInt(match[1]);
          const innerCode = match[2];
          const subCommands = this.parsePseudocode(innerCode);
          commands.push({ type: 'REPEAT', times, commands: subCommands });
        }
      } else {
        // Single commands - handle various formats
        if (trimmed.includes('MOVE_FORWARD') || trimmed.includes('Move Forward') || trimmed.includes('move forward')) {
          // Handle "Move Forward X times" format
          const moveMatch = trimmed.match(/Move Forward (\d+) time/i);
          if (moveMatch) {
            const count = parseInt(moveMatch[1]);
            for (let i = 0; i < count; i++) {
              commands.push({ type: 'MOVE_FORWARD' });
            }
          } else {
            commands.push({ type: 'MOVE_FORWARD' });
          }
        }
        // Handle "MOVE FORWARD X TIMES" format
        if (trimmed.includes('MOVE FORWARD') && trimmed.includes('TIMES')) {
          const moveMatch = trimmed.match(/MOVE FORWARD (\d+) TIMES/i);
          if (moveMatch) {
            const count = parseInt(moveMatch[1]);
            for (let i = 0; i < count; i++) {
              commands.push({ type: 'MOVE_FORWARD' });
            }
          }
        }
        if (trimmed.includes('ROTATE_LEFT') || trimmed.includes('Turn Left') || trimmed.includes('turn left') || trimmed.includes('TURN_LEFT') || trimmed.includes('TURN LEFT')) {
          commands.push({ type: 'ROTATE_LEFT' });
        }
        if (trimmed.includes('ROTATE_RIGHT') || trimmed.includes('Turn Right') || trimmed.includes('turn right') || trimmed.includes('TURN_RIGHT') || trimmed.includes('TURN RIGHT')) {
          commands.push({ type: 'ROTATE_RIGHT' });
        }
        if (trimmed.includes('Move Right') || trimmed.includes('move right')) {
          commands.push({ type: 'MOVE_FORWARD' });
        }
        if (trimmed.includes('Move Up') || trimmed.includes('move up')) {
          commands.push({ type: 'ROTATE_LEFT' });
          commands.push({ type: 'MOVE_FORWARD' });
        }
        if (trimmed.includes('Move Down') || trimmed.includes('move down')) {
          commands.push({ type: 'ROTATE_RIGHT' });
          commands.push({ type: 'MOVE_FORWARD' });
        }
        if (trimmed.includes('Move Left') || trimmed.includes('move left')) {
          commands.push({ type: 'ROTATE_LEFT' });
          commands.push({ type: 'ROTATE_LEFT' });
          commands.push({ type: 'MOVE_FORWARD' });
        }
        // Handle cardinal directions
        if (trimmed.includes('MOVE NORTH') || trimmed.includes('move north')) {
          commands.push({ type: 'ROTATE_LEFT' });
          commands.push({ type: 'ROTATE_LEFT' });
          commands.push({ type: 'ROTATE_LEFT' });
          commands.push({ type: 'MOVE_FORWARD' });
        }
        if (trimmed.includes('MOVE SOUTH') || trimmed.includes('move south')) {
          commands.push({ type: 'ROTATE_RIGHT' });
          commands.push({ type: 'MOVE_FORWARD' });
        }
        if (trimmed.includes('MOVE EAST') || trimmed.includes('move east')) {
          commands.push({ type: 'MOVE_FORWARD' });
        }
        if (trimmed.includes('MOVE WEST') || trimmed.includes('move west')) {
          commands.push({ type: 'ROTATE_LEFT' });
          commands.push({ type: 'MOVE_FORWARD' });
        }
      }
    }

    console.log('Parsed commands:', commands);
    return commands;
  }

  // Move robot forward based on current direction
  moveForward(position, direction, gridSize = { width: 4, height: 4 }) {
    const newPos = { ...position };
    
    switch (direction) {
      case 0: // Right
        newPos.x += 1;
        break;
      case 1: // Down
        newPos.y += 1;
        break;
      case 2: // Left
        newPos.x -= 1;
        break;
      case 3: // Up
        newPos.y -= 1;
        break;
    }

    // Check boundaries
    if (newPos.x < 0 || newPos.x >= gridSize.width || newPos.y < 0 || newPos.y >= gridSize.height) {
      return null; // Out of bounds
    }

    return newPos;
  }

  // Validate a generated question
  async validateQuestion(question) {
    try {
      // Parse the grid
      const gridData = this.parseGrid(question.questionsText);
      
      if (!gridData.robotPosition || !gridData.goalPosition) {
        console.log('Could not parse robot or goal position');
        return false;
      }

      // Test each answer option
      const results = [];
      for (let i = 0; i < question.options.length; i++) {
        const reachesGoal = this.simulateRobotMovement(
          question.options[i],
          gridData.robotPosition,
          gridData.robotDirection,
          gridData.goalPosition
        );
        results.push(reachesGoal);
      }

      // Check if exactly one option reaches the goal
      const correctCount = results.filter(r => r).length;
      const isValid = correctCount === 1;

      console.log('Validation results:', results);
      console.log('Correct count:', correctCount);
      console.log('Is valid:', isValid);

      return isValid;
    } catch (error) {
      console.error('Error validating question:', error);
      return false;
    }
  }

  // Generate and validate a question with retry logic
  async generateValidQuestion(topic = 'algorithms', difficulty = 'medium', maxRetries = 3) {
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      console.log(`Attempt ${attempt} to generate valid question...`);
      
      try {
        // Generate question
        const question = await this.generateRobotQuestion(topic, difficulty);
        
        // Validate question
        const isValid = await this.validateQuestion(question);
        
        if (isValid) {
          console.log('Valid question generated successfully!');
          return question;
        } else {
          console.log(`Attempt ${attempt} failed validation, retrying...`);
        }
      } catch (error) {
        console.error(`Attempt ${attempt} failed with error:`, error);
      }
    }

    throw new Error(`Failed to generate valid question after ${maxRetries} attempts`);
  }

  // Save validated question to database
  async saveQuestionToDatabase(question, additionalTags = []) {
    try {
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
        tags: [...question.tags, ...additionalTags],
        metadata: {
          generatedBy: 'AI',
          validationScore: 1.0,
          usageCount: 0,
          averageScore: 0,
          isActive: true
        }
      });

      const savedQuestion = await newQuestion.save();
      console.log('Question saved to database:', savedQuestion._id);
      return savedQuestion;
    } catch (error) {
      console.error('Error saving question to database:', error);
      throw error;
    }
  }

  // Main method to generate, validate, and save a question
  async generateAndSaveQuestion(topic = 'algorithms', difficulty = 'medium', additionalTags = []) {
    try {
      console.log('Starting question generation process...');
      
      // Generate and validate question
      const validQuestion = await this.generateValidQuestion(topic, difficulty);
      
      // Save to database
      const savedQuestion = await this.saveQuestionToDatabase(validQuestion, additionalTags);
      
      console.log('Question generation and validation complete!');
      return savedQuestion;
    } catch (error) {
      console.error('Failed to generate and save question:', error);
      throw error;
    }
  }
}

export default RobotQuestionValidator;
