import type { Artifact } from "@/types/game";

export const artifacts: Artifact[] = [
  {
    id: "art-lanterna",
    name: "Lanterna de Ferroviário",
    summary: "Uma lanterna a óleo usada durante as vistorias noturnas nas oficinas.",
  },
  {
    id: "art-bussola",
    name: "Bússola de Engenheiro",
    summary: "Instrumento de medição encontrado próximo à ponte mista.",
  },
  {
    id: "art-medalha",
    name: "Medalha Comemorativa",
    summary: "Cunhada em 1912 para a inauguração da EFMM, recuperada nas ruínas da Candelária.",
  },
  {
    id: "art-diario",
    name: "Fragmento de Diário",
    summary: "Páginas manchadas com anotações de um trabalhador sobre o surto de malária.",
  }
];

export const artifactRegistry = Object.fromEntries(artifacts.map((a) => [a.id, a])) as Record<string, Artifact>;
