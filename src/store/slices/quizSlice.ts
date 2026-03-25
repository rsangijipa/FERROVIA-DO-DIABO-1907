import { type StateCreator } from "zustand";

import { quizQuestions } from "@/content/quizQuestions";

import type { GameStore, QuizSlice } from "../types";

export const createQuizSlice: StateCreator<GameStore, [], [], QuizSlice> = (set, get) => ({
  quizIndex: 0,
  quizScore: 0,
  quizAnswers: [],
  quizFeedback: null,
  quizStatus: "ongoing",
  rankingLocal: [],

  answerQuiz: (chosenIndex) => {
    const state = get();
    const question = quizQuestions[state.quizIndex];
    if (!question || state.quizStatus !== "ongoing") {
      return null;
    }

    const correct = chosenIndex === question.correctIndex;
    const nextScore = correct ? state.quizScore + 1 : state.quizScore;

    if (question.rewardUnlockId && correct) {
      state.unlockCodex(question.rewardUnlockId);
    }

    set({
      quizScore: nextScore,
      quizFeedback: question.explanation,
      quizAnswers: [
        ...state.quizAnswers,
        { questionId: question.id, chosenIndex, correct },
      ],
      saveData: {
        ...state.saveData,
        lastUpdated: new Date().toISOString(),
      },
    });

    return { correct, explanation: question.explanation };
  },

  nextQuiz: () => {
    const state = get();
    if (state.quizStatus !== "ongoing") return;

    if (state.quizIndex >= quizQuestions.length - 1) {
      const nextRanking = [...state.rankingLocal, state.quizScore].sort((a, b) => b - a).slice(0, 5);
      set({
        quizStatus: "finished",
        rankingLocal: nextRanking,
        quizFeedback: null,
      });
      return;
    }

    set({
      quizIndex: state.quizIndex + 1,
      quizFeedback: null,
    });
  },

  resetQuiz: () =>
    set({
      quizIndex: 0,
      quizScore: 0,
      quizAnswers: [],
      quizFeedback: null,
      quizStatus: "ongoing",
    }),
});
