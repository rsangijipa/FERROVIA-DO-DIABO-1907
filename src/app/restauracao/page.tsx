"use client";

import { RestorationMode } from "@/components/restoration/RestorationMode";
import { useMode } from "@/lib/useMode";

export default function RestauracaoPage() {
  useMode("restauracao");
  return <RestorationMode />;
}
