"use client";

import Link from "next/link";

import { restorationEvents } from "@/content/restorationEvents";
import { useGameStore } from "@/store/useGameStore";

import { ChoiceButton } from "../ui/ChoiceButton";
import { ResourcePanel } from "../ui/ResourcePanel";

const endingText = {
  bom: "O complexo entra em operação com memória preservada e confiança pública elevada.",
  mediano: "A ferrovia avança, mas algumas concessões deixam cicatrizes no acervo e na equipe.",
  ruim: "A restauração chega ao fim com perdas técnicas e desgaste social difícil de reparar.",
};

export function RestorationMode() {
  const resources = useGameStore((s) => s.restorationResources);
  const week = useGameStore((s) => s.restorationWeek);
  const eventIndex = useGameStore((s) => s.restorationEventIndex);
  const status = useGameStore((s) => s.restorationStatus);
  const log = useGameStore((s) => s.restorationLog);
  const resolve = useGameStore((s) => s.resolveRestorationChoice);
  const reset = useGameStore((s) => s.resetRestoration);
  const evaluateEnding = useGameStore((s) => s.evaluateRestorationEnding);

  const event = restorationEvents[eventIndex];
  const ending = evaluateEnding();

  return (
    <section className="space-y-4">
      <ResourcePanel resources={resources} />

      <div className="card-dark p-5">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Semana {Math.min(week, 12)} / 12</p>
        {status === "ongoing" && event ? (
          <>
            <h1 className="mt-2 font-serif text-2xl text-[var(--color-paper)]">{event.title}</h1>
            <p className="mt-3 text-sm text-[var(--color-muted)]">{event.description}</p>
            <div className="mt-4 grid gap-3">
              {event.choices.map((choice) => {
                const entries = Object.entries(choice.consequence.resources).map(([k, v]) => ({ label: k, value: v ?? 0 }));
                return (
                  <ChoiceButton
                    key={choice.id}
                    label={choice.label}
                    deltas={entries}
                    onClick={() => resolve(choice.id)}
                  />
                );
              })}
            </div>
          </>
        ) : (
          <>
            <h1 className="font-serif text-2xl text-[var(--color-paper)]">
              {status === "lost" ? "Derrota na Restauração" : "Ciclo de Restauração Concluído"}
            </h1>
            <p className="mt-3 text-sm text-[var(--color-muted)]">
              {status === "lost"
                ? "Um indicador crítico colapsou. A revitalização foi interrompida antes do prazo mínimo."
                : endingText[ending]}
            </p>
            <div className="mt-4 flex flex-wrap gap-3">
              <button className="btn-primary" onClick={reset}>
                Recomeçar ciclo
              </button>
              <Link className="btn-secondary" href="/resultado">
                Ver resultado integrado
              </Link>
            </div>
          </>
        )}
      </div>

      <div className="card-dark p-5">
        <h2 className="font-serif text-xl text-[var(--color-paper)]">Diário Operacional</h2>
        <ul className="mt-3 space-y-2 text-sm text-[var(--color-muted)]">
          {log.length === 0 ? <li>Nenhum evento resolvido ainda.</li> : log.slice(-5).map((line) => <li key={line}>• {line}</li>)}
        </ul>
      </div>
    </section>
  );
}
