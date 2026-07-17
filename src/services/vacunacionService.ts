import apiClient from "../api/client";
import type { HistorialVacunacionRequest, HistorialVacunacionResponse } from "../types";

export async function listarVacunacionesPorMascota(mascotaId: number): Promise<HistorialVacunacionResponse[]> {
  const response = await apiClient.get<HistorialVacunacionResponse[]>(`/api/mascotas/${mascotaId}/vacunaciones`);
  return response.data;
}

export async function registrarVacunacion(mascotaId: number, data: HistorialVacunacionRequest): Promise<HistorialVacunacionResponse> {
  const response = await apiClient.post<HistorialVacunacionResponse>(`/api/mascotas/${mascotaId}/vacunaciones`, data);
  return response.data;
}

export async function actualizarVacunacion(id: number, data: HistorialVacunacionRequest): Promise<HistorialVacunacionResponse> {
  const response = await apiClient.put<HistorialVacunacionResponse>(`/api/vacunaciones/${id}`, data);
  return response.data;
}

export async function eliminarVacunacion(id: number): Promise<void> {
  await apiClient.delete(`/api/vacunaciones/${id}`);
}

export async function obtenerProximasDosis(): Promise<HistorialVacunacionResponse[]> {
  const response = await apiClient.get<HistorialVacunacionResponse[]>("/api/vacunaciones/proximas");
  return response.data;
}
