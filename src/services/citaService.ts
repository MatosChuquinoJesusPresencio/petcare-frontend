import apiClient from "../api/client";
import type { CitaRequest, CitaEstadoRequest, CitaReprogramarRequest, CitaResponse, CitaPageResponse, DisponibilidadResponse } from "../types/citaType";

export async function obtenerCitas(params?: {
  mascotaId?: number;
  veterinarioId?: number;
  servicioId?: number;
  estado?: string;
  fechaDesde?: string;
  fechaHasta?: string;
}): Promise<CitaResponse[]> {
  const response = await apiClient.get<CitaPageResponse>("/api/citas", { params });
  return response.data.content;
}

export async function obtenerCitaPorId(id: number): Promise<CitaResponse> {
  const response = await apiClient.get<CitaResponse>(`/api/citas/${id}`);
  return response.data;
}

export async function agendarCita(data: CitaRequest): Promise<CitaResponse> {
  const response = await apiClient.post<CitaResponse>("/api/citas", data);
  return response.data;
}

export async function cambiarEstadoCita(id: number, status: string): Promise<CitaResponse> {
  const response = await apiClient.put<CitaResponse>(`/api/citas/${id}/estado`, { status } satisfies CitaEstadoRequest);
  return response.data;
}

export async function reprogramarCita(id: number, dateTime: string): Promise<CitaResponse> {
  const response = await apiClient.put<CitaResponse>(`/api/citas/${id}/reprogramar`, { dateTime } satisfies CitaReprogramarRequest);
  return response.data;
}

export async function cancelarCita(id: number): Promise<void> {
  await apiClient.delete(`/api/citas/${id}`);
}

export async function obtenerDisponibilidad(veterinarioId: number, fecha: string, servicioId: number): Promise<DisponibilidadResponse> {
  const response = await apiClient.get<DisponibilidadResponse>("/api/citas/disponibilidad", {
    params: { veterinarioId, fecha, servicioId },
  });
  return response.data;
}
