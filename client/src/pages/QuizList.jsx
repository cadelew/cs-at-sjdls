import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function QuizList() {
  const location = useLocation();
  const [quizzes, setQuizzes] = useState([]);
  const [questionCounts, setQuestionCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortBy, setSortBy] = useState('title');
  const [order, setOrder] = useState('asc');
  const [showSaveNotification, setShowSaveNotification] = useState(false);

  useEffect(() => {
    fetchQuizzes();
  }, [sortBy, order]);

  useEffect(() => {
    // Check if we came from a quiz save action
    if (location.state?.saveSuccess) {
      setShowSaveNotification(true);
      setTimeout(() => setShowSaveNotification(false), 3000);
      // Clear the state to prevent showing again on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.state]);

  const fetchQuizzes = async () => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/quiz?sortBy=${sortBy}&order=${order}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch quizzes');
      }
      
      const data = await response.json();
      setQuizzes(data);
      
      // Fetch question counts for each quiz
      const counts = {};
      for (const quiz of data) {
        try {
          const questionsResponse = await fetch(`http://localhost:3000/api/question/${quiz._id}/questions`);
          if (questionsResponse.ok) {
            const questions = await questionsResponse.json();
            counts[quiz._id] = questions.length;
          } else {
            counts[quiz._id] = quiz.totalQuestions || 0;
          }
        } catch (err) {
          counts[quiz._id] = quiz.totalQuestions || 0;
        }
      }
      setQuestionCounts(counts);
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty?.toLowerCase()) {
      case 'easy':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200';
      case 'hard':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200';
    }
  };

  const getTopicColor = (topic) => {
    const colors = {
      'programming': 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200',
      'algorithms': 'bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-200',
      'data-structures': 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-200',
      'networking': 'bg-cyan-100 text-cyan-800 dark:bg-cyan-900 dark:text-cyan-200',
      'security': 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200',
      'default': 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-200'
    };
    return colors[topic?.toLowerCase()] || colors.default;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quizzes...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
              <p className="font-semibold">Error loading quizzes</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      {/* Save Notification Popup */}
      {showSaveNotification && (
        <div className="fixed top-20 right-6 z-50 transform transition-all duration-300 ease-in-out animate-pulse">
          <div className="bg-green-50 dark:bg-green-900 border border-green-400 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <span className="font-medium">Progress saved successfully!</span>
          </div>
        </div>
      )}
      
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-4xl font-extrabold dark:text-transparent text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-4xl box-content font-extrabold text-transparent select-none">
              AP CSP Quiz Center
            </span>
            AP CSP Quiz Center
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            Test your knowledge with interactive quizzes covering all AP CSP topics
          </p>
        </div>

        {/* Sort Controls */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-4 mb-6">
          <div className="flex flex-wrap gap-4 items-center justify-center">
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-black dark:text-white">Sort by:</label>
              <select 
                value={sortBy} 
                onChange={(e) => setSortBy(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-purple-500 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="title">Title</option>
                <option value="topic">Topic</option>
                <option value="difficulty">Difficulty</option>
                <option value="timeLimit">Time Limit</option>
                <option value="totalQuestions">Questions</option>
              </select>
            </div>
            
            <div className="flex items-center space-x-2">
              <label className="text-sm font-medium text-black dark:text-white">Order:</label>
              <select 
                value={order} 
                onChange={(e) => setOrder(e.target.value)}
                className="px-3 py-1 border border-gray-300 dark:border-purple-500 rounded bg-white dark:bg-gray-800 text-black dark:text-white"
              >
                <option value="asc">Ascending</option>
                <option value="desc">Descending</option>
              </select>
            </div>
            
            <button 
              onClick={fetchQuizzes}
              className="px-4 py-1 bg-purple-600 hover:bg-purple-700 text-white rounded transition-colors"
            >
              Refresh
            </button>
          </div>
        </div>

        {/* Quiz Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {quizzes.map((quiz) => (
            <div key={quiz._id} className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 hover:shadow-lg transition-shadow">
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-black dark:text-white flex-1">
                  {quiz.title}
                </h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                  {quiz.difficulty || 'Unknown'}
                </span>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {quiz.description || 'No description available'}
              </p>
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTopicColor(quiz.topic)}`}>
                  {quiz.topic || 'General'}
                </span>
              </div>
              
              <div className="grid grid-cols-2 gap-4 mb-4 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {questionCounts[quiz._id] || quiz.totalQuestions || '?'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Questions</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                    {quiz.timeLimit ? `${quiz.timeLimit}m` : '∞'}
                  </div>
                  <div className="text-gray-600 dark:text-gray-400">Time Limit</div>
                </div>
              </div>
              
              <div className="text-center">
                <Link
                  to={`/quiz/${quiz._id}`}
                  className="inline-block w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors text-center"
                >
                  Start Quiz
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State */}
        {quizzes.length === 0 && (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">📝</div>
            <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
              No quizzes available
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              Check back later for new quizzes or contact your instructor.
            </p>
          </div>
        )}

        {/* Navigation */}
        <div className="mt-8 text-center">
          <Link
            to="/ap-csp-review"
            className="inline-flex items-center px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
          >
            ← Back to AP CSP Review
          </Link>
        </div>
      </div>
    </div>
  );
}
