import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";


import { historyChapters, historyScenesByChapterId } from "@/content/historyContent";
import { museumAreas } from "@/content/museumContent";
import { quizModules, quizQuestionsByModuleId } from "@/content/quizContent";
import { restorationModules, restorationTaskById } from "@/content/restorationModules";
import { unlockRules } from "@/content/unlockRules";
import { applyResourceDelta, clamp, stateFromResources } from "@/lib/gameUtils";
import { SAVE_VERSION, STORAGE_KEY } from "@/lib/storage";
import type {
  GlobalStateLevel,
  HistoryProgress,
  ModeId,
  MuseumProgress,
  NarrativeBars,
  Player,
  ProgressState,
  QuizModuleProgress,
  Resources,
  RestorationDecisionFeedback,
  RestorationModuleProgress,
  RestorationStage,
  SaveData,
  Settings,
  TutorialProgress,
} from "@/types/game";

const initialResources: Resources = {
  orcamento: 0,
  moral: 0,
  saudeSanitaria: 0,
  progressoTecnico: 0,
  preservacao: 0,
};

const initialBars: NarrativeBars = {
  saude: 0,
  moral: 0,
  progresso: 0,
};




const availableHistoryChapters = historyChapters.filter((chapter) => chapter.status === "available");
const legacyMuseumMap: Record<string, string> = {
  "codex-tratado-petropolis": "museu-tratado",
  "codex-locomotiva-18": "museu-locomotiva-18",
  "codex-hospital-candelaria": "museu-candelaria",
};

const buildRestorationProgress = () =>
  Object.fromEntries(
    restorationModules.map((module, index) => [
      module.id,
      {
        stage: index === 0 ? "diagnosis" : "locked",
        completedTaskIds: [],
        selectedChoiceIds: [],
        log: [],
        lastResolvedTaskId: null,
        lastChoiceId: null,
      } satisfies RestorationModuleProgress,
    ]),
  ) as Record<string, RestorationModuleProgress>;

const buildQuizProgress = () =>
  Object.fromEntries(
    quizModules.map((module) => [
      module.id,
      {
        status: module.status === "available" ? "available" : "locked",
        currentQuestionIndex: 0,
        correct: 0,
        answers: [],
        feedback: null,
      } satisfies QuizModuleProgress,
    ]),
  ) as Record<string, QuizModuleProgress>;

const buildInitialProgress = (): ProgressState => ({
  restoration: buildRestorationProgress(),
  history: {
    currentChapterId: availableHistoryChapters[0]?.id ?? "",
    currentSceneIndex: 0,
    pendingConsequence: null,
    completedChapterIds: [],
    completedSceneIds: [],
    historyLog: [],
    bars: initialBars,
    status: "ongoing",
  } satisfies HistoryProgress,
  quiz: buildQuizProgress(),
  museum: {
    unlockedEntryIds: ["museu-tratado"],
    viewedEntryIds: [],
    selectedAreaId: museumAreas[0]?.id ?? null,
  } satisfies MuseumProgress,
  audioLogs: [],
  foundArtifacts: [],
  reputation: {
    tecnico: 0,
    historico: 0,
    conhecimento: 0,
    acervo: 0,
  },
});

const buildInitialPlayer = (): Player => ({
  id: "player-local",
  name: "Curador da Memória",
  progress: 0,
  achievements: [],
});

const buildInitialSaveData = (): SaveData => ({
  version: SAVE_VERSION,
  currentMode: "hub",
  lastUpdated: new Date().toISOString(),
  hasAcceptedLanding: false,
});

const buildInitialTutorial = (): TutorialProgress => ({
  started: false,
  completed: false,
  activeStep: "restoration",
  completedSteps: [],
});

const buildInitialSettings = (): Settings => ({
  fontScale: 1,
  highContrast: false,
  reducedMotion: false,
});


import { getCampaignState } from "@/lib/campaign/campaignEngine";

const calculatePlayerProgress = (progress: ProgressState, resources: Resources) => {
  const campaign = getCampaignState(progress, resources);
  return campaign.overallProgress;
};

