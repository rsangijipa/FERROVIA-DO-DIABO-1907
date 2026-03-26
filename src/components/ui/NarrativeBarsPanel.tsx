"use client";

import clsx from "clsx";
import type { NarrativeBars } from "@/types/game";

import { StatusBar } from "./StatusBar";

const CRITICAL_THRESHOLD = 25;

export function NarrativeBarsPanel({ bars, className }: { bars: NarrativeBars; className?: string }) {
  return (
    <section className={clsx("card-dark space-y-3 p-4", className)}>
      <p className="text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">Estado da jornada</p>
      <div className="space-y-3">
        <div>
          <StatusBar label="Saúde" value={bars.saude} colorVar="--color-success" />
          {bars.saude <= CRITICAL_THRESHOLD && (
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-danger)]">
              ⚠ Crítico
            </p>
          )}
        </div>
        <div>
          <StatusBar label="Moral" value={bars.moral} colorVar="--color-latao" />
          {bars.moral <= CRITICAL_THRESHOLD && (
            <p className="mt-1 text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-danger)]">
              ⚠ Crítico
            </p>
          )}
        </div>
        <div>
          <StatusBar label="Progresso" value={bars.progresso} colorVar="--color-rust" />
        </div>
      </div>
    </section>
  );
}
