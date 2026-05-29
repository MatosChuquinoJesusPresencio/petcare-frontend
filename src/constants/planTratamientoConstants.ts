export const ESTADOS_PLAN_TRATAMIENTO = [
  "ACTIVO",
  "COMPLETADO",
  "SUSPENDIDO",
] as const;

export type EstadoPlanTratamiento = typeof ESTADOS_PLAN_TRATAMIENTO[number];

export const PLAN_TRATAMIENTO_ESTADO_LABEL: Record<EstadoPlanTratamiento, string> = {
  ACTIVO: "Activo",
  COMPLETADO: "Completado",
  SUSPENDIDO: "Suspendido",
};
