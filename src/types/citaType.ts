import type { MascotaResponse } from "./mascotaType";
import type { ServicioResponse } from "./servicioType";

export interface VeterinarioResponse {
  id: number;
  nombre: string;
  apellido: string;
  email?: string;
}

export interface CitaResponse {
  id: number;
  mascota: MascotaResponse;
  veterinario: VeterinarioResponse;
  servicio: ServicioResponse;
  fechaHora: string;
  estado: string;
  notas: string;
  creadoPor?: VeterinarioResponse;
  creadoEn?: string;
  actualizadoEn?: string;
}

export interface CitaRequest {
  petId: number;
  veterinarianId: number;
  serviceId: number;
  dateTime: string;
  notes?: string;
}

export interface CitaEstadoRequest {
  status: string;
}

export interface CitaReprogramarRequest {
  dateTime: string;
}

export interface CitaPageResponse {
  content: CitaResponse[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

export interface DisponibilidadResponse {
  veterinarioId: number;
  fecha: string;
  duracionMinutos: number;
  horariosDisponibles: string[];
}
