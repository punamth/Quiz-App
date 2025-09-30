import { useAppDispatch } from "../app/hooks";
import { startQuiz } from "../features/quizSlice";

export default function StartScreen() {
  const dispatch = useAppDispatch();

  return (
    <div className="flex flex-col items-center justify-center h-full w-full px-4">
      <h1 className="text-3xl sm:text-4xl font-bold text-black dark:text-white mb-6 sm:mb-8 text-center">
        Welcome to the Quiz!
      </h1>
      <button
        onClick={() => dispatch(startQuiz())}
        className="text-lg sm:text-2xl px-5 sm:px-6 py-2.5 sm:py-3 bg-orange-400 text-black font-semibold rounded-lg shadow-md hover:bg-orange-500 transition-colors"
      >
        Start
      </button>
    </div>
  );
}