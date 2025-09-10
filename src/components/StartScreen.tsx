import { useAppDispatch } from "../app/hooks";
import { startQuiz } from "../features/quizSlice";

export default function StartScreen() {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full">
      <h1 className="text-4xl font-bold text-black dark:text-white mb-8">
        Welcome to the Quiz!
      </h1>
      <button
        onClick={() => dispatch(startQuiz())}
        className="text-2xl px-6 py-3 bg-orange-400 text-black font-semibold rounded-lg shadow-md hover:bg-orange-500 transition-colors"
      >
        Start
      </button>
    </div>
  );
}