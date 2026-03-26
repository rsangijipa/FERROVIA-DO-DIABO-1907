import type { ModeId, RestorationStage } from "@/types/game";

export const restorationStages: RestorationStage[] = [
  "locked",
  "diagnosis",
  "prioritization",
  "contracting",
  "restoration",
  "validation",
  "released",
];

/**
 * Valid letters for multiple-choice options in NarrativeMode and QuizMode.
 * Max supported choices visually is 4 (A, B, C, D).
 */
export const choiceLetters = ["A", "B", "C", "D"] as const;

export interface ModeRouteDef {
  id: ModeId;
  href: string;
  label: string;
  shortLabel: string;
}

export const modeRoutes: ModeRouteDef[] = [
  { id: "restauracao2026", href: "/restauracao-2026", label: "Restauração", shortLabel: "Restauro" },
  { id: "historiaInterativa", href: "/historia-interativa", label: "História", shortLabel: "História" },
  { id: "quizTematico", href: "/quiz-tematico", label: "Quiz", shortLabel: "Quiz" },
  { id: "museuVivo", href: "/museu-vivo", label: "Museu", shortLabel: "Museu" },
  { id: "resultadoIntegrado", href: "/resultado-integrado", label: "Resultado", shortLabel: "Resultado" },
  { id: "config", href: "/config", label: "Configurações", shortLabel: "Config" },
];
