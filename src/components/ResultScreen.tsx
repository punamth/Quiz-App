import { useAppDispatch, useAppSelector } from "../app/hooks";
import { restartQuiz } from "../features/quizSlice";

export default function ResultScreen() {
  const dispatch = useAppDispatch();
  const { score, questions } = useAppSelector((state) => state.quiz);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-white">
      <h2 className="text-4xl font-bold text-black mb-8">Quiz Completed 🎉</h2>
      <p className="text-2xl font-semibold text-black mb-8">Your Score: {score} / {questions.length}</p>
      <button 
      onClick={() => dispatch(restartQuiz())}
      className="px-6 py-3 bg-orange-400 text-black font-bold rounded-lg shadow-md hover:bg-orange-500 transition-colors">Restart Quiz</button>
    </div>
  );
}
