export const ESTADOS_SALA_ESPERA = [
  "PENDIENTE",
  "EN_ATENCION",
  "ATENDIDO",
  "NO_ASISTIO",
  "REPROGRAMADO",
] as const;

export type EstadoSalaEspera = typeof ESTADOS_SALA_ESPERA[number];

export const SALA_ESPERA_ESTADO_LABEL: Record<EstadoSalaEspera, string> = {
  PENDIENTE: "Pendiente",
  EN_ATENCION: "En Atención",
  ATENDIDO: "Atendido",
  NO_ASISTIO: "No Asistió",
  REPROGRAMADO: "Reprogramado",
};
