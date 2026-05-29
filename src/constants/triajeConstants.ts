export const NIVELES_URGENCIA = [
  "RUTINARIA",
  "PREFERENTE",
  "URGENTE",
  "EMERGENCIA",
] as const;

export type NivelUrgencia = typeof NIVELES_URGENCIA[number];

export const URGENCIA_LABEL: Record<NivelUrgencia, string> = {
  RUTINARIA: "Rutinaria",
  PREFERENTE: "Preferente",
  URGENTE: "Urgente",
  EMERGENCIA: "Emergencia",
};
