import React, { useState, useEffect } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

export default function QuizResults() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [totalTimeTaken, setTotalTimeTaken] = useState(0);
  const [quizAttemptId, setQuizAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showDetailedResults, setShowDetailedResults] = useState(false);

  useEffect(() => {
    if (location.state) {
      // Data passed from quiz taking
      setQuiz(location.state.quiz);
      setQuestions(location.state.questions);
      setAnswers(location.state.answers);
      setScore(location.state.score);
      setTotalTimeTaken(location.state.totalTimeTaken);
      setQuizAttemptId(location.state.quizAttemptId);
      setLoading(false);
    } else {
      // Fetch results from API
      fetchQuizResults();
    }
  }, [id, location.state]);

  const fetchQuizResults = async () => {
    try {
      setLoading(true);
      
      // For now, we'll need to implement a way to get quiz results
      // This would require additional API endpoints
      setError('Quiz results not available. Please complete a quiz first.');
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const calculateDetailedStats = () => {
    const correctAnswers = Object.entries(answers).filter(([questionId, chosenAnswer]) => {
      const question = questions.find(q => q._id === questionId);
      return question && chosenAnswer === question.correctAnswer;
    }).length;
    
    const incorrectAnswers = Object.entries(answers).filter(([questionId, chosenAnswer]) => {
      const question = questions.find(q => q._id === questionId);
      return question && chosenAnswer !== question.correctAnswer;
    }).length;
    
    const skippedQuestions = questions.length - Object.keys(answers).length;
    
    return {
      correct: correctAnswers,
      incorrect: incorrectAnswers,
      skipped: skippedQuestions,
      total: questions.length
    };
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'text-green-600 dark:text-green-400';
    if (score >= 60) return 'text-yellow-600 dark:text-yellow-400';
    return 'text-red-600 dark:text-red-400';
  };

  const getScoreMessage = (score) => {
    if (score >= 90) return 'Excellent work! 🎉';
    if (score >= 80) return 'Great job! 👍';
    if (score >= 70) return 'Good effort! 💪';
    if (score >= 60) return 'Keep practicing! 📚';
    return 'Review the material and try again! 🔄';
  };

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading results...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
              <p className="font-semibold">Error loading results</p>
              <p className="text-sm mt-1">{error}</p>
            </div>
            <button 
              onClick={() => navigate('/quiz-list')}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Back to Quiz List
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (!quiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-400">No quiz data available</p>
          </div>
        </div>
      </div>
    );
  }

  const stats = calculateDetailedStats();

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="mb-7 relative py-4 flex justify-center items-center text-black dark:bg-gradient-to-r dark:from-purple-800 dark:via-purple-500 dark:to-purple-800 bg-clip-text text-4xl font-extrabold dark:text-transparent text-center">
            <span className="absolute hidden inset-0 w-full h-full dark:flex justify-center items-center bg-gradient-to-r blur-xl from-purple-500 via-purple-500 to-purple-500 bg-clip-text text-4xl box-content font-extrabold text-transparent select-none">
              Quiz Results
            </span>
            Quiz Results
          </h1>
        </div>

        {/* Score Summary */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-8 mb-6 text-center">
          <div className="mb-6">
            <div className={`text-6xl font-bold mb-2 ${getScoreColor(score)}`}>
              {score}%
            </div>
            <h2 className="text-2xl font-semibold text-black dark:text-white mb-2">
              {quiz.title}
            </h2>
            <p className={`text-lg ${getScoreColor(score)}`}>
              {getScoreMessage(score)}
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-green-100 dark:bg-green-900 border border-green-400 rounded-lg p-4">
              <div className="text-2xl font-bold text-green-800 dark:text-green-200">
                {stats.correct}
              </div>
              <div className="text-sm text-green-700 dark:text-green-300">
                Correct
              </div>
            </div>
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 rounded-lg p-4">
              <div className="text-2xl font-bold text-red-800 dark:text-red-200">
                {stats.incorrect}
              </div>
              <div className="text-sm text-red-700 dark:text-red-300">
                Incorrect
              </div>
            </div>
            <div className="bg-yellow-100 dark:bg-yellow-900 border border-yellow-400 rounded-lg p-4">
              <div className="text-2xl font-bold text-yellow-800 dark:text-yellow-200">
                {stats.skipped}
              </div>
              <div className="text-sm text-yellow-700 dark:text-yellow-300">
                Skipped
              </div>
            </div>
            <div className="bg-blue-100 dark:bg-blue-900 border border-blue-400 rounded-lg p-4">
              <div className="text-2xl font-bold text-blue-800 dark:text-blue-200">
                {formatTime(totalTimeTaken)}
              </div>
              <div className="text-sm text-blue-700 dark:text-blue-300">
                Time Taken
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap justify-center gap-4 mb-6">
          <button
            onClick={() => setShowDetailedResults(!showDetailedResults)}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
          >
            {showDetailedResults ? 'Hide' : 'Show'} Detailed Results
          </button>
          
          <button
            onClick={() => navigate(`/quiz/${id}`)}
            className="px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
          >
            Retake Quiz
          </button>
          
          <button
            onClick={() => navigate('/quiz-list')}
            className="px-6 py-3 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 font-semibold rounded-lg transition-colors"
          >
            Back to Quiz List
          </button>
        </div>

        {/* Detailed Results */}
        {showDetailedResults && (
          <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-black dark:text-white mb-6">
              Question-by-Question Results
            </h3>
            
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = answers[question._id];
                const isCorrect = userAnswer === question.correctAnswer;
                const isSkipped = userAnswer === undefined;
                
                return (
                  <div key={question._id} className={`border rounded-lg p-4 ${
                    isCorrect 
                      ? 'bg-green-50 dark:bg-green-900 border-green-400' 
                      : isSkipped
                      ? 'bg-yellow-50 dark:bg-yellow-900 border-yellow-400'
                      : 'bg-red-50 dark:bg-red-900 border-red-400'
                  }`}>
                    <div className="flex items-start justify-between mb-3">
                      <h4 className="font-semibold text-black dark:text-white">
                        Question {index + 1}
                      </h4>
                      <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                        isCorrect 
                          ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-200'
                          : isSkipped
                          ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-200'
                          : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-200'
                      }`}>
                        {isCorrect ? 'Correct' : isSkipped ? 'Skipped' : 'Incorrect'}
                      </div>
                    </div>
                    
                    <p className="text-black dark:text-white mb-4">
                      {question.questionsText}
                    </p>
                    
                    <div className="space-y-2">
                      {question.options.map((option, optionIndex) => {
                        const isUserAnswer = userAnswer === optionIndex;
                        const isCorrectAnswer = question.correctAnswer === optionIndex;
                        
                        return (
                          <div key={optionIndex} className={`p-3 rounded-lg border ${
                            isCorrectAnswer
                              ? 'bg-green-100 dark:bg-green-800 border-green-400'
                              : isUserAnswer && !isCorrectAnswer
                              ? 'bg-red-100 dark:bg-red-800 border-red-400'
                              : 'bg-gray-100 dark:bg-gray-800 border-gray-400'
                          }`}>
                            <div className="flex items-center">
                              {isCorrectAnswer && (
                                <span className="text-green-600 dark:text-green-400 mr-2">✓</span>
                              )}
                              {isUserAnswer && !isCorrectAnswer && (
                                <span className="text-red-600 dark:text-red-400 mr-2">✗</span>
                              )}
                              <span className={`${
                                isCorrectAnswer 
                                  ? 'text-green-800 dark:text-green-200 font-semibold'
                                  : isUserAnswer && !isCorrectAnswer
                                  ? 'text-red-800 dark:text-red-200 font-semibold'
                                  : 'text-black dark:text-white'
                              }`}>
                                {option}
                              </span>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    
                    {question.explanation && (
                      <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900 border border-blue-400 rounded-lg">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Explanation:</strong> {question.explanation}
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Performance Insights */}
        <div className="mt-6 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6">
          <h3 className="text-xl font-semibold text-black dark:text-white mb-4">
            Performance Insights
          </h3>
          
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-2">Strengths</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                <li>• Answered {stats.correct} questions correctly</li>
                <li>• Completed quiz in {formatTime(totalTimeTaken)}</li>
                {score >= 80 && <li>• Excellent understanding of the material</li>}
                {score >= 60 && <li>• Good grasp of core concepts</li>}
              </ul>
            </div>
            
            <div>
              <h4 className="font-semibold text-black dark:text-white mb-2">Areas for Improvement</h4>
              <ul className="text-sm text-gray-700 dark:text-gray-300 space-y-1">
                {stats.incorrect > 0 && <li>• Review {stats.incorrect} incorrect answers</li>}
                {stats.skipped > 0 && <li>• Complete {stats.skipped} skipped questions</li>}
                {score < 70 && <li>• Focus on fundamental concepts</li>}
                <li>• Practice with similar questions</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
