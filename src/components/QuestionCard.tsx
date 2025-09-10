import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAnswer, nextQuestion, fetchQuestions, goToPreviousQuestion, goToQuestion } from "../features/quizSlice";
import { Check, X } from "lucide-react";

export default function QuestionCard() {
  const dispatch = useAppDispatch();
  const { questions, currentQuestionIndex, selectedAnswer, loading, error, score, quizCompleted, answeredQuestions } = useAppSelector(
    (state) => state.quiz
  );

  // Timer state - 10 seconds per question
  const [timeRemaining, setTimeRemaining] = useState(10);

  // Reset timer when question changes
  useEffect(() => {
    setTimeRemaining(10);
  }, [currentQuestionIndex]);

  // Timer effect
  useEffect(() => {
  if (quizCompleted) return;

  if (timeRemaining > 0) {
    const timer = setTimeout(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);
    return () => clearTimeout(timer);
    } else {
      // Time's up, move to next question automatically
      dispatch(nextQuestion());
    }
  }, [timeRemaining, quizCompleted, dispatch]);

    // Fetch questions on mount
  useEffect(() => {
    dispatch(fetchQuestions());
  }, [dispatch]);

  // Format time as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-900 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <p className="text-xl text-gray-600 dark:text-gray-300">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-700 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <p className="text-xl text-red-600 dark:text-red-400">Error: {error}</p>
        </div>
      </div>
    );
  }

  if (!questions.length || !questions[currentQuestionIndex]) {
    return (
      <div className="min-h-screen bg-white dark:bg-gray-700 flex items-center justify-center">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
          <p className="text-xl text-gray-600 dark:text-gray-300">No questions available.</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="h-full w-full p-4 overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        {/* Header with Timer */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            {/* Timer */}
            <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
              <div className="w-6 h-6 rounded-full border-2 border-gray-400 dark:border-gray-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-gray-400 dark:bg-gray-500 rounded-full"></div>
              </div>
              <span className="text-sm font-medium">Time remaining</span>
              <span className="text-xl font-mono font-bold">{formatTime(timeRemaining)}</span>
            </div>
          </div>
        </div>

        <div className="flex gap-2">
          {/* Main Question Area */}
          <div className="flex-1">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-8">
              {/* Question Header */}
              <div className="mb-8">
                <h2 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-2">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </h2>
                <h1 className="text-xl font-semibold text-gray-800 dark:text-gray-200 leading-relaxed">
                  {currentQ.question}
                </h1>
              </div>

              {/* Answer Options */}
              <div className="grid grid-cols-1 gap-3 mb-8">
                {currentQ.options.map((opt, index) => {
                  const letters = ["A", "B", "C", "D"];
                  const isCorrect = opt === currentQ.answer;
                  const isSelected = selectedAnswer === opt;

                  let buttonClass =
                    "w-full p-4 text-left rounded-lg border transition-all duration-200 flex items-center justify-between";
                  let icon = null;

                  if (selectedAnswer) {
                    if (isCorrect) {
                      // Always show green for the correct answer
                      buttonClass += " bg-green-50 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-300";
                      icon = <Check className="w-5 h-5 text-green-600 dark:text-green-400" />;
                    } else if (isSelected && !isCorrect) {
                      // Show red for the selected wrong answer
                      buttonClass += " bg-red-50 dark:bg-red-900/30 border-red-500 text-red-800 dark:text-red-300";
                      icon = <X className="w-5 h-5 text-red-600 dark:text-red-400" />;
                    } else {
                      buttonClass +=
                        " bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 opacity-70";
                    }
                  } else {
                    buttonClass +=
                      " bg-white dark:bg-gray-700 border-gray-200 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 hover:border-gray-300 dark:hover:border-gray-500";
                  }

                  return (
                    <button
                      key={opt}
                      onClick={() => !selectedAnswer && dispatch(selectAnswer(opt))}
                      className={buttonClass}
                      disabled={!!selectedAnswer}
                    >
                      <div className="flex items-center gap-3 w-full justify-between">
                        {/* Left side: option letter + text */}
                        <div className="flex items-center gap-3">
                          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-600 flex items-center justify-center text-sm font-medium">
                            {letters[index]}.
                          </span>
                          <span className="flex-1">{opt}</span>
                        </div>
                        {/* Right side: conditional icon */}
                        {icon}
                      </div>
                    </button>
                  );
                })}
                </div>  

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <button
                  disabled={currentQuestionIndex === 0}
                  onClick={() => dispatch(goToPreviousQuestion())}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Prev
                </button>

                <div className="flex gap-1">
                  {questions.map((_, index) => (
                    <button
                      key={index}
                      onClick={() => dispatch(goToQuestion(index))}
                      className={`w-10 h-10 rounded-lg font-medium transition-colors ${
                        index === currentQuestionIndex
                          ? 'bg-orange-400 text-white'
                          : answeredQuestions.includes(index)
                          ? 'bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 border border-gray-600 dark:border-gray-500'
                          : 'bg-white dark:bg-gray-700 text-gray-600 dark:text-gray-300 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-600'
                      }`}
                    >
                      {index + 1}
                    </button>
                  ))}
                </div>

                <button
                  disabled={!selectedAnswer}
                  onClick={() => dispatch(nextQuestion())}
                  className="px-6 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Next
                </button>
              </div>
            </div>
          </div>

          {/* Scoreboard */}
          <div className="w-64">
            <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 sticky top-4">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">Score</h3>
              
              {/* Circular Progress */}
              <div className="relative w-32 h-32 mx-auto mb-6">
                <svg className="w-32 h-32 transform -rotate-90" viewBox="0 0 100 100">
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#e5e7eb"
                    className="dark:stroke-gray-600"
                    strokeWidth="8"
                    fill="none"
                  />
                  <circle
                    cx="50"
                    cy="50"
                    r="40"
                    stroke="#fb923c"
                    strokeWidth="8"
                    fill="none"
                    strokeLinecap="round"
                    strokeDasharray={`${questions.length > 0 ? (score / questions.length) * 251.2 : 0} 251.2`}
                    className="transition-all duration-500"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-800 dark:text-gray-200">{score}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">/{questions.length}</div>
                  </div>
                </div>
              </div>

              {/* Progress Stats */}
              <div className="space-y-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Answered</span>
                  <span className="font-medium text-gray-800 dark:text-gray-200">{answeredQuestions.length}/{questions.length}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Score</span>
                  <span className="font-medium text-orange-600 dark:text-orange-400">{score}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}