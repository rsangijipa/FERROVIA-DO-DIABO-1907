import type { CampaignReward } from "./campaignTypes";

/* ── Restoration module → what it unlocks ─────────────────────── */

export const restorationRewards: Record<string, CampaignReward> = {
  trilhos: {
    historyChapterId: "capitulo-1",
    quizModuleId: "quiz-diplomacia",
    museumAreaId: "area-diplomacia",
    pillarImpact: "+10% Progresso Técnico",
  },
  barracoes: {
    historyChapterId: "capitulo-2",
    quizModuleId: "quiz-construcao",
    museumAreaId: "area-candelaria",
    pillarImpact: "+12% Progresso Técnico",
  },
  "material-rodante": {
    historyChapterId: "capitulo-3",
    quizModuleId: "quiz-trabalho",
    museumAreaId: "area-locomotivas",
    pillarImpact: "+10% Progresso Técnico",
  },
  "operacao-publica": {
    historyChapterId: "capitulo-4",
    quizModuleId: "quiz-economia",
    museumAreaId: "area-trilhos",
    pillarImpact: "+12% Progresso Técnico",
  },
};

/* ── History chapter → quiz it unlocks ────────────────────────── */

export const historyToQuiz: Record<string, string> = {
  "capitulo-1": "quiz-diplomacia",
  "capitulo-2": "quiz-construcao",
  "capitulo-3": "quiz-trabalho",
  "capitulo-4": "quiz-economia",
  "capitulo-5": "quiz-patrimonio",
  "capitulo-6": "quiz-patrimonio",
};

/* ── Quiz module → museum wing it unlocks ─────────────────────── */

export const quizToMuseum: Record<string, string> = {
  "quiz-diplomacia": "area-diplomacia",
  "quiz-construcao": "area-locomotivas",
  "quiz-trabalho": "area-candelaria",
  "quiz-economia": "area-construcao",
  "quiz-patrimonio": "area-reabertura",
};

/* ── Museum wing → acervo bonus (%) ───────────────────────────── */

export const museumAreaBonus: Record<string, number> = {
  "area-diplomacia": 8,
  "area-locomotivas": 8,
  "area-candelaria": 8,
  "area-construcao": 6,
  "area-trilhos": 6,
  "area-trabalhadores": 6,
  "area-borracha": 5,
  "area-ruina": 5,
  "area-reabertura": 5,
};

/* ── Museum entry → source label(s) ───────────────────────────── */

const entrySourceMap: Record<string, string[]> = {
  "museu-tratado": ["Quiz Temático"],
  "museu-porto-velho": ["Quiz Temático"],
  "museu-diplomacia-fronteira": ["Quiz Temático"],
  "museu-locomotiva-18": ["Quiz Temático"],
  "museu-litorina": ["Quiz Temático"],
  "museu-oficina-aberta": ["Restauração 2026"],
  "museu-candelaria": ["Quiz Temático"],
  "museu-quinino": ["História Interativa"],
  "museu-memoria-trabalho": ["História Interativa"],
};

/**
 * Returns human-readable unlock sources for a museum entry.
 * Supports multiple origins (e.g. "História + Quiz").
 */
export function getEntryUnlockSources(entryId: string): {
  sourceModules: string[];
  label: string;
} {
  const sources = entrySourceMap[entryId] ?? [];
  return {
    sourceModules: sources,
    label: sources.length > 0 ? sources.join(" + ") : "—",
  };
}

/**
 * Returns the requirement label for a locked museum entry.
 */
export function getEntryUnlockRequirement(entryId: string): string {
  const sources = entrySourceMap[entryId];
  if (!sources || sources.length === 0) return "Avance na campanha";
  return `Complete ${sources.join(" ou ")}`;
}
