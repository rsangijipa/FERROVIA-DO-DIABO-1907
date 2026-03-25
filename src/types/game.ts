export type ModeId = "menu" | "restauracao" | "narrativa" | "quiz" | "codex" | "resultado" | "config";

export type GlobalStateLevel = "estavel" | "pressionado" | "crise" | "colapso";

export interface Resources {
  orcamento: number;
  moral: number;
  saudeSanitaria: number;
  progressoTecnico: number;
  preservacao: number;
}

export interface LocomotiveAsset {
  id: string;
  name: string;
  restorationLevel: number;
  status: "critico" | "restauro" | "operacional";
  requirements: string[];
}

export interface EventConsequence {
  resources: Partial<Resources>;
  text: string;
  unlocks?: string[];
  tags?: string[];
}

export interface EventChoice {
  id: string;
  label: string;
  consequence: EventConsequence;
}

export interface GameEvent {
  id: string;
  title: string;
  description: string;
  choices: EventChoice[];
  tags: string[];
  image?: string;
}

export interface NarrativeBars {
  saude: number;
  moral: number;
  progresso: number;
}

export interface NarrativeChoice {
  id: string;
  label: string;
  consequence: string;
  delta: Partial<NarrativeBars>;
  setFlags?: string[];
  requiredFlags?: string[];
  latentDelta?: Partial<NarrativeBars>;
  unlocks?: string[];
}

export interface NarrativeScene {
  id: string;
  chapter: number;
  title: string;
  protagonist: "barbadiano" | "medico" | "ambos";
  text: string;
  choices: NarrativeChoice[];
}

export interface QuizQuestion {
  id: string;
  category:
    | "Tratado de Petropolis"
    | "Construcao"
    | "Trabalhadores"
    | "Doencas e Saneamento"
    | "Locomotivas"
    | "Patrimonio";
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  rewardUnlockId?: string;
}

export interface CodexEntry {
  id: string;
  type: "personagem" | "fato" | "locomotiva" | "documento" | "marco";
  title: string;
  body: string;
  tags: string[];
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  unlockedAt?: string;
}

export interface Settings {
  fontScale: number;
  highContrast: boolean;
  reducedMotion: boolean;
  soundEnabled: boolean;
}

export interface SaveData {
  version: number;
  currentMode: ModeId;
  lastUpdated: string;
}

export interface Player {
  id: string;
  name: string;
  progress: number;
  unlockedModes: ModeId[];
  achievements: Achievement[];
}
