import type {
  Achievement,
  GlobalStateLevel,
  LocomotiveAsset,
  ModeId,
  NarrativeBars,
  Player,
  Resources,
  SaveData,
  Settings,
} from "@/types/game";

export interface MetaSlice {
  player: Player;
  saveData: SaveData;
  globalState: GlobalStateLevel;
  setMode: (mode: ModeId) => void;
  setGlobalState: (state: GlobalStateLevel) => void;
  addAchievement: (achievement: Achievement) => void;
  setPlayerProgress: (progress: number) => void;
}

export interface RestorationSlice {
  restorationWeek: number;
  restorationResources: Resources;
  locomotives: LocomotiveAsset[];
  restorationEventIndex: number;
  restorationLog: string[];
  restorationStatus: "ongoing" | "won" | "lost";
  resolveRestorationChoice: (choiceId: string) => { ok: boolean; message: string };
  resetRestoration: () => void;
  evaluateRestorationEnding: () => "bom" | "mediano" | "ruim";
}

export interface NarrativeSlice {
  protagonist: "barbadiano" | "medico" | null;
  sceneIndex: number;
  narrativeBars: NarrativeBars;
  narrativeFlags: Record<string, boolean>;
  narrativeHistory: string[];
  pendingConsequence: string | null;
  queuedLatentDelta: Partial<NarrativeBars> | null;
  narrativeStatus: "ongoing" | "won" | "lost";
  chooseProtagonist: (protagonist: "barbadiano" | "medico") => void;
  chooseNarrativeChoice: (choiceId: string) => { ok: boolean; message: string };
  advanceNarrative: () => void;
  resetNarrative: () => void;
}

export interface QuizSlice {
  quizIndex: number;
  quizScore: number;
  quizAnswers: { questionId: string; chosenIndex: number; correct: boolean }[];
  quizFeedback: string | null;
  quizStatus: "ongoing" | "finished";
  rankingLocal: number[];
  answerQuiz: (chosenIndex: number) => { correct: boolean; explanation: string } | null;
  nextQuiz: () => void;
  resetQuiz: () => void;
}

export interface CodexSlice {
  unlockedCodexIds: string[];
  unlockCodex: (id: string) => void;
}

export interface SettingsSlice {
  settings: Settings;
  setFontScale: (scale: number) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleSound: () => void;
}

export type GameStore = MetaSlice &
  RestorationSlice &
  NarrativeSlice &
  QuizSlice &
  CodexSlice &
  SettingsSlice;
