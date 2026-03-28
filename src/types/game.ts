export type ModeId =
  | "hub"
  | "restauracao2026"
  | "historiaInterativa"
  | "quizTematico"
  | "museuVivo"
  | "resultadoIntegrado"
  | "config";

export type GlobalStateLevel = "estavel" | "pressionado" | "crise" | "colapso";

export type PlaystyleProfile =
  | "restaurador_tecnico"
  | "curador_patrimonial"
  | "gestor_politico"
  | "operador_vitrine"
  | "mediador_humanista"
  | "executor_imprudente"
  | "indefinido";

export interface IncidentOption {
  id: string;
  label: string;
  consequence: string;
  resourceDelta: Partial<Resources>;
  directorDelta: Partial<Omit<CampaignDirectorState, "currentWeek" | "activeIncident" | "incidentHistory" | "playstyleProfile" | "dynamicObjective">>;
}

export interface Incident {
  id: string;
  type: "sanitario" | "tecnico" | "politico" | "equipe" | "clima" | "publico";
  title: string;
  description: string;
  options: IncidentOption[];
}

export interface DynamicObjective {
  title: string;
  primaryRisk: string;
  recommendedAction: string;
  consequenceIfIgnored: string;
  targetModuleId?: ModeId;
}

export interface CampaignDirectorState {
  currentWeek: number;
  publicOpinion: number;
  institutionalTrust: number;
  operationalFatigue: number;
  sanitaryRisk: number;
  inaugurationPressure: number;
  heritageIntegrity: number;
  activeIncident: Incident | null;
  incidentHistory: string[];
  playstyleProfile: PlaystyleProfile;
  dynamicObjective: DynamicObjective | null;
}

export type ContentType = "historical_fact" | "contemporary_fact" | "simulation_2026";

export type RestorationStage =
  | "locked"
  | "diagnosis"
  | "prioritization"
  | "contracting"
  | "restoration"
  | "validation"
  | "released";

export type DramaticRole = "setup" | "pressure" | "decision" | "consequence";

export type Difficulty = "easy" | "medium" | "hard";

export type MuseumColorState = "locked" | "discovered" | "restored" | "complete";
export type TutorialStepId = "restoration" | "history" | "quiz" | "museum";

export interface EditorialMeta {
  contentType: ContentType;
  sourceRef: string;
  confidenceNote: string;
  unlockSource: string;
}

export interface Resources {
  orcamento: number;
  moral: number;
  saudeSanitaria: number;
  progressoTecnico: number;
  preservacao: number;
}

export interface NarrativeBars {
  saude: number;
  moral: number;
  progresso: number;
}

export interface EvidenceRef {
  id: string;
  title: string;
  shortRef: string;
  description: string;
}

export interface Character {
  id: string;
  name: string;
  role: string;
  summary: string;
}

export interface Place {
  id: string;
  name: string;
  summary: string;
}

export interface Artifact {
  id: string;
  name: string;
  summary: string;
}

export interface RestorationTaskChoice {
  id: string;
  label: string;
  summary: string;
  outcome: string;
  resourceDelta: Partial<Resources>;
  timelineNote: string;
}

export interface RestorationTask extends EditorialMeta {
  id: string;
  moduleId: string;
  title: string;
  summary: string;
  stage: "diagnosis" | "prioritization" | "contracting" | "restoration" | "validation";
  cost: string;
  time: string;
  impact: string;
  risk: string;
  dependencies: string[];
  evidenceType: string;
  choices: RestorationTaskChoice[];
}

export interface RestorationModule extends EditorialMeta {
  id: string;
  title: string;
  kicker: string;
  summary: string;
  objective: string;
  imageSrc: string;
  subsystems: string[];
  taskIds: string[];
}

export interface HistoryChoice {
  id: string;
  label: string;
  consequence: string;
  delta: Partial<NarrativeBars>;
}

export interface HistoryScene extends EditorialMeta {
  id: string;
  chapterId: string;
  title: string;
  context: string;
  dialogue: string;
  characterId: string;
  locationId: string;
  historicalAnchor: string;
  outcomeTags: string[];
  dramaticRole: DramaticRole;
  choices: HistoryChoice[];
}

export interface HistoryChapter extends EditorialMeta {
  id: string;
  part: number;
  title: string;
  summary: string;
  status: "available" | "planned";
}

export interface QuizQuestion extends EditorialMeta {
  id: string;
  moduleId: string;
  prompt: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  difficulty: Difficulty;
  topic: string;
  museumUnlockId?: string;
}

export interface QuizModule extends EditorialMeta {
  id: string;
  title: string;
  summary: string;
  status: "available" | "planned";
}

export interface MuseumEntry extends EditorialMeta {
  id: string;
  areaId: string;
  title: string;
  summary: string;
  whatIsIt: string;
  historicalUse: string;
  whereAppearsInGame: string;
  whyItMattersToday: string;
}

export interface MuseumArea extends EditorialMeta {
  id: string;
  title: string;
  icon: string;
  unlockThreshold: number;
  entryIds: string[];
  status: "available" | "planned";
}

export interface AudioLog extends EditorialMeta {
  id: string;
  title: string;
  speaker: string;
  date: string;
  transcript: string;
  unlockedAt?: string;
}

export interface UnlockRule {
  id: string;
  sourceType: "restoration" | "history" | "quiz" | "milestone";
  sourceId: string;
  museumEntryId: string;
  audioLogId?: string;
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
}

export interface SaveData {
  version: number;
  currentMode: ModeId;
  lastUpdated: string;
  hasAcceptedLanding: boolean;
}

export interface TutorialProgress {
  started: boolean;
  completed: boolean;
  activeStep: TutorialStepId;
  completedSteps: TutorialStepId[];
}

export interface Player {
  id: string;
  name: string;
  progress: number;
  achievements: Achievement[];
}

export interface RestorationModuleProgress {
  stage: RestorationStage;
  completedTaskIds: string[];
  selectedChoiceIds: string[];
  log: string[];
  lastResolvedTaskId: string | null;
  lastChoiceId: string | null;
}

export interface HistoryProgress {
  currentChapterId: string;
  currentSceneIndex: number;
  pendingConsequence: string | null;
  completedChapterIds: string[];
  completedSceneIds: string[];
  historyLog: string[];
  bars: NarrativeBars;
  status: "ongoing" | "completed";
}

export interface QuizModuleProgress {
  status: "locked" | "available" | "completed";
  currentQuestionIndex: number;
  correct: number;
  answers: { questionId: string; chosenIndex: number; correct: boolean }[];
  feedback: string | null;
}

export interface MuseumProgress {
  unlockedEntryIds: string[];
  viewedEntryIds: string[];
  selectedAreaId: string | null;
}

export interface ProgressState {
  restoration: Record<string, RestorationModuleProgress>;
  history: HistoryProgress;
  quiz: Record<string, QuizModuleProgress>;
  museum: MuseumProgress;
  audioLogs: string[];
  foundArtifacts: string[];
  reputation: Record<string, number>;
  director: CampaignDirectorState;
}

export interface RestorationDecisionFeedback {
  moduleId: string;
  taskId: string;
  taskTitle: string;
  choiceId: string;
  choiceLabel: string;
  outcome: string;
  timelineNote: string;
  resourceDelta: Partial<Resources>;
  unlockedEntryIds: string[];
  nextStage: RestorationStage;
  impactSummary: string;
}
