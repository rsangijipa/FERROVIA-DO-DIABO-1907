import { historyChapters, historyScenesByChapterId } from "@/content/historyContent";
import { museumAreas } from "@/content/museumContent";
import { quizModules, quizQuestionsByModuleId } from "@/content/quizContent";
import { restorationModules } from "@/content/restorationModules";
import { artifacts } from "@/content/entities";
import { unlockRules } from "@/content/unlockRules";
import { clamp } from "@/lib/gameUtils";
import { restorationStages } from "@/lib/constants";
import type { ProgressState, Resources } from "@/types/game";
import type { PillarScores } from "./campaignTypes";

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

const totalAudioLogs = unlockRules.filter((r) => r.audioLogId).length;
const totalArtifacts = artifacts.length;
const totalCollectibles = totalAudioLogs + totalArtifacts;

/** Safely divides; returns 0 when divisor is 0 */
export const safeDivide = (numerator: number, divisor: number) =>
  divisor === 0 ? 0 : numerator / divisor;

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
  const entryUnlocked = progress.museum.unlockedEntryIds.length;
  const entryViewed = progress.museum.viewedEntryIds.length;
  const museumBase = safeDivide(entryUnlocked, totalMuseumEntries) * 60 +
                    safeDivide(entryViewed, totalMuseumEntries) * 40;

  const logsFound = progress.audioLogs.length;
  const artifactsFound = progress.foundArtifacts.length;
  const collectiblesRatio = safeDivide(logsFound + artifactsFound, totalCollectibles) * 100;

  const acervo = clamp(museumBase * 0.8 + collectiblesRatio * 0.2);

  return { tecnico, historico, conhecimento, acervo };
}
