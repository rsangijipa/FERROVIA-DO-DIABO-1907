import type { Metadata } from "next";
import { RestorationMode } from "@/components/restoration/RestorationMode";
import { ModeInitializer } from "@/components/layout/ModeInitializer";

export const metadata: Metadata = {
  title: "Restauração 2026 | Ferrovia do Diabo",
  description: "Administre o orçamento e tome decisões cruciais na restauração patrimonial e ambiental.",
};

export default function Restauracao2026Page() {
  return (
    <>
      <ModeInitializer mode="restauracao2026" />
      <RestorationMode />
    </>
  );
}
