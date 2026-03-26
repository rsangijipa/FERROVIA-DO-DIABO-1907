import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

import { getCampaignReading } from "@/lib/campaign/campaignEngine";
import { historyChapters, historyScenesByChapterId } from "@/content/historyContent";
import { museumAreas } from "@/content/museumContent";
import { quizModules, quizQuestionsByModuleId } from "@/content/quizContent";
import { restorationModules, restorationTaskById } from "@/content/restorationModules";
import { unlockRules } from "@/content/unlockRules";
import { applyResourceDelta, clamp, stateFromResources } from "@/lib/gameUtils";
import { SAVE_VERSION, STORAGE_KEY } from "@/lib/storage";
import { restorationStages } from "@/lib/constants";
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
  RestorationModuleProgress,
  RestorationStage,
  SaveData,
  Settings,
} from "@/types/game";

const initialResources: Resources = {
  orcamento: 72,
  moral: 70,
  saudeSanitaria: 68,
  progressoTecnico: 66,
  preservacao: 74,
};

const initialBars: NarrativeBars = {
  saude: 72,
  moral: 70,
  progresso: 68,
};



const availableHistoryChapters = historyChapters.filter((chapter) => chapter.status === "available");
const availableQuizModules = quizModules.filter((module) => module.status === "available");
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
});

const buildInitialPlayer = (): Player => ({
  id: "player-local",
  name: "Curador da Memoria",
  progress: 6,
  achievements: [],
});

const buildInitialSaveData = (): SaveData => ({
  version: SAVE_VERSION,
  currentMode: "hub",
  lastUpdated: new Date().toISOString(),
});

const buildInitialSettings = (): Settings => ({
  fontScale: 1,
  highContrast: false,
  reducedMotion: false,
  soundEnabled: true,
});

const chapterSceneCount = availableHistoryChapters.reduce((acc, chapter) => acc + (historyScenesByChapterId[chapter.id]?.length ?? 0), 0);
const quizQuestionCount = availableQuizModules.reduce((acc, module) => acc + (quizQuestionsByModuleId[module.id]?.length ?? 0), 0);

const calculatePlayerProgress = (progress: ProgressState) => {
  const restorationValue = restorationModules.reduce((acc, module) => {
    const stageIndex = restorationStages.indexOf(progress.restoration[module.id]?.stage ?? "locked");
    return acc + stageIndex / (restorationStages.length - 1);
  }, 0) / restorationModules.length;

  const historyValue = chapterSceneCount === 0
    ? 0
    : (progress.history.completedSceneIds.length + (progress.history.pendingConsequence ? 0.5 : 0)) / chapterSceneCount;

  const quizAnswered = availableQuizModules.reduce((acc, module) => acc + progress.quiz[module.id].answers.length, 0);
  const quizValue = quizQuestionCount === 0 ? 0 : quizAnswered / quizQuestionCount;

  const museumEntriesTotal = museumAreas.filter((area) => area.status === "available").reduce((acc, area) => acc + area.entryIds.length, 0);
  const museumValue = museumEntriesTotal === 0 ? 0 : progress.museum.unlockedEntryIds.length / museumEntriesTotal;

  return Math.round(((restorationValue * 0.35) + (historyValue * 0.25) + (quizValue * 0.2) + (museumValue * 0.2)) * 100);
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

export interface GameStore {
  player: Player;
  saveData: SaveData;
  settings: Settings;
  globalState: GlobalStateLevel;
  restorationResources: Resources;
  progress: ProgressState;
  setMode: (mode: ModeId) => void;
  setFontScale: (scale: number) => void;
  toggleHighContrast: () => void;
  toggleReducedMotion: () => void;
  toggleSound: () => void;
  advanceRestorationModule: (moduleId: string) => void;
  resolveRestorationTaskChoice: (moduleId: string, choiceId: string) => void;
  chooseHistoryChoice: (choiceId: string) => void;
  advanceHistoryScene: () => void;
  answerQuiz: (moduleId: string, chosenIndex: number) => void;
  nextQuizQuestion: (moduleId: string) => void;
  selectMuseumArea: (areaId: string) => void;
  viewMuseumEntry: (entryId: string) => void;
  resetCampaign: () => void;
}

const buildInitialState = () => {
  const progress = buildInitialProgress();
  return {
    player: { ...buildInitialPlayer(), progress: calculatePlayerProgress(progress) },
    saveData: buildInitialSaveData(),
    settings: buildInitialSettings(),
    globalState: "estavel" as GlobalStateLevel,
    restorationResources: initialResources,
    progress,
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

      toggleSound: () =>
        set((state) => ({
          settings: {
            ...state.settings,
            soundEnabled: !state.settings.soundEnabled,
          },
        })),

      advanceRestorationModule: (moduleId) =>
        set((state) => {
          const moduleProgress = state.progress.restoration[moduleId];
          if (!moduleProgress) return state;

          const currentStage = moduleProgress.stage;
          if (!["prioritization", "contracting", "validation"].includes(currentStage)) {
            return state;
          }

          const nextStage: RestorationStage = currentStage === "prioritization"
            ? "contracting"
            : currentStage === "contracting"
              ? "restoration"
              : "released";

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
              progress: calculatePlayerProgress(nextProgress),
            },
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
          const nextUnlockedEntries = unlockEntriesFromSource(choice.id, state.progress.museum.unlockedEntryIds);
          const nextStage: RestorationStage = moduleProgress.stage === "diagnosis" ? "prioritization" : "validation";

          const nextProgress = {
            ...state.progress,
            restoration: {
              ...state.progress.restoration,
              [moduleId]: {
                ...moduleProgress,
                stage: nextStage,
                completedTaskIds: [...moduleProgress.completedTaskIds, task.id],
                selectedChoiceIds: [...moduleProgress.selectedChoiceIds, choice.id],
                log: [...moduleProgress.log, choice.timelineNote],
              },
            },
            museum: {
              ...state.progress.museum,
              unlockedEntryIds: nextUnlockedEntries,
            },
          };

          return {
            restorationResources: nextResources,
            globalState: nextGlobalState,
            progress: nextProgress,
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress),
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
          };

          return {
            progress: nextProgress,
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress),
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
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress),
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
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress),
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
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress),
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
            player: {
              ...state.player,
              progress: calculatePlayerProgress(nextProgress),
            },
          };
        }),

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
          progress: {
            ...base.progress,
            museum: {
              ...base.progress.museum,
              unlockedEntryIds: [...new Set([...base.progress.museum.unlockedEntryIds, ...legacyUnlocked])],
            },
          },
        };

        nextState.player.progress = calculatePlayerProgress(nextState.progress);
        return nextState as unknown as GameStore;
      },
    },
  ),
);
