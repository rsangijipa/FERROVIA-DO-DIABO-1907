import { useEffect } from "react";
import { useGameStore } from "@/store/useGameStore";
import type { ModeId } from "@/types/game";

const modeTracks: Record<ModeId, string> = {
  hub: "/audio/ambient/hub_blueprint.mp3",
  restauracao2026: "/audio/ambient/workshop_metal.mp3",
  historiaInterativa: "/audio/ambient/jungle_night.mp3",
  quizTematico: "/audio/ambient/office_ticking.mp3",
  museuVivo: "/audio/ambient/museum_echo.mp3",
  resultadoIntegrado: "/audio/ambient/victory_strings.mp3",
  config: "/audio/ambient/hub_blueprint.mp3",
};

export function useSoundscape() {}
