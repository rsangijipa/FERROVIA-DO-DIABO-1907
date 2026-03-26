import type { Metadata } from "next";
import { HomeHub } from "@/components/home/HomeHub";
import { ModeInitializer } from "@/components/layout/ModeInitializer";

export const metadata: Metadata = {
  title: "Painel de Controle | Ferrovia do Diabo",
  description: "Gerencie o progresso e os desafios da restauração da EFMM.",
};

export default function HomePage() {
  return (
    <>
      <ModeInitializer mode="hub" />
      <HomeHub />
    </>
  );
}
