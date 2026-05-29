export const TIPOS_SEGUIMIENTO = [
  "LLAMADA",
  "CONTROL_PRESENCIAL",
  "REVISION_TRATAMIENTO",
] as const;

export type TipoSeguimiento = typeof TIPOS_SEGUIMIENTO[number];

export const SEGUIMIENTO_TIPO_LABEL: Record<TipoSeguimiento, string> = {
  LLAMADA: "Llamada",
  CONTROL_PRESENCIAL: "Control Presencial",
  REVISION_TRATAMIENTO: "Revisión de Tratamiento",
};

export const ESTADOS_SEGUIMIENTO = [
  "PROGRAMADO",
  "COMPLETADO",
  "CANCELADO",
] as const;

export type EstadoSeguimiento = typeof ESTADOS_SEGUIMIENTO[number];

export const SEGUIMIENTO_ESTADO_LABEL: Record<EstadoSeguimiento, string> = {
  PROGRAMADO: "Programado",
  COMPLETADO: "Completado",
  CANCELADO: "Cancelado",
};
