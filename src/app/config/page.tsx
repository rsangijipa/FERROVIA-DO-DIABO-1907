"use client";

import { ConfigView } from "@/components/config/ConfigView";
import { useMode } from "@/lib/useMode";

export default function ConfigPage() {
  useMode("config");
  return <ConfigView />;
}
