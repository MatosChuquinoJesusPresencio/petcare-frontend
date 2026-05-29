export const TIPOS_ACTIVIDAD = [
  "MEDICACION",
  "CONTROL",
  "ACTIVIDAD",
] as const;

export type TipoActividad = typeof TIPOS_ACTIVIDAD[number];

export const ACTIVIDAD_TIPO_LABEL: Record<TipoActividad, string> = {
  MEDICACION: "Medicación",
  CONTROL: "Control",
  ACTIVIDAD: "Actividad",
};

export const ESTADOS_ACTIVIDAD = [
  "PENDIENTE",
  "REALIZADO",
  "CANCELADO",
] as const;

export type EstadoActividad = typeof ESTADOS_ACTIVIDAD[number];

export const ACTIVIDAD_ESTADO_LABEL: Record<EstadoActividad, string> = {
  PENDIENTE: "Pendiente",
  REALIZADO: "Realizado",
  CANCELADO: "Cancelado",
};
