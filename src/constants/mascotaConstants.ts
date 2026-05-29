export const SEXOS_MASCOTA = ["MACHO", "HEMBRA"] as const;

export type SexoMascota = typeof SEXOS_MASCOTA[number];

export const SEXO_LABEL: Record<SexoMascota, string> = {
  MACHO: "Macho",
  HEMBRA: "Hembra",
};
