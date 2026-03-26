"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookMarked } from "lucide-react";

import { getHistoryChapterImage, historyAssets } from "@/content/assetManifest";
import { historyChapters, historyScenesByChapterId } from "@/content/historyContent";
import { characters, places } from "@/content/entities";
import { getPillarScores } from "@/lib/campaign/campaignEngine";
import { historyToQuiz } from "@/lib/campaign/campaignRewards";
import { useGameStore } from "@/store/useGameStore";

import { CharacterPortrait } from "../ui/CharacterPortrait";
import { EditorialSeal } from "../ui/EditorialSeal";
import { GameArtwork } from "../ui/GameArtwork";
import { NarrativeBarsPanel } from "../ui/NarrativeBarsPanel";
import { SectionHero } from "../ui/SectionHero";
import { StatusBar } from "../ui/StatusBar";

const dramaticRoleLabel = {
  setup: "Setup",
  pressure: "Pressure",
  decision: "Decision",
  consequence: "Consequence",
} as const;

const choiceLetters = ["A", "B", "C", "D"];

const crossfade = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.26, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.14 } },
};

export function NarrativeMode() {
  const history = useGameStore((store) => store.progress.history);
  const fullProgress = useGameStore((store) => store.progress);
  const resources = useGameStore((store) => store.restorationResources);
  const chooseHistoryChoice = useGameStore((store) => store.chooseHistoryChoice);
  const advanceHistoryScene = useGameStore((store) => store.advanceHistoryScene);

  const pillarScores = getPillarScores(fullProgress, resources);

  const currentChapter = historyChapters.find((chapter) => chapter.id === history.currentChapterId) ?? historyChapters[0];
  const scenes = historyScenesByChapterId[currentChapter.id] ?? [];
  const currentScene = scenes[history.currentSceneIndex];
  const currentCharacter = characters.find((character) => character.id === currentScene?.characterId);
  const currentPlace = places.find((place) => place.id === currentScene?.locationId);

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Capitulo interativo de patrimonio"
        title="Historia Interativa"
        subtitle="Entrega 1 com 2 partes completas. Cada cena cruza contexto historico, fala dramatizada, decisao e impacto em saude, moral e progresso."
        imageSrc={historyAssets.hero}
        imageAlt="Historia Interativa"
        chips={[
          `${history.completedChapterIds.length}/2 partes concluidas`,
          `${history.completedSceneIds.length}/8 cenas resolvidas`,
          history.status === "completed" ? "Slice concluido" : `Parte ${currentChapter.part} em andamento`,
        ]}
        fallbackArea="historiaInterativa"
        preload
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,0.88fr)_minmax(0,1.4fr)]">
        {/* Left panel */}
        <aside className="space-y-4">
          <NarrativeBarsPanel bars={history.bars} />

          {/* Memória Histórica */}
          <div className="card-dark px-5 py-3">
            <StatusBar label="Memória Histórica" value={Math.round(pillarScores.historico)} colorVar="--color-latao" />
          </div>

          <article className="card-dark p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Estrutura da campanha</p>
            <div className="mt-4 space-y-3">
              {historyChapters.map((chapter) => {
                const active = chapter.id === currentChapter.id;
                const completed = history.completedChapterIds.includes(chapter.id);

                return (
                  <div
                    key={chapter.id}
                    className={`rounded-2xl border p-4 transition-all duration-200 ${
                      active
                        ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.12)] glow-badge"
                        : "border-[color:rgba(233,223,201,0.1)] bg-[color:rgba(12,15,14,0.18)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">Parte {chapter.part}</p>
                        <h2 className="mt-2 font-serif text-xl text-[var(--color-paper)]">{chapter.title}</h2>
                      </div>
                      <span className={`image-badge ${completed ? "image-badge-gold" : ""}`}>
                        {completed ? "Concluída" : chapter.status === "planned" ? "Planejada" : "Ativa"}
                      </span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">{chapter.summary}</p>
                    {!completed && chapter.status === "available" && (
                      <div className="mt-3">
                        <p className="text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-cobre)]">
                          Ao concluir → libera {historyToQuiz[chapter.id] ? "Quiz" : "próxima etapa"} + peça do Museu
                        </p>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </article>
        </aside>

        {/* Right: scene panel */}
        <AnimatePresence mode="wait">
          <motion.article
            key={currentScene?.id ?? "completed"}
            className="card-dark overflow-hidden"
            {...crossfade}
          >
            {currentScene ? (
              <>
                {/* Chapter illustration */}
                <GameArtwork
                  src={getHistoryChapterImage(currentChapter.id)}
                  alt={currentChapter.title}
                  aspectRatio="16/9"
                  overlay
                  fadeBottom
                  fallbackArea="historiaInterativa"
                  fallbackLabel={currentChapter.title}
                  className="max-h-[14rem] min-h-[10rem] rounded-b-none border-x-0 border-t-0"
                  sizes="(max-width: 1280px) 100vw, 60vw"
                />

                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">
                        Parte {currentChapter.part} • Cena {history.currentSceneIndex + 1}/{scenes.length}
                      </p>
                      <h1 className="mt-2 font-serif text-3xl text-[var(--color-paper)]">{currentScene.title}</h1>
                    </div>
                    <span className="rounded-full border border-[color:rgba(212,163,103,0.28)] bg-[color:rgba(212,163,103,0.1)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--color-latao)]">
                      {dramaticRoleLabel[currentScene.dramaticRole]}
                    </span>
                  </div>

                  <p className="mt-4 text-sm leading-7 text-[var(--color-muted)]">{currentScene.context}</p>

                  {/* Dialogue with character portrait and quotation */}
                  <div className="mt-5 flex gap-4 rounded-2xl border border-[color:rgba(212,163,103,0.16)] bg-[color:rgba(12,15,14,0.2)] p-5">
                    {currentCharacter && (
                      <CharacterPortrait
                        characterId={currentCharacter.id}
                        name={currentCharacter.name}
                        size={56}
                        className="mt-1"
                      />
                    )}
                    <div className="min-w-0 flex-1">
                      {currentCharacter && (
                        <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[var(--color-latao)]">
                          {currentCharacter.name}
                        </p>
                      )}
                      <p className="mt-2 font-serif text-base italic leading-7 text-[var(--color-paper)]">
                        <span className="mr-1 text-lg text-[var(--color-latao)]">&ldquo;</span>
                        {currentScene.dialogue}
                        <span className="ml-1 text-lg text-[var(--color-latao)]">&rdquo;</span>
                      </p>
                    </div>
                  </div>

                  {/* Metadata cards */}
                  <div className="mt-4 grid gap-3 md:grid-cols-3">
                    <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">Personagem</p>
                      <p className="mt-2 font-semibold text-[var(--color-paper)]">{currentCharacter?.name ?? "Sem registro"}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">Lugar</p>
                      <p className="mt-2 font-semibold text-[var(--color-paper)]">{currentPlace?.name ?? "Sem registro"}</p>
                    </div>
                    <div className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-4">
                      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">Âncora histórica</p>
                      <p className="mt-2 font-semibold text-[var(--color-paper)]">{currentScene.historicalAnchor}</p>
                    </div>
                  </div>

                  <EditorialSeal
                    contentType={currentScene.contentType}
                    sourceRef={currentScene.sourceRef}
                    confidenceNote={currentScene.confidenceNote}
                    className="mt-5"
                  />

                  {/* Outcome tags */}
                  <div className="mt-5 rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-4">
                    <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-latao)]">
                      <BookMarked size={14} />
                      Outcome tags
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {currentScene.outcomeTags.map((tag) => (
                        <span key={tag} className="image-badge">{tag}</span>
                      ))}
                    </div>
                  </div>

                  {/* Consequence or choices */}
                  {history.pendingConsequence ? (
                    <div className="mt-5 rounded-2xl border border-[color:rgba(212,163,103,0.24)] bg-[color:rgba(212,163,103,0.08)] p-5">
                      <p className="text-sm leading-7 text-[var(--color-paper)]">{history.pendingConsequence}</p>
                      <button className="btn-primary mt-4" onClick={advanceHistoryScene}>
                        Avancar cena
                      </button>
                    </div>
                  ) : (
                    <div className="mt-5 grid gap-3">
                      {currentScene.choices.map((choice, i) => (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => chooseHistoryChoice(choice.id)}
                          className="group rounded-2xl border border-[color:rgba(212,163,103,0.2)] bg-[color:rgba(12,15,14,0.2)] p-4 text-left transition-all duration-200 hover:border-[color:var(--color-cobre)] hover-lift-game"
                        >
                          <div className="flex items-start gap-3">
                            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-[color:rgba(212,163,103,0.3)] bg-[color:rgba(212,163,103,0.1)] font-serif text-sm font-bold text-[var(--color-latao)]">
                              {choiceLetters[i] ?? "•"}
                            </span>
                            <div>
                              <h3 className="font-semibold text-[var(--color-paper)]">{choice.label}</h3>
                              <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{choice.consequence}</p>
                            </div>
                          </div>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="p-6">
                <h1 className="font-serif text-3xl text-[var(--color-paper)]">Slice historico concluido</h1>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  As duas primeiras partes da Historia Interativa foram concluídas. O restante da campanha ja esta
                  previsto no schema para expansao futura.
                </p>
              </div>
            )}
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
