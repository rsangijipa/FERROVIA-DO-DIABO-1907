import type { UnlockRule } from "@/types/game";

export const unlockRules: UnlockRule[] = [
  { id: "unlock-1", sourceType: "quiz", sourceId: "qd-01", museumEntryId: "museu-tratado" },
  { id: "unlock-2", sourceType: "quiz", sourceId: "qd-04", museumEntryId: "museu-porto-velho" },
  { id: "unlock-3", sourceType: "quiz", sourceId: "qd-07", museumEntryId: "museu-diplomacia-fronteira" },
  { id: "unlock-4", sourceType: "quiz", sourceId: "qc-03", museumEntryId: "museu-candelaria" },
  { id: "unlock-5", sourceType: "history", sourceId: "c2-s2-a", museumEntryId: "museu-quinino" },
  { id: "unlock-6", sourceType: "history", sourceId: "c2-s4-a", museumEntryId: "museu-memoria-trabalho" },
  { id: "unlock-7", sourceType: "quiz", sourceId: "qc-05", museumEntryId: "museu-locomotiva-18" },
  { id: "unlock-8", sourceType: "restoration", sourceId: "rod-restauro-a", museumEntryId: "museu-oficina-aberta" },
  { id: "unlock-9", sourceType: "quiz", sourceId: "qc-09", museumEntryId: "museu-litorina" },
  { id: "audio-1", sourceType: "restoration", sourceId: "rod-restauro-a", museumEntryId: "museu-oficina-aberta", audioLogId: "log-construction-noise" },
  { id: "audio-2", sourceType: "history", sourceId: "c2-s2-a", museumEntryId: "museu-quinino", audioLogId: "log-hospital-whisper" },
];
