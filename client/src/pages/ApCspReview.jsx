import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ApCspReview() {
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [currentProblem, setCurrentProblem] = useState(0);
  const [userAnswers, setUserAnswers] = useState({});
  const [showResults, setShowResults] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isTimedMode, setIsTimedMode] = useState(false);

  // Practice Problems by Topic
  const practiceProblems = {
    'program-purpose': {
      title: 'Program Purpose & Function',
      description: 'Understanding how programs take input, process data, and produce output.',
      problems: [
        {
          id: 1,
          question: 'A student is creating a program to calculate the area of a rectangle. Which of the following best describes the program\'s purpose?',
          options: [
            'A) To display the length and width of rectangles',
            'B) To calculate and output the area of a rectangle given its dimensions',
            'C) To store rectangle dimensions in a database',
            'D) To compare different rectangle shapes'
          ],
          correct: 1,
          explanation: 'The program\'s purpose is to calculate and output the area of a rectangle given its dimensions. This involves taking input (length and width), processing (multiplying them), and producing output (the area).'
        },
        {
          id: 2,
          question: 'Which of the following is an example of program input?',
          options: [
            'A) print("Hello World")',
            'B) user_name = input("Enter your name: ")',
            'C) total = 5 + 3',
            'D) if score > 100: print("Excellent")'
          ],
          correct: 1,
          explanation: 'user_name = input("Enter your name: ") is an example of program input because it takes data from the user.'
        }
      ]
    },
    'data-abstraction': {
      title: 'Data Abstraction',
      description: 'Using lists and other data structures to manage complexity.',
      problems: [
        {
          id: 3,
          question: 'A student wants to store the names of 50 students. Which data structure would be most appropriate?',
          options: [
            'A) 50 separate variables (student1, student2, etc.)',
            'B) A list containing all student names',
            'C) A single string with all names concatenated',
            'D) A dictionary with 50 separate keys'
          ],
          correct: 1,
          explanation: 'A list is the most appropriate data structure because it allows for efficient storage and manipulation of multiple related items.'
        },
        {
          id: 4,
          question: 'What is the primary benefit of using a list instead of individual variables?',
          options: [
            'A) Lists use less memory',
            'B) Lists make code easier to modify and scale',
            'C) Lists are faster to access',
            'D) Lists prevent errors'
          ],
          correct: 1,
          explanation: 'Lists make code easier to modify and scale because you can iterate through them and perform operations on all elements efficiently.'
        }
      ]
    },
    'procedural-abstraction': {
      title: 'Procedural Abstraction',
      description: 'Creating and using functions to organize code.',
      problems: [
        {
          id: 5,
          question: 'Which of the following is a valid function definition with a parameter?',
          options: [
            'A) def main():',
            'B) def calculate_area(length, width):',
            'C) def print_hello():',
            'D) def get_data():'
          ],
          correct: 1,
          explanation: 'def calculate_area(length, width): is a valid function definition with parameters (length and width).'
        },
        {
          id: 6,
          question: 'A student writes a function to calculate the average of three numbers. What should the function return?',
          options: [
            'A) The sum of the three numbers',
            'B) The average of the three numbers',
            'C) The largest of the three numbers',
            'D) Nothing (void function)'
          ],
          correct: 1,
          explanation: 'The function should return the average of the three numbers, which is the calculated result.'
        }
      ]
    },
    'algorithm': {
      title: 'Algorithm Implementation',
      description: 'Sequencing, selection, and iteration in algorithms.',
      problems: [
        {
          id: 7,
          question: 'Which of the following represents iteration in an algorithm?',
          options: [
            'A) if score > 90: grade = "A"',
            'B) for i in range(10): print(i)',
            'C) total = num1 + num2',
            'D) def calculate():'
          ],
          correct: 1,
          explanation: 'for i in range(10): print(i) represents iteration because it repeats the print statement multiple times.'
        },
        {
          id: 8,
          question: 'What type of control structure is used in the following code?\nif temperature > 80:\n    print("Hot day")\nelse:\n    print("Cool day")',
          options: [
            'A) Sequencing',
            'B) Selection',
            'C) Iteration',
            'D) Recursion'
          ],
          correct: 1,
          explanation: 'This code uses selection (if-else) to choose between different actions based on a condition.'
        }
      ]
    }
  };

  // Exam Format Information
  const examInfo = {
    'create-task': {
      title: 'Create Performance Task',
      description: 'Students develop a program of their choice and submit documentation.',
      components: [
        'Program Code (200+ lines)',
        'Video (1 minute)',
        'Written Responses (3 prompts)',
        'Program Documentation'
      ],
      tips: [
        'Choose a meaningful problem to solve',
        'Include all required elements: input, processing, output',
        'Use lists for data abstraction',
        'Create at least one function with parameters',
        'Document your code clearly'
      ]
    },
    'multiple-choice': {
      title: 'Multiple Choice Exam',
      description: '70 questions covering all Big Ideas in 2 hours.',
      bigIdeas: [
        'Big Idea 1: Creative Development',
        'Big Idea 2: Data',
        'Big Idea 3: Algorithms & Programming',
        'Big Idea 4: Computer Systems & Networks',
        'Big Idea 5: Impact of Computing'
      ],
      tips: [
        'Read questions carefully',
        'Eliminate obviously wrong answers',
        'Look for keywords in the question',
        'Manage your time (about 1.7 minutes per question)',
        'Answer every question (no penalty for wrong answers)'
      ]
    }
  };

  const handleAnswerSelect = (problemId, answerIndex) => {
    setUserAnswers(prev => ({
      ...prev,
      [problemId]: answerIndex
    }));
  };

  const calculateScore = () => {
    const totalProblems = Object.values(practiceProblems).reduce((sum, topic) => sum + topic.problems.length, 0);
    const correctAnswers = Object.values(practiceProblems).flat().filter(problem => 
      userAnswers[problem.id] === problem.correct
    ).length;
    return Math.round((correctAnswers / totalProblems) * 100);
  };

  const startTimedPractice = () => {
    setIsTimedMode(true);
    setTimeRemaining(120); // 2 minutes for practice
    setCurrentProblem(0);
    setUserAnswers({});
    setShowResults(false);
  };

  const resetPractice = () => {
    setUserAnswers({});
    setShowResults(false);
    setCurrentProblem(0);
    setIsTimedMode(false);
    setTimeRemaining(0);
  };

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-4xl font-extrabold dark:text-transparent text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-4xl box-content font-extrabold text-transparent select-none">
              AP CSP Review & Practice
            </span>
            AP CSP Review & Practice
          </h1>
          
          <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 mb-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              🎯 Exam Overview
            </h2>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Create Performance Task (30%)
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  Develop a program and submit documentation
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Program Code (200+ lines)</li>
                  <li>• Video Demonstration (1 min)</li>
                  <li>• Written Responses (3 prompts)</li>
                </ul>
              </div>
              <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                  Multiple Choice Exam (70%)
                </h3>
                <p className="text-sm text-gray-700 dark:text-gray-300 mb-3">
                  70 questions in 2 hours
                </p>
                <ul className="text-xs text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• 5 Big Ideas covered</li>
                  <li>• No penalty for wrong answers</li>
                  <li>• ~1.7 minutes per question</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Practice Section */}
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Topic Selection */}
          <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              📚 Practice by Topic
            </h2>
            <div className="space-y-3">
              {Object.entries(practiceProblems).map(([key, topic]) => (
                <button
                  key={key}
                  onClick={() => setSelectedTopic(key)}
                  className={`w-full text-left p-4 rounded-lg border transition-colors ${
                    selectedTopic === key
                      ? 'bg-purple-100 dark:bg-purple-900 border-purple-500 text-purple-800 dark:text-purple-200'
                      : 'bg-amber-100 dark:bg-gray-800 border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-200 dark:hover:bg-gray-700'
                  }`}
                >
                  <h3 className="font-semibold">{topic.title}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                    {topic.description}
                  </p>
                  <span className="text-xs text-gray-500 dark:text-gray-500">
                    {topic.problems.length} practice problems
                  </span>
                </button>
              ))}
            </div>
            
            <div className="mt-6 space-y-3">
              <button
                onClick={startTimedPractice}
                className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                ⏱️ Start Timed Practice (2 min)
              </button>
              <button
                onClick={resetPractice}
                className="w-full bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                🔄 Reset Practice
              </button>
            </div>
          </div>

          {/* Practice Problems */}
          <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
              {isTimedMode ? '⏱️ Timed Practice' : '📝 Practice Problems'}
            </h2>
            
            {isTimedMode && timeRemaining > 0 && (
              <div className="mb-4 p-3 bg-red-100 dark:bg-red-900 border border-red-400 rounded-lg">
                <p className="text-red-800 dark:text-red-200 font-semibold">
                  Time Remaining: {Math.floor(timeRemaining / 60)}:{(timeRemaining % 60).toString().padStart(2, '0')}
                </p>
              </div>
            )}

            {selectedTopic && !isTimedMode ? (
              <div>
                <h3 className="text-lg font-semibold text-black dark:text-white mb-4">
                  {practiceProblems[selectedTopic].title}
                </h3>
                <div className="space-y-6">
                  {practiceProblems[selectedTopic].problems.map((problem, index) => (
                    <div key={problem.id} className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
                      <h4 className="font-semibold text-black dark:text-white mb-3">
                        Problem {index + 1}
                      </h4>
                      <p className="text-black dark:text-white mb-4">
                        {problem.question}
                      </p>
                      <div className="space-y-2">
                        {problem.options.map((option, optionIndex) => (
                          <label key={optionIndex} className="flex items-center space-x-2 cursor-pointer">
                            <input
                              type="radio"
                              name={`problem-${problem.id}`}
                              value={optionIndex}
                              checked={userAnswers[problem.id] === optionIndex}
                              onChange={() => handleAnswerSelect(problem.id, optionIndex)}
                              className="text-purple-600"
                            />
                            <span className="text-black dark:text-white">{option}</span>
                          </label>
                        ))}
                      </div>
                      {userAnswers[problem.id] !== undefined && (
                        <div className={`mt-3 p-3 rounded-lg ${
                          userAnswers[problem.id] === problem.correct
                            ? 'bg-green-100 dark:bg-green-900 border border-green-400'
                            : 'bg-red-100 dark:bg-red-900 border border-red-400'
                        }`}>
                          <p className={`font-semibold ${
                            userAnswers[problem.id] === problem.correct
                              ? 'text-green-800 dark:text-green-200'
                              : 'text-red-800 dark:text-red-200'
                          }`}>
                            {userAnswers[problem.id] === problem.correct ? '✅ Correct!' : '❌ Incorrect'}
                          </p>
                          <p className={`text-sm mt-1 ${
                            userAnswers[problem.id] === problem.correct
                              ? 'text-green-700 dark:text-green-300'
                              : 'text-red-700 dark:text-red-300'
                          }`}>
                            {problem.explanation}
                          </p>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            ) : !selectedTopic && !isTimedMode ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  Select a topic to start practicing!
                </p>
              </div>
            ) : isTimedMode ? (
              <div className="text-center py-8">
                <p className="text-gray-600 dark:text-gray-400">
                  Timed practice mode - answer as many questions as possible!
                </p>
                <div className="mt-4">
                  <button
                    onClick={() => setShowResults(true)}
                    className="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    End Practice & View Results
                  </button>
                </div>
              </div>
            ) : null}

            {/* Results */}
            {showResults && (
              <div className="mt-6 p-4 bg-purple-100 dark:bg-purple-900 border border-purple-500 rounded-lg">
                <h3 className="text-lg font-semibold text-purple-800 dark:text-purple-200 mb-2">
                  🎉 Practice Complete!
                </h3>
                <p className="text-purple-700 dark:text-purple-300">
                  Score: {calculateScore()}%
                </p>
                <p className="text-sm text-purple-600 dark:text-purple-400 mt-2">
                  Keep practicing to improve your score!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Study Resources */}
        <div className="mt-8 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-4">
            📖 Study Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                🔗 Essential Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-principles" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline">
                    AP CSP Course Description
                  </a>
                </li>
                <li>
                  <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-principles/exam" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline">
                    Official Exam Information
                  </a>
                </li>
                <li>
                  <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-principles/assessment" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline">
                    Create Task Guidelines
                  </a>
                </li>
              </ul>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                💡 Study Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• Practice coding daily, even for 15-30 minutes</li>
                <li>• Review the Big Ideas regularly</li>
                <li>• Take practice exams under timed conditions</li>
                <li>• Document your Create Task process thoroughly</li>
                <li>• Join study groups or find a study partner</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <div className="mt-8 text-center space-x-4">
          <Link
            to="/quiz-list"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            🎯 Take Quizzes
          </Link>
          <Link
            to="/checklist"
            className="inline-flex items-center px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
          >
            📋 Go to AP CSP Checklist
          </Link>
        </div>
      </div>
    </div>
  );
}
