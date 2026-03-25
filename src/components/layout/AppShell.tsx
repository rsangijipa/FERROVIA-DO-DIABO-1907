"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Compass, BookOpenText, Factory, ScrollText, Wrench, Trophy, Archive } from "lucide-react";

import { resolvePageBackground } from "@/content/assetManifest";
import { useGameStore } from "@/store/useGameStore";

const navItems = [
  { href: "/", label: "Menu", icon: Compass },
  { href: "/restauracao", label: "Restauração", icon: Factory },
  { href: "/narrativa", label: "História", icon: ScrollText },
  { href: "/quiz", label: "Quiz", icon: BookOpenText },
  { href: "/codex", label: "Codex", icon: Archive },
  { href: "/resultado", label: "Resultado", icon: Trophy },
  { href: "/config", label: "Config", icon: Wrench },
];

export function AppShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const state = useGameStore((s) => s.globalState);
  const fontScale = useGameStore((s) => s.settings.fontScale);
  const currentMode = useGameStore((s) => s.saveData.currentMode);
  const background = resolvePageBackground(pathname, currentMode);

  return (
    <div className="min-h-screen text-[var(--color-text)]" style={{ fontSize: `${fontScale}rem` }}>
      <div className="fixed inset-0 -z-20 ambient-photo" style={{ backgroundImage: `url(${background})` }} />
      <div className="fixed inset-0 -z-10 ambient-scrim" />
      <div className="pointer-events-none fixed inset-0 -z-10 ambient-grid" />

      <header className="sticky top-0 z-20 border-b border-[color:var(--color-border)] bg-[color:rgba(18,20,19,0.74)] backdrop-blur-md">
        <div className="mx-auto flex w-full max-w-7xl items-center justify-between gap-3 px-4 py-3 md:px-6">
          <div>
            <p className="font-serif text-lg tracking-wide text-[var(--color-latao)]">Madeira-Mamoré</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[var(--color-muted)]">Trilhos da Memória</p>
          </div>
          <div className="rounded-full border border-[color:var(--color-border)] bg-[color:rgba(12,15,14,0.32)] px-3 py-1 text-xs uppercase tracking-wide text-[var(--color-muted)]">
            Estado: <span className="text-[var(--color-alert)]">{state}</span>
          </div>
        </div>
        <nav className="mx-auto flex w-full max-w-7xl flex-wrap gap-2 px-4 pb-3 md:px-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`inline-flex items-center gap-2 rounded-md border px-3 py-2 text-sm transition ${
                  active
                    ? "border-[color:var(--color-cobre)] bg-[color:rgba(183,106,60,0.18)] text-[var(--color-paper)]"
                    : "border-[color:var(--color-border)] bg-[color:rgba(18,20,19,0.46)] text-[var(--color-muted)] hover:text-[var(--color-paper)]"
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
