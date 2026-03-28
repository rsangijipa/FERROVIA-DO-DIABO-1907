import type { CampaignDirectorState, Incident, DynamicObjective, ProgressState, Resources } from "@/types/game";
import { getCampaignState } from "./campaignEngine";

const INCIDENT_POOL: Incident[] = [
  {
    id: "surto_malaria_2026",
    type: "sanitario",
    title: "Surto Localizado e Clima Úmido",
    description: "O risco sanitário ultrapassou o limite tolerável. Um surto afasta restauradores e ameaça a linha do tempo do projeto.",
    options: [
      {
        id: "surto_op_1",
        label: "Desviar orçamento para intervenção de saúde rápida",
        consequence: "Perda orçamentária, mas restaura a saúde e moral.",
        resourceDelta: { orcamento: -15, moral: 10, saudeSanitaria: 25 },
        directorDelta: { sanitaryRisk: -40, publicOpinion: 10, operationalFatigue: -10 },
      },
      {
        id: "surto_op_2",
        label: "Manter o ritmo com a equipe base restante",
        consequence: "Corte severo de moral e risco à frente operacional. Atrasos a caminho.",
        resourceDelta: { moral: -20, progressoTecnico: -15 },
        directorDelta: { operationalFatigue: 30, institutionalTrust: -15, publicOpinion: -10 },
      },
    ],
  },
  {
    id: "pressao_politica_inaugural",
    type: "politico",
    title: "Pressão por Inauguração Precoce",
    description: "Visitas de autoridades no estado estão exigindo a liberação antecipada de módulos não finalizados.",
    options: [
      {
        id: "politico_op_1",
        label: "Ceder à pressa",
        consequence: "Ganha muita confiança política, mas o patrimônio sofre riscos técnicos estruturais.",
        resourceDelta: { preservacao: -20, progressoTecnico: 10 },
        directorDelta: { institutionalTrust: 30, inaugurationPressure: -50, heritageIntegrity: -25 },
      },
      {
        id: "politico_op_2",
        label: "Blindar o canteiro (Priorizar Acervo)",
        consequence: "O patrimônio é protegido, mas o orçamento de repasses perde suporte.",
        resourceDelta: { orcamento: -20, preservacao: 15 },
        directorDelta: { institutionalTrust: -25, publicOpinion: 15, inaugurationPressure: 10 },
      },
    ],
  },
  {
    id: "desgaste_trabalhador",
    type: "equipe",
    title: "Exaustão Operacional e Greve Branca",
    description: "A fadiga de campo passou dos limites (Estilo Farquhar). Houve paralisação parcial por segurança.",
    options: [
      {
        id: "equipe_op_1",
        label: "Aumentar folgas e contratar apoio",
        consequence: "Queda imediata de orçamento e pausa no avanço, mas resgata confiança e fôlego humano.",
        resourceDelta: { orcamento: -20, moral: 25, progressoTecnico: -5 },
        directorDelta: { operationalFatigue: -50, sanitaryRisk: -10, publicOpinion: 5 },
      },
      {
        id: "equipe_op_2",
        label: "Exigir cumprimento de metas",
        consequence: "A obra não para, mas o moral desaba assustadoramente.",
        resourceDelta: { moral: -30 },
        directorDelta: { operationalFatigue: 20, sanitaryRisk: 20, publicOpinion: -20 },
      },
    ],
  },
  {
    id: "deterioracao_monumento",
    type: "tecnico",
    title: "Deterioração Histórica Agravada",
    description: "A integridade do acervo físico caiu substancialmente. Imprensa e ativistas cobram o Ministério Público.",
    options: [
      {
        id: "monumento_op_1",
        label: "Reter avanço para um super-restauro corretivo",
        consequence: "Lentidão técnica garantida, mas recupera aplausos de historiadores e a integridade.",
        resourceDelta: { preservacao: 30, progressoTecnico: -25 },
        directorDelta: { heritageIntegrity: 40, institutionalTrust: 15, operationalFatigue: 15 },
      },
      {
        id: "monumento_op_2",
        label: "Tapar com soluções estéticas de curto prazo",
        consequence: "Salva o cronograma de vitrine, mas enterra o sentido do patrimônio de raiz.",
        resourceDelta: { progressoTecnico: 10, preservacao: -35 },
        directorDelta: { publicOpinion: -30, institutionalTrust: 10, heritageIntegrity: -20 },
      },
    ],
  },
];

export function calculateDirectorRisks(director: CampaignDirectorState): CampaignDirectorState {
  const nextDirector = { ...director };

  // Avança o turno local do diretor
  nextDirector.currentWeek += 1;

  // Se não houver incidente ativo, verifica se deve triggar.
  if (!nextDirector.activeIncident) {
    if (nextDirector.sanitaryRisk > 75 && Math.random() > 0.3) {
      nextDirector.activeIncident = INCIDENT_POOL.find((i) => i.id === "surto_malaria_2026") ?? null;
    } else if (nextDirector.inaugurationPressure > 80 && Math.random() > 0.4) {
      nextDirector.activeIncident = INCIDENT_POOL.find((i) => i.id === "pressao_politica_inaugural") ?? null;
    } else if (nextDirector.operationalFatigue > 85 && Math.random() > 0.3) {
      nextDirector.activeIncident = INCIDENT_POOL.find((i) => i.id === "desgaste_trabalhador") ?? null;
    } else if (nextDirector.heritageIntegrity < 35 && Math.random() > 0.5) {
      nextDirector.activeIncident = INCIDENT_POOL.find((i) => i.id === "deterioracao_monumento") ?? null;
    }
  }

  return nextDirector;
}

export function buildDynamicObjective(director: CampaignDirectorState, progress: ProgressState, resources: Resources): DynamicObjective {
  const campaign = getCampaignState(progress, resources);
  
  if (director.sanitaryRisk > 60) {
    return {
      title: "Alerta Sanitário Preemente",
      primaryRisk: "Epidemia e interdição do canteiro",
      recommendedAction: "Resolver impasses históricos ou gastar recursos em isolamento para amenizar surto (Acesse História Interativa)",
      consequenceIfIgnored: "Risco de +30 em Fadiga e Evento de Crise",
      targetModuleId: "historiaInterativa"
    };
  }

  if (director.inaugurationPressure > 70) {
    return {
      title: "Cobrança de Lançamento Ativa",
      primaryRisk: "Perda de subsídios e confiança institucional",
      recommendedAction: "Avançar urgentemente pilares Técnicos da Restauração para entregar etapa na mídia.",
      consequenceIfIgnored: "Risco altíssimo de intervenção política na integridade.",
      targetModuleId: "restauracao2026"
    };
  }

  if (director.heritageIntegrity < 50) {
    return {
      title: "Alerta de Curadoria e Identidade",
      primaryRisk: "O complexo está virando mera cenografia genérica.",
      recommendedAction: "Estude o passado no Museu Vivo e no Quiz para injetar Preservação (+Acervo).",
      consequenceIfIgnored: "Corte na credibilidade patrimonial local e condenação curatorial.",
      targetModuleId: "quizTematico"
    };
  }

  return {
    title: "Sincronia Estável de Módulos",
    primaryRisk: "Estagnação se não equilibrar as frentes",
    recommendedAction: `Recomendação padrão do Comando: ${campaign.currentMission?.title ?? "Expanda a Restauração"}`,
    consequenceIfIgnored: "Crescimento sub-otimizado dos pilares.",
    targetModuleId: campaign.recommendedModule
  };
}
