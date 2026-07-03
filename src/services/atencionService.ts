import apiClient from "../api/client";
import type { AtencionClinicaRequest, AtencionClinicaResponse, PaginatedResponse } from "../types";

export async function obtenerAtencionesClinicas(): Promise<AtencionClinicaResponse[]> {
  const response = await apiClient.get<PaginatedResponse<AtencionClinicaResponse>>("/api/atenciones-clinicas");
  return response.data.content;
}

export async function crearAtencionClinica(data: AtencionClinicaRequest): Promise<AtencionClinicaResponse> {
  const response = await apiClient.post<AtencionClinicaResponse>("/api/atenciones-clinicas", data);
  return response.data;
}

export async function obtenerAtencionesPorMascota(mascotaId: number): Promise<AtencionClinicaResponse[]> {
  const response = await apiClient.get<PaginatedResponse<AtencionClinicaResponse>>(`/api/atenciones-clinicas/mascota/${mascotaId}`);
  return response.data.content;
}

export async function obtenerAtencionClinicaPorId(id: number): Promise<AtencionClinicaResponse> {
  const response = await apiClient.get<AtencionClinicaResponse>(`/api/atenciones-clinicas/${id}`);
  return response.data;
}

export async function obtenerAtencionClinicaPorCitaId(citaId: number): Promise<AtencionClinicaResponse> {
  const response = await apiClient.get<AtencionClinicaResponse>(`/api/atenciones-clinicas/cita/${citaId}`);
  return response.data;
}

export async function actualizarAtencionClinica(id: number, data: AtencionClinicaRequest): Promise<AtencionClinicaResponse> {
  const response = await apiClient.put<AtencionClinicaResponse>(`/api/atenciones-clinicas/${id}`, data);
  return response.data;
}
