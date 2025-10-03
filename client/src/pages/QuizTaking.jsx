import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';

export default function QuizTaking() {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [quizAttemptId, setQuizAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (id) {
      fetchQuizData();
    }
  }, [id]);

  useEffect(() => {
    let timer;
    if (timeRemaining > 0) {
      timer = setTimeout(() => {
        setTimeRemaining(timeRemaining - 1);
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      
      // Fetch quiz details
      const quizResponse = await fetch(`http://localhost:3000/api/quiz/${id}`);
      if (!quizResponse.ok) {
        throw new Error('Failed to fetch quiz');
      }
      const quizData = await quizResponse.json();
      setQuiz(quizData);
      
      // Fetch questions
      const questionsResponse = await fetch(`http://localhost:3000/api/question/${id}/questions`);
      if (!questionsResponse.ok) {
        throw new Error('Failed to fetch questions');
      }
      const questionsData = await questionsResponse.json();
      setQuestions(questionsData);
      
      // Start quiz attempt
      await startQuizAttempt(quizData._id);
      
      // Set timer if quiz has time limit
      if (quizData.timeLimit) {
        setTimeRemaining(quizData.timeLimit * 60); // Convert minutes to seconds
      }
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const startQuizAttempt = async (quizId) => {
    try {
      const response = await fetch('http://localhost:3000/api/quiz-stat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          quizId: quizId,
          userId: 'current-user-123' // TODO: Get from auth context
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to start quiz attempt');
      }
      
      const data = await response.json();
      setQuizAttemptId(data._id);
    } catch (err) {
      console.error('Error starting quiz attempt:', err);
      // Continue without tracking for now
    }
  };

  const submitAnswer = async (questionId, chosenAnswer) => {
    if (!quizAttemptId) return;
    
    try {
      const response = await fetch(`http://localhost:3000/api/quiz-stat/${quizAttemptId}/answer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          answer: {
            questionId: questionId,
            chosenAnswer: chosenAnswer,
            isCorrect: false, // Will be calculated on backend
            isSkipped: false,
            timeTaken: 0, // TODO: Track time per question
            date: new Date().toISOString()
          }
        }),
      });
      
      if (!response.ok) {
        console.error('Failed to submit answer');
      }
    } catch (err) {
      console.error('Error submitting answer:', err);
    }
  };

  const handleAnswerSelect = (questionId, answerIndex) => {
    const newAnswers = {
      ...answers,
      [questionId]: answerIndex
    };
    setAnswers(newAnswers);
    
    // Submit answer to backend
    submitAnswer(questionId, answerIndex);
  };

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  const handleSubmitQuiz = async () => {
    if (submitting) return;
    
    try {
      setSubmitting(true);
      
      // Calculate score
      const correctAnswers = Object.entries(answers).filter(([questionId, chosenAnswer]) => {
        const question = questions.find(q => q._id === questionId);
        return question && chosenAnswer === question.correctAnswer;
      }).length;
      
      const score = Math.round((correctAnswers / questions.length) * 100);
      const totalTimeTaken = quiz.timeLimit ? (quiz.timeLimit * 60) - timeRemaining : 0;
      
      // Submit quiz completion
      if (quizAttemptId) {
        const response = await fetch(`http://localhost:3000/api/quiz-stat/${quizAttemptId}/submit`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: score,
            totalTimeTaken: totalTimeTaken
          }),
        });
        
        if (!response.ok) {
          console.error('Failed to submit quiz');
        }
      }
      
      // Navigate to results
      navigate(`/quiz/${id}/results`, {
        state: {
          quiz: quiz,
          questions: questions,
          answers: answers,
          score: score,
          totalTimeTaken: totalTimeTaken,
          quizAttemptId: quizAttemptId
        }
      });
      
    } catch (err) {
      console.error('Error submitting quiz:', err);
      setError('Failed to submit quiz. Please try again.');
    } finally {
      setSubmitting(false);
    }
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
            <p className="mt-4 text-gray-600 dark:text-gray-400">Loading quiz...</p>
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
              <p className="font-semibold">Error loading quiz</p>
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

  const currentQuestionData = questions[currentQuestion];
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  return (
    <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-2xl font-bold text-black dark:text-white">{quiz.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{quiz.description}</p>
            </div>
            {timeRemaining !== null && (
              <div className={`px-4 py-2 rounded-lg font-semibold ${
                timeRemaining < 300 ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200' : 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200'
              }`}>
                Time: {formatTime(timeRemaining)}
              </div>
            )}
          </div>
          
          {/* Progress Bar */}
          <div className="mb-4">
            <div className="flex justify-between text-sm text-gray-600 dark:text-gray-400 mb-2">
              <span>Question {currentQuestion + 1} of {questions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
              <div 
                className="bg-purple-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>

        {/* Question */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 mb-6">
          <h2 className="text-xl font-semibold text-black dark:text-white mb-6">
            {currentQuestionData.questionsText}
          </h2>
          
          <div className="space-y-3">
            {currentQuestionData.options.map((option, index) => (
              <label 
                key={index} 
                className={`flex items-center p-4 rounded-lg border cursor-pointer transition-colors ${
                  answers[currentQuestionData._id] === index
                    ? 'bg-purple-100 dark:bg-purple-900 border-purple-500'
                    : 'bg-amber-100 dark:bg-gray-800 border-black dark:border-purple-500 hover:bg-amber-200 dark:hover:bg-gray-700'
                }`}
              >
                <input
                  type="radio"
                  name={`question-${currentQuestionData._id}`}
                  value={index}
                  checked={answers[currentQuestionData._id] === index}
                  onChange={() => handleAnswerSelect(currentQuestionData._id, index)}
                  className="sr-only"
                />
                <div className={`w-4 h-4 rounded-full border-2 mr-3 flex items-center justify-center ${
                  answers[currentQuestionData._id] === index
                    ? 'border-purple-500 bg-purple-500'
                    : 'border-gray-400'
                }`}>
                  {answers[currentQuestionData._id] === index && (
                    <div className="w-2 h-2 rounded-full bg-white"></div>
                  )}
                </div>
                <span className="text-black dark:text-white">{option}</span>
              </label>
            ))}
          </div>
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center">
          <button
            onClick={handlePreviousQuestion}
            disabled={currentQuestion === 0}
            className={`px-6 py-3 rounded-lg font-semibold transition-colors ${
              currentQuestion === 0
                ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 dark:text-gray-400 cursor-not-allowed'
                : 'bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800'
            }`}
          >
            ← Previous
          </button>
          
          <div className="flex space-x-3">
            {currentQuestion === questions.length - 1 ? (
              <button
                onClick={handleSubmitQuiz}
                disabled={submitting}
                className="px-6 py-3 bg-green-600 hover:bg-green-700 text-white font-semibold rounded-lg transition-colors disabled:opacity-50"
              >
                {submitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            ) : (
              <button
                onClick={handleNextQuestion}
                className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white font-semibold rounded-lg transition-colors"
              >
                Next →
              </button>
            )}
          </div>
        </div>

        {/* Question Navigation */}
        <div className="mt-6 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-4">
          <h3 className="text-sm font-semibold text-black dark:text-white mb-3">Question Navigation</h3>
          <div className="grid grid-cols-5 md:grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentQuestion(index)}
                className={`w-8 h-8 rounded text-xs font-semibold transition-colors ${
                  index === currentQuestion
                    ? 'bg-purple-600 text-white'
                    : answers[questions[index]._id] !== undefined
                    ? 'bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200'
                    : 'bg-amber-100 dark:bg-gray-800 text-black dark:text-white hover:bg-amber-200 dark:hover:bg-gray-700'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
