"use client";

import { AnimatePresence, motion } from "framer-motion";
import { BookMarked } from "lucide-react";

import { getHistoryChapterImage, historyAssets } from "@/content/assetManifest";
import { historyChapters, historyScenesByChapterId } from "@/content/historyContent";
import { characters, places } from "@/content/entities";
import { getPillarScores } from "@/lib/campaign/campaignEngine";
import { historyToQuiz } from "@/lib/campaign/campaignRewards";
import { choiceLetters } from "@/lib/constants";
import { useGameStore } from "@/store/useGameStore";

import { CharacterPortrait } from "../ui/CharacterPortrait";
import { EditorialSeal } from "../ui/EditorialSeal";
import { GameArtwork } from "../ui/GameArtwork";
import { NarrativeBarsPanel } from "../ui/NarrativeBarsPanel";
import { SectionHero } from "../ui/SectionHero";
import { StatusBar } from "../ui/StatusBar";
import { Typewriter } from "../ui/Typewriter";
import { useSFX } from "@/hooks/useSFX";

const dramaticRoleLabel = {
  setup: "Setup",
  pressure: "Pressure",
  decision: "Decision",
  consequence: "Consequence",
} as const;



const crossfade = {
  initial: { opacity: 0, scale: 0.98 },
  animate: { opacity: 1, scale: 1, transition: { duration: 0.26, ease: "easeOut" } },
  exit: { opacity: 0, scale: 0.98, transition: { duration: 0.14 } },
} as const;

