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
        imageSrc={museumAssets.hero}
        imageAlt="Museu Vivo"
        chips={[`${museum.unlockedEntryIds.length} entradas desbloqueadas`, `${unlockedAreas}/9 alas descobertas`, `${museum.viewedEntryIds.length} entradas vistas`]}
        fallbackArea="museuVivo"
        preload
      />

      <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_minmax(0,1.15fr)]">
        {/* Left: museum map */}
        <section className="card-dark overflow-hidden p-0">
          {/* Map base image */}
          <div className="relative h-40 overflow-hidden">
            <Image
              src={museumAssets.mapBase}
              alt="Mapa do museu"
              fill
              className="object-cover"
              sizes="(max-width: 1280px) 100vw, 50vw"
            />
            <div className="absolute inset-0 bg-[linear-gradient(180deg,transparent_20%,rgba(25,29,27,0.95))]" />
            <div className="absolute bottom-4 left-5">
              <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-latao)]">Mapa do museu</p>
            </div>
          </div>

          {/* Museum nodes grid */}
          <div className="grid gap-3 p-5 md:grid-cols-2">
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
                      <h1 className="mt-2 font-serif text-3xl text-[var(--color-paper)]">{selectedArea.title}</h1>
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
                            className={`w-full rounded-2xl border p-5 text-left transition-all duration-200 ${
                              viewed
                                ? "border-[color:rgba(212,163,103,0.3)] bg-[color:rgba(212,163,103,0.08)]"
                                : "border-[color:rgba(233,223,201,0.1)] bg-[color:rgba(12,15,14,0.18)] hover:border-[color:var(--color-cobre)] hover-lift-game"
                            }`}
                          >
                            {/* Entry thumbnail */}
                            <div className="flex gap-4">
                              <div className="relative h-16 w-16 shrink-0 overflow-hidden rounded-xl border border-[color:var(--color-border)]">
                                <Image
                                  src={getMuseumEntryThumb(entry.id, selectedArea.id)}
                                  alt={entry.title}
                                  fill
                                  className="object-cover"
                                  sizes="64px"
                                />
                              </div>
                              <div className="min-w-0 flex-1">
                                <div className="flex items-center justify-between gap-3">
                                  <h2 className="font-serif text-xl text-[var(--color-paper)]">{entry.title}</h2>
                                  <span className={`image-badge ${viewed ? "image-badge-gold" : ""}`}>{viewed ? "Vista" : "Nova"}</span>
                                </div>
                                <p className="mt-2 text-sm leading-6 text-[var(--color-muted)]">{entry.summary}</p>
                              {/* Source attribution */}
                              <p className="mt-1 text-[0.6rem] uppercase tracking-[0.12em] text-[var(--color-cobre)]">
                                Desbloqueado por: {getEntryUnlockSources(entry.id).label}
                              </p>
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
