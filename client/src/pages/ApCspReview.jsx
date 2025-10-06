import React from 'react';
import { Link } from 'react-router-dom';

export default function ApCspReview() {
  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-4xl font-extrabold dark:text-transparent text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-4xl box-content font-extrabold text-transparent select-none">
              AP CSP Review & Study Guide
            </span>
            AP CSP Review & Study Guide
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Comprehensive review materials and resources for AP Computer Science Principles
          </p>
        </div>

        {/* Action Buttons */}
        <div className="text-center space-x-4 mb-8">
          <Link
            to="/quiz-list"
            className="inline-flex items-center px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            🎯 Take Practice Quizzes
          </Link>
          <Link
            to="/user-dashboard"
            className="inline-flex items-center px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            📊 View Analytics
          </Link>
          <Link
            to="/checklist"
            className="inline-flex items-center px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
          >
            📋 AP CSP Checklist
          </Link>
        </div>

        {/* Exam Overview */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
            🎯 Exam Overview
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Create Performance Task (30%)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                Students develop a program of their choice and submit comprehensive documentation.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-black dark:text-white">Required Components:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Program Code (200+ lines)</li>
                  <li>• Video Demonstration (1 minute)</li>
                  <li>• Written Responses (3 prompts)</li>
                  <li>• Program Documentation</li>
                </ul>
              </div>
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-black dark:text-white">Key Requirements:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Input, processing, and output</li>
                  <li>• List for data abstraction</li>
                  <li>• Function with parameters</li>
                  <li>• Selection and iteration</li>
                </ul>
              </div>
            </div>
            
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-6">
              <h3 className="text-xl font-semibold text-black dark:text-white mb-3">
                Multiple Choice Exam (70%)
              </h3>
              <p className="text-gray-700 dark:text-gray-300 mb-4">
                70 questions covering all Big Ideas in 2 hours.
              </p>
              <div className="space-y-2">
                <h4 className="font-semibold text-black dark:text-white">Big Ideas Covered:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• Big Idea 1: Creative Development</li>
                  <li>• Big Idea 2: Data</li>
                  <li>• Big Idea 3: Algorithms & Programming</li>
                  <li>• Big Idea 4: Computer Systems & Networks</li>
                  <li>• Big Idea 5: Impact of Computing</li>
                </ul>
              </div>
              <div className="mt-4 space-y-2">
                <h4 className="font-semibold text-black dark:text-white">Exam Tips:</h4>
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>• ~1.7 minutes per question</li>
                  <li>• No penalty for wrong answers</li>
                  <li>• Read questions carefully</li>
                  <li>• Eliminate obviously wrong answers</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Big Ideas Breakdown */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
            📚 Big Ideas Breakdown
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Big Idea 1: Creative Development
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How computing innovations are created and how they can help solve problems.
              </p>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Big Idea 2: Data
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How data is collected, stored, processed, and analyzed to create information.
              </p>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Big Idea 3: Algorithms & Programming
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How algorithms are designed and implemented to solve computational problems.
              </p>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Big Idea 4: Computer Systems & Networks
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How computer systems and networks work and how they enable innovation.
              </p>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Big Idea 5: Impact of Computing
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                How computing affects society, economy, and culture.
              </p>
            </div>
          </div>
        </div>

        {/* Study Resources */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
            📖 Study Resources
          </h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                🔗 Essential Links
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-principles" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline block">
                    📋 AP CSP Course Description
                  </a>
                </li>
                <li>
                  <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-principles/exam" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline block">
                    📝 Official Exam Information
                  </a>
                </li>
                <li>
                  <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-principles/assessment" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline block">
                    🎯 Create Task Guidelines
                  </a>
                </li>
                <li>
                  <a href="https://apcentral.collegeboard.org/courses/ap-computer-science-principles/assessment/create-performance-task" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="text-purple-600 dark:text-purple-400 hover:underline block">
                    📹 Performance Task Examples
                  </a>
                </li>
              </ul>
            </div>
            
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-3">
                💡 Study Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700 dark:text-gray-300">
                <li>• <strong>Practice coding daily</strong> - even 15-30 minutes helps</li>
                <li>• <strong>Review Big Ideas regularly</strong> - understand concepts, not just memorize</li>
                <li>• <strong>Take practice exams</strong> under timed conditions</li>
                <li>• <strong>Document your Create Task</strong> process thoroughly</li>
                <li>• <strong>Join study groups</strong> or find a study partner</li>
                <li>• <strong>Use multiple resources</strong> - textbooks, online tutorials, practice problems</li>
              </ul>
            </div>
          </div>
        </div>

        {/* Programming Concepts */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold text-black dark:text-white mb-6">
            💻 Key Programming Concepts
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Variables & Data Types
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Strings, integers, floats</li>
                <li>• Boolean values</li>
                <li>• Variable naming</li>
                <li>• Type conversion</li>
              </ul>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Control Structures
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• If/else statements</li>
                <li>• For and while loops</li>
                <li>• Nested structures</li>
                <li>• Logical operators</li>
              </ul>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Functions & Procedures
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Function definition</li>
                <li>• Parameters and arguments</li>
                <li>• Return values</li>
                <li>• Function calls</li>
              </ul>
            </div>
            <div className="bg-amber-100 dark:bg-gray-800 border border-black dark:border-purple-500 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-black dark:text-white mb-2">
                Data Structures
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• Lists and arrays</li>
                <li>• Dictionaries/maps</li>
                <li>• String manipulation</li>
                <li>• Data abstraction</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}