import { configureStore } from "@reduxjs/toolkit";
import quizReducer from "../features/quizSlice";

export const store = configureStore({
  reducer: {
    quiz: quizReducer,
  },
});

// Types for RootState & AppDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
