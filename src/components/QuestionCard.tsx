import { useAppDispatch, useAppSelector } from "../app/hooks";
import { selectAnswer, nextQuestion } from "../features/quizSlice";

export default function QuestionCard() {
  const dispatch = useAppDispatch();
  const { questions, currentQuestionIndex, selectedAnswer } = useAppSelector(
    (state) => state.quiz
  );
  const currentQ = questions[currentQuestionIndex];

  return (
    <div className ="flex flex-col items-center justify-center min-h-screen bg-white">
      <h2 className="text-2xl font-semibold text-black mb-8">{currentQ.question}</h2>
      <ul className="space-y-4 w-full max-w-md mx-auto">
        {currentQ.options.map((opt) => (
          <li key={opt}>
            <button
              onClick={() => dispatch(selectAnswer(opt))}
              className={`
                w-full px-6 py-3 rounded-xl border text-lg font-medium
                transition-all duration-200
                ${selectedAnswer === opt
                  ? "bg-gray-200 text-black shadow-lg scale-105"
                  : "bg-white text-gray-800 border-gray-300 hover:bg-gray-100"}
              `}
            >
              {opt}
            </button>
          </li>
        ))}
      </ul>
      <button disabled={!selectedAnswer} 
      onClick={() => dispatch(nextQuestion())}
      className="px-8 py-3 mt-4 mb-4 bg-orange-400 text-black font-bold rounded-lg shadow-md hover:bg-orange-500 ">
        Next
      </button>
    </div>
  );
}
