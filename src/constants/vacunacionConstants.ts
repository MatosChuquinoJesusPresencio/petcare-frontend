export const TIPOS_VACUNACION = ["VACUNA", "DESPARASITACION"] as const;

export type TipoVacunacion = typeof TIPOS_VACUNACION[number];

export const VACUNACION_TIPO_LABEL: Record<TipoVacunacion, string> = {
  VACUNA: "Vacuna",
  DESPARASITACION: "Desparasitación",
};
