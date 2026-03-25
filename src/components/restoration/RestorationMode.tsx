"use client";

import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";

import { modeCovers } from "@/content/assetManifest";
import { restorationEvents } from "@/content/restorationEvents";
import { useGameStore } from "@/store/useGameStore";

import { ChoiceButton } from "../ui/ChoiceButton";
import { GameArtwork } from "../ui/GameArtwork";
import { ResourcePanel } from "../ui/ResourcePanel";

const endingText = {
  bom: "O complexo entra em operação com memória preservada e confiança pública elevada.",
  mediano: "A ferrovia avança, mas algumas concessões deixam cicatrizes no acervo e na equipe.",
  ruim: "A restauração chega ao fim com perdas técnicas e desgaste social difícil de reparar.",
};

const formatTag = (tag: string) => tag.replace(/-/g, " ");

export function RestorationMode() {
  const resources = useGameStore((s) => s.restorationResources);
  const week = useGameStore((s) => s.restorationWeek);
  const eventIndex = useGameStore((s) => s.restorationEventIndex);
  const status = useGameStore((s) => s.restorationStatus);
  const log = useGameStore((s) => s.restorationLog);
  const resolve = useGameStore((s) => s.resolveRestorationChoice);
  const reset = useGameStore((s) => s.resetRestoration);
  const evaluateEnding = useGameStore((s) => s.evaluateRestorationEnding);
  const reducedMotion = useGameStore((s) => s.settings.reducedMotion);

  const event = restorationEvents[eventIndex];
  const ending = evaluateEnding();
  const motionTransition = reducedMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" as const };
  const motionInitial = reducedMotion ? false : { opacity: 0, y: 12 };
  const motionExit = reducedMotion ? { opacity: 1 } : { opacity: 0, y: -8 };

  return (
    <section className="space-y-4">
      <ResourcePanel resources={resources} />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1.6fr)_minmax(320px,0.95fr)]">
        <AnimatePresence mode="wait">
          {status === "ongoing" && event ? (
            <motion.article
              key={event.id}
              initial={motionInitial}
              animate={{ opacity: 1, y: 0 }}
              exit={motionExit}
              transition={motionTransition}
              className="card-dark overflow-hidden"
            >
              <GameArtwork
                src={event.image}
                alt={event.title}
                aspectRatio="16/9"
                overlay
                preload={eventIndex === 0}
                fallbackArea="restauracao"
                fallbackLabel={event.title}
                className="rounded-none border-0"
                sizes="(max-width: 1280px) 100vw, 68vw"
              />

              <div className="p-5 md:p-6">
                <div className="flex flex-wrap gap-2">
                  <span className="image-badge image-badge-gold">Semana {Math.min(week, 12)} / 12</span>
                  {event.tags.map((tag) => (
                    <span key={tag} className="image-badge">
                      {formatTag(tag)}
                    </span>
                  ))}
                </div>

                <h1 className="mt-4 font-serif text-2xl text-[var(--color-paper)] md:text-3xl">{event.title}</h1>
                <p className="mt-3 max-w-3xl text-sm leading-7 text-[var(--color-muted)]">{event.description}</p>

                <div className="mt-5 grid gap-3">
                  {event.choices.map((choice) => {
                    const entries = Object.entries(choice.consequence.resources).map(([k, v]) => ({
                      label: k,
                      value: v ?? 0,
                    }));

                    return (
                      <ChoiceButton key={choice.id} label={choice.label} deltas={entries} onClick={() => resolve(choice.id)} />
                    );
                  })}
                </div>
              </div>
            </motion.article>
          ) : (
            <motion.article
              key="restoration-ending"
              initial={motionInitial}
              animate={{ opacity: 1, y: 0 }}
              exit={motionExit}
              transition={motionTransition}
              className="card-dark overflow-hidden"
            >
              <GameArtwork
                src={modeCovers.restauracao}
                alt="Oficina de restauração da Madeira-Mamoré"
                aspectRatio="16/9"
                overlay
                fallbackArea="restauracao"
                fallbackLabel="Ciclo de restauração"
                className="rounded-none border-0"
                sizes="(max-width: 1280px) 100vw, 68vw"
              />

              <div className="p-5 md:p-6">
                <span className="image-badge image-badge-gold">
                  {status === "lost" ? "Campanha interrompida" : "Ciclo de restauração concluído"}
                </span>
                <h1 className="mt-4 font-serif text-2xl text-[var(--color-paper)] md:text-3xl">
                  {status === "lost" ? "Derrota na Restauração" : "Ciclo de Restauração Concluído"}
                </h1>
                <p className="mt-3 text-sm leading-7 text-[var(--color-muted)]">
                  {status === "lost"
                    ? "Um indicador crítico colapsou. A revitalização foi interrompida antes do prazo mínimo."
                    : endingText[ending]}
                </p>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button className="btn-primary" onClick={reset}>
                    Recomeçar ciclo
                  </button>
                  <Link className="btn-secondary" href="/resultado">
                    Ver resultado integrado
                  </Link>
                </div>
              </div>
            </motion.article>
          )}
        </AnimatePresence>

        <aside className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.24em] text-[var(--color-muted)]">Registro recente</p>
          <h2 className="mt-2 font-serif text-xl text-[var(--color-paper)]">Diário Operacional</h2>
          <ul className="mt-4 space-y-3 text-sm leading-6 text-[var(--color-muted)]">
            {log.length === 0 ? (
              <li>Nenhum evento resolvido ainda.</li>
            ) : (
              log.slice(-5).map((line) => <li key={line}>• {line}</li>)
            )}
          </ul>
        </aside>
      </div>
    </section>
  );
}
