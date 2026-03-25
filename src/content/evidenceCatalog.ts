import type { EvidenceRef } from "@/types/game";

export const evidenceCatalog: EvidenceRef[] = [
  {
    id: "treaty-1903",
    title: "Tratado de Petropolis",
    shortRef: "Tratado de Petropolis, 1903",
    description: "Base diplomatica para a compensacao ferroviaria ligada ao Acre.",
  },
  {
    id: "construction-1907-1912",
    title: "Construcao da EFMM",
    shortRef: "Obras da EFMM, 1907-1912",
    description: "Marco cronologico da construcao entre Porto Velho e Guajara-Mirim.",
  },
  {
    id: "porto-velho-formation",
    title: "Formacao de Porto Velho",
    shortRef: "Porto Velho e a obra ferroviaria",
    description: "Registro do crescimento urbano ligado ao canteiro da estrada de ferro.",
  },
  {
    id: "candelaria",
    title: "Hospital e Cemiterio da Candelaria",
    shortRef: "Candelaria, memoria sanitaria da obra",
    description: "Referencia para doencas tropicais, hospital de campanha e memoria dos trabalhadores.",
  },
  {
    id: "iphan-2008",
    title: "Tombamento do complexo",
    shortRef: "Iphan, tombamento em 2008",
    description: "Reconhecimento patrimonial federal do conjunto ferroviario.",
  },
  {
    id: "reopening-2024",
    title: "Reabertura do complexo",
    shortRef: "Reabertura publica em 2024",
    description: "Retomada da visitacao e ativacao cultural do complexo.",
  },
  {
    id: "activation-2025-2026",
    title: "Ativacao cultural e turistica",
    shortRef: "Museu, litorina e agenda 2025-2026",
    description: "Uso contemporaneo com museu, litorina, eventos e exibicoes da Locomotiva 18.",
  },
];

export const evidenceById = Object.fromEntries(evidenceCatalog.map((item) => [item.id, item])) as Record<string, EvidenceRef>;
