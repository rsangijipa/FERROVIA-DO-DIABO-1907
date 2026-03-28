import type { CampaignDirectorState, PlaystyleProfile, ProgressState, Resources } from "@/types/game";
import { getCampaignState } from "./campaignEngine";

export function calculatePlaystyleProfile(progress: ProgressState, resources: Resources, director: CampaignDirectorState): PlaystyleProfile {
  const campaign = getCampaignState(progress, resources);
  const domPillar = campaign.dominantPillar;

  // 1. Restaurador Técnico: Foca puramente em técnica, ignora ou aceita fadiga/pressão publicamente.
  if (domPillar === "tecnico" && director.publicOpinion < 60 && director.heritageIntegrity >= 40) {
    return "restaurador_tecnico";
  }

  // 2. Curador Patrimonial: Alta integridade de acervo, conhecimento vasto, avesso a sacrificar o legado para políticos.
  if ((domPillar === "acervo" || domPillar === "historico") && director.heritageIntegrity > 75 && director.inaugurationPressure > 40) {
    return "curador_patrimonial";
  }

  // 3. Gestor Político: Opinião altíssima, confiança institucional idem, mas patrimônio vazio/raso.
  if (director.publicOpinion > 80 && director.institutionalTrust > 75 && director.heritageIntegrity < 50) {
    return "gestor_politico";
  }

  // 4. Operador de Vitrine: Muita pressa de inaugurar, pilares teóricos vazios, obra que atende mídia na hora e ruína no futuro.
  if (domPillar === "tecnico" && director.heritageIntegrity < 40 && director.publicOpinion > 60) {
    return "operador_vitrine";
  }

  // 5. Mediador Humanista: Altíssimo moral, fadiga esvaziada, sem surto de doenças (cuidou do trabalhador como Oswaldo Cruz tentou).
  if (director.sanitaryRisk < 30 && director.operationalFatigue < 40 && progress.history.bars.moral > 40) {
    return "mediador_humanista";
  }

  // 6. Executor Imprudente (O Novo Farquhar): Fez a obra no tempo, faturou progresso tecnico, mas morte e fadiga sangraram a base.
  if (domPillar === "tecnico" && director.operationalFatigue > 70 && director.sanitaryRisk > 70) {
    return "executor_imprudente";
  }

  return "indefinido";
}
