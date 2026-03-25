import { type StateCreator } from "zustand";

import { narrativeScenes } from "@/content/narrativeScenes";
import { clamp } from "@/lib/gameUtils";
import type { NarrativeBars } from "@/types/game";

import type { GameStore, NarrativeSlice } from "../types";

const initialBars: NarrativeBars = {
  saude: 70,
  moral: 70,
  progresso: 70,
};

const applyBarsDelta = (bars: NarrativeBars, delta: Partial<NarrativeBars>) => ({
  saude: clamp(bars.saude + (delta.saude ?? 0)),
  moral: clamp(bars.moral + (delta.moral ?? 0)),
  progresso: clamp(bars.progresso + (delta.progresso ?? 0)),
});

export const createNarrativeSlice: StateCreator<GameStore, [], [], NarrativeSlice> = (
  set,
  get,
) => ({
  protagonist: null,
  sceneIndex: 0,
  narrativeBars: initialBars,
  narrativeFlags: {},
  narrativeHistory: [],
  pendingConsequence: null,
  queuedLatentDelta: null,
  narrativeStatus: "ongoing",

  chooseProtagonist: (protagonist) => set({ protagonist }),

  chooseNarrativeChoice: (choiceId) => {
    const state = get();
    const scene = narrativeScenes[state.sceneIndex];
    if (!scene || state.narrativeStatus !== "ongoing") {
      return { ok: false, message: "Campanha já finalizada." };
    }

    const eligibleChoices = scene.choices.filter((choice) => {
      const hasRequired = !choice.requiredFlags?.length ||
        choice.requiredFlags.every((flag) => state.narrativeFlags[flag]);
      const hasForbidden = (choice as unknown as { blockedFlags?: string[] }).blockedFlags?.some(
        (flag) => state.narrativeFlags[flag],
      );
      if (scene.id === "n-02" && choice.id.startsWith("n-02-c")) {
        return !state.narrativeFlags.isolated_sick;
      }
      if (scene.id === "n-02" && choice.id.startsWith("n-02-d")) {
        return !state.narrativeFlags.isolated_sick;
      }
      return hasRequired && !hasForbidden;
    });

    const choice = eligibleChoices.find((item) => item.id === choiceId);
    if (!choice) {
      return { ok: false, message: "Escolha indisponível para este estado." };
    }

    let nextBars = applyBarsDelta(state.narrativeBars, choice.delta);
    if (state.queuedLatentDelta) {
      nextBars = applyBarsDelta(nextBars, state.queuedLatentDelta);
    }

    const nextFlags = { ...state.narrativeFlags };
    choice.setFlags?.forEach((flag) => {
      nextFlags[flag] = true;
    });

    choice.unlocks?.forEach((id) => state.unlockCodex(id));

    set({
      narrativeBars: nextBars,
      narrativeFlags: nextFlags,
      narrativeHistory: [...state.narrativeHistory, choice.id],
      pendingConsequence: choice.consequence,
      queuedLatentDelta: choice.latentDelta ?? null,
      saveData: {
        ...state.saveData,
        lastUpdated: new Date().toISOString(),
      },
    });

    if (nextBars.moral <= 0 || nextBars.saude <= 0 || nextBars.progresso <= 0) {
      set({ narrativeStatus: "lost" });
      return { ok: true, message: "Uma barra crítica colapsou." };
    }

    return { ok: true, message: choice.consequence };
  },

  advanceNarrative: () => {
    const state = get();
    if (state.narrativeStatus !== "ongoing") return;

    const isLast = state.sceneIndex >= narrativeScenes.length - 1;
    if (isLast) {
      set({ narrativeStatus: "won", pendingConsequence: null });
      return;
    }

    set({
      sceneIndex: state.sceneIndex + 1,
      pendingConsequence: null,
    });
  },

  resetNarrative: () => {
    const state = get();
    set({
      protagonist: null,
      sceneIndex: 0,
      narrativeBars: initialBars,
      narrativeFlags: {},
      narrativeHistory: [],
      pendingConsequence: null,
      queuedLatentDelta: null,
      narrativeStatus: "ongoing",
      saveData: {
        ...state.saveData,
        lastUpdated: new Date().toISOString(),
      },
    });
  },
});
