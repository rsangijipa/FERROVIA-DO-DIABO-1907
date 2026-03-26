import { restorationModules } from "@/content/restorationModules";


import type { CampaignMission } from "./campaignTypes";

/**
 * Ordered missions — the engine resolves the first one whose check() is false.
 * Fallback: when all are complete, currentMission is null → UI shows "Campanha concluída".
 */
export const campaignMissions: CampaignMission[] = [
  {
    id: "m-trilhos-start",
    title: "Iniciar diagnóstico dos Trilhos",
    check: (p) => {
      const stage = p.restoration["trilhos"]?.stage;
      return stage !== "locked" && stage !== "diagnosis";
    },
    targetModule: "restauracao2026",
    reward: "Desbloqueia Parte 1 da História",
    impact: "+8% Progresso Técnico",
  },
  {
    id: "m-trilhos-complete",
    title: "Liberar o módulo Trilhos",
    check: (p) => p.restoration["trilhos"]?.stage === "released",
    targetModule: "restauracao2026",
    reward: "Desbloqueia capítulos + Quiz Diplomacia",
    impact: "+10% Progresso Técnico",
  },
  {
    id: "m-history-ch1",
    title: "Concluir Parte 1 da História",
    check: (p) => p.history.completedChapterIds.includes("capitulo-1"),
    targetModule: "historiaInterativa",
    reward: "Libera Quiz Diplomacia e Território",
    impact: "+8% Memória Histórica",
  },
  {
    id: "m-quiz-diplomacia",
    title: "Dominar Quiz de Diplomacia",
    check: (p) => p.quiz["quiz-diplomacia"]?.status === "completed",
    targetModule: "quizTematico",
    reward: "Desbloqueia ala Diplomacia no Museu",
    impact: "+10% Conhecimento",
  },
  {
    id: "m-barracoes-complete",
    title: "Liberar módulo Barracões",
    check: (p) => p.restoration["barracoes"]?.stage === "released",
    targetModule: "restauracao2026",
    reward: "Desbloqueia Parte 2 + Quiz Construção",
    impact: "+12% Progresso Técnico",
  },
  {
    id: "m-history-ch2",
    title: "Concluir Parte 2 da História",
    check: (p) => p.history.completedChapterIds.includes("capitulo-2"),
    targetModule: "historiaInterativa",
    reward: "Libera Quiz Construção e Engenharia",
    impact: "+8% Memória Histórica",
  },
  {
    id: "m-quiz-construcao",
    title: "Dominar Quiz de Construção",
    check: (p) => p.quiz["quiz-construcao"]?.status === "completed",
    targetModule: "quizTematico",
    reward: "Desbloqueia ala Locomotivas no Museu",
    impact: "+10% Conhecimento",
  },
  {
    id: "m-full-revitalization",
    title: "Concluir a Revitalização da EFMM",
    check: (p, r) => {
      const allReleased = restorationModules.every(
        (mod) => p.restoration[mod.id]?.stage === "released",
      );
      const avgResource =
        (r.orcamento + r.moral + r.saudeSanitaria + r.progressoTecnico + r.preservacao) / 5;
      return allReleased && avgResource >= 50;
    },
    targetModule: "resultadoIntegrado",
    reward: "Perfil final + dossiê da campanha",
    impact: "Abertura da EFMM 2026",
  },
];
