"use client";

import Link from "next/link";
import { Factory, ScrollText, BookOpenText, Archive, Trophy } from "lucide-react";

import { useGameStore } from "@/store/useGameStore";

const cards = [
  {
    href: "/restauracao",
    title: "Modo Restauração",
    description: "Gerencie recursos, eventos críticos e os ativos do complexo ferroviário.",
    icon: Factory,
  },
  {
    href: "/narrativa",
    title: "Modo História",
    description: "Viva decisões entre 1907-1912 com custo humano real e consequências persistentes.",
    icon: ScrollText,
  },
  {
    href: "/quiz",
    title: "Quiz Histórico",
    description: "Responda, desbloqueie codex e ganhe vantagem cultural no metajogo.",
    icon: BookOpenText,
  },
  {
    href: "/codex",
    title: "Codex / Museu",
    description: "Acompanhe personagens, documentos e marcos desbloqueados.",
    icon: Archive,
  },
  {
    href: "/resultado",
    title: "Resultado Integrado",
    description: "Leia seu epílogo cruzando gestão, narrativa e desempenho histórico.",
    icon: Trophy,
  },
];

export function HomeHub() {
  const progress = useGameStore((s) => s.player.progress);
  const codex = useGameStore((s) => s.unlockedCodexIds.length);

  return (
    <section className="space-y-6">
      <div className="card-dark p-6">
        <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Hub narrativo interativo</p>
        <h1 className="mt-2 font-serif text-3xl text-[var(--color-paper)]">Madeira-Mamoré: Trilhos da Memória</h1>
        <p className="mt-3 max-w-3xl text-sm text-[var(--color-muted)]">
          Você participa da reconstrução da memória da ferrovia. Restaure, escolha e aprenda em um ciclo de decisão
          contínuo.
        </p>
        <div className="mt-4 flex flex-wrap gap-3 text-xs text-[var(--color-paper)]">
          <span className="chip">Progresso: {Math.round(progress)}%</span>
          <span className="chip">Entradas no Codex: {codex}</span>
          <span className="chip">Save local ativo</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <Link key={card.href} href={card.href} className="card-dark group p-5 transition hover:-translate-y-0.5">
              <div className="flex items-center gap-3">
                <Icon className="text-[var(--color-cobre)]" size={20} />
                <h2 className="font-serif text-xl text-[var(--color-paper)]">{card.title}</h2>
              </div>
              <p className="mt-2 text-sm text-[var(--color-muted)]">{card.description}</p>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
