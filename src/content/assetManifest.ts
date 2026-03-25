import type { CodexEntry, ModeId, Resources } from "@/types/game";

type RoutePath = "/" | "/restauracao" | "/narrativa" | "/quiz" | "/codex" | "/resultado" | "/config";
type RestorationEventId =
  | "ev-01"
  | "ev-02"
  | "ev-03"
  | "ev-04"
  | "ev-05"
  | "ev-06"
  | "ev-07"
  | "ev-08"
  | "ev-09"
  | "ev-10"
  | "ev-11"
  | "ev-12";

type ModeCoverId = "restauracao" | "narrativa" | "quiz" | "codex" | "resultado";
type AssetFallbackArea = "app" | "home" | "restauracao" | "quiz" | "codex" | "resultado" | "menu-card";

export const pageBackgrounds = {
  "/": "/game-assets/backgrounds/patio.jpg",
  "/restauracao": "/game-assets/backgrounds/oficina.jpg",
  "/narrativa": "/game-assets/backgrounds/ponte.jpg",
  "/quiz": "/game-assets/backgrounds/museu.jpg",
  "/codex": "/game-assets/backgrounds/museu.jpg",
  "/resultado": "/game-assets/backgrounds/patio.jpg",
  "/config": "/game-assets/backgrounds/oficina.jpg",
} as const satisfies Record<RoutePath, string>;

export const modeBackgroundRouteByMode = {
  menu: "/",
  restauracao: "/restauracao",
  narrativa: "/narrativa",
  quiz: "/quiz",
  codex: "/codex",
  resultado: "/resultado",
  config: "/config",
} as const satisfies Record<ModeId, RoutePath>;

export const modeCovers = {
  restauracao: "/game-assets/modes/restauracao.jpg",
  narrativa: "/game-assets/modes/historia.jpg",
  quiz: "/game-assets/modes/quiz.jpg",
  codex: "/game-assets/modes/codex.jpg",
  resultado: "/game-assets/backgrounds/ponte.jpg",
} as const satisfies Record<ModeCoverId, string>;

export const restorationEventArt = {
  "ev-01": "/game-assets/events/restauracao/week-01-inspecao-locomotiva-18.jpg",
  "ev-02": "/game-assets/events/restauracao/week-02-vazamento-oficina.jpg",
  "ev-03": "/game-assets/events/restauracao/week-03-pressao-imprensa-local.jpg",
  "ev-04": "/game-assets/events/restauracao/week-04-surto-gripe-equipe.jpg",
  "ev-05": "/game-assets/events/restauracao/week-05-ponte-santo-antonio.jpg",
  "ev-06": "/game-assets/events/restauracao/week-06-equipe-restauro-subdimensionada.jpg",
  "ev-07": "/game-assets/events/restauracao/week-07-arquivo-historico-danificado.jpg",
  "ev-08": "/game-assets/events/restauracao/week-08-pane-gerador.jpg",
  "ev-09": "/game-assets/events/restauracao/week-09-demanda-escolar.jpg",
  "ev-10": "/game-assets/events/restauracao/week-10-conflito-fornecimento.jpg",
  "ev-11": "/game-assets/events/restauracao/week-11-fiscalizacao-sanitaria.jpg",
  "ev-12": "/game-assets/events/restauracao/week-12-abertura-trecho-piloto.jpg",
} as const satisfies Record<RestorationEventId, string>;

export const resourceIcons = {
  orcamento: "/game-assets/icons/orcamento.png",
  moral: "/game-assets/icons/moral.png",
  saudeSanitaria: "/game-assets/icons/saude.png",
  progressoTecnico: "/game-assets/icons/progresso.png",
  preservacao: "/game-assets/icons/preservacao.png",
} as const satisfies Record<keyof Resources, string>;

export const areaFallbacks = {
  app: pageBackgrounds["/"],
  home: pageBackgrounds["/"],
  restauracao: modeCovers.restauracao,
  quiz: modeCovers.quiz,
  codex: modeCovers.codex,
  resultado: modeCovers.resultado,
  "menu-card": pageBackgrounds["/"],
} as const satisfies Record<AssetFallbackArea, string>;

export const codexThumbByType = {
  documento: resourceIcons.preservacao,
  locomotiva: resourceIcons.progressoTecnico,
  personagem: resourceIcons.moral,
  marco: resourceIcons.moral,
  fato: resourceIcons.preservacao,
} as const satisfies Record<CodexEntry["type"], string>;

const codexHealthTokens = ["saude", "sanitario", "saneamento", "hospital", "medicina", "surto", "quinino", "triagem"];

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

export const resolveCodexThumb = (entry: CodexEntry) => {
  if (entry.type !== "fato") {
    return codexThumbByType[entry.type];
  }

  const searchable = `${entry.title} ${entry.body} ${entry.tags.join(" ")}`.toLowerCase();
  const isHealthContext = codexHealthTokens.some((token) => searchable.includes(token));

  return isHealthContext ? resourceIcons.saudeSanitaria : codexThumbByType.fato;
};
