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
import { ScrollToTop } from "../ui/ScrollToTop";
import { useSFX } from "@/hooks/useSFX";
import { LandingPage } from "../home/LandingPage";
import { MobileNav } from "./MobileNav";

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
  const hasAcceptedLanding = useGameStore((state) => state.saveData.hasAcceptedLanding);

  const campaign = getCampaignState(progress, resources);
  const { playClick, playTick } = useSFX();

  const particleType = pathname.includes("restauracao") 
    ? (resources.orcamento < 40 ? "heat" : "soot") 
    : pathname.includes("historia") 
    ? "dust" 
    : pathname.includes("museu") 
    ? "firefly" 
    : "dust";

  return (
    <MotionConfig reducedMotion={settings.reducedMotion ? "always" : "never"}>
      <PreferenceBridge />
      <AmbientParticles type={particleType} />
      <ScrollToTop />

      {/* Premium Overlays */}
      <div className="noise-overlay" aria-hidden="true" />
      <div className="mist-overlay" aria-hidden="true" />

      <div className="min-h-screen text-[var(--color-text)]" style={{ fontSize: `${settings.fontScale}rem` }}>
        <AnimatePresence>
          {!hasAcceptedLanding && (
            <motion.div
              key="landing-overlay"
              initial={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="fixed inset-0 z-[100]"
            >
              <LandingPage />
            </motion.div>
          )}
        </AnimatePresence>

        {hasAcceptedLanding && (
          <header className="sticky top-0 z-30 border-b border-[color:rgba(212,163,103,0.14)] bg-[color:rgba(10,12,11,0.92)] backdrop-blur-lg">
            <div className="mx-auto flex w-full max-w-7xl box-border items-center justify-between gap-3 px-4 py-3 md:px-6">
              <div className="min-w-0">
                <p className="font-serif text-base tracking-wide text-[var(--color-latao)] md:text-lg">Madeira-Mamore</p>
                <p className="text-[0.6rem] uppercase tracking-[0.22em] text-[var(--color-muted)] leading-none mt-1">Trilhos da Memoria</p>
              </div>

              {/* Desktop Navigation Combined */}
              <div className="hidden flex-1 items-center justify-center gap-2 px-4 lg:flex">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = pathname === item.href;
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => playClick()}
                      onMouseEnter={() => playTick()}
                      aria-current={isActive ? "page" : undefined}
                      className={clsx(
                        "inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[0.8rem] transition-all duration-200",
                        isActive
                          ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)] text-[var(--color-paper)] glow-badge"
                          : "border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.4)] text-[var(--color-muted)] hover:border-[color:rgba(212,163,103,0.2)] hover:text-[var(--color-paper)]",
                      )}
                    >
                      <Icon size={12} />
                      {item.label}
                    </Link>
                  );
                })}
              </div>

              <div className="hidden items-center gap-3 md:flex">
                <div className="flex flex-col items-end">
                  <span className="text-[0.6rem] uppercase tracking-[0.14em] text-[var(--color-latao)] mb-1">
                    {campaign.overallProgress}% Revitalização
                  </span>
                  <div className="h-1 w-24 overflow-hidden rounded-full bg-[color:rgba(233,223,201,0.12)]">
                    <motion.div
                      className="h-full rounded-full bg-[var(--color-latao)]"
                      initial={false}
                      animate={{ width: `${campaign.overallProgress}%` }}
                    />
                  </div>
                </div>
                <ProgressRing value={playerProgress} size={30} strokeWidth={3} />
                <button
                  type="button"
                  onClick={() => {
                    playClick();
                    useGameStore.getState().logout();
                  }}
                  onMouseEnter={() => playTick()}
                  className="text-[0.65rem] uppercase tracking-[0.16em] text-[var(--color-muted)] hover:text-[var(--color-danger)] transition-colors border border-[color:rgba(233,223,201,0.1)] rounded-full px-3 py-1 bg-[color:rgba(12,15,14,0.2)]"
                >
                  Sair
                </button>
              </div>

              {/* Mobile Controls */}
              <div className="flex items-center gap-2 md:hidden">
                <ProgressRing value={playerProgress} size={28} strokeWidth={2} />
                <button
                  type="button"
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.36)] text-[var(--color-paper)]"
                  aria-expanded={menuOpen}
                  aria-label={menuOpen ? "Fechar menu" : "Abrir menu"}
                  onClick={() => {
                    playClick();
                    setMenuOpen((value) => !value);
                  }}
                >
                  {menuOpen ? <X size={16} /> : <Menu size={16} />}
                </button>
              </div>
            </div>

            {/* Secondary Row for Navigation (Tablet/Narrower Desktop) */}
            <div className="mx-auto flex w-full max-w-7xl box-border flex-wrap gap-2 px-4 pb-2 pt-1 lg:hidden md:flex hidden">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => playClick()}
                    className={clsx(
                      "inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs transition-all",
                      isActive
                        ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)] text-[var(--color-paper)]"
                        : "border-[color:rgba(212,163,103,0.1)] text-[var(--color-muted)]",
                    )}
                  >
                    <Icon size={12} />
                    {item.label}
                  </Link>
                );
              })}
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
                        onClick={() => {
                          playClick();
                          setMenuOpen(false);
                        }}
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

                  <div className="mt-2 border-t border-[color:rgba(233,223,201,0.08)] pt-4">
                    <button
                      type="button"
                      onClick={() => {
                        playClick();
                        setMenuOpen(false);
                        useGameStore.getState().logout();
                      }}
                      className="flex w-full items-center justify-center gap-2 rounded-2xl border border-[color:rgba(239,68,68,0.2)] bg-[color:rgba(239,68,68,0.06)] px-4 py-3 text-xs uppercase tracking-[0.16em] text-[var(--color-paper)] transition-all hover:bg-[color:rgba(239,68,68,0.1)]"
                    >
                      Encerrar Sessão / Sair
                    </button>
                  </div>
                </div>
              </div>
            ) : null}
          </header>
        )}

        <AnimatePresence mode="wait">
          <motion.main
            key={pathname}
            variants={routeVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ duration: 0.18, ease: "easeOut" }}
            className={clsx(
              "relative z-10 mx-auto w-full max-w-7xl box-border pb-20 md:pb-6",
              hasAcceptedLanding ? "px-4 py-4 md:px-6 md:py-6" : "p-0 overflow-hidden h-screen"
            )}
          >
            {children}
          </motion.main>
        </AnimatePresence>
        {hasAcceptedLanding && <MobileNav />}
      </div>
    </MotionConfig>
  );
}
