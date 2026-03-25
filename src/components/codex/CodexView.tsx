"use client";

import {
  Archive,
  Cross,
  Hammer,
  Map,
  Package,
  Route,
  ScrollText,
  TrainFront,
  Users,
} from "lucide-react";

import { museumAreaById, museumAreas, museumEntries } from "@/content/museumContent";
import { useGameStore } from "@/store/useGameStore";
import type { MuseumColorState } from "@/types/game";

import { EditorialSeal } from "../ui/EditorialSeal";
import { SectionHero } from "../ui/SectionHero";

const iconByName = {
  archive: Archive,
  cross: Cross,
  hammer: Hammer,
  map: Map,
  package: Package,
  route: Route,
  "scroll-text": ScrollText,
  "train-front": TrainFront,
  users: Users,
};

const colorStateLabel: Record<MuseumColorState, string> = {
  locked: "Locked",
  discovered: "Discovered",
  restored: "Restored",
  complete: "Complete",
};

const getAreaColorState = (
  areaId: string,
  unlockedEntryIds: string[],
  viewedEntryIds: string[],
): MuseumColorState => {
  const area = museumAreaById[areaId];
  if (!area || area.entryIds.length === 0) return "locked";

  const unlockedCount = area.entryIds.filter((entryId) => unlockedEntryIds.includes(entryId)).length;
  const viewedCount = area.entryIds.filter((entryId) => viewedEntryIds.includes(entryId)).length;

  if (unlockedCount === 0) return "locked";
  if (viewedCount === 0) return "discovered";
  if (viewedCount < area.entryIds.length) return "restored";
  return "complete";
};

export function CodexView() {
  const museum = useGameStore((store) => store.progress.museum);
  const selectMuseumArea = useGameStore((store) => store.selectMuseumArea);
  const viewMuseumEntry = useGameStore((store) => store.viewMuseumEntry);

  const selectedAreaId = museum.selectedAreaId ?? museumAreas[0]?.id ?? null;
  const selectedArea = selectedAreaId ? museumAreaById[selectedAreaId] : null;
  const selectedEntries = selectedArea
    ? museumEntries.filter((entry) => entry.areaId === selectedArea.id && museum.unlockedEntryIds.includes(entry.id))
    : [];
  const unlockedAreas = museumAreas.filter((area) => getAreaColorState(area.id, museum.unlockedEntryIds, museum.viewedEntryIds) !== "locked").length;

  return (
    <section className="space-y-4">
      <SectionHero
        eyebrow="Payoff do jogo"
        title="Museu Vivo"
        subtitle="Mapa inicial com 3 alas operacionais e 9 alas planejadas. Cada entrada conecta o que e, como era usado, onde aparece no jogo e por que importa hoje."
        imageSrc="/game-assets/modes/codex.jpg"
        imageAlt="Museu Vivo"
        chips={[`${museum.unlockedEntryIds.length} entradas desbloqueadas`, `${unlockedAreas}/9 alas descobertas`, `${museum.viewedEntryIds.length} entradas vistas`]}
        fallbackArea="museuVivo"
        preload
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        <section className="card-dark p-5">
          <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Mapa do museu</p>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {museumAreas.map((area) => {
              const Icon = iconByName[area.icon as keyof typeof iconByName] ?? Archive;
              const state = getAreaColorState(area.id, museum.unlockedEntryIds, museum.viewedEntryIds);
              const active = selectedArea?.id === area.id;

              return (
                <button
                  key={area.id}
                  type="button"
                  onClick={() => selectMuseumArea(area.id)}
                  className={`rounded-2xl border p-4 text-left transition ${
                    active
                      ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.16)]"
                      : "border-[color:rgba(233,223,201,0.1)] bg-[color:rgba(12,15,14,0.2)]"
                  }`}
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[color:rgba(233,223,201,0.12)] bg-[color:rgba(12,15,14,0.24)] text-[var(--color-paper)]">
                      <Icon size={18} />
                    </span>
                    <span className={`image-badge ${state === "complete" ? "image-badge-gold" : ""}`}>{colorStateLabel[state]}</span>
                  </div>
                  <h2 className="mt-4 font-serif text-xl text-[var(--color-paper)]">{area.title}</h2>
                  <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">
                    {area.status === "planned" ? "Estrutura prevista para expansao futura." : `${area.entryIds.length} entradas na Entrega 1.`}
                  </p>
                </button>
              );
            })}
          </div>
        </section>

        <article className="card-light p-6">
          {selectedArea ? (
            <>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-moss)]">Ala selecionada</p>
                  <h1 className="mt-2 font-serif text-3xl text-[var(--color-ink)]">{selectedArea.title}</h1>
                </div>
                <span className="image-badge">{colorStateLabel[getAreaColorState(selectedArea.id, museum.unlockedEntryIds, museum.viewedEntryIds)]}</span>
              </div>

              <EditorialSeal
                contentType={selectedArea.contentType}
                sourceRef={selectedArea.sourceRef}
                confidenceNote={selectedArea.confidenceNote}
                className="mt-4"
              />

              {selectedEntries.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-[color:rgba(183,106,60,0.16)] bg-[color:rgba(31,35,32,0.04)] p-5">
                  <p className="text-sm leading-7 text-[var(--color-ink-soft)]">
                    Esta ala ainda nao foi desbloqueada por progresso suficiente. Continue jogando para descobrir suas
                    entradas.
                  </p>
                </div>
              ) : (
                <div className="mt-5 space-y-4">
                  {selectedEntries.map((entry) => {
                    const viewed = museum.viewedEntryIds.includes(entry.id);
                    return (
                      <button
                        key={entry.id}
                        type="button"
                        onClick={() => viewMuseumEntry(entry.id)}
                        className={`w-full rounded-2xl border p-5 text-left transition ${
                          viewed
                            ? "border-[color:rgba(183,106,60,0.28)] bg-[color:rgba(183,106,60,0.07)]"
                            : "border-[color:rgba(183,106,60,0.16)] bg-[color:rgba(31,35,32,0.04)] hover:border-[color:var(--color-cobre)]"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3">
                          <h2 className="font-serif text-2xl text-[var(--color-ink)]">{entry.title}</h2>
                          <span className="image-badge">{viewed ? "Vista" : "Nova"}</span>
                        </div>
                        <p className="mt-3 text-sm leading-7 text-[var(--color-ink-soft)]">{entry.summary}</p>
                        <div className="mt-4 grid gap-3 md:grid-cols-2">
                          <div className="rounded-2xl border border-[color:rgba(183,106,60,0.14)] bg-white/50 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-moss)]">O que e</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">{entry.whatIsIt}</p>
                          </div>
                          <div className="rounded-2xl border border-[color:rgba(183,106,60,0.14)] bg-white/50 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-moss)]">Como era utilizado</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">{entry.historicalUse}</p>
                          </div>
                          <div className="rounded-2xl border border-[color:rgba(183,106,60,0.14)] bg-white/50 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-moss)]">Onde aparece no jogo</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">{entry.whereAppearsInGame}</p>
                          </div>
                          <div className="rounded-2xl border border-[color:rgba(183,106,60,0.14)] bg-white/50 p-4">
                            <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-moss)]">Por que importa hoje</p>
                            <p className="mt-2 text-sm leading-6 text-[var(--color-ink-soft)]">{entry.whyItMattersToday}</p>
                          </div>
                        </div>
                        <EditorialSeal
                          contentType={entry.contentType}
                          sourceRef={entry.sourceRef}
                          confidenceNote={entry.confidenceNote}
                          compact
                          className="mt-4"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </>
          ) : null}
        </article>
      </div>
    </section>
  );
}
