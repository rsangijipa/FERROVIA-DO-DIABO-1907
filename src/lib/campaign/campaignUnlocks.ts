import { restorationRewards } from "./campaignRewards";
import type { PillarId, PillarScores } from "./campaignTypes";

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
