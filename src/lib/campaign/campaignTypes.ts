import type { ModeId } from "@/types/game";

/* ── Pillar scores (always 0–100) ─────────────────────────────── */

export interface PillarScores {
  /** Restoration stage progress + resources.progressoTecnico */
  tecnico: number;
  /** Completed scenes/chapters + narrative bars */
  historico: number;
  /** Quiz correct / total */
  conhecimento: number;
  /** Museum unlocked + viewed entries */
  acervo: number;
}

export type PillarId = keyof PillarScores;

export const PILLAR_WEIGHTS: Record<PillarId, number> = {
  tecnico: 0.35,
  historico: 0.25,
  conhecimento: 0.2,
  acervo: 0.2,
};

export const PILLAR_LABELS: Record<PillarId, string> = {
  tecnico: "Progresso Técnico",
  historico: "Memória Histórica",
  conhecimento: "Conhecimento",
  acervo: "Acervo do Museu",
};

export const PILLAR_COLORS: Record<PillarId, string> = {
  tecnico: "--color-rust",
  historico: "--color-latao",
  conhecimento: "--color-info",
  acervo: "--color-success",
};

/* ── Unlock source (supports multiple origins) ────────────────── */

export interface UnlockSource {
  /** e.g. ["História Interativa", "Quiz Temático"] */
  sourceModules: string[];
  /** Ready-to-render label, e.g. "História + Quiz" */
  label: string;
}

/* ── Campaign reward chain ────────────────────────────────────── */

export interface CampaignReward {
  historyChapterId?: string;
  quizModuleId?: string;
  museumAreaId?: string;
  /** Short label for UI e.g. "+10% Progresso Técnico" */
  pillarImpact: string;
}

/* ── Mission ──────────────────────────────────────────────────── */

export interface CampaignMission {
  id: string;
  title: string;
  /** Pure predicate – true when this mission is done */
  check: (progress: import("@/types/game").ProgressState, resources: import("@/types/game").Resources) => boolean;
  targetModule: ModeId;
  reward: string;
  impact: string;
}

/* ── Full campaign state returned by getCampaignState() ─────── */

export interface CampaignState {
  currentMission: CampaignMission | null;
  completedMissions: CampaignMission[];
  nextUnlock: string | null;
  recommendedModule: ModeId;
  pillarScores: PillarScores;
  overallProgress: number;
  dominantPillar: PillarId;
}
