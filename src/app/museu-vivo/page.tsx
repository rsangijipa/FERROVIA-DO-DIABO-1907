import type { Metadata } from "next";
import { CodexView } from "@/components/codex/CodexView";
import { ModeInitializer } from "@/components/layout/ModeInitializer";

export const metadata: Metadata = {
  title: "Museu Vivo | Ferrovia do Diabo",
  description: "Acervo histórico com dados reais das expedições de campo ao longo do Rio Madeira.",
};

export default function MuseuVivoPage() {
  return (
    <>
      <ModeInitializer mode="museuVivo" />
      <CodexView />
    </>
  );
}
