import apiClient from "../api/client";
import type { DisponibilidadRequest, DisponibilidadVeterinarioResponse } from "../types";

export async function obtenerDisponibilidadPorVeterinario(veterinarioId: number): Promise<DisponibilidadVeterinarioResponse[]> {
  const response = await apiClient.get<DisponibilidadVeterinarioResponse[]>(`/api/disponibilidad/veterinario/${veterinarioId}`);
  return response.data;
}

export async function obtenerDisponibilidadPorId(id: number): Promise<DisponibilidadVeterinarioResponse> {
  const response = await apiClient.get<DisponibilidadVeterinarioResponse>(`/api/disponibilidad/${id}`);
  return response.data;
}

export async function crearDisponibilidad(data: DisponibilidadRequest): Promise<DisponibilidadVeterinarioResponse> {
  const response = await apiClient.post<DisponibilidadVeterinarioResponse>("/api/disponibilidad", data);
  return response.data;
}

export async function actualizarDisponibilidad(id: number, data: DisponibilidadRequest): Promise<DisponibilidadVeterinarioResponse> {
  const response = await apiClient.put<DisponibilidadVeterinarioResponse>(`/api/disponibilidad/${id}`, data);
  return response.data;
}

export async function eliminarDisponibilidad(id: number): Promise<void> {
  await apiClient.delete(`/api/disponibilidad/${id}`);
}
