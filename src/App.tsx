import { useAppSelector } from "./app/hooks";
import StartScreen from "./components/StartScreen";
import QuestionCard from "./components/QuestionCard";
import ResultScreen from "./components/ResultScreen";
import { useDarkMode } from "./app/useDarkMode"; 

export default function App() {
  const { quizStarted, quizCompleted } = useAppSelector((state) => state.quiz);
  const { isDark, toggle } = useDarkMode();

  return (
    <div className="h-screen bg-white text-black dark:bg-gray-700 dark:text-white transition-colors flex flex-col overflow-hidden">
      {/* Header with dark mode toggle */}
      <header className="p-2 flex justify-end flex-shrink-0">
        <button
          onClick={toggle}
          className="px-2 py-2 rounded-lg bg-white dark:bg-gray-700 text-black dark:text-white transition-colors"
        >
          {isDark ? "☀️" : "🌙"}
        </button>
      </header>

      {/* Screens controlled by Redux state */}
      <main className="flex-1 flex justify-center items-center overflow-hidden">
        {!quizStarted && <StartScreen />}
        {quizStarted && !quizCompleted && <QuestionCard />}
        {quizCompleted && <ResultScreen />}
      </main>
    </div>
  );
}