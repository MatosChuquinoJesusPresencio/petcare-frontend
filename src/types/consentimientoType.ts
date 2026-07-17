export interface ConsentimientoResponse {
  id: number;
  mascotaId: number;
  mascotaNombre: string;
  duenoId: number;
  atencionClinicaId: number;
  veterinarioId: number;
  veterinarioNombre: string;
  tipoProcedimiento: string;
  descripcionProcedimiento: string;
  riesgosDescritos: string;
  alternativas: string;
  consentido: boolean;
  fechaConsentimiento: string;
  duenoNombreVerificado: string;
  testigoNombre: string;
  observaciones: string;
  createdAt: string;
}

export interface ConsentimientoRequest {
  mascotaId: number;
  duenoId: number;
  atencionClinicaId?: number;
  veterinarioId: number;
  tipoProcedimiento: string;
  descripcionProcedimiento: string;
  riesgosDescritos: string;
  alternativas?: string;
  consentido: boolean;
  duenoNombreVerificado?: string;
  testigoNombre?: string;
  observaciones?: string;
}
