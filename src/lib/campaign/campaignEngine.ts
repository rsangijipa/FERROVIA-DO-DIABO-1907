import { historyChapters, historyScenesByChapterId } from "@/content/historyContent";
import { museumAreas } from "@/content/museumContent";
import { quizModules, quizQuestionsByModuleId } from "@/content/quizContent";
import { restorationModules } from "@/content/restorationModules";
import { clamp } from "@/lib/gameUtils";
import type { ProgressState, Resources, RestorationStage } from "@/types/game";

import { campaignMissions } from "./campaignMissions";
import { restorationRewards } from "./campaignRewards";
import type {
  CampaignState,
  PillarId,
  PillarScores,
} from "./campaignTypes";
import { PILLAR_WEIGHTS } from "./campaignTypes";

/* ── Constants ────────────────────────────────────────────────── */

const restorationStages: RestorationStage[] = [
  "locked",
  "diagnosis",
  "prioritization",
  "contracting",
  "restoration",
  "validation",
  "released",
];

const availableHistoryChapters = historyChapters.filter((ch) => ch.status === "available");
const availableQuizModules = quizModules.filter((m) => m.status === "available");

const totalHistoryScenes = availableHistoryChapters.reduce(
  (n, ch) => n + (historyScenesByChapterId[ch.id]?.length ?? 0),
  0,
);

const totalQuizQuestions = availableQuizModules.reduce(
  (n, m) => n + (quizQuestionsByModuleId[m.id]?.length ?? 0),
  0,
);

const totalMuseumEntries = museumAreas
  .filter((a) => a.status === "available")
  .reduce((n, a) => n + a.entryIds.length, 0);

/* ── Helpers ──────────────────────────────────────────────────── */

/** Safely divides; returns 0 when divisor is 0 */
const safeDivide = (numerator: number, divisor: number) =>
  divisor === 0 ? 0 : numerator / divisor;

/* ── Pillar scores ────────────────────────────────────────────── */

/**
 * Derives the 4 campaign pillars from current progress + resources.
 *
 * **tecnico** ← restoration stage progress (60%) + resources.progressoTecnico (40%)
 * **historico** ← completed scenes ratio (70%) + avg narrative bars (30%)
 * **conhecimento** ← quiz correct / total questions
 * **acervo** ← museum unlocked (60%) + viewed (40%)
 *
 * All values clamped 0–100. All divisions zero-safe.
 */
export function getPillarScores(
  progress: ProgressState,
  resources: Resources,
): PillarScores {
  // tecnico
  const stageProgress = restorationModules.reduce((acc, mod) => {
    const idx = restorationStages.indexOf(progress.restoration[mod.id]?.stage ?? "locked");
    return acc + safeDivide(idx, restorationStages.length - 1);
  }, 0);
  const stageAvg = safeDivide(stageProgress, restorationModules.length) * 100;
  const tecnico = clamp(stageAvg * 0.6 + resources.progressoTecnico * 0.4);

  // historico
  const scenesRatio = safeDivide(progress.history.completedSceneIds.length, totalHistoryScenes) * 100;
  const barsAvg =
    (progress.history.bars.saude + progress.history.bars.moral + progress.history.bars.progresso) / 3;
  const historico = clamp(scenesRatio * 0.7 + barsAvg * 0.3);

  // conhecimento
  const quizCorrect = availableQuizModules.reduce(
    (acc, m) => acc + (progress.quiz[m.id]?.correct ?? 0),
    0,
  );
  const conhecimento = clamp(safeDivide(quizCorrect, totalQuizQuestions) * 100);

  // acervo
  const unlocked = progress.museum.unlockedEntryIds.length;
  const viewed = progress.museum.viewedEntryIds.length;
  const acervo = clamp(
    safeDivide(unlocked, totalMuseumEntries) * 60 +
      safeDivide(viewed, totalMuseumEntries) * 40,
  );

  return { tecnico, historico, conhecimento, acervo };
}

/* ── Campaign state ───────────────────────────────────────────── */

export function getCampaignState(
  progress: ProgressState,
  resources: Resources,
): CampaignState {
  const pillarScores = getPillarScores(progress, resources);

  // Overall progress (weighted)
  const overallProgress = Math.round(
    pillarScores.tecnico * PILLAR_WEIGHTS.tecnico +
      pillarScores.historico * PILLAR_WEIGHTS.historico +
      pillarScores.conhecimento * PILLAR_WEIGHTS.conhecimento +
      pillarScores.acervo * PILLAR_WEIGHTS.acervo,
  );

  // Dominant pillar
  const pillarEntries: [PillarId, number][] = [
    ["tecnico", pillarScores.tecnico],
    ["historico", pillarScores.historico],
    ["conhecimento", pillarScores.conhecimento],
    ["acervo", pillarScores.acervo],
  ];
  const dominantPillar = pillarEntries.reduce((best, curr) =>
    curr[1] > best[1] ? curr : best,
  )[0];

  // Missions
  const completedMissions = campaignMissions.filter((m) => m.check(progress, resources));
  const currentMission = campaignMissions.find((m) => !m.check(progress, resources)) ?? null;

  // Next unlock
  const nextUnlock = currentMission?.reward ?? null;

  // Recommended module
  const recommendedModule = currentMission?.targetModule ?? "resultadoIntegrado";

  return {
    currentMission,
    completedMissions,
    nextUnlock,
    recommendedModule,
    pillarScores,
    overallProgress,
    dominantPillar,
  };
}

/* ── Reward helpers for UI labels ─────────────────────────────── */

/**
 * Returns rewards unlocked by completing a restoration module.
 */
export function getRewardsForModule(moduleId: string) {
  return restorationRewards[moduleId] ?? null;
}

/**
 * Returns a campaign-level reading text for the Resultado page.
 * Considers dominant pillar, weakest pillar, and overall progress.
 */
export function getCampaignReading(pillarScores: PillarScores, overallProgress: number) {
  const entries: [PillarId, number][] = [
    ["tecnico", pillarScores.tecnico],
    ["historico", pillarScores.historico],
    ["conhecimento", pillarScores.conhecimento],
    ["acervo", pillarScores.acervo],
  ];

  const dominant = entries.reduce((a, b) => (b[1] > a[1] ? b : a));
  const weakest = entries.reduce((a, b) => (b[1] < a[1] ? b : a));

  const pillarLabels: Record<PillarId, string> = {
    tecnico: "restauração técnica",
    historico: "memória histórica",
    conhecimento: "conhecimento validado",
    acervo: "curadoria do acervo",
  };

  if (overallProgress >= 75) {
    return `A campanha de revitalização alcançou excelência. Sua força principal foi ${pillarLabels[dominant[0]]}, sustentando a abertura da EFMM com profundidade.`;
  }
  if (overallProgress >= 50) {
    return `A revitalização avançou com consistência, liderada por ${pillarLabels[dominant[0]]}. Para consolidar, invista em ${pillarLabels[weakest[0]]}, que ficou abaixo do ideal.`;
  }
  if (overallProgress >= 25) {
    return `A campanha ainda está em formação. O pilar mais forte é ${pillarLabels[dominant[0]]}, mas ${pillarLabels[weakest[0]]} precisa de atenção imediata para viabilizar a abertura.`;
  }
  return `A revitalização mal começou. Concentre-se em ${pillarLabels[dominant[0]]} para ganhar tração e depois avance nos demais pilares.`;
}
