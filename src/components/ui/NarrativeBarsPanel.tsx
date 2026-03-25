"use client";

import type { NarrativeBars } from "@/types/game";

import { StatusBar } from "./StatusBar";

export function NarrativeBarsPanel({ bars }: { bars: NarrativeBars }) {
  return (
    <section className="card-light space-y-3 p-4">
      <StatusBar label="Saúde" value={bars.saude} colorVar="--color-success" />
      <StatusBar label="Moral" value={bars.moral} colorVar="--color-latao" />
      <StatusBar label="Progresso" value={bars.progresso} colorVar="--color-rust" />
    </section>
  );
}
