export interface RecetaDetalleRequest {
  medicamento: string;
  presentacion?: string;
  dosis: string;
  frecuencia: string;
  duracion: string;
  viaAdministracion?: string;
  indicaciones?: string;
}

export interface RecetaRequest {
  diagnostico: string;
  notasAdicionales?: string;
  veterinarioId: number;
  detalles: RecetaDetalleRequest[];
}

export interface RecetaDetalleResponse {
  id: number;
  medicamento: string;
  presentacion: string | null;
  dosis: string;
  frecuencia: string;
  duracion: string;
  viaAdministracion: string | null;
  indicaciones: string | null;
}

export interface RecetaResponse {
  id: number;
  atencionClinicaId: number;
  mascotaId: number;
  mascotaNombre: string;
  veterinarioId: number;
  veterinarioNombre: string;
  diagnostico: string;
  notasAdicionales: string | null;
  estado: string;
  createdBy: number;
  createdAt: string;
  detalles: RecetaDetalleResponse[];
}
