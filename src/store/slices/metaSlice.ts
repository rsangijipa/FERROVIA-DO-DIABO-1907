import { type StateCreator } from "zustand";

import type { GameStore, MetaSlice } from "../types";

export const createMetaSlice: StateCreator<GameStore, [], [], MetaSlice> = (set) => ({
  player: {
    id: "player-local",
    name: "Curador da Memoria",
    progress: 0,
    unlockedModes: ["menu", "restauracao", "narrativa", "quiz", "codex", "resultado", "config"],
    achievements: [],
  },
  saveData: {
    version: 1,
    currentMode: "menu",
    lastUpdated: new Date().toISOString(),
  },
  globalState: "estavel",

  setMode: (mode) =>
    set((state) => ({
      saveData: {
        ...state.saveData,
        currentMode: mode,
        lastUpdated: new Date().toISOString(),
      },
    })),

  setGlobalState: (stateLevel) => set({ globalState: stateLevel }),

  addAchievement: (achievement) =>
    set((state) => {
      if (state.player.achievements.some((item) => item.id === achievement.id)) {
        return state;
      }

      return {
        player: {
          ...state.player,
          achievements: [...state.player.achievements, achievement],
        },
      };
    }),

  setPlayerProgress: (progress) =>
    set((state) => ({
      player: {
        ...state.player,
        progress,
      },
    })),
});
