"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, MotionConfig, motion } from "framer-motion";
import { Archive, BookOpenText, Compass, Factory, Menu, ScrollText, Trophy, Wrench, X } from "lucide-react";
import clsx from "clsx";

import { getCampaignState } from "@/lib/campaign/campaignEngine";
import { useGameStore } from "@/store/useGameStore";

import { AmbientParticles } from "../ui/AmbientParticles";
import { ProgressRing } from "../ui/ProgressRing";

const navItems = [
  { href: "/", label: "Hub", icon: Compass },
  { href: "/restauracao-2026", label: "Restauração", icon: Factory },
  { href: "/historia-interativa", label: "História", icon: ScrollText },
  { href: "/quiz-tematico", label: "Quiz", icon: BookOpenText },
  { href: "/museu-vivo", label: "Museu", icon: Archive },
  { href: "/resultado-integrado", label: "Resultado", icon: Trophy },
  { href: "/config", label: "Config", icon: Wrench },
];

const routeVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
};

function PreferenceBridge() {
  const settings = useGameStore((store) => store.settings);

  useEffect(() => {
    document.documentElement.dataset.highContrast = String(settings.highContrast);
    document.documentElement.dataset.reducedMotion = String(settings.reducedMotion);
  }, [settings.highContrast, settings.reducedMotion]);

  return null;
}

export function AppShellClient({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const state = useGameStore((store) => store.globalState);
  const settings = useGameStore((store) => store.settings);
  const playerProgress = useGameStore((store) => store.player.progress);
  const progress = useGameStore((store) => store.progress);
  const resources = useGameStore((store) => store.restorationResources);

  const campaign = getCampaignState(progress, resources);

  return (
    <MotionConfig reducedMotion={settings.reducedMotion ? "always" : "never"}>
      <PreferenceBridge />
      <AmbientParticles />

      <div className="min-h-screen text-[var(--color-text)]" style={{ fontSize: `${settings.fontScale}rem` }}>
        <header className="sticky top-0 z-30 border-b border-[color:rgba(212,163,103,0.14)] bg-[color:rgba(10,12,11,0.92)] backdrop-blur-lg">
          <div className="mx-auto flex w-full max-w-7xl box-border items-center justify-between gap-3 px-4 py-3 md:px-6">
            <div className="min-w-0">
              <p className="font-serif text-lg tracking-wide text-[var(--color-latao)] md:text-xl">Madeira-Mamore</p>
              <p className="text-[0.65rem] uppercase tracking-[0.22em] text-[var(--color-muted)]">Trilhos da Memoria</p>
            </div>

            <div className="hidden items-center gap-3 md:flex">
              <ProgressRing value={playerProgress} size={34} strokeWidth={3} />
              <span className="glow-badge inline-flex rounded-full border border-[color:rgba(212,163,103,0.32)] bg-[color:rgba(212,163,103,0.1)] px-3 py-2 text-xs uppercase tracking-[0.16em] text-[var(--color-latao)]">
                {playerProgress}%
              </span>
            </div>

            <div className="flex items-center gap-2 md:hidden">
              <ProgressRing value={playerProgress} size={30} strokeWidth={3} />
              <button
                type="button"
                className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.36)] text-[var(--color-paper)]"
                aria-expanded={menuOpen}
                aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                onClick={() => setMenuOpen((value) => !value)}
              >
                {menuOpen ? <X size={18} /> : <Menu size={18} />}
              </button>
            </div>
          </div>

          <div className="mx-auto hidden w-full max-w-7xl box-border items-center gap-3 px-4 py-2 md:flex md:px-6">
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

          <div className="mx-auto hidden w-full max-w-7xl box-border flex-wrap gap-2 px-4 pb-4 pt-2 md:flex md:px-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={clsx(
                    "inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition-all duration-200",
                    isActive
                      ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)] text-[var(--color-paper)] glow-badge rail-underline"
                      : "border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.4)] text-[var(--color-muted)] hover:border-[color:rgba(212,163,103,0.2)] hover:text-[var(--color-paper)]",
                  )}
                >
                  <Icon size={14} />
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="gold-separator" />

          <div className="mx-auto flex w-full max-w-7xl box-border items-center gap-3 px-4 py-2 md:hidden">
            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[color:rgba(233,223,201,0.12)]">
              <motion.div
                className="h-full rounded-full bg-[var(--color-latao)]"
                initial={false}
                animate={{ width: `${campaign.overallProgress}%` }}
                transition={{ type: "spring", stiffness: 120, damping: 18 }}
              />
            </div>
            <span className="text-[0.65rem] uppercase tracking-[0.14em] text-[var(--color-latao)]">
              {campaign.overallProgress}%
            </span>
          </div>

          {menuOpen ? (
            <div className="border-t border-[color:rgba(212,163,103,0.14)] bg-[color:rgba(8,10,9,0.96)] px-4 pb-4 pt-3 md:hidden">
              <div className="space-y-2">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMenuOpen(false)}
                      className={clsx(
                        "flex items-center justify-between rounded-2xl border px-4 py-3 text-sm",
                        isActive
                          ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)] text-[var(--color-paper)]"
                          : "border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.28)] text-[var(--color-muted)]",
                      )}
                    >
                      <span className="flex items-center gap-3">
                        <Icon size={15} />
                        {item.label}
                      </span>
                      {isActive ? <span className="image-badge image-badge-gold">Atual</span> : null}
                    </Link>
                  );
                })}
              </div>

              <div className="mt-4 grid gap-3 rounded-2xl border border-[color:rgba(233,223,201,0.08)] bg-[color:rgba(12,15,14,0.2)] p-4">
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  <span>Progresso</span>
                  <span>{playerProgress}%</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  <span>Revitalização</span>
                  <span className="text-[var(--color-paper)]">{campaign.overallProgress}%</span>
                </div>
                <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.16em] text-[var(--color-muted)]">
                  <span>Estado</span>
                  <span className="text-[var(--color-cobre)]">{state}</span>
                </div>
              </div>
            </div>
          ) : null}
        </header>

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            variants={routeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
            className="relative z-10 mx-auto w-full max-w-7xl box-border px-4 py-4 md:px-6 md:py-6"
          >
            {children}
          </motion.main>
        </AnimatePresence>
      </div>
    </MotionConfig>
  );
}