export function NarrativeMode() {
  const history = useGameStore((store) => store.progress.history);
  const fullProgress = useGameStore((store) => store.progress);
  const resources = useGameStore((store) => store.restorationResources);
  const chooseHistoryChoice = useGameStore((store) => store.chooseHistoryChoice);
  const advanceHistoryScene = useGameStore((store) => store.advanceHistoryScene);

  const pillarScores = getPillarScores(fullProgress, resources);
  const { playClick } = useSFX();

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
            className="card-dark overflow-hidden historical-lens"
            {...crossfade}
          >
            {currentScene ? (
              <>
                <div className="relative">
                  <GameArtwork
                    src={getHistoryChapterImage(currentChapter.id)}
                    alt={currentChapter.title}
                    aspectRatio="16/9"
                    overlay
                    fadeBottom
                    fallbackArea="historiaInterativa"
                    fallbackLabel={currentChapter.title}
                    className="max-h-[24rem] min-h-[18rem] rounded-b-none border-x-0 border-t-0"
                    sizes="(max-width: 1280px) 100vw, 60vw"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ferrovia)] via-black/40 to-transparent flex flex-col justify-end p-6 md:p-10 pointer-events-none">
                    <div className="flex items-center gap-3 mb-3">
                      <span className="rounded border border-[color:rgba(212,163,103,0.4)] bg-black/60 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-latao)] backdrop-blur-md">
                        Parte {currentChapter.part}
                      </span>
                      <span className="rounded border border-[color:rgba(191,122,79,0.6)] bg-[var(--color-rust)]/80 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-[var(--color-paper)] backdrop-blur-md shadow-[0_0_15px_rgba(161,79,42,0.6)]">
                        {dramaticRoleLabel[currentScene.dramaticRole]}
                      </span>
                    </div>
                    <h1 className="font-serif text-3xl md:text-5xl text-[var(--color-paper)] leading-tight drop-shadow-[0_4px_12px_rgba(0,0,0,1)]">
                      {currentScene.title}
                    </h1>
                    <p className="text-xs uppercase tracking-[0.3em] text-[var(--color-latao)]/80 mt-3 drop-shadow-md">
                      Cena {history.currentSceneIndex + 1} de {scenes.length}
                    </p>
                  </div>
                </div>

                <div className="p-5 md:p-6 pt-4">

                  <div className="mt-4 text-sm leading-7 text-[var(--color-muted)] h-14 md:h-20 lg:h-auto overflow-y-auto">
                    <Typewriter text={currentScene.context} speed={20} />
                  </div>

                  {/* Dialogue with character portrait and quotation */}
                  {/* Dialogue with character portrait and quotation */}
                  <div className="mt-6 relative">
                    <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-[var(--color-latao)]/15 via-transparent to-[var(--color-latao)]/5 blur-xl opacity-20" />
                    <div className="relative flex flex-col md:flex-row items-start gap-5 rounded-2xl border border-[color:rgba(212,163,103,0.4)] bg-[color:rgba(12,15,14,0.48)] p-5 md:p-6 shadow-2xl overflow-hidden">
                      <div className="absolute top-0 right-0 p-4 opacity-5">
                        <span className="font-serif text-8xl text-[var(--color-latao)]">&rdquo;</span>
                      </div>
                      
                      {currentCharacter && (
                        <div className="relative shrink-0 flex flex-col items-center z-10">
                          <CharacterPortrait
                            characterId={currentCharacter.id}
                            name={currentCharacter.name}
                            size={100}
                            className="rounded-full ring-4 ring-[var(--color-latao)]/30 ring-offset-4 ring-offset-[color:var(--color-ferrovia)] shadow-[0_10px_30px_rgba(0,0,0,0.8)]"
                          />
                          <div className="mt-[-10px] px-4 py-1.5 rounded-full bg-[color:var(--color-ferrovia)] border border-[color:var(--color-latao)]/40 shadow-lg relative z-10">
                            <p className="text-[9px] font-bold uppercase tracking-[0.3em] text-[var(--color-latao)]">
                              Depoente
                            </p>
                          </div>
                        </div>
                      )}
                      
                      <div className="min-w-0 flex-1">
                        {currentCharacter && (
                          <h3 className="text-[11px] font-bold uppercase tracking-[0.24em] text-[var(--color-latao)] mb-3">
                            {currentCharacter.name}
                          </h3>
                        )}
                        <div className="font-serif text-lg md:text-xl italic leading-relaxed text-[var(--color-paper)] drop-shadow-sm">
                          <Typewriter text={currentScene.dialogue} speed={25} />
                        </div>
                      </div>
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
                      <p className="text-sm leading-7 text-[var(--color-paper)]">
                        <Typewriter text={history.pendingConsequence} speed={25} />
                      </p>
                      <button className="btn-primary mt-4" onClick={() => { playClick(); advanceHistoryScene(); }}>
                        Avancar cena
                      </button>
                    </div>
                  ) : (
                    <div className="mt-10 grid gap-4 grid-cols-1 lg:grid-cols-2 relative pb-4">
                      <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-cobre)]/5 to-transparent blur-2xl pointer-events-none" />
                      {currentScene.choices.map((choice, i) => (
                        <button
                          key={choice.id}
                          type="button"
                          onClick={() => { playClick(); chooseHistoryChoice(choice.id); }}
                          className="group relative overflow-hidden rounded-2xl border border-[color:rgba(212,163,103,0.3)] bg-[color:rgba(12,15,14,0.4)] p-6 text-left transition-all duration-300 tactical-hover"
                        >
                          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI4IiBoZWlnaHQ9IjgiPgo8cmVjdCB3aWR0aD0iOCIgaGVpZ2h0PSI4IiBmaWxsPSIjMDAwIiBmaWxsLW9wYWNpdHk9IjAuMDUiPjwvcmVjdD4KPHBhdGggZD0iTTAgMEw4IDhaTTEwIDBMOCAyWiIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utb3BhY2l0eT0iMC4wNSIgc3Ryb2tlLXdpZHRoPSIxIj48L3BhdGg+Cjwvc3ZnPg==')] opacity-0 group-hover:opacity-30 transition-opacity pointer-events-none" />
                          <div className="relative z-10 flex flex-col h-full justify-between gap-4">
                            <div>
                               <p className="text-[10px] uppercase font-bold tracking-[0.3em] text-[var(--color-rust)] mb-2 group-hover:text-[var(--color-cobre)] transition-colors">Postura {choiceLetters[i]}</p>
                               <h3 className="font-serif text-2xl leading-tight text-[var(--color-paper)] group-hover:text-white transition-colors">{choice.label}</h3>
                            </div>
                            <div className="flex items-start gap-3 mt-4">
                               <div className="flex-1 border-t border-[color:rgba(212,163,103,0.15)] pt-4">
                                  <p className="text-xs italic leading-6 text-[var(--color-muted)] group-hover:text-[var(--color-paper)]/90 transition-colors">{choice.consequence}</p>
                               </div>
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
