import type { ModeId } from "@/types/game";

/* ------------------------------------------------------------------ */
/*  Route / Mode typing                                                */
/* ------------------------------------------------------------------ */

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

/* ------------------------------------------------------------------ */
/*  Shared backgrounds (v3)                                            */
/* ------------------------------------------------------------------ */

export const sharedBackgrounds = {
  darkGrid: "/game-assets-v3/shared/backgrounds/app-dark-grid.jpg",
  mapLines: "/game-assets-v3/shared/backgrounds/app-map-lines.jpg",
  paperGrid: "/game-assets-v3/shared/backgrounds/app-paper-grid.jpg",
} as const;

/* ------------------------------------------------------------------ */
/*  Hub assets                                                         */
/* ------------------------------------------------------------------ */

export const hubAssets = {
  heroMain: "/game-assets-v3/hub/hero-hub-main.jpg",
  continueCampaign: "/game-assets-v3/hub/continue-campaign.jpg",
  efmmHistorica: "/game-assets-v3/hub/efmm-historica.jpg",
  efmmHoje: "/game-assets-v3/hub/efmm-hoje.jpg",
  cards: {
    historiaInterativa: "/game-assets-v3/hub/cards/historia-interativa.jpg",
    museuVivo: "/game-assets-v3/hub/cards/museu-vivo.jpg",
    quizTematico: "/game-assets-v3/hub/cards/quiz-tematico.jpg",
    restauracao2026: "/game-assets-v3/hub/cards/restauracao-2026.jpg",
  },
  timeline: {
    rail: "/game-assets-v3/hub/timeline/timeline-rail.png",
  },
} as const;

/* ------------------------------------------------------------------ */
/*  Restoration assets                                                 */
/* ------------------------------------------------------------------ */

export const restorationAssets = {
  hero: "/game-assets-v3/hub/restoration/hero-restoration-2026.jpg",
  modules: {
    trilhos: "/game-assets-v3/hub/restoration/modules/trilhos.jpg",
    barracoes: "/game-assets-v3/hub/restoration/modules/barracoes-galpoes.jpg",
    "material-rodante": "/game-assets-v3/hub/restoration/modules/locomotiva-material-rodante.jpg",
    "operacao-publica": "/game-assets-v3/hub/restoration/modules/estruturas-operacao.jpg",
  },
} as const;

/** Get restoration module image with fallback to hero */
export function getRestorationModuleImage(moduleId: string): string {
  const modules = restorationAssets.modules as Record<string, string>;
  return modules[moduleId] ?? restorationAssets.hero;
}

/* ------------------------------------------------------------------ */
/*  History assets                                                     */
/* ------------------------------------------------------------------ */

export const historyAssets = {
  hero: "/game-assets-v3/history/hero-history.jpg",
  chapters: {
    "ch-tratado": "/game-assets-v3/history/chapters/part-01-tratado-promessa.jpg",
    "ch-mata": "/game-assets-v3/history/chapters/part-02-entrar-na-mata.jpg",
    "ch-doenca": "/game-assets-v3/history/chapters/part-03-doenca-hospital.jpg",
    "ch-engenharia": "/game-assets-v3/history/chapters/part-04-engenharia-travessias.jpg",
    "ch-operacao": "/game-assets-v3/history/chapters/part-05-operacao-declinio.jpg",
    "ch-tombamento": "/game-assets-v3/history/chapters/part-06-tombamento-reabertura.jpg",
  },
  characters: {
    "amalia-nogueira": "/game-assets-v3/history/characters/amalia-nogueira.jpg",
    "chefe-operacoes": "/game-assets-v3/history/characters/chefe-operacoes.jpg",
    "enfermeiro-tobias": "/game-assets-v3/history/characters/enfermeiro-tobias.jpg",
    reed: "/game-assets-v3/history/characters/reed.jpg",
  },
} as const;

/** Get chapter illustration with fallback to history hero */
export function getHistoryChapterImage(chapterId: string): string {
  const chapters = historyAssets.chapters as Record<string, string>;
  return chapters[chapterId] ?? historyAssets.hero;
}

/** Get character portrait path or null if not available */
export function getCharacterPortrait(characterId: string): string | null {
  const characters = historyAssets.characters as Record<string, string>;
  return characters[characterId] ?? null;
}

/* ------------------------------------------------------------------ */
/*  Quiz assets                                                        */
/* ------------------------------------------------------------------ */

export const quizAssets = {
  hero: "/game-assets-v3/quiz/hero-quiz.jpg",
  modules: {
    "diplomacia-territorio": "/game-assets-v3/quiz/modules/01-diplomacia-territorio.jpg",
    "construcao-engenharia": "/game-assets-v3/quiz/modules/02-construcao-engenharia.jpg",
    "trabalho-saude-cotidiano": "/game-assets-v3/quiz/modules/03-trabalho-saude-cotidiano.jpg",
    "economia-operacao-declinio": "/game-assets-v3/quiz/modules/04-economia-operacao-declinio.jpg",
    "patrimonio-atualidade": "/game-assets-v3/quiz/modules/05-patrimonio-atualidade.jpg",
  },
} as const;

