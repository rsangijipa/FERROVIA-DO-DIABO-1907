"use client";

import type { Resources } from "@/types/game";

import { ResourceIcon } from "./ResourceIcon";
import { StatusBar } from "./StatusBar";

const resourceItems = [
  { key: "orcamento", label: "Orçamento", colorVar: "--color-info" },
  { key: "moral", label: "Moral", colorVar: "--color-latao" },
  { key: "saudeSanitaria", label: "Saúde", colorVar: "--color-success" },
  { key: "progressoTecnico", label: "Progresso", colorVar: "--color-rust" },
  { key: "preservacao", label: "Preservação", colorVar: "--color-info" },
] as const;

export function ResourcePanel({ resources }: { resources: Resources }) {
  return (
    <section className="card-dark grid gap-3 p-4 md:grid-cols-5">
      {resourceItems.map((item) => (
        <div
          key={item.key}
          className="rounded-xl border border-[color:rgba(197,154,93,0.16)] bg-[color:rgba(12,15,14,0.14)] p-3"
        >
          <StatusBar
            label={
              <span className="flex items-center gap-2">
                <ResourceIcon resource={item.key} />
                <span>{item.label}</span>
              </span>
            }
            value={resources[item.key]}
            colorVar={item.colorVar}
          />
        </div>
      ))}
    </section>
  );
}
