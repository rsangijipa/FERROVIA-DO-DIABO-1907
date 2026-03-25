"use client";

import { Factory, ScrollText, BookOpenText, Archive, Trophy } from "lucide-react";

import { modeCovers } from "@/content/assetManifest";
import { useGameStore } from "@/store/useGameStore";

import { ModeCard } from "../ui/ModeCard";
import { SectionHero } from "../ui/SectionHero";

const cards = [
  {
    href: "/restauracao",
    title: "Modo Restauração",
    description: "Gerencie recursos, eventos críticos e os ativos do complexo ferroviário.",
    icon: Factory,
    imageSrc: modeCovers.restauracao,
    fallbackArea: "restauracao" as const,
  },
  {
    href: "/narrativa",
    title: "Modo História",
    description: "Viva decisões entre 1907-1912 com custo humano real e consequências persistentes.",
    icon: ScrollText,
    imageSrc: modeCovers.narrativa,
    fallbackArea: "home" as const,
  },
  {
    href: "/quiz",
    title: "Quiz Histórico",
    description: "Responda, desbloqueie codex e ganhe vantagem cultural no metajogo.",
    icon: BookOpenText,
    imageSrc: modeCovers.quiz,
    fallbackArea: "quiz" as const,
  },
  {
    href: "/codex",
    title: "Codex / Museu",
    description: "Acompanhe personagens, documentos e marcos desbloqueados.",
    icon: Archive,
    imageSrc: modeCovers.codex,
    fallbackArea: "codex" as const,
  },
  {
    href: "/resultado",
    title: "Resultado Integrado",
    description: "Leia seu epílogo cruzando gestão, narrativa e desempenho histórico.",
    icon: Trophy,
    imageSrc: modeCovers.resultado,
    fallbackArea: "resultado" as const,
  },
];

export function HomeHub() {
  const progress = useGameStore((s) => s.player.progress);
  const codex = useGameStore((s) => s.unlockedCodexIds.length);

  return (
    <section className="space-y-6">
      <SectionHero
        eyebrow="Hub narrativo interativo"
        title="Madeira-Mamoré: Trilhos da Memória"
        subtitle="Você participa da reconstrução da memória da ferrovia. Restaure, escolha e aprenda em um ciclo de decisão contínuo."
        imageSrc="/game-assets/backgrounds/patio.jpg"
        imageAlt="Pátio ferroviário histórico da Madeira-Mamoré"
        chips={[`Progresso: ${Math.round(progress)}%`, `Entradas no Codex: ${codex}`, "Save local ativo"]}
        fallbackArea="home"
        preload
      />

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card) => (
          <ModeCard
            key={card.href}
            href={card.href}
            title={card.title}
            description={card.description}
            icon={card.icon}
            imageSrc={card.imageSrc}
            imageAlt={card.title}
            fallbackArea={card.fallbackArea}
          />
        ))}
      </div>
    </section>
  );
}
