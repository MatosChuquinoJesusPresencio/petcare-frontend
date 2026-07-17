export interface SeguimientoResponse {
  id: number;
  atencionClinicaId: number;
  mascotaId: number;
  mascotaNombre: string;
  veterinarioId: number;
  veterinarioNombre: string;
  duenoNotificadoId: number;
  tipo: string;
  fechaProgramada: string;
  fechaCompletada: string;
  motivo: string;
  resultado: string;
  estado: string;
  createdAt: string;
}

export interface SeguimientoRequest {
  veterinarioId: number;
  tipo: string;
  fechaProgramada: string;
  motivo: string;
  duenoNotificadoId?: number;
}
