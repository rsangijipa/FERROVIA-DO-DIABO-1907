"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Hammer, BookOpen, LibraryBig, Settings } from "lucide-react";
import clsx from "clsx";

export function MobileNav() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", icon: Home, label: "Início" },
    { href: "/restauracao", icon: Hammer, label: "Restauro" },
    { href: "/narrativa", icon: BookOpen, label: "História" },
    { href: "/codex", icon: LibraryBig, label: "Museu" },
    { href: "/config", icon: Settings, label: "Ajustes" },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden pb-safe">
      <div className="flex h-16 items-center justify-around border-t border-[color:var(--color-border)] bg-[color:var(--color-surface)] px-2 shadow-[0_-10px_30px_rgba(0,0,0,0.5)] backdrop-blur-md">
        {navItems.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-label={item.label}
              className={clsx(
                "flex flex-col items-center justify-center gap-1 rounded-xl p-2 transition-all duration-200",
                isActive
                  ? "text-[var(--color-latao)] drop-shadow-[0_0_8px_rgba(212,163,103,0.3)]"
                  : "text-[var(--color-muted)] hover:text-[var(--color-paper)] hover:bg-[color:rgba(233,223,201,0.05)]",
              )}
            >
              <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} className={isActive ? "scale-110" : "scale-100"} />
              <span className="text-[10px] uppercase tracking-wider font-semibold">
                {item.label}
              </span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
