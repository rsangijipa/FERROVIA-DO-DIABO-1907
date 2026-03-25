"use client";

import { BookMarked } from "lucide-react";

import { historyChapters, historyScenesByChapterId } from "@/content/historyContent";
import { characters, places } from "@/content/entities";
import { useGameStore } from "@/store/useGameStore";

import { EditorialSeal } from "../ui/EditorialSeal";
import { NarrativeBarsPanel } from "../ui/NarrativeBarsPanel";
import { SectionHero } from "../ui/SectionHero";

const dramaticRoleLabel = {
  setup: "Setup",
  pressure: "Pressure",
  decision: "Decision",
  consequence: "Consequence",
} as const;

export function NarrativeMode() {
  const history = useGameStore((store) => store.progress.history);
  const chooseHistoryChoice = useGameStore((store) => store.chooseHistoryChoice);
  const advanceHistoryScene = useGameStore((store) => store.advanceHistoryScene);

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
        imageSrc="/game-assets/modes/historia.jpg"
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
        <aside className="space-y-4">
          <NarrativeBarsPanel bars={history.bars} />

          <article className="card-light p-5">
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">Estrutura da campanha</p>
            <div className="mt-4 space-y-3">
              {historyChapters.map((chapter) => {
                const active = chapter.id === currentChapter.id;
                const completed = history.completedChapterIds.includes(chapter.id);

                return (
                  <div
                    key={chapter.id}
                    className={`rounded-2xl border p-4 ${
                      active
                        ? "border-[color:rgba(183,106,60,0.32)] bg-[color:rgba(183,106,60,0.08)]"
                        : "border-[color:rgba(183,106,60,0.14)] bg-[color:rgba(31,35,32,0.04)]"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-3">
                      <div>
                        <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-moss)]">Parte {chapter.part}</p>
                        <h2 className="mt-2 font-serif text-xl text-[var(--color-ink)]">{chapter.title}</h2>
                      </div>
                      <span className="image-badge">{completed ? "Concluida" : chapter.status === "planned" ? "Planejada" : "Ativa"}</span>
                    </div>
                    <p className="mt-3 text-sm leading-6 text-[var(--color-ink-soft)]">{chapter.summary}</p>
                  </div>
                );
              })}
            </div>
          </article>
        </aside>

        <article className="card-light p-6">
          {currentScene ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">
                    Parte {currentChapter.part} • Cena {history.currentSceneIndex + 1}/{scenes.length}
                  </p>
                  <h1 className="mt-2 font-serif text-3xl text-[var(--color-ink)]">{currentScene.title}</h1>
                </div>
                <span className="rounded-full border border-[color:rgba(183,106,60,0.24)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--color-rust)]">
                  {dramaticRoleLabel[currentScene.dramaticRole]}
                </span>
              </div>

              <p className="mt-4 text-sm leading-7 text-[var(--color-ink-soft)]">{currentScene.context}</p>
              <blockquote className="mt-4 rounded-2xl border border-[color:rgba(183,106,60,0.16)] bg-[color:rgba(31,35,32,0.04)] p-4 text-sm leading-7 text-[var(--color-ink)]">
                {currentScene.dialogue}
              </blockquote>

              <div className="mt-4 grid gap-3 md:grid-cols-3">
                <div className="rounded-2xl border border-[color:rgba(183,106,60,0.16)] bg-[color:rgba(31,35,32,0.04)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-moss)]">Personagem</p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{currentCharacter?.name ?? "Sem registro"}</p>
                </div>
                <div className="rounded-2xl border border-[color:rgba(183,106,60,0.16)] bg-[color:rgba(31,35,32,0.04)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-moss)]">Lugar</p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{currentPlace?.name ?? "Sem registro"}</p>
                </div>
                <div className="rounded-2xl border border-[color:rgba(183,106,60,0.16)] bg-[color:rgba(31,35,32,0.04)] p-4">
                  <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-moss)]">Ancora historica</p>
                  <p className="mt-2 font-semibold text-[var(--color-ink)]">{currentScene.historicalAnchor}</p>
                </div>
              </div>

              <EditorialSeal
                contentType={currentScene.contentType}
                sourceRef={currentScene.sourceRef}
                confidenceNote={currentScene.confidenceNote}
                className="mt-5"
              />

              <div className="mt-5 rounded-2xl border border-[color:rgba(183,106,60,0.16)] bg-[color:rgba(31,35,32,0.04)] p-4">
                <div className="flex items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-moss)]">
                  <BookMarked size={14} />
                  Outcome tags
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  {currentScene.outcomeTags.map((tag) => (
                    <span key={tag} className="image-badge">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {history.pendingConsequence ? (
                <div className="mt-5 rounded-2xl border border-[color:rgba(183,106,60,0.24)] bg-[color:rgba(183,106,60,0.08)] p-5">
                  <p className="text-sm leading-7 text-[var(--color-ink)]">{history.pendingConsequence}</p>
                  <button className="btn-primary mt-4" onClick={advanceHistoryScene}>
                    Avancar cena
                  </button>
                </div>
              ) : (
                <div className="mt-5 grid gap-3">
                  {currentScene.choices.map((choice) => (
                    <button
                      key={choice.id}
                      type="button"
                      onClick={() => chooseHistoryChoice(choice.id)}
                      className="rounded-2xl border border-[color:rgba(183,106,60,0.22)] bg-[color:rgba(31,35,32,0.04)] p-4 text-left transition hover:border-[color:var(--color-cobre)]"
                    >
                      <h3 className="font-semibold text-[var(--color-ink)]">{choice.label}</h3>
                      <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">{choice.consequence}</p>
                    </button>
                  ))}
                </div>
              )}
            </>
          ) : (
            <div>
              <h1 className="font-serif text-3xl text-[var(--color-ink)]">Slice historico concluido</h1>
              <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
                As duas primeiras partes da Historia Interativa foram concluídas. O restante da campanha ja esta
                previsto no schema para expansao futura.
              </p>
            </div>
          )}
        </article>
      </div>
    </section>
  );
}
