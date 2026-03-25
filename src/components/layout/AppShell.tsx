"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Archive,
  BookOpenText,
  Compass,
  Factory,
  Map,
  ScrollText,
  Trophy,
  Wrench,
} from "lucide-react";

import { resolvePageBackground } from "@/content/assetManifest";
import { useGameStore } from "@/store/useGameStore";

const navItems = [
  { href: "/", label: "Hub", icon: Compass },
  { href: "/restauracao-2026", label: "Restauração 2026", icon: Factory },
  { href: "/historia-interativa", label: "Historia Interativa", icon: ScrollText },
  { href: "/quiz-tematico", label: "Quiz Tematico", icon: BookOpenText },
  { href: "/museu-vivo", label: "Museu Vivo", icon: Archive },
  { href: "/resultado-integrado", label: "Resultado", icon: Trophy },
  { href: "/config", label: "Config", icon: Wrench },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useGameStore((store) => store.globalState);
  const fontScale = useGameStore((store) => store.settings.fontScale);
  const currentMode = useGameStore((store) => store.saveData.currentMode);
  const playerName = useGameStore((store) => store.player.name);
  const playerProgress = useGameStore((store) => store.player.progress);
  const background = resolvePageBackground(pathname, currentMode);

  return (
    <div className="min-h-screen text-[var(--color-text)]" style={{ fontSize: `${fontScale}rem` }}>
      <div className="fixed inset-0 -z-20 ambient-photo" style={{ backgroundImage: `url(${background})` }} />
      <div className="fixed inset-0 -z-10 ambient-scrim" />
      <div className="pointer-events-none fixed inset-0 -z-10 ambient-grid" />

      <header className="sticky top-0 z-20 border-b border-[color:var(--color-border)] bg-[color:rgba(10,12,11,0.82)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-4 md:px-6">
          <div>
            <p className="font-serif text-xl tracking-wide text-[var(--color-latao)]">Madeira-Mamore</p>
            <p className="text-xs uppercase tracking-[0.22em] text-[var(--color-muted)]">Trilhos da Memoria</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs uppercase tracking-[0.18em] text-[var(--color-muted)]">
            <span className="inline-flex items-center gap-2 rounded-full border border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.36)] px-3 py-2">
              <Map size={12} />
              {playerName}
            </span>
            <span className="inline-flex rounded-full border border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.36)] px-3 py-2">
              Progresso {playerProgress}%
            </span>
            <span className="inline-flex rounded-full border border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.36)] px-3 py-2">
              Estado {state}
            </span>
          </div>
        </div>

        <nav className="mx-auto flex w-full max-w-7xl flex-wrap gap-2 px-4 pb-4 md:px-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-full border px-3 py-2 text-sm transition ${
                  active
                    ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)] text-[var(--color-paper)]"
                    : "border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.4)] text-[var(--color-muted)] hover:text-[var(--color-paper)]"
                }`}
              >
                <Icon size={14} />
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="relative z-10 mx-auto w-full max-w-7xl px-4 py-6 md:px-6">{children}</main>
    </div>
  );
}
