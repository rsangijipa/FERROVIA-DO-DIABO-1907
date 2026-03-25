import { type StateCreator } from "zustand";

import { starterCodexIds } from "@/content/codexEntries";

import type { CodexSlice, GameStore } from "../types";

export const createCodexSlice: StateCreator<GameStore, [], [], CodexSlice> = (set) => ({
  unlockedCodexIds: starterCodexIds,
  unlockCodex: (id) =>
    set((state) => {
      if (state.unlockedCodexIds.includes(id)) return state;
      return {
        unlockedCodexIds: [...state.unlockedCodexIds, id],
      };
    }),
});
