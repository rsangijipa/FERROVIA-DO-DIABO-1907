import type { ProgressState, Resources } from "@/types/game";
import { campaignMissions } from "./campaignMissions";
import type { CampaignState, PillarId } from "./campaignTypes";
import { PILLAR_WEIGHTS } from "./campaignTypes";
import { getPillarScores } from "./campaignPillars";

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
