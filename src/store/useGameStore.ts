import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

import { STORAGE_KEY, SAVE_VERSION } from "@/lib/storage";

import { createCodexSlice } from "./slices/codexSlice";
import { createMetaSlice } from "./slices/metaSlice";
import { createNarrativeSlice } from "./slices/narrativeSlice";
import { createQuizSlice } from "./slices/quizSlice";
import { createRestorationSlice } from "./slices/restorationSlice";
import { createSettingsSlice } from "./slices/settingsSlice";
import type { GameStore } from "./types";

export const useGameStore = create<GameStore>()(
  persist(
    (...a) => ({
      ...createMetaSlice(...a),
      ...createRestorationSlice(...a),
      ...createNarrativeSlice(...a),
      ...createQuizSlice(...a),
      ...createCodexSlice(...a),
      ...createSettingsSlice(...a),
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      version: SAVE_VERSION,
      partialize: (state) => ({
        player: state.player,
        saveData: state.saveData,
        globalState: state.globalState,
        restorationWeek: state.restorationWeek,
        restorationResources: state.restorationResources,
        locomotives: state.locomotives,
        restorationEventIndex: state.restorationEventIndex,
        restorationLog: state.restorationLog,
        restorationStatus: state.restorationStatus,
        protagonist: state.protagonist,
        sceneIndex: state.sceneIndex,
        narrativeBars: state.narrativeBars,
        narrativeFlags: state.narrativeFlags,
        narrativeHistory: state.narrativeHistory,
        queuedLatentDelta: state.queuedLatentDelta,
        narrativeStatus: state.narrativeStatus,
        quizIndex: state.quizIndex,
        quizScore: state.quizScore,
        quizAnswers: state.quizAnswers,
        quizStatus: state.quizStatus,
        rankingLocal: state.rankingLocal,
        unlockedCodexIds: state.unlockedCodexIds,
        settings: state.settings,
      }),
    },
  ),
);
