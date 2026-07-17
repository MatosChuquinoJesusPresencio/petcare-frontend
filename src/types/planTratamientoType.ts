export interface PlanTratamientoResponse {
  id: number;
  atencionClinicaId: number;
  mascotaId: number;
  mascotaNombre: string;
  veterinarioId: number;
  veterinarioNombre: string;
  diagnostico: string;
  objetivos: string;
  fechaInicio: string;
  fechaFinEstimada: string;
  estado: string;
  actividades: PlanTratamientoActividadResponse[];
  creadoEn: string;
}

export interface PlanTratamientoActividadResponse {
  id: number;
  tipo: string;
  titulo: string;
  descripcion: string;
  fechaProgramada: string;
  horaProgramada: string;
  estado: string;
  resultado: string;
}

export interface PlanTratamientoRequest {
  atencionClinicaId: number;
  mascotaId: number;
  veterinarioId: number;
  diagnostico: string;
  objetivos?: string;
  fechaInicio: string;
  fechaFinEstimada?: string;
  actividades: PlanTratamientoActividadRequest[];
}

export interface PlanTratamientoActividadRequest {
  tipo: string;
  titulo: string;
  descripcion?: string;
  fechaProgramada?: string;
  horaProgramada?: string;
}
