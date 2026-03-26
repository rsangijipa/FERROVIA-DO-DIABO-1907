import { sharedBackgrounds } from "@/content/assetManifest";

import { AppShellClient } from "./AppShellClient";

export function AppShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen text-[var(--color-text)]">
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

      <AppShellClient>{children}</AppShellClient>
    </div>
  );
}
