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
      
      // Fetch active quizzes from different categories
      const categories = ['practice', 'exam', 'topic-specific', 'mixed'];
      const allQuizzes = [];
      
      for (const category of categories) {
        try {
          const response = await fetch(`/api/quiz/active/${category}/general`, {
            credentials: 'include'
          });
          if (response.ok) {
            const data = await response.json();
            if (data.quizzes) {
              allQuizzes.push(...data.quizzes);
            }
          }
        } catch (err) {
          console.warn(`Failed to fetch ${category} quizzes:`, err);
        }
      }
      
      // Sort quizzes based on user preference
      const sortedQuizzes = allQuizzes.sort((a, b) => {
        let aValue = a[sortBy];
        let bValue = b[sortBy];
        
        // Handle special cases
        if (sortBy === 'title') {
          aValue = a.title?.toLowerCase() || '';
          bValue = b.title?.toLowerCase() || '';
        }
        
        if (order === 'asc') {
          return aValue > bValue ? 1 : -1;
        } else {
          return aValue < bValue ? 1 : -1;
        }
      });
      
      setQuizzes(sortedQuizzes);
      
      // Set question counts (already available in quiz data)
      const counts = {};
      sortedQuizzes.forEach(quiz => {
        counts[quiz._id] = quiz.totalQuestions || 0;
      });
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
          
          <div className="flex justify-center gap-4">
            <Link
              to="/user-dashboard"
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors text-sm"
            >
              📊 View Analytics
            </Link>
          </div>
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
            <div key={quiz._id} className={`bg-amber-50 dark:bg-black border rounded-lg p-6 hover:shadow-lg transition-shadow ${
              quiz.isInProgress 
                ? 'border-orange-500 dark:border-orange-400 bg-orange-50 dark:bg-orange-900' 
                : 'border-black dark:border-purple-500'
            }`}>
              <div className="flex items-start justify-between mb-4">
                <h3 className="text-xl font-semibold text-black dark:text-white flex-1">
                  {quiz.title}
                </h3>
                <div className="flex flex-col items-end space-y-1">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${getDifficultyColor(quiz.difficulty)}`}>
                    {quiz.difficulty || 'Unknown'}
                  </span>
                  {quiz.isInProgress && (
                    <span className="px-2 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-200">
                      In Progress
                    </span>
                  )}
                </div>
              </div>
              
              <p className="text-gray-600 dark:text-gray-400 mb-4 text-sm">
                {quiz.description || 'No description available'}
              </p>
              
              {/* Progress Information for In-Progress Quizzes */}
              {quiz.isInProgress && quiz.progressInfo && (
                <div className="mb-4 p-3 bg-orange-100 dark:bg-orange-800 rounded-lg">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                      Progress: {quiz.progressInfo.progressPercentage}%
                    </span>
                    <span className="text-sm text-orange-700 dark:text-orange-300">
                      {quiz.progressInfo.currentQuestion}/{quiz.progressInfo.totalQuestions} questions
                    </span>
                  </div>
                  <div className="w-full bg-orange-200 dark:bg-orange-700 rounded-full h-2">
                    <div 
                      className="bg-orange-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${quiz.progressInfo.progressPercentage}%` }}
                    ></div>
                  </div>
                  {quiz.progressInfo.timeRemaining && (
                    <div className="mt-2 text-xs text-orange-700 dark:text-orange-300">
                      Time remaining: {quiz.progressInfo.timeRemaining} minutes
                    </div>
                  )}
                </div>
              )}
              
              <div className="flex flex-wrap gap-2 mb-4">
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getTopicColor(quiz.topic)}`}>
                  {quiz.topic || 'General'}
                </span>
                <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200">
                  {quiz.category || 'practice'}
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
                  className={`inline-block w-full font-semibold py-3 px-4 rounded-lg transition-colors text-center ${
                    quiz.isInProgress
                      ? 'bg-orange-600 hover:bg-orange-700 text-white'
                      : 'bg-purple-600 hover:bg-purple-700 text-white'
                  }`}
                >
                  {quiz.actionText || (quiz.isInProgress ? 'Resume Quiz' : 'Start Quiz')}
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
