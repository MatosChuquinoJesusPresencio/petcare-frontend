import apiClient from "../api/client";
import type { PaginatedResponse, TriajeRequest, TriajeResponse } from "../types";

export async function crearTriaje(data: TriajeRequest): Promise<TriajeResponse> {
  const response = await apiClient.post<TriajeResponse>("/api/triajes", data);
  return response.data;
}

export async function obtenerTriajes(): Promise<TriajeResponse[]> {
  const response = await apiClient.get<PaginatedResponse<TriajeResponse>>("/api/triajes");
  return response.data.content;
}

export async function obtenerTriajesPorPrioridad(nivelUrgencia: string): Promise<TriajeResponse[]> {
  const response = await apiClient.get<PaginatedResponse<TriajeResponse>>(`/api/triajes/prioridad/${nivelUrgencia}`);
  return response.data.content;
}

export async function obtenerTriajePorId(id: number): Promise<TriajeResponse> {
  const response = await apiClient.get<TriajeResponse>(`/api/triajes/${id}`);
  return response.data;
}

export async function obtenerTriajePorCitaId(citaId: number): Promise<TriajeResponse> {
  const response = await apiClient.get<TriajeResponse>(`/api/triajes/cita/${citaId}`);
  return response.data;
}
