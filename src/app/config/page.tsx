import type { Metadata } from "next";
import { ConfigView } from "@/components/config/ConfigView";
import { ModeInitializer } from "@/components/layout/ModeInitializer";

export const metadata: Metadata = {
  title: "Configurações | Ferrovia do Diabo",
  description: "Ajuste preferências de interface, acessibilidade e sistema.",
};

export default function ConfigPage() {
  return (
    <>
      <ModeInitializer mode="config" />
      <ConfigView />
    </>
  );
}
