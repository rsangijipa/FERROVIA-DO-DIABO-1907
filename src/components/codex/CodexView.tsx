"use client";

import { modeCovers, resolveCodexThumb } from "@/content/assetManifest";
import { codexEntries } from "@/content/codexEntries";
import { useGameStore } from "@/store/useGameStore";

import { GameArtwork } from "../ui/GameArtwork";
import { SectionHero } from "../ui/SectionHero";

export function CodexView() {
  const unlocked = useGameStore((s) => s.unlockedCodexIds);
  const entries = codexEntries.filter((entry) => unlocked.includes(entry.id));

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Museu Digital"
        title="Codex Desbloqueado"
        subtitle="Um acervo vivo de personagens, documentos e marcos que conectam patrimônio ferroviário, memória social e contexto histórico."
        imageSrc={modeCovers.codex}
        imageAlt="Acervo museológico da Madeira-Mamoré"
        chips={[`${entries.length} entradas disponíveis`, "Curadoria local"]}
        fallbackArea="codex"
        preload
      />

      {entries.length === 0 ? (
        <article className="card-light p-6">
          <h2 className="font-serif text-2xl text-[var(--color-ink)]">Acervo em formação</h2>
          <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">
            Novas entradas serão liberadas conforme você avançar na restauração, na narrativa e no quiz.
          </p>
        </article>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {entries.map((entry) => (
            <article key={entry.id} className="card-light flex gap-4 p-5">
              <GameArtwork
                src={resolveCodexThumb(entry)}
                alt=""
                aspectRatio="1/1"
                fit="contain"
                fallbackArea="codex"
                fallbackLabel={entry.title}
                className="w-20 shrink-0 rounded-[1rem] border-[color:rgba(183,106,60,0.18)] bg-[color:rgba(31,35,32,0.05)]"
                imageClassName="p-4"
                sizes="80px"
              />

              <div className="min-w-0">
                <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-moss)]">{entry.type}</p>
                <h2 className="mt-2 font-serif text-xl text-[var(--color-ink)]">{entry.title}</h2>
                <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">{entry.body}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {entry.tags.map((tag) => (
                    <span key={tag} className="rounded-full border border-[color:rgba(183,106,60,0.2)] px-3 py-1 text-xs text-[var(--color-ink-soft)]">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}
