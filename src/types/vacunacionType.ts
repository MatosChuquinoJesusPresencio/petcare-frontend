export interface HistorialVacunacionRequest {
  tipo: string;
  nombreProducto: string;
  fechaAplicacion: string;
  proximaDosis?: string;
  lote?: string;
  fabricante?: string;
  dosis?: string;
  viaAdministracion?: string;
  veterinarioId: number;
  observaciones?: string;
}

export interface HistorialVacunacionResponse {
  id: number;
  mascotaId: number;
  mascotaNombre: string;
  tipo: string;
  nombreProducto: string;
  fechaAplicacion: string;
  proximaDosis: string | null;
  lote: string | null;
  fabricante: string | null;
  dosis: string | null;
  viaAdministracion: string | null;
  veterinarioId: number;
  veterinarioNombre: string;
  observaciones: string | null;
  estado: string;
}
