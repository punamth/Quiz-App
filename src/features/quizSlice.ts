import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface Question {
  id: number;
  question: string;
  options: string[];
  answer: string;
}

interface QuizState {
  questions: Question[];
  currentQuestionIndex: number;
  selectedAnswer: string | null;
  score: number;
  quizStarted: boolean;
  quizCompleted: boolean;
}

const initialState: QuizState = {
  questions: [
    { id: 1, question: "1. What is React?", options: ["Library", "Framework", "Language"], answer: "Library" },
    { id: 2, question: "2. Redux is used for?", options: ["Styling", "State Management", "Animations"], answer: "State Management" },
    { id: 3, question: "3. JSX stands for?", options: ["Java Syntax Extension", "JavaScript XML", "JSON Syntax"], answer: "JavaScript XML" },
  ],
  currentQuestionIndex: 0,
  selectedAnswer: null,
  score: 0,
  quizStarted: false,
  quizCompleted: false,
};

const quizSlice = createSlice({
  name: "quiz",
  initialState,
  reducers: {
    startQuiz: (state) => {
      state.quizStarted = true;
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.quizCompleted = false;
    },
    selectAnswer: (state, action: PayloadAction<string>) => {
      state.selectedAnswer = action.payload;
    },
    nextQuestion: (state) => {
      const currentQ = state.questions[state.currentQuestionIndex];
      if (state.selectedAnswer === currentQ.answer) {
        state.score += 1;
      }
      state.selectedAnswer = null;
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        state.quizCompleted = true;
      }
    },
    restartQuiz: (state) => {
      state.quizStarted = false;
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.selectedAnswer = null;
      state.quizCompleted = false;
    },
  },
});

export const { startQuiz, selectAnswer, nextQuestion, restartQuiz } = quizSlice.actions;
export default quizSlice.reducer;
