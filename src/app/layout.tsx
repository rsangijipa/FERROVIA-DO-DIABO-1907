import type { Metadata } from "next";
import { Cormorant_Garamond, Inter } from "next/font/google";

import { AppShell } from "@/components/layout/AppShell";

import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

const cormorant = Cormorant_Garamond({
  variable: "--font-cormorant",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

export const metadata: Metadata = {
  title: "Madeira-Mamore: Trilhos da Memoria",
  description: "Experiencia patrimonial jogavel sobre a EFMM com hub, restauracao, historia, quiz, museu e dossie final.",
  metadataBase: new URL("https://ferrovia-do-diabo-1907.vercel.app"),
  openGraph: {
    title: "Madeira-Mamore: Trilhos da Memoria",
    description: "Experiencia patrimonial jogavel sobre a EFMM com hub, restauracao, historia, quiz, museu e dossie final.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Madeira-Mamore: Trilhos da Memoria",
    description: "Experiencia patrimonial jogavel sobre a EFMM com hub, restauracao, historia, quiz, museu e dossie final.",
  },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="pt-BR" className={`${inter.variable} ${cormorant.variable} h-full`}>
      <body className="min-h-full bg-[var(--color-bg)] font-sans text-[var(--color-text)] antialiased">
        <AppShell>{children}</AppShell>
      </body>
    </html>
  );
}
