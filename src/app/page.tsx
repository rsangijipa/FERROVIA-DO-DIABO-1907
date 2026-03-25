"use client";

import { HomeHub } from "@/components/home/HomeHub";
import { useMode } from "@/lib/useMode";

export default function HomePage() {
  useMode("hub");
  return <HomeHub />;
}
