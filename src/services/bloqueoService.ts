import apiClient from "../api/client";
import type { BloqueoRequest, BloqueoVeterinarioResponse } from "../types";

export async function obtenerBloqueosPorVeterinario(veterinarioId: number): Promise<BloqueoVeterinarioResponse[]> {
  const response = await apiClient.get<BloqueoVeterinarioResponse[]>(`/api/bloqueos/veterinario/${veterinarioId}`);
  return response.data;
}

export async function obtenerBloqueosPorVeterinarioYFecha(veterinarioId: number, fecha: string): Promise<BloqueoVeterinarioResponse[]> {
  const response = await apiClient.get<BloqueoVeterinarioResponse[]>(`/api/bloqueos/veterinario/${veterinarioId}/fecha`, {
    params: { fecha },
  });
  return response.data;
}

export async function obtenerBloqueoPorId(id: number): Promise<BloqueoVeterinarioResponse> {
  const response = await apiClient.get<BloqueoVeterinarioResponse>(`/api/bloqueos/${id}`);
  return response.data;
}

export async function crearBloqueo(data: BloqueoRequest): Promise<BloqueoVeterinarioResponse> {
  const response = await apiClient.post<BloqueoVeterinarioResponse>("/api/bloqueos", data);
  return response.data;
}

export async function eliminarBloqueo(id: number): Promise<void> {
  await apiClient.delete(`/api/bloqueos/${id}`);
}