const buildTutorialProgress = (progress: ProgressState, current?: TutorialProgress): TutorialProgress => {
  const completedSteps = [
    progress.restoration["trilhos"]?.selectedChoiceIds.length > 0 ? "restoration" : null,
    progress.history.completedSceneIds.length > 0 ? "history" : null,
    Object.values(progress.quiz).some((module) => module.answers.length > 0) ? "quiz" : null,
    progress.museum.viewedEntryIds.length > 0 ? "museum" : null,
  ].filter((value): value is TutorialProgress["activeStep"] => value !== null);

  const activeStep = (["restoration", "history", "quiz", "museum"] as const).find((step) => !completedSteps.includes(step)) ?? "museum";

  return {
    started: current?.started ?? false,
    completed: completedSteps.length === 4,
    activeStep,
    completedSteps,
  };
};

const getNextRestorationStage = (stage: RestorationStage): RestorationStage => {
  switch (stage) {
    case "diagnosis":
      return "prioritization";
    case "prioritization":
      return "contracting";
    case "contracting":
      return "restoration";
    case "restoration":
      return "validation";
    case "validation":
      return "released";
    default:
      return stage;
  }
};

const mapLegacyMode = (value: unknown): ModeId => {
  if (value === "restauracao") return "restauracao2026";
  if (value === "narrativa") return "historiaInterativa";
  if (value === "quiz") return "quizTematico";
  if (value === "codex") return "museuVivo";
  if (value === "resultado") return "resultadoIntegrado";
  if (value === "menu") return "hub";
  if (value === "config") return "config";
  return "hub";
};

const unlockEntriesFromSource = (sourceId: string, unlockedEntryIds: string[]) => {
  const nextUnlocked = [...unlockedEntryIds];
  unlockRules
    .filter((rule) => rule.sourceId === sourceId)
    .forEach((rule) => {
      if (!nextUnlocked.includes(rule.museumEntryId)) {
        nextUnlocked.push(rule.museumEntryId);
      }
    });
  return nextUnlocked;
};

const unlockAudioLogsFromSource = (sourceId: string, unlockedAudioIds: string[]) => {
  const nextUnlocked = [...unlockedAudioIds];
  unlockRules
    .filter((rule) => rule.sourceId === sourceId && rule.audioLogId)
    .forEach((rule) => {
      if (rule.audioLogId && !nextUnlocked.includes(rule.audioLogId)) {
        nextUnlocked.push(rule.audioLogId);
      }
    });
  return nextUnlocked;
};

export interface GameStore {
  player: Player;
  saveData: SaveData;
  settings: Settings;
  tutorial: TutorialProgress;
  globalState: GlobalStateLevel;
  restorationResources: Resources;
  progress: ProgressState;
  restorationFeedback: RestorationDecisionFeedback | null;
  setMode: (mode: ModeId) => void;
  setFontScale: (scale: number) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  startTutorial: () => void;
  dismissRestorationFeedback: () => void;
  advanceRestorationModule: (moduleId: string) => void;
  resolveRestorationTaskChoice: (moduleId: string, choiceId: string) => void;
  chooseHistoryChoice: (choiceId: string) => void;
  advanceHistoryScene: () => void;
  answerQuiz: (moduleId: string, chosenIndex: number) => void;
  nextQuizQuestion: (moduleId: string) => void;
  selectMuseumArea: (areaId: string) => void;
  viewMuseumEntry: (entryId: string) => void;
  unlockAudioLog: (logId: string) => void;
  discoverArtifact: (artifactId: string) => void;
  acceptLanding: () => void;
  logout: () => void;
  resetCampaign: () => void;
}

const buildInitialState = () => {
  const progress = buildInitialProgress();
  return {
    player: { ...buildInitialPlayer(), progress: calculatePlayerProgress(progress, initialResources) },
    saveData: buildInitialSaveData(),
    settings: buildInitialSettings(),
    tutorial: buildInitialTutorial(),
    globalState: "estavel" as GlobalStateLevel,
    restorationResources: initialResources,
    progress,
    restorationFeedback: null,
  };
};

