export interface ServicioResponse {
  id: number;
  nombre: string;
  descripcion: string;
  duracionMinutos: number;
  costoReferencial: number;
  activo: boolean;
}

export interface ServicioPageResponse {
  content: ServicioResponse[];
}