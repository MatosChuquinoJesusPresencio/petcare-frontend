export const ESTADOS_CITA = [
  "AGENDADA",
  "CONFIRMADA",
  "REPROGRAMADA",
  "CANCELADA",
  "ATENDIDA",
  "NO_ASISTIO",
] as const;

export type EstadoCita = typeof ESTADOS_CITA[number];

export const ESTADO_BADGE: Record<EstadoCita, string> = {
  AGENDADA: "bg-primary",
  CONFIRMADA: "bg-success",
  REPROGRAMADA: "bg-warning text-dark",
  CANCELADA: "bg-danger",
  ATENDIDA: "bg-info",
  NO_ASISTIO: "bg-secondary",
};

export const ESTADO_LABEL: Record<EstadoCita, string> = {
  AGENDADA: "Agendada",
  CONFIRMADA: "Confirmada",
  REPROGRAMADA: "Reprogramada",
  CANCELADA: "Cancelada",
  ATENDIDA: "Atendida",
  NO_ASISTIO: "No Asistió",
};
