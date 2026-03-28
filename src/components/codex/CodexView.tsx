"use client";

import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
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

import { getMuseumEntryThumb, getMuseumWingImage, museumAssets } from "@/content/assetManifest";
import { museumAreaById, museumAreas, museumEntries } from "@/content/museumContent";
import { getEntryUnlockRequirement, getEntryUnlockSources, museumAreaBonus } from "@/lib/campaign/campaignRewards";
import { useGameStore } from "@/store/useGameStore";
import type { MuseumColorState } from "@/types/game";

import { EditorialSeal } from "../ui/EditorialSeal";
import { GameArtwork } from "../ui/GameArtwork";
import { MuseumNode } from "../ui/MuseumNode";
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

const crossfade = {
  initial: { opacity: 0, x: 10 },
  animate: { opacity: 1, x: 0, transition: { duration: 0.24, ease: "easeOut" } },
  exit: { opacity: 0, x: -10, transition: { duration: 0.12 } },
} as const;

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
        imageSrc={museumAssets.hero}
        imageAlt="Museu Vivo"
        chips={[`${museum.unlockedEntryIds.length} entradas desbloqueadas`, `${unlockedAreas}/9 alas descobertas`, `${museum.viewedEntryIds.length} entradas vistas`]}
        fallbackArea="museuVivo"
        preload
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Left: museum map */}
        <section className="card-dark overflow-hidden flex flex-col relative">
          <div className="absolute inset-0 blueprint-bg opacity-40 mix-blend-overlay pointer-events-none" />
          
          {/* Map base image with integrated overlay */}
          <div className="relative h-64 overflow-hidden shrink-0 border-b border-[color:rgba(212,163,103,0.15)] shadow-inner">
            <Image
              src={museumAssets.mapBase}
              alt="Planta do Complexo"
              fill
              className="object-cover opacity-80 mix-blend-luminosity hover:scale-105 transition-transform duration-1000"
              sizes="(max-width: 1280px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[var(--color-ferrovia)] via-transparent to-[var(--color-ferrovia)]/30" />
            <div className="absolute inset-0 bg-gradient-to-r from-[var(--color-ferrovia)]/80 via-transparent to-transparent" />
            <div className="absolute bottom-6 left-6 flex items-center gap-3">
              <Map size={24} className="text-[var(--color-latao)]" />
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-[var(--color-cobre)] drop-shadow-md">Documento 4A</p>
                <p className="font-serif text-lg text-[var(--color-paper)] drop-shadow-md">Planta Curatorial</p>
              </div>
            </div>
          </div>

          {/* Museum nodes grid */}
          <div className="grid gap-4 p-6 md:grid-cols-2 flex-1 relative z-10">
            {museumAreas.map((area) => {
              const Icon = iconByName[area.icon as keyof typeof iconByName] ?? Archive;
              const state = getAreaColorState(area.id, museum.unlockedEntryIds, museum.viewedEntryIds);
              const active = selectedArea?.id === area.id;

              return (
                <MuseumNode
                  key={area.id}
                  icon={Icon}
                  label={area.title}
                  state={state}
                  active={active}
                  onClick={() => selectMuseumArea(area.id)}
                />
              );
            })}
          </div>
        </section>

        {/* Right: selected wing detail */}
        <AnimatePresence mode="wait">
          <motion.article
            key={selectedAreaId ?? "none"}
            className="card-dark overflow-hidden"
            {...crossfade}
          >
            {selectedArea ? (
              <>
                {/* Wing artwork */}
                <GameArtwork
                  src={getMuseumWingImage(selectedArea.id)}
                  alt={selectedArea.title}
                  aspectRatio="16/9"
                  overlay
                  fadeBottom
                  fallbackArea="museuVivo"
                  fallbackLabel={selectedArea.title}
                  className="max-h-[12rem] min-h-[8rem] rounded-b-none border-x-0 border-t-0"
                  sizes="(max-width: 1280px) 100vw, 55vw"
                />

                <div className="p-5 md:p-6">
                  <div className="flex flex-wrap items-center justify-between gap-3">
                    <div>
                      <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Ala selecionada</p>
                      <h1 className="mt-2 font-serif text-2xl md:text-3xl text-[var(--color-paper)]">{selectedArea.title}</h1>
                    </div>
                    <span className="image-badge image-badge-gold">
                      {getAreaColorState(selectedArea.id, museum.unlockedEntryIds, museum.viewedEntryIds) === "complete" ? "Completa" : getAreaColorState(selectedArea.id, museum.unlockedEntryIds, museum.viewedEntryIds) === "restored" ? "Restaurada" : getAreaColorState(selectedArea.id, museum.unlockedEntryIds, museum.viewedEntryIds) === "discovered" ? "Descoberta" : "Trancada"}
                    </span>
                  </div>
                  {/* Acervo bonus */}
                  {museumAreaBonus[selectedArea.id] && (
                    <p className="mt-2 text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-cobre)]">
                      Complete para ganhar: +{museumAreaBonus[selectedArea.id]}% Acervo do Museu
                    </p>
                  )}

                  <EditorialSeal
                    contentType={selectedArea.contentType}
                    sourceRef={selectedArea.sourceRef}
                    confidenceNote={selectedArea.confidenceNote}
                    className="mt-4"
                  />

                  {selectedEntries.length === 0 ? (
                    <div className="mt-5 rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.18)] p-5">
                      <p className="text-sm leading-7 text-[var(--color-muted)]">
                        Esta ala ainda não foi desbloqueada por progresso suficiente.
                      </p>
                      {/* Show locked entries with unlock requirements */}
                      {(() => {
                        const lockedEntries = museumEntries.filter(
                          (e) => e.areaId === selectedArea.id && !museum.unlockedEntryIds.includes(e.id),
                        );
                        if (lockedEntries.length === 0) return null;
                        return (
                          <div className="mt-3 space-y-2">
                            {lockedEntries.map((entry) => (
                              <p key={entry.id} className="text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                                {entry.title}: Para desbloquear: {getEntryUnlockRequirement(entry.id)}
                              </p>
                            ))}
                          </div>
                        );
                      })()}
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
                            aria-expanded={viewed}
                            aria-label={`Entrada: ${entry.title}. Status: ${viewed ? "Vista" : "Nova"}`}
                            className={`group w-full rounded-2xl border p-5 text-left transition-all duration-300 relative overflow-hidden ${
                              viewed
                                ? "border-[color:rgba(212,163,103,0.3)] bg-[color:rgba(12,15,14,0.4)] shadow-md"
                                : "border-[color:var(--color-cobre)] bg-[color:rgba(212,163,103,0.1)] tactical-hover shadow-[0_0_20px_rgba(212,163,103,0.15)]"
                            }`}
                          >
                            {!viewed && <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[var(--color-latao)]/20 to-transparent pointer-events-none translate-x-[-100%] animate-[shine-sweep_3s_infinite]" />}
                            
                            {/* Entry Header */}
                            <div className="flex flex-col md:flex-row md:items-start gap-5 relative z-10">
                              <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg border-2 border-[var(--color-latao)] shadow-[0_8px_16px_rgba(0,0,0,0.6)] group-hover:scale-105 transition-transform duration-500">
                                <Image
                                  src={getMuseumEntryThumb(entry.id, selectedArea.id)}
                                  alt={entry.title}
                                  fill
                                  className="object-cover"
                                  sizes="80px"
                                />
                                <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.8)] pointer-events-none" />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
                                  <span className={`text-[9px] uppercase font-bold tracking-[0.25em] px-2 py-1 rounded border ${viewed ? "border-white/10 text-white/50 bg-black/40" : "border-[var(--color-cobre)] text-[var(--color-latao)] bg-[var(--color-cobre)]/20 shadow-[0_0_8px_rgba(212,163,103,0.6)]"}`}>
                                    {viewed ? "Catalogado" : "Nova Descoberta"}
                                  </span>
                                  <p className="text-[10px] uppercase tracking-[0.16em] text-[var(--color-cobre)] opacity-80 flex items-center gap-1">
                                    <Archive size={10} /> Origem: {getEntryUnlockSources(entry.id).label}
                                  </p>
                                </div>
                                <h2 className="font-serif text-xl md:text-2xl text-[var(--color-paper)] drop-shadow-sm">{entry.title}</h2>
                                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{entry.summary}</p>
                              </div>
                            </div>

                            {viewed && (
                              <div className="mt-4 grid gap-3 md:grid-cols-2">
                                {[
                                  { label: "O que é", text: entry.whatIsIt },
                                  { label: "Como era utilizado", text: entry.historicalUse },
                                  { label: "Onde aparece no jogo", text: entry.whereAppearsInGame },
                                  { label: "Por que importa hoje", text: entry.whyItMattersToday },
                                ].map((item) => (
                                  <div key={item.label} className="rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.12)] p-4">
                                    <p className="text-xs uppercase tracking-[0.16em] text-[var(--color-latao)]">{item.label}</p>
                                    <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{item.text}</p>
                                  </div>
                                ))}
                              </div>
                            )}

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
                </div>
              </>
            ) : null}
          </motion.article>
        </AnimatePresence>
      </div>
    </section>
  );
}
