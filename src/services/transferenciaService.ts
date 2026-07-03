import apiClient from "../api/client";
import type { HistorialTransferenciaResponse, PaginatedResponse } from "../types";

export async function obtenerTransferenciasPorMascota(mascotaId: number): Promise<HistorialTransferenciaResponse[]> {
  const response = await apiClient.get<PaginatedResponse<HistorialTransferenciaResponse>>(`/api/mascotas/${mascotaId}/transferencias`);
  return response.data.content;
}
