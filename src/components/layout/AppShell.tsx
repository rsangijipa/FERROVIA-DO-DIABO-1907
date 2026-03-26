"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  BookOpenText,
  Compass,
  Factory,
  Map,
  ScrollText,
  Target,
  Trophy,
  Wrench,
} from "lucide-react";
import clsx from "clsx";

import { sharedBackgrounds } from "@/content/assetManifest";
import { getCampaignState } from "@/lib/campaign/campaignEngine";
import { modeRoutes } from "@/lib/constants";
import { useGameStore } from "@/store/useGameStore";

import { AmbientParticles } from "../ui/AmbientParticles";
import { ProgressRing } from "../ui/ProgressRing";

const navItems = [
  { href: "/", label: "Hub", icon: Compass },
  { href: "/restauracao-2026", label: "Restauração 2026", icon: Factory },
  { href: "/historia-interativa", label: "Historia Interativa", icon: ScrollText },
  { href: "/quiz-tematico", label: "Quiz Tematico", icon: BookOpenText },
  { href: "/museu-vivo", label: "Museu Vivo", icon: Archive },
  { href: "/resultado-integrado", label: "Resultado", icon: Trophy },
  { href: "/config", label: "Config", icon: Wrench },
];

const routeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useGameStore((store) => store.globalState);
  const fontScale = useGameStore((store) => store.settings.fontScale);
  const playerName = useGameStore((store) => store.player.name);
  const playerProgress = useGameStore((store) => store.player.progress);
  const progress = useGameStore((store) => store.progress);
  const resources = useGameStore((store) => store.restorationResources);

  const campaign = getCampaignState(progress, resources);

  return (
    <div className="min-h-screen text-[var(--color-text)]" style={{ fontSize: `${fontScale}rem` }}>
      {/* Atmospheric background layers */}
      <div
        className="fixed inset-0 -z-30 ambient-drift"
        style={{
          backgroundImage: `url(${sharedBackgrounds.darkGrid})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "saturate(0.5) brightness(0.25)",
        }}
      />
      <div
        className="pointer-events-none fixed inset-0 -z-25"
        style={{
          backgroundImage: `url(${sharedBackgrounds.mapLines})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.06,
          mixBlendMode: "screen",
        }}
      />
      <div className="fixed inset-0 -z-20 ambient-scrim" />
      <div className="pointer-events-none fixed inset-0 -z-15 vignette-soft" />
      <div className="pointer-events-none fixed inset-0 -z-10 ambient-grid" />

      <AmbientParticles />

      {/* Header */}
      <header className="sticky top-0 z-20 bg-[color:rgba(10,12,11,0.86)] backdrop-blur-lg">
        <nav
          className="mx-auto flex w-full max-w-7xl items-center justify-between px-2 pb-2 pt-2 md:px-4"
          role="navigation"
          aria-label="Menu principal"
        >
          <div>
            <p className="font-serif text-xl tracking-wide text-[var(--color-latao)]">Madeira-Mamore</p>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Trilhos da Memoria</p>
          </div>

          <div className="flex flex-wrap items-center gap-3 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            {/* Progress ring */}
            <ProgressRing value={playerProgress} size={32} strokeWidth={3} className="mr-1" />

            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.36)] px-3 py-2">
              <Map size={12} />
              {playerName}
            </span>
            <span className="glow-badge inline-flex rounded-full border border-[color:rgba(212,163,103,0.32)] bg-[color:rgba(212,163,103,0.1)] px-3 py-2 text-[var(--color-latao)]">
              {playerProgress}%
            </span>
            <span className="inline-flex rounded-full border border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.36)] px-3 py-2">
              {state}
            </span>
          </div>
        </nav>

        <nav className="mx-auto flex w-full max-w-7xl flex-wrap gap-2 px-4 pb-4 md:px-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={isActive ? "page" : undefined}
                className={clsx(
                  `inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all duration-200`,
                  isActive
                    ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)] text-[var(--color-paper)] glow-badge rail-underline"
                    : "border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.4)] text-[var(--color-muted)] hover:text-[var(--color-paper)] hover:border-[color:rgba(212,163,103,0.2)]"
                )}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>

        {/* Gold separator */}
        <div className="gold-separator" />

        {/* Campaign bar */}
        <div className="mx-auto flex w-full max-w-7xl items-center gap-3 px-4 py-2 md:px-6">
          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color:rgba(233,223,201,0.12)]">
            <motion.div
              className="h-full rounded-full bg-[var(--color-latao)]"
              initial={false}
              animate={{ width: `${campaign.overallProgress}%` }}
              transition={{ type: "spring", stiffness: 120, damping: 18 }}
            />
          </div>
          <span className="shrink-0 text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-latao)]">
            {campaign.overallProgress}% Revitalização
          </span>
        </div>

        {/* Current mission */}
        {campaign.currentMission ? (
          <Link
            href={modeRoutes.find(m => m.id === campaign.recommendedModule)?.href ?? "/"}
            className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 pb-2 transition-colors hover:text-[var(--color-paper)] md:px-6"
          >
            <Target size={12} className="shrink-0 text-[var(--color-cobre)]" />
            <span className="truncate text-xs text-[var(--color-muted)]">
              <span className="hidden sm:inline">{campaign.currentMission.title}</span>
              <span className="sm:hidden">Missão: {campaign.currentMission.title.split(" ").slice(-1)[0]}</span>
            </span>
            <span className="ml-auto shrink-0 text-[0.6rem] uppercase tracking-[0.12em] text-[var(--color-cobre)]">
              {campaign.currentMission.impact}
            </span>
          </Link>
        ) : (
          <div className="mx-auto flex w-full max-w-7xl items-center gap-2 px-4 pb-2 md:px-6">
            <Target size={12} className="shrink-0 text-[var(--color-success)]" />
            <span className="text-xs text-[var(--color-success)]">Campanha concluída</span>
          </div>
        )}
      </header>

      {/* Content shell with route transition */}
      <AnimatePresence mode="wait">
        <motion.main
          key={pathname}
          variants={routeVariants}
          initial="initial"
          animate="animate"
          exit="exit"
          transition={{ duration: 0.18, ease: "easeOut" }}
          className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 md:px-6"
        >
          {children}
        </motion.main>
      </AnimatePresence>
    </div>
  );
}
