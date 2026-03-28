import type { Artifact, Character, Place } from "@/types/game";

export const characters: Character[] = [
  {
    id: "barao-rio-branco",
    name: "Barao do Rio Branco",
    role: "diplomacia",
    summary: "Figura central da diplomacia brasileira no contexto do Tratado de Petropolis.",
  },
  {
    id: "engenheira-amalia",
    name: "Amalia Nogueira",
    role: "patrimonio e engenharia",
    summary: "Personagem de simulacao que coordena prioridades tecnicas da Restauração 2026.",
  },
  {
    id: "tobias-candelaria",
    name: "Tobias da Enfermaria",
    role: "saude",
    summary: "Personagem dramatizado que conduz o jogador pelo impacto sanitario da construcao.",
  },
  {
    id: "estivador-caribenho",
    name: "Samuel Brathwaite",
    role: "trabalhadores",
    summary: "Voz dramatizada inspirada nos trabalhadores caribenhos presentes na obra.",
  },
  {
    id: "oswaldo-cruz",
    name: "Oswaldo Cruz",
    role: "saude",
    summary: "Sanitarista que interveio em 1910 para controlar a mortalidade por malária com uso sistêmico do quinino.",
  },
];

export const places: Place[] = [
  {
    id: "porto-velho",
    name: "Porto Velho",
    summary: "Cidade moldada para atender a construcao e a operacao da EFMM.",
  },
  {
    id: "guajara-mirim",
    name: "Guajara-Mirim",
    summary: "Ponto final historico da ferrovia e elo logistico regional.",
  },
  {
    id: "candelaria",
    name: "Candelaria",
    summary: "Area associada ao hospital e ao cemiterio que marcam a memoria sanitaria da obra.",
  },
  {
    id: "patio-ferroviario",
    name: "Patio Ferroviario",
    summary: "Nucleo atual do complexo revitalizado com museu, visitas e exibicoes.",
  },
  {
    id: "vila-americana",
    name: "Vila Americana",
    summary: "Setor abastado de Porto Velho criado por Farquhar, separado da mão-de-obra brasileira pela Avenida Divisória.",
  },
];

export const artifacts: Artifact[] = [
  {
    id: "locomotiva-18",
    name: "Locomotiva 18",
    summary: "Peca-chave do acervo e simbolo da retomada publica do complexo.",
  },
  {
    id: "litorina",
    name: "Litorina",
    summary: "Material rodante associado a passeios e mediacao educativa contemporanea.",
  },
  {
    id: "tratado-de-petropolis",
    name: "Tratado de Petropolis",
    summary: "Documento simbolico que ancora a origem geopolitica da ferrovia.",
  },
  {
    id: "locomotiva-50",
    name: "Locomotiva 50",
    summary: "Máquina com destinação de restauro integral visando transporte futuro de passageiros.",
  },
];
