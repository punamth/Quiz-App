import { useAppSelector } from "./app/hooks";
import StartScreen from "./components/StartScreen";
import QuestionCard from "./components/QuestionCard";
import ResultScreen from "./components/ResultScreen";

export default function App() {
  const { quizStarted, quizCompleted } = useAppSelector((state) => state.quiz);

  return (
    <div>
      {!quizStarted && <StartScreen />}
      {quizStarted && !quizCompleted && <QuestionCard />}
      {quizCompleted && <ResultScreen />}
    </div>
  );
}
