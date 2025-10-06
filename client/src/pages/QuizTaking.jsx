import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

export default function QuizTaking() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { currentUser } = useSelector((state) => state.user);
  
  const [quiz, setQuiz] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState({});
  const [timeRemaining, setTimeRemaining] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [isResumed, setIsResumed] = useState(false);
  const [showSaveNotification, setShowSaveNotification] = useState(false);
  const [hasUnsavedProgress, setHasUnsavedProgress] = useState(false);
  const [isStartingQuiz, setIsStartingQuiz] = useState(false);
  const timeRemainingRef = useRef(null);

  useEffect(() => {
    if (id) {
      fetchQuizData();
    }
  }, [id]);

  // Re-fetch quiz data when user changes
  useEffect(() => {
    if (id && currentUser) {
      fetchQuizData();
    }
  }, [currentUser]);

  // Handle page unload (tab close, navigation, refresh)
  useEffect(() => {
    const handleBeforeUnload = (e) => {
      // Only show warning if there's progress to save
      if (Object.keys(answers).length > 0 || currentQuestion > 0) {
        e.preventDefault();
        e.returnValue = 'Do you want to save your progress before leaving?';
        return 'Do you want to save your progress before leaving?';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [answers, currentQuestion]);

  // Track unsaved progress
  useEffect(() => {
    const hasProgress = Object.keys(answers).length > 0 || currentQuestion > 0;
    setHasUnsavedProgress(hasProgress);
  }, [answers, currentQuestion]);

  // Handle navigation protection
  useEffect(() => {
    const handleClick = (e) => {
      if (!hasUnsavedProgress) return;
      
      // Find the closest link element
      const link = e.target.closest('a');
      if (!link) return;
      
      // Check if it's a navigation link (React Router Link)
      const href = link.getAttribute('href');
      if (!href || href.startsWith('#')) return;
      
      // Prevent the default navigation
      e.preventDefault();
      e.stopPropagation();
      
      const shouldProceed = window.confirm(
        "Do you want to save your progress before leaving? Click OK to save and continue, or Cancel to stay on this page."
      );
      
      if (shouldProceed) {
        saveProgress().then(() => {
          // Navigate after saving
          if (href.startsWith('/')) {
            navigate(href);
          } else {
            window.location.href = href;
          }
        });
      }
    };

    const handlePopState = (e) => {
      if (hasUnsavedProgress) {
        const shouldProceed = window.confirm(
          "Do you want to save your progress before leaving? Click OK to save and continue, or Cancel to stay on this page."
        );
        
        if (shouldProceed) {
          saveProgress().then(() => {
            // Allow the navigation to proceed
            window.history.back();
          });
        } else {
          // Push current state back to prevent navigation
          window.history.pushState(null, '', window.location.href);
        }
      }
    };

    // Add event listeners with capture to intercept early
    document.addEventListener('click', handleClick, true);
    window.addEventListener('popstate', handlePopState);

    return () => {
      document.removeEventListener('click', handleClick, true);
      window.removeEventListener('popstate', handlePopState);
    };
  }, [hasUnsavedProgress, navigate]);

  useEffect(() => {
    let timer;
    if (timeRemaining !== null && timeRemaining > 0) {
      timer = setTimeout(() => {
        const newTime = timeRemaining - 1;
        setTimeRemaining(newTime);
        timeRemainingRef.current = newTime; // Keep ref in sync
      }, 1000);
    } else if (timeRemaining === 0) {
      handleSubmitQuiz();
    }
    return () => clearTimeout(timer);
  }, [timeRemaining]);

  // Keep ref in sync with state
  useEffect(() => {
    timeRemainingRef.current = timeRemaining;
  }, [timeRemaining]);

  const fetchQuizData = async () => {
    try {
      setLoading(true);
      
      // Fetch quiz details
      const quizResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/quiz/${id}`, {
        credentials: 'include'
      });
      if (!quizResponse.ok) {
        throw new Error('Failed to fetch quiz');
      }
      const quizData = await quizResponse.json();
      setQuiz(quizData);
      
      // Fetch questions
      const questionsResponse = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/question/${id}/questions`, {
        credentials: 'include'
      });
      if (!questionsResponse.ok) {
        throw new Error('Failed to fetch questions');
      }
      const questionsData = await questionsResponse.json();
      setQuestions(questionsData);
      
      // Check for existing attempts first
      await checkForExistingAttempt(quizData._id, quizData);
      
      setError(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const checkForExistingAttempt = async (quizId, quizData) => {
    if (isStartingQuiz) {
      return;
    }
    
    try {
      const userId = currentUser?._id || 'anonymous';
      
      // Check if user has in-progress quizzes
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/quiz/in-progress/user`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const responseData = await response.json();
        const inProgressQuizzes = responseData.quizzes || [];
        const currentQuizProgress = inProgressQuizzes.find(q => q._id === quizId);
        
        if (currentQuizProgress && currentQuizProgress.userProgress) {
          // Resume existing attempt
          const progress = currentQuizProgress.userProgress;
          setCurrentQuestion(progress.currentQuestion || 0);
          setIsResumed(true);
          
          // Set timer from saved time or quiz time limit
          if (progress.timeRemaining !== null && progress.timeRemaining !== undefined) {
            setTimeRemaining(progress.timeRemaining);
          } else if (quizData.timeLimit) {
            const timeInSeconds = quizData.timeLimit * 60;
            setTimeRemaining(timeInSeconds);
          }
          
          // Load existing answers
          let existingAnswers = {};
          if (progress.answers) {
            
            // Check if answers is an array or object
            if (Array.isArray(progress.answers)) {
              // If it's an array, convert to object
              progress.answers.forEach(answer => {
                if (answer.questionId && answer.selectedAnswer !== undefined) {
                  existingAnswers[answer.questionId] = answer.selectedAnswer;
                }
              });
            } else {
              // If it's already an object, use it directly
              existingAnswers = progress.answers;
            }
          }
          setAnswers(existingAnswers);
        } else {
          // Start new attempt
          await startQuizAttempt(quizId, quizData);
        }
      } else {
        // Start new attempt if no existing attempts
        await startQuizAttempt(quizId, quizData);
      }
    } catch (err) {
      console.error('Error checking for existing attempts:', err);
      // Start new attempt as fallback
      await startQuizAttempt(quizId, quizData);
    }
  };

  const startQuizAttempt = async (quizId, quizData) => {
    if (isStartingQuiz) {
      return;
    }
    
    setIsStartingQuiz(true);
    try {
      
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/quiz/${quizId}/start`, {
        credentials: 'include',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('Failed to start quiz:', errorData);
        throw new Error('Failed to start quiz');
      }
      
      const data = await response.json();
      
      // If resuming, load the progress data
      if (data.progress) {
        setCurrentQuestion(data.progress.currentQuestion || 0);
        setIsResumed(true);
        
        // Set timer from saved time or quiz time limit
        if (data.progress.timeRemaining !== null && data.progress.timeRemaining !== undefined) {
          setTimeRemaining(data.progress.timeRemaining);
        } else if (quizData.timeLimit) {
          const timeInSeconds = quizData.timeLimit * 60;
          setTimeRemaining(timeInSeconds);
        }
        
        // Load existing answers
        const existingAnswers = {};
        if (data.progress.answers) {
          data.progress.answers.forEach(answer => {
            existingAnswers[answer.questionId] = answer.chosenAnswer;
          });
        }
        setAnswers(existingAnswers);
      }
      
      // Set timer if quiz has time limit
      if (quizData && quizData.timeLimit) {
        const timeInSeconds = quizData.timeLimit * 60; // Convert minutes to seconds
        setTimeRemaining(timeInSeconds);
      }
    } catch (err) {
      console.error('Error starting quiz attempt:', err);
      // Continue without tracking for now
    } finally {
      setIsStartingQuiz(false);
    }
  };

  const submitAnswer = async (questionId, chosenAnswer) => {
    if (!quiz) return;
    
    try {
      // Update local state immediately for better UX
      setAnswers(prev => ({
        ...prev,
        [questionId]: chosenAnswer
      }));
      
      // Save progress to backend
      await saveProgress();
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

  const saveProgress = async () => {
    if (!quiz) return;
    
    // Get the current timer value using ref to avoid stale closure
    const currentTimeRemaining = timeRemainingRef.current;
    
    try {
      const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/quiz/${quiz._id}/progress`, {
        credentials: 'include',
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          currentQuestion: currentQuestion,
          answers: Object.entries(answers).map(([questionId, chosenAnswer]) => ({
            questionId: questionId,
            selectedAnswer: chosenAnswer
          })),
          timeRemaining: currentTimeRemaining
        }),
      });
      
      if (response.ok) {
        setShowSaveNotification(true);
        setTimeout(() => setShowSaveNotification(false), 3000); // Hide after 3 seconds
      } else {
        console.error('Failed to save progress');
      }
    } catch (err) {
      console.error('Error saving progress:', err);
    }
  };

  const handleBackToQuizList = async () => {
    // Always save progress automatically before leaving
    await saveProgress();
    setHasUnsavedProgress(false); // Clear unsaved progress flag
    // Navigate immediately with save success state
    navigate('/quiz-list', { state: { saveSuccess: true } });
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
      setHasUnsavedProgress(false); // Clear unsaved progress flag
      
      // Calculate score
      const correctAnswers = Object.entries(answers).filter(([questionId, chosenAnswer]) => {
        const question = questions.find(q => q._id === questionId);
        return question && chosenAnswer === question.correctAnswer;
      }).length;
      
      const score = Math.round((correctAnswers / questions.length) * 100);
      const totalTimeTaken = quiz.timeLimit ? (quiz.timeLimit * 60) - timeRemaining : 0;
      
      // Submit quiz completion
      if (quiz) {
        const response = await fetch(`${import.meta.env.VITE_API_BASE_URL || '/api'}/quiz/${quiz._id}/complete`, {
          credentials: 'include',
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            score: score,
            timeSpent: totalTimeTaken,
            answers: Object.entries(answers).map(([questionId, selectedAnswer]) => ({
              questionId: questionId,
              selectedAnswer: selectedAnswer,
              isCorrect: questions.find(q => q._id === questionId)?.correctAnswer === selectedAnswer
            }))
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
          quizId: quiz?._id
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

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-amber-50 dark:bg-black pt-24 p-6">
        <div className="max-w-4xl mx-auto">
          <div className="text-center">
            <div className="bg-red-100 dark:bg-red-900 border border-red-400 text-red-700 dark:text-red-200 px-4 py-3 rounded-lg">
              <p className="font-semibold">Authentication Required</p>
              <p className="text-sm mt-1">Please sign in to take quizzes</p>
            </div>
            <button 
              onClick={() => navigate('/sign-in')}
              className="mt-4 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Sign In
            </button>
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
      {/* Save Notification Popup */}
      {showSaveNotification && (
        <div className="fixed top-20 right-6 z-50 transform transition-all duration-300 ease-in-out animate-pulse">
          <div className="bg-green-50 dark:bg-green-900 border border-green-400 text-green-800 dark:text-green-200 px-4 py-3 rounded-lg shadow-lg flex items-center space-x-2">
            <span className="text-green-600 dark:text-green-400">✓</span>
            <span className="font-medium">Progress saved successfully!</span>
          </div>
        </div>
      )}
      
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-amber-50 dark:bg-black border border-black dark:border-purple-500 rounded-lg p-6 mb-6">
          <div className="flex justify-between items-start mb-4">
            <button
              onClick={handleBackToQuizList}
              className="px-4 py-2 bg-amber-50 dark:bg-black border border-black dark:border-purple-500 text-black dark:text-white hover:bg-amber-100 dark:hover:bg-gray-800 rounded-lg transition-colors text-sm font-medium flex items-center space-x-2"
            >
              <span>←</span>
              <span>Save & Exit</span>
            </button>
            
            <div className="flex-1 text-center">
              <h1 className="text-2xl font-bold text-black dark:text-white">{quiz.title}</h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">{quiz.description}</p>
              {isResumed && (
                <div className="mt-2 px-3 py-1 bg-green-100 dark:bg-green-900 border border-green-400 rounded-full inline-block">
                  <span className="text-green-800 dark:text-green-200 text-sm font-medium">
                    📍 Resumed from previous session
                  </span>
                </div>
              )}
            </div>
            
            <div className="flex flex-col items-end space-y-2">
              {timeRemaining !== null && (
                <div className={`px-4 py-2 rounded-lg font-semibold border ${
                  timeRemaining < 300 
                    ? 'bg-red-50 dark:bg-red-900 border-red-400 text-red-800 dark:text-red-200' 
                    : 'bg-amber-50 dark:bg-black border-black dark:border-purple-500 text-black dark:text-white'
                }`}>
                  Time: {formatTime(timeRemaining)}
                </div>
              )}
              
              {/* Adaptive Timing Info */}
              {quiz?.timingBreakdown && (
                <div className="text-xs text-gray-600 dark:text-gray-400 text-right">
                  <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-2 border border-gray-200 dark:border-gray-600">
                    <div className="font-semibold mb-1">⏱️ Adaptive Timing</div>
                    <div className="space-y-1">
                      <div>Total: {Math.round(quiz.timingBreakdown.total)} min</div>
                      <div>Buffer: {Math.round(quiz.timingBreakdown.bufferTime)} min</div>
                      {quiz.timingBreakdown.byQuestionType && Object.keys(quiz.timingBreakdown.byQuestionType).length > 0 && (
                        <div className="text-xs">
                          {Object.entries(quiz.timingBreakdown.byQuestionType).map(([type, time]) => (
                            <div key={type} className="flex justify-between">
                              <span className="capitalize">{type.replace('_', ' ')}:</span>
                              <span>{Math.round(time)}m</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
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
          <div className="text-black dark:text-white mb-6">
            {currentQuestionData.questionsText.includes('robot starts at position') || 
             currentQuestionData.questionsText.includes('grid below') ||
             currentQuestionData.questionsText.includes('facing >') ||
             currentQuestionData.questionsText.includes('facing v') ||
             currentQuestionData.questionsText.includes('facing ^') ||
             currentQuestionData.questionsText.includes('facing <') ||
             currentQuestionData.questionsText.includes('```') ||
             currentQuestionData.questionsText.includes('def ') ||
             currentQuestionData.questionsText.includes('function ') ||
             currentQuestionData.questionsText.includes('for ') ||
             currentQuestionData.questionsText.includes('while ') ||
             currentQuestionData.questionsText.includes('if ') ? (
              <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border border-gray-300 dark:border-gray-600">
                {currentQuestionData.questionsText.replace(/\\n/g, '\n')}
              </pre>
            ) : (
              <h2 className="text-xl font-semibold">
                {currentQuestionData.questionsText.replace(/\\n/g, '\n')}
              </h2>
            )}
          </div>
          
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
                <span className="text-black dark:text-white">
                  {option.includes('ROTATE') || option.includes('MOVE_FORWARD') || option.includes('REPEAT') ? (
                    <pre className="whitespace-pre-wrap font-mono text-sm bg-gray-100 dark:bg-gray-800 p-2 rounded border border-gray-300 dark:border-gray-600">
                      {option.replace(/\\n/g, '\n')}
                    </pre>
                  ) : (
                    option.replace(/\\n/g, '\n')
                  )}
                </span>
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
