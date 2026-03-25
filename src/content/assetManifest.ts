import type { ModeId, Resources } from "@/types/game";

type RoutePath =
  | "/"
  | "/restauracao-2026"
  | "/historia-interativa"
  | "/quiz-tematico"
  | "/museu-vivo"
  | "/resultado-integrado"
  | "/config";

type ModeCoverId = "restauracao2026" | "historiaInterativa" | "quizTematico" | "museuVivo" | "resultadoIntegrado";
type AssetFallbackArea =
  | "app"
  | "hub"
  | "restauracao2026"
  | "historiaInterativa"
  | "quizTematico"
  | "museuVivo"
  | "resultadoIntegrado"
  | "menu-card";

export const pageBackgrounds = {
  "/": "/game-assets/backgrounds/patio.jpg",
  "/restauracao-2026": "/game-assets/backgrounds/oficina.jpg",
  "/historia-interativa": "/game-assets/backgrounds/ponte.jpg",
  "/quiz-tematico": "/game-assets/backgrounds/museu.jpg",
  "/museu-vivo": "/game-assets/backgrounds/museu.jpg",
  "/resultado-integrado": "/game-assets/backgrounds/patio.jpg",
  "/config": "/game-assets/backgrounds/oficina.jpg",
} as const satisfies Record<RoutePath, string>;

export const modeBackgroundRouteByMode = {
  hub: "/",
  restauracao2026: "/restauracao-2026",
  historiaInterativa: "/historia-interativa",
  quizTematico: "/quiz-tematico",
  museuVivo: "/museu-vivo",
  resultadoIntegrado: "/resultado-integrado",
  config: "/config",
} as const satisfies Record<ModeId, RoutePath>;

export const modeCovers = {
  restauracao2026: "/game-assets/modes/restauracao.jpg",
  historiaInterativa: "/game-assets/modes/historia.jpg",
  quizTematico: "/game-assets/modes/quiz.jpg",
  museuVivo: "/game-assets/modes/codex.jpg",
  resultadoIntegrado: "/game-assets/backgrounds/patio.jpg",
} as const satisfies Record<ModeCoverId, string>;

export const resourceIcons = {
  orcamento: "/game-assets/icons/orcamento.png",
  moral: "/game-assets/icons/moral.png",
  saudeSanitaria: "/game-assets/icons/saude.png",
  progressoTecnico: "/game-assets/icons/progresso.png",
  preservacao: "/game-assets/icons/preservacao.png",
} as const satisfies Record<keyof Resources, string>;

export const areaFallbacks = {
  app: pageBackgrounds["/"],
  hub: pageBackgrounds["/"],
  restauracao2026: modeCovers.restauracao2026,
  historiaInterativa: modeCovers.historiaInterativa,
  quizTematico: modeCovers.quizTematico,
  museuVivo: modeCovers.museuVivo,
  resultadoIntegrado: modeCovers.resultadoIntegrado,
  "menu-card": pageBackgrounds["/"],
} as const satisfies Record<AssetFallbackArea, string>;

export type PageBackgroundKey = keyof typeof pageBackgrounds;
export type ResourceIconKey = keyof typeof resourceIcons;
export type FallbackAreaKey = keyof typeof areaFallbacks;

export const resolvePageBackground = (pathname: string, currentMode?: ModeId) => {
  if (pathname in pageBackgrounds) {
    return pageBackgrounds[pathname as PageBackgroundKey];
  }

  if (currentMode) {
    return pageBackgrounds[modeBackgroundRouteByMode[currentMode]];
  }

  return areaFallbacks.app;
};
