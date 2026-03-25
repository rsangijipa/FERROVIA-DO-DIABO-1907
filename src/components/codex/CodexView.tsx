"use client";

import { codexEntries } from "@/content/codexEntries";
import { useGameStore } from "@/store/useGameStore";

export function CodexView() {
  const unlocked = useGameStore((s) => s.unlockedCodexIds);
  const entries = codexEntries.filter((entry) => unlocked.includes(entry.id));

  return (
    <section className="space-y-4">
      <div className="card-dark p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Museu Digital</p>
        <h1 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">Codex Desbloqueado</h1>
        <p className="mt-2 text-sm text-[var(--color-muted)]">{entries.length} entradas disponíveis nesta sessão.</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {entries.map((entry) => (
          <article key={entry.id} className="card-light p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-moss)]">{entry.type}</p>
            <h2 className="mt-2 font-serif text-xl text-[var(--color-ink)]">{entry.title}</h2>
            <p className="mt-3 text-sm text-[var(--color-ink-soft)]">{entry.body}</p>
            <p className="mt-3 text-xs text-[var(--color-ink-soft)]">Tags: {entry.tags.join(", ")}</p>
          </article>
        ))}
      </div>
    </section>
  );
}
