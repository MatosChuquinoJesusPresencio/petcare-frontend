export interface ServicioResponse {
  id: number;
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
  costoReferencial: number;
  activo: boolean;
}

export interface ServicioRequest {
  name: string;
  description: string;
  durationMinutes: number;
  referentialCost: number;
}

export interface ServicioPageResponse {
  content: ServicioResponse[];
}
