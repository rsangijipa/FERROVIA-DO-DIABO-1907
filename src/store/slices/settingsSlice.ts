import { type StateCreator } from "zustand";

import type { GameStore, SettingsSlice } from "../types";

export const createSettingsSlice: StateCreator<GameStore, [], [], SettingsSlice> = (set) => ({
  settings: {
    fontScale: 1,
    highContrast: false,
    reducedMotion: false,
    soundEnabled: true,
  },
  setFontScale: (scale) =>
    set((state) => ({
      settings: {
        ...state.settings,
        fontScale: Math.min(1.3, Math.max(0.9, scale)),
      },
    })),
  toggleHighContrast: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        highContrast: !state.settings.highContrast,
      },
    })),
  toggleReducedMotion: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        reducedMotion: !state.settings.reducedMotion,
      },
    })),
  toggleSound: () =>
    set((state) => ({
      settings: {
        ...state.settings,
        soundEnabled: !state.settings.soundEnabled,
      },
    })),
});
