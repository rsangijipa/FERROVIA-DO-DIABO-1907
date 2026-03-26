import type { Metadata } from "next";
import { NarrativeMode } from "@/components/narrative/NarrativeMode";
import { ModeInitializer } from "@/components/layout/ModeInitializer";

export const metadata: Metadata = {
  title: "História Interativa | Ferrovia do Diabo",
  description: "Vivencie as memórias e relatos históricos que moldaram a EFMM e a região da Amazônia",
};

export default function HistoriaInterativaPage() {
  return (
    <>
      <ModeInitializer mode="historiaInterativa" />
      <NarrativeMode />
    </>
  );
}
