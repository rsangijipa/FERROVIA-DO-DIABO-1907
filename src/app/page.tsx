import type { Metadata } from "next";
import { ClientHome } from "@/components/home/ClientHome";

export const metadata: Metadata = {
  title: "Ferrovia do Diabo | 1907 — 1912",
  description: "Uma experiência imersiva de restauração e memória da Estrada de Ferro Madeira-Mamoré.",
};

export default function HomePage() {
  return <ClientHome />;
}
