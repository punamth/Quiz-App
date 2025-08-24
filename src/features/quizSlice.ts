import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
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
  loading: boolean;
  error: string | null;
  answeredQuestions: number[]; // Track which questions have been answered
}

const decodeHTML = (str: string) =>
  str
    .replace(/&quot;/g, '"')
    .replace(/&#039;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");

// Utility function to shuffle options
const shuffleArray = (array: string[]) =>
  [...array].sort(() => Math.random() - 0.5);

// createAsyncThunk for API call
export const fetchQuestions = createAsyncThunk<Question[]>(
  "quiz/fetchQuestions",
  async () => {
    const res = await fetch(
      "https://opentdb.com/api.php?amount=10&category=18&difficulty=easy&type=multiple"
    );
    if (!res.ok) throw new Error("Failed to fetch questions");

    const data = await res.json();

    return data.results.map((q: any, index: number) => {
      const options = shuffleArray([
        ...q.incorrect_answers.map((opt: string) => decodeHTML(opt)),
        decodeHTML(q.correct_answer),
      ]);

      return {
        id: index,
        question: decodeHTML(q.question),
        options,
        answer: decodeHTML(q.correct_answer),
      };
    });
  }
);

const initialState: QuizState = {
  questions: [],
  currentQuestionIndex: 0,
  selectedAnswer: null,
  score: 0,
  quizStarted: false,
  quizCompleted: false,
  loading: false,
  error: null,
  answeredQuestions: [],
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
      state.answeredQuestions = [];
      state.selectedAnswer = null;
    },
    selectAnswer: (state, action: PayloadAction<string>) => {
      state.selectedAnswer = action.payload;
    },
    nextQuestion: (state) => {
      const currentQ = state.questions[state.currentQuestionIndex];
      
      // Only process if an answer is selected and question hasn't been answered before
      if (state.selectedAnswer && !state.answeredQuestions.includes(state.currentQuestionIndex)) {
        if (state.selectedAnswer === currentQ.answer) {
          state.score += 1;
        }
        state.answeredQuestions.push(state.currentQuestionIndex);
      }
      
      state.selectedAnswer = null;
      
      if (state.currentQuestionIndex < state.questions.length - 1) {
        state.currentQuestionIndex += 1;
      } else {
        state.quizCompleted = true;
      }
    },
    goToPreviousQuestion: (state) => {
      if (state.currentQuestionIndex > 0) {
        state.currentQuestionIndex -= 1;
        state.selectedAnswer = null;
      }
    },
    goToQuestion: (state, action: PayloadAction<number>) => {
      const questionIndex = action.payload;
      if (questionIndex >= 0 && questionIndex < state.questions.length) {
        state.currentQuestionIndex = questionIndex;
        state.selectedAnswer = null;
      }
    },
    restartQuiz: (state) => {
      state.quizStarted = false;
      state.currentQuestionIndex = 0;
      state.score = 0;
      state.selectedAnswer = null;
      state.quizCompleted = false;
      state.answeredQuestions = [];
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchQuestions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchQuestions.fulfilled, (state, action) => {
        state.loading = false;
        state.questions = action.payload;
        state.quizStarted = true; // Auto-start quiz when questions are loaded
      })
      .addCase(fetchQuestions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Something went wrong";
      });
  },
});

export const { 
  startQuiz, 
  selectAnswer, 
  nextQuestion, 
  goToPreviousQuestion,
  goToQuestion,
  restartQuiz 
} = quizSlice.actions;

export default quizSlice.reducer;