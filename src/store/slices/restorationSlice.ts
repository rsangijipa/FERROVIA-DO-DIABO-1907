import { type StateCreator } from "zustand";

import { restorationEvents } from "@/content/restorationEvents";
import { applyResourceDelta, stateFromResources } from "@/lib/gameUtils";
import type { LocomotiveAsset, Resources } from "@/types/game";

import type { GameStore, RestorationSlice } from "../types";

const initialResources: Resources = {
  orcamento: 70,
  moral: 70,
  saudeSanitaria: 70,
  progressoTecnico: 70,
  preservacao: 70,
};

const initialLocomotives: LocomotiveAsset[] = [
  {
    id: "loco-18",
    name: "Locomotiva 18",
    restorationLevel: 35,
    status: "restauro",
    requirements: ["caldeira", "rodagem", "freio"],
  },
  {
    id: "loco-50",
    name: "Locomotiva 50",
    restorationLevel: 20,
    status: "critico",
    requirements: ["chassi", "fornalha", "valvulas"],
  },
];

export const createRestorationSlice: StateCreator<GameStore, [], [], RestorationSlice> = (
  set,
  get,
) => ({
  restorationWeek: 1,
  restorationResources: initialResources,
  locomotives: initialLocomotives,
  restorationEventIndex: 0,
  restorationLog: [],
  restorationStatus: "ongoing",

  resolveRestorationChoice: (choiceId) => {
    const state = get();
    const event = restorationEvents[state.restorationEventIndex];
    if (!event || state.restorationStatus !== "ongoing") {
      return { ok: false, message: "Modo restauração já concluído." };
    }

    const choice = event.choices.find((item) => item.id === choiceId);
    if (!choice) {
      return { ok: false, message: "Escolha inválida." };
    }

    const nextResources = applyResourceDelta(state.restorationResources, choice.consequence.resources);
    const globalState = stateFromResources(nextResources);
    const nextWeek = state.restorationWeek + 1;
    const lastEvent = state.restorationEventIndex >= restorationEvents.length - 1;

    if (choice.consequence.unlocks) {
      choice.consequence.unlocks.forEach((id) => state.unlockCodex(id));
    }

    set({
      restorationResources: nextResources,
      globalState,
      restorationWeek: nextWeek,
      restorationEventIndex: Math.min(state.restorationEventIndex + 1, restorationEvents.length - 1),
      restorationLog: [...state.restorationLog, `${event.title}: ${choice.consequence.text}`],
      saveData: {
        ...state.saveData,
        lastUpdated: new Date().toISOString(),
      },
    });

    const collapse = Object.values(nextResources).some((value) => value <= 0);
    if (collapse) {
      set({ restorationStatus: "lost" });
      return { ok: true, message: "Colapso sistêmico no restauro." };
    }

    if (lastEvent) {
      set({ restorationStatus: "won" });
      return { ok: true, message: "Ciclo de restauração concluído." };
    }

    return { ok: true, message: choice.consequence.text };
  },

  evaluateRestorationEnding: () => {
    const r = get().restorationResources;
    const score = (r.preservacao + r.progressoTecnico + r.moral + r.saudeSanitaria + r.orcamento) / 5;
    if (score >= 65) return "bom";
    if (score >= 40) return "mediano";
    return "ruim";
  },

  resetRestoration: () => {
    const state = get();
    set({
      restorationWeek: 1,
      restorationResources: initialResources,
      locomotives: initialLocomotives,
      restorationEventIndex: 0,
      restorationLog: [],
      restorationStatus: "ongoing",
      globalState: "estavel",
      saveData: {
        ...state.saveData,
        lastUpdated: new Date().toISOString(),
      },
    });
  },
});
