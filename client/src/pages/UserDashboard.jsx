import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { PerformanceTrendsChart, TopicPerformanceChart, ScoreDistributionChart } from '../components/charts';

export default function UserDashboard() {
  const { currentUser } = useSelector((state) => state.user);
  const [analytics, setAnalytics] = useState(null);
  const [quizHistory, setQuizHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      setLoading(true);
      
      // Fetch analytics and history in parallel
      const [analyticsResponse, historyResponse] = await Promise.all([
        fetch(`http://localhost:3000/api/analytics/user/${currentUser._id}`),
        fetch(`http://localhost:3000/api/analytics/user/${currentUser._id}/history?limit=10`)
      ]);

      if (analyticsResponse.ok) {
        const analyticsData = await analyticsResponse.json();
        setAnalytics(analyticsData.analytics);
      }

      if (historyResponse.ok) {
        const historyData = await historyResponse.json();
        setQuizHistory(historyData.history);
      }

      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    if (!seconds) return '0:00';
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreBgColor = (score) => {
    if (score >= 80) return 'bg-green-100 dark:bg-green-900 border-green-400';
    if (score >= 60) return 'bg-yellow-100 dark:bg-yellow-900 border-yellow-400';
    return 'bg-red-100 dark:bg-red-900 border-red-400';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading your dashboard...</p>
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
              <p className="font-semibold">Error loading dashboard</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-4xl font-extrabold dark:text-transparent text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-4xl box-content font-extrabold text-transparent select-none">
              Your Dashboard
            </span>
            Your Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {currentUser?.username}! Track your learning progress and performance.
          </p>
        </div>

        {/* Quick Actions */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          <Link
            to="/quiz-list"
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            🎯 Take a Quiz
          </Link>
          <Link
            to="/ap-csp-review"
            className="px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
          >
            📚 Study Materials
          </Link>
        </div>

        {/* Tab Navigation */}
        <div className="flex justify-center mb-6">
          <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('overview')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'overview'
                  ? 'bg-purple-600 text-white'
                  : 'text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'history'
                  ? 'bg-purple-600 text-white'
                  : 'text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800'
              }`}
            >
              Quiz History
            </button>
            <button
              onClick={() => setActiveTab('analytics')}
              className={`px-4 py-2 rounded-md transition-colors ${
                activeTab === 'analytics'
                  ? 'bg-purple-600 text-white'
                  : 'text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800'
              }`}
            >
              Analytics
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {analytics && analytics.totalQuizzes > 0 ? (
              <>
                {/* Key Metrics */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                  <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-purple-600 dark:text-purple-400 mb-2">
                      {analytics.totalQuizzes}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Quizzes Completed</div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 text-center">
                    <div className={`text-3xl font-bold mb-2 ${getScoreColor(analytics.averageScore)}`}>
                      {analytics.averageScore}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Average Score</div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 text-center">
                    <div className="text-3xl font-bold text-blue-600 dark:text-blue-400 mb-2">
                      {formatTime(analytics.totalTimeSpent)}
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Total Study Time</div>
                  </div>
                  
                  <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 text-center">
                    <div className={`text-3xl font-bold mb-2 ${
                      analytics.improvementTrend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                    }`}>
                      {analytics.improvementTrend >= 0 ? '+' : ''}{analytics.improvementTrend}%
                    </div>
                    <div className="text-gray-600 dark:text-gray-400">Improvement Trend</div>
                  </div>
                </div>

                {/* Performance Chart */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PerformanceTrendsChart data={analytics} />
                  <ScoreDistributionChart data={analytics} />
                </div>

                {/* Topic Performance */}
                {analytics.topics.length > 0 && (
                  <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                      Performance by Topic
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      {analytics.topics.map(topic => {
                        const topicData = analytics.topicPerformance[topic];
                        return (
                          <div key={topic} className="bg-amber-100 dark:bg-gray-800 rounded-lg p-4">
                            <div className="font-medium text-black dark:text-white mb-2">
                              {topic}
                            </div>
                            <div className={`text-2xl font-bold mb-1 ${getScoreColor(topicData.averageScore)}`}>
                              {topicData.averageScore.toFixed(1)}%
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400">
                              {topicData.totalAttempts} attempt{topicData.totalAttempts !== 1 ? 's' : ''}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📚</div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  Start Your Learning Journey
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Complete your first quiz to see your progress and analytics here.
                </p>
                <Link
                  to="/quiz-list"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Take Your First Quiz
                </Link>
              </div>
            )}
          </div>
        )}

        {/* History Tab */}
        {activeTab === 'history' && (
          <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
              Quiz History
            </h3>
            {quizHistory.length > 0 ? (
              <div className="space-y-3">
                {quizHistory.map((attempt) => (
                  <div key={attempt.attemptId} className="bg-amber-100 dark:bg-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-black dark:text-white">
                          {attempt.quizTitle}
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {attempt.topic} • {attempt.difficulty} • {formatDate(attempt.completedAt)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className={`font-bold ${getScoreColor(attempt.score)}`}>
                          {attempt.score}%
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {attempt.correctAnswers}/{attempt.totalQuestions} correct
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatTime(attempt.timeTaken)}
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="text-4xl mb-4">📊</div>
                <p className="text-gray-600 dark:text-gray-400">
                  No quiz history available. Complete some quizzes to see your history here.
                </p>
              </div>
            )}
          </div>
        )}

        {/* Analytics Tab */}
        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {analytics && analytics.totalQuizzes > 0 ? (
              <>
                {/* Charts Grid */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <PerformanceTrendsChart data={analytics} />
                  <ScoreDistributionChart data={analytics} />
                </div>
                
                <TopicPerformanceChart data={analytics} />

                {/* Additional Analytics */}
                <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
                  <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                    📊 Additional Insights
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-black dark:text-white mb-2">Improvement Trend</h4>
                      <div className={`text-3xl font-bold ${
                        analytics.improvementTrend >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }`}>
                        {analytics.improvementTrend >= 0 ? '+' : ''}{analytics.improvementTrend}%
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {analytics.improvementTrend >= 0 ? 'You\'re improving!' : 'Keep practicing to improve'}
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-black dark:text-white mb-2">Study Consistency</h4>
                      <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                        {analytics.totalQuizzes}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        Total quizzes completed
                      </p>
                    </div>
                  </div>
                </div>

                {/* Difficulty Analysis */}
                {analytics.difficultyBreakdown && Object.keys(analytics.difficultyBreakdown).length > 0 && (
                  <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
                      Performance by Difficulty
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {Object.entries(analytics.difficultyBreakdown).map(([difficulty, data]) => (
                        <div key={difficulty} className="bg-amber-100 dark:bg-gray-800 rounded-lg p-4">
                          <div className="font-medium text-black dark:text-white mb-2 capitalize">
                            {difficulty}
                          </div>
                          <div className={`text-2xl font-bold mb-1 ${getScoreColor(data.averageScore)}`}>
                            {data.averageScore.toFixed(1)}%
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            {data.totalAttempts} attempt{data.totalAttempts !== 1 ? 's' : ''}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-6xl mb-4">📈</div>
                <h3 className="text-xl font-semibold text-black dark:text-white mb-2">
                  Analytics Coming Soon
                </h3>
                <p className="text-gray-600 dark:text-gray-400 mb-6">
                  Complete more quizzes to unlock detailed analytics and insights.
                </p>
                <Link
                  to="/quiz-list"
                  className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
                >
                  Take More Quizzes
                </Link>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