export const useGameStore = create<GameStore>()(
  persist(
    (set) => ({
      ...buildInitialState(),

      setMode: (mode) =>
        set((state) => ({
          saveData: {
            ...state.saveData,
            currentMode: mode,
            lastUpdated: new Date().toISOString(),
          },
        })),

      startTutorial: () =>
        set((state) => ({
          tutorial: {
            ...state.tutorial,
            started: true,
          },
        })),

      setFontScale: (scale) =>
        set((state) => ({
          settings: {
            ...state.settings,
            fontScale: Math.min(1.3, Math.max(0.9, scale)),
          },
        })),

      toggleHighContrast: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            highContrast: !state.settings.highContrast,
          },
        })),

      toggleReducedMotion: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            reducedMotion: !state.settings.reducedMotion,
          },
        })),


      dismissRestorationFeedback: () =>
        set(() => ({
          restorationFeedback: null,
        })),

      advanceRestorationModule: (moduleId) =>
        set((state) => {
          const moduleProgress = state.progress.restoration[moduleId];
          if (!moduleProgress) return state;

          const currentStage = moduleProgress.stage;
          if (!["prioritization", "contracting", "validation"].includes(currentStage)) {
            return state;
          }

          const hasPendingDecision = restorationModules
            .flatMap((module) => module.taskIds)
            .map((taskId) => restorationTaskById[taskId])
            .some((task) => task?.moduleId === moduleId && task.stage === currentStage && !moduleProgress.completedTaskIds.includes(task.id));

          if (hasPendingDecision) {
            return state;
          }

          const nextStage = getNextRestorationStage(currentStage);

          const nextProgress = {
            ...state.progress,
            restoration: {
              ...state.progress.restoration,
              [moduleId]: {
                ...moduleProgress,
                stage: nextStage,
                log: [...moduleProgress.log, `Etapa avancada para ${nextStage}.`],
              },
            },
          };

          if (nextStage === "released") {
            const releasedIndex = restorationModules.findIndex((module) => module.id === moduleId);
            const nextModule = restorationModules[releasedIndex + 1];
            if (nextModule && nextProgress.restoration[nextModule.id].stage === "locked") {
              nextProgress.restoration[nextModule.id] = {
                ...nextProgress.restoration[nextModule.id],
                stage: "diagnosis",
                log: [...nextProgress.restoration[nextModule.id].log, "Modulo liberado para diagnostico."],
              };
            }
          }

          return {
            progress: nextProgress,
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress, state.restorationResources),
            },
            tutorial: buildTutorialProgress(nextProgress, state.tutorial),
            saveData: {
              ...state.saveData,
              lastUpdated: new Date().toISOString(),
            },
          };
        }),

      resolveRestorationTaskChoice: (moduleId, choiceId) =>
        set((state) => {
          const moduleProgress = state.progress.restoration[moduleId];
          if (!moduleProgress) return state;

          const task = restorationModules
            .flatMap((module) => module.taskIds)
            .map((taskId) => restorationTaskById[taskId])
            .find((item) => item.moduleId === moduleId && item.stage === moduleProgress.stage);

          if (!task || moduleProgress.completedTaskIds.includes(task.id)) return state;

          const choice = task.choices.find((item) => item.id === choiceId);
          if (!choice) return state;

          const nextResources = applyResourceDelta(state.restorationResources, choice.resourceDelta);
          const nextGlobalState = stateFromResources(nextResources);
          const previousUnlockedEntries = state.progress.museum.unlockedEntryIds;
          const nextUnlockedEntries = unlockEntriesFromSource(choice.id, previousUnlockedEntries);
          const previousUnlockedAudio = state.progress.audioLogs;
          const nextUnlockedAudio = unlockAudioLogsFromSource(choice.id, previousUnlockedAudio);
          const stageTasks = restorationModules
            .flatMap((module) => module.taskIds)
            .map((taskId) => restorationTaskById[taskId])
            .filter((item) => item?.moduleId === moduleId && item.stage === moduleProgress.stage);
          const isStageComplete = stageTasks.every((item) => item && (item.id === task.id || moduleProgress.completedTaskIds.includes(item.id)));
          const nextStage: RestorationStage = isStageComplete
            ? getNextRestorationStage(moduleProgress.stage)
            : moduleProgress.stage;

          const nextProgress: ProgressState = {
            ...state.progress,
            restoration: {
              ...state.progress.restoration,
              [moduleId]: {
                ...moduleProgress,
                stage: nextStage,
                completedTaskIds: [...moduleProgress.completedTaskIds, task.id],
                selectedChoiceIds: [...moduleProgress.selectedChoiceIds, choice.id],
                log: [...moduleProgress.log, choice.timelineNote],
                lastResolvedTaskId: task.id,
                lastChoiceId: choice.id,
              },
            },
            museum: {
              ...state.progress.museum,
              unlockedEntryIds: nextUnlockedEntries,
            },
            audioLogs: nextUnlockedAudio,
            foundArtifacts: state.progress.foundArtifacts,
            reputation: {
              ...state.progress.reputation,
              tecnico: state.progress.reputation.tecnico + (choice.resourceDelta.progressoTecnico ?? 0) / 10,
              acervo: state.progress.reputation.acervo + (choice.resourceDelta.preservacao ?? 0) / 10,
            },
          };

          const newlyUnlockedEntryIds = nextUnlockedEntries.filter((entryId) => !previousUnlockedEntries.includes(entryId));
          const nextTutorial = buildTutorialProgress(nextProgress, {
            ...state.tutorial,
            started: state.tutorial.started || state.saveData.currentMode === "hub",
          });

          return {
            restorationResources: nextResources,
            globalState: nextGlobalState,
            progress: nextProgress,
            tutorial: nextTutorial,
            restorationFeedback: {
              moduleId,
              taskId: task.id,
              taskTitle: task.title,
              choiceId: choice.id,
              choiceLabel: choice.label,
              outcome: choice.outcome,
              timelineNote: choice.timelineNote,
              resourceDelta: choice.resourceDelta,
              unlockedEntryIds: newlyUnlockedEntryIds,
              nextStage,
              impactSummary: task.impact,
            },
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress, nextResources),
            },
            saveData: {
              ...state.saveData,
              lastUpdated: new Date().toISOString(),
            },
          };
        }),

      chooseHistoryChoice: (choiceId) =>
        set((state) => {
          if (state.progress.history.pendingConsequence) return state;

          const scene = historyScenesByChapterId[state.progress.history.currentChapterId]?.[state.progress.history.currentSceneIndex];
          const choice = scene?.choices.find((item) => item.id === choiceId);
          if (!scene || !choice) return state;

          const nextBars = {
            saude: clamp(state.progress.history.bars.saude + (choice.delta.saude ?? 0)),
            moral: clamp(state.progress.history.bars.moral + (choice.delta.moral ?? 0)),
            progresso: clamp(state.progress.history.bars.progresso + (choice.delta.progresso ?? 0)),
          };

          const nextProgress = {
            ...state.progress,
            history: {
              ...state.progress.history,
              bars: nextBars,
              pendingConsequence: choice.consequence,
              completedSceneIds: [...state.progress.history.completedSceneIds, scene.id],
              historyLog: [...state.progress.history.historyLog, `${scene.title}: ${choice.consequence}`],
            },
            museum: {
              ...state.progress.museum,
              unlockedEntryIds: unlockEntriesFromSource(choice.id, state.progress.museum.unlockedEntryIds),
            },
            audioLogs: unlockAudioLogsFromSource(choice.id, state.progress.audioLogs),
            reputation: {
              ...state.progress.reputation,
              historico: state.progress.reputation.historico + (choice.delta.moral ?? 0) / 10,
              conhecimento: state.progress.reputation.conhecimento + (choice.delta.progresso ?? 0) / 10,
            },
          };

          return {
            progress: nextProgress,
            tutorial: buildTutorialProgress(nextProgress, state.tutorial),
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress, state.restorationResources),
            },
            saveData: {
              ...state.saveData,
              lastUpdated: new Date().toISOString(),
            },
          };
        }),

      advanceHistoryScene: () =>
        set((state) => {
          if (!state.progress.history.pendingConsequence) return state;

          const currentChapterScenes = historyScenesByChapterId[state.progress.history.currentChapterId] ?? [];
          const isLastScene = state.progress.history.currentSceneIndex >= currentChapterScenes.length - 1;
          const currentChapterIndex = availableHistoryChapters.findIndex((chapter) => chapter.id === state.progress.history.currentChapterId);

          const nextHistory = {
            ...state.progress.history,
            pendingConsequence: null,
          };

          if (isLastScene) {
            nextHistory.completedChapterIds = [...nextHistory.completedChapterIds, state.progress.history.currentChapterId];
            const nextChapter = availableHistoryChapters[currentChapterIndex + 1];
            if (nextChapter) {
              nextHistory.currentChapterId = nextChapter.id;
              nextHistory.currentSceneIndex = 0;
            } else {
              nextHistory.status = "completed";
            }
          } else {
            nextHistory.currentSceneIndex += 1;
          }

          const nextProgress = {
            ...state.progress,
            history: nextHistory,
          };

          return {
            progress: nextProgress,
            tutorial: buildTutorialProgress(nextProgress, state.tutorial),
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress, state.restorationResources),
            },
            saveData: {
              ...state.saveData,
              lastUpdated: new Date().toISOString(),
            },
          };
        }),

      answerQuiz: (moduleId, chosenIndex) =>
        set((state) => {
          const moduleProgress = state.progress.quiz[moduleId];
          const questions = quizQuestionsByModuleId[moduleId] ?? [];
          const question = questions[moduleProgress?.currentQuestionIndex ?? 0];
          if (!moduleProgress || !question || moduleProgress.feedback) return state;

          const correct = chosenIndex === question.correctIndex;
          const nextUnlockedEntries = correct
            ? unlockEntriesFromSource(question.id, state.progress.museum.unlockedEntryIds)
            : state.progress.museum.unlockedEntryIds;

          const nextModuleProgress: QuizModuleProgress = {
            ...moduleProgress,
            correct: moduleProgress.correct + (correct ? 1 : 0),
            answers: [...moduleProgress.answers, { questionId: question.id, chosenIndex, correct }],
            feedback: question.explanation,
          };

          const nextProgress = {
            ...state.progress,
            quiz: {
              ...state.progress.quiz,
              [moduleId]: nextModuleProgress,
            },
            museum: {
              ...state.progress.museum,
              unlockedEntryIds: nextUnlockedEntries,
            },
          };

          return {
            progress: nextProgress,
            tutorial: buildTutorialProgress(nextProgress, state.tutorial),
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress, state.restorationResources),
            },
            saveData: {
              ...state.saveData,
              lastUpdated: new Date().toISOString(),
            },
          };
        }),

      nextQuizQuestion: (moduleId) =>
        set((state) => {
          const moduleProgress = state.progress.quiz[moduleId];
          const questions = quizQuestionsByModuleId[moduleId] ?? [];
          if (!moduleProgress || !moduleProgress.feedback) return state;

          const isLast = moduleProgress.currentQuestionIndex >= questions.length - 1;
          const nextModuleProgress: QuizModuleProgress = {
            ...moduleProgress,
            currentQuestionIndex: isLast ? moduleProgress.currentQuestionIndex : moduleProgress.currentQuestionIndex + 1,
            feedback: null,
            status: isLast ? "completed" : moduleProgress.status,
          };

          const nextProgress = {
            ...state.progress,
            quiz: {
              ...state.progress.quiz,
              [moduleId]: nextModuleProgress,
            },
          };

          return {
            progress: nextProgress,
            tutorial: buildTutorialProgress(nextProgress, state.tutorial),
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress, state.restorationResources),
            },
            saveData: {
              ...state.saveData,
              lastUpdated: new Date().toISOString(),
            },
          };
        }),

      selectMuseumArea: (areaId) =>
        set((state) => ({
          progress: {
            ...state.progress,
            museum: {
              ...state.progress.museum,
              selectedAreaId: areaId,
            },
          },
        })),

      viewMuseumEntry: (entryId) =>
        set((state) => {
          if (state.progress.museum.viewedEntryIds.includes(entryId)) return state;

          const nextProgress = {
            ...state.progress,
            museum: {
              ...state.progress.museum,
              viewedEntryIds: [...state.progress.museum.viewedEntryIds, entryId],
            },
          };

          return {
            progress: nextProgress,
            tutorial: buildTutorialProgress(nextProgress, state.tutorial),
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress, state.restorationResources),
            },
          };
        }),

      unlockAudioLog: (logId) =>
        set((state) => {
          const nextProgress = {
            ...state.progress,
            audioLogs: [...state.progress.audioLogs, logId],
          };
          return {
            progress: nextProgress,
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress, state.restorationResources),
            },
          };
        }),

      discoverArtifact: (artifactId) =>
        set((state) => {
          const nextProgress = {
            ...state.progress,
            foundArtifacts: [...state.progress.foundArtifacts, artifactId],
          };
          return {
            progress: nextProgress,
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress, state.restorationResources),
            },
          };
        }),

      acceptLanding: () =>
        set((state) => ({
          saveData: {
            ...state.saveData,
            hasAcceptedLanding: true,
          },
        })),

      logout: () =>
        set((state) => ({
          saveData: {
            ...state.saveData,
            hasAcceptedLanding: false,
          },
        })),

      resetCampaign: () =>
        set(() => ({
          ...buildInitialState(),
        })),
    }),
    {
      name: STORAGE_KEY,
      version: SAVE_VERSION,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        player: state.player,
        saveData: state.saveData,
        settings: state.settings,
        tutorial: state.tutorial,
        globalState: state.globalState,
        restorationResources: state.restorationResources,
        progress: state.progress,
      }),
      migrate: (persistedState, version) => {
        const base = buildInitialState();
        const persisted = persistedState as Record<string, unknown> | undefined;

        if (!persisted) {
          return base as unknown as GameStore;
        }

        if (version >= SAVE_VERSION) {
          return persistedState as GameStore;
        }

        const legacyUnlocked = Array.isArray(persisted.unlockedCodexIds)
          ? (persisted.unlockedCodexIds as string[])
              .map((id) => legacyMuseumMap[id])
              .filter((value): value is string => Boolean(value))
          : [];

        const nextState = {
          ...base,
          player: {
            ...base.player,
            name: typeof persisted.player === "object" && persisted.player && "name" in persisted.player
              ? String((persisted.player as Record<string, unknown>).name)
              : base.player.name,
          },
          saveData: {
            ...base.saveData,
            currentMode: mapLegacyMode(
              typeof persisted.saveData === "object" && persisted.saveData && "currentMode" in persisted.saveData
                ? (persisted.saveData as Record<string, unknown>).currentMode
                : "hub",
            ),
          },
          settings: {
            ...base.settings,
            ...(typeof persisted.settings === "object" && persisted.settings ? (persisted.settings as Settings) : {}),
          },
          tutorial: buildInitialTutorial(),
          progress: {
            ...base.progress,
            museum: {
              ...base.progress.museum,
              unlockedEntryIds: [...new Set([...base.progress.museum.unlockedEntryIds, ...legacyUnlocked])],
            },
          },
        };

        if (typeof persisted.tutorial === "object" && persisted.tutorial) {
          nextState.tutorial = {
            ...base.tutorial,
            ...(persisted.tutorial as TutorialProgress),
          };
        }

        nextState.tutorial = buildTutorialProgress(nextState.progress, nextState.tutorial);
        nextState.player.progress = calculatePlayerProgress(nextState.progress, nextState.restorationResources);

        if (typeof nextState.saveData === "object" && nextState.saveData) {
          (nextState.saveData as Record<string, unknown>).hasAcceptedLanding = 
            (nextState.saveData as Record<string, unknown>).hasAcceptedLanding ?? false;
        }

        // Ensure reputation exists in Phase 4/5
        if (!nextState.progress.reputation) {
          nextState.progress.reputation = {
            tecnico: 0,
            historico: 0,
            conhecimento: 0,
            acervo: 0,
          };
        }

        return nextState as unknown as GameStore;
      },
    },
  ),
);
