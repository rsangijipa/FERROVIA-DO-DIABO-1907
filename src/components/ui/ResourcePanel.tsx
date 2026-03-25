"use client";

import type { Resources } from "@/types/game";

import { StatusBar } from "./StatusBar";

export function ResourcePanel({ resources }: { resources: Resources }) {
  return (
    <section className="card-dark grid gap-3 p-4 md:grid-cols-5">
      <StatusBar label="Orçamento" value={resources.orcamento} colorVar="--color-info" />
      <StatusBar label="Moral" value={resources.moral} colorVar="--color-latao" />
      <StatusBar label="Saúde" value={resources.saudeSanitaria} colorVar="--color-success" />
      <StatusBar label="Progresso" value={resources.progressoTecnico} colorVar="--color-rust" />
      <StatusBar label="Preservação" value={resources.preservacao} colorVar="--color-info" />
    </section>
  );
}