/** Get quiz module image with fallback to quiz hero */
export function getQuizModuleImage(moduleId: string): string {
  const modules = quizAssets.modules as Record<string, string>;
  return modules[moduleId] ?? quizAssets.hero;
}

/* ------------------------------------------------------------------ */
/*  Museum assets                                                      */
/* ------------------------------------------------------------------ */

export const museumAssets = {
  hero: "/game-assets-v3/museum/hero-museum.jpg",
  mapBase: "/game-assets-v3/museum/map/museum-map-base.jpg",
  wings: {
    construcao: "/game-assets-v3/museum/wings/construcao.jpg",
    diplomacia: "/game-assets-v3/museum/wings/diplomacia.jpg",
    "hospital-candelaria": "/game-assets-v3/museum/wings/hospital-candelaria.jpg",
    locomotivas: "/game-assets-v3/museum/wings/locomotivas.jpg",
    "trabalhadores-cotidiano": "/game-assets-v3/museum/wings/trabalhadores-cotidiano.jpg",
    "trilhos-pontes": "/game-assets-v3/museum/wings/trilhos-pontes.jpg",
  },
  entryThumbs: {
    "hospital-candelaria": "/game-assets-v3/museum/entry-thumbs/hospital-candelaria.jpg",
    "locomotiva-18": "/game-assets-v3/museum/entry-thumbs/locomotiva-18.jpg",
    "tratado-petropolis": "/game-assets-v3/museum/entry-thumbs/tratado-petropolis.jpg",
  },
} as const;

/** Get museum wing image with fallback to museum hero */
export function getMuseumWingImage(wingId: string): string {
  const wings = museumAssets.wings as Record<string, string>;
  return wings[wingId] ?? museumAssets.hero;
}

/** Get museum entry thumbnail with fallback to wing image then hero */
export function getMuseumEntryThumb(entryId: string, wingId?: string): string {
  const thumbs = museumAssets.entryThumbs as Record<string, string>;
  if (thumbs[entryId]) return thumbs[entryId];
  if (wingId) return getMuseumWingImage(wingId);
  return museumAssets.hero;
}

/* ------------------------------------------------------------------ */
/*  Result assets                                                      */
/* ------------------------------------------------------------------ */

export const resultAssets = {
  hero: "/game-assets-v3/results/hero-result.jpg",
  profiles: {
    "Curador da Memoria": "/game-assets-v3/results/profiles/curador-da-memoria.jpg",
    "Engenheiro da Revitalizacao": "/game-assets-v3/results/profiles/engenheiro-da-revitalizacao.jpg",
    "Guardiao do Acervo": "/game-assets-v3/results/profiles/guardiao-do-acerv.jpg",
    "Mediador do Patrimonio": "/game-assets-v3/results/profiles/mediador-do-patrimonio.jpg",
    "Operador do Legado": "/game-assets-v3/results/profiles/operador-do-legado.jpg",
  },
} as const;

/** Get profile image — maps to the real truncated filename for Guardiao */
export function getProfileImage(profileName: string): string {
  const profiles = resultAssets.profiles as Record<string, string>;
  return profiles[profileName] ?? resultAssets.hero;
}

/* ------------------------------------------------------------------ */
/*  Config assets                                                      */
/* ------------------------------------------------------------------ */

export const configAssets = {
  hero: "/game-assets-v3/config/hero-config.jpg",
} as const;

/* ------------------------------------------------------------------ */
/*  Legacy-compatible exports (page backgrounds, mode covers, etc.)    */
/* ------------------------------------------------------------------ */

export const pageBackgrounds = {
  "/": hubAssets.heroMain,
  "/restauracao-2026": restorationAssets.hero,
  "/historia-interativa": historyAssets.hero,
  "/quiz-tematico": quizAssets.hero,
  "/museu-vivo": museumAssets.hero,
  "/resultado-integrado": resultAssets.hero,
  "/config": configAssets.hero,
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
  restauracao2026: hubAssets.cards.restauracao2026,
  historiaInterativa: hubAssets.cards.historiaInterativa,
  quizTematico: hubAssets.cards.quizTematico,
  museuVivo: hubAssets.cards.museuVivo,
  resultadoIntegrado: resultAssets.hero,
} as const satisfies Record<ModeCoverId, string>;

export const areaFallbacks = {
  app: hubAssets.heroMain,
  hub: hubAssets.heroMain,
  restauracao2026: restorationAssets.hero,
  historiaInterativa: historyAssets.hero,
  quizTematico: quizAssets.hero,
  museuVivo: museumAssets.hero,
  resultadoIntegrado: resultAssets.hero,
  "menu-card": hubAssets.heroMain,
} as const satisfies Record<AssetFallbackArea, string>;

/* ------------------------------------------------------------------ */
/*  Public type helpers                                                */
/* ------------------------------------------------------------------ */

export type PageBackgroundKey = keyof typeof pageBackgrounds;

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
