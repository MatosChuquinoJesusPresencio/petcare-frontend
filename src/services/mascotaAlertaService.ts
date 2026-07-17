import apiClient from "../api/client";
import type { MascotaAlertaResponse } from "../types";

export async function obtenerAlertasMascota(mascotaId: number): Promise<MascotaAlertaResponse> {
  const response = await apiClient.get<MascotaAlertaResponse>(`/api/mascotas/${mascotaId}/alertas-medicas`);
  return response.data;
}

export async function listarMascotasConAlertas(): Promise<MascotaAlertaResponse[]> {
  const response = await apiClient.get<MascotaAlertaResponse[]>("/api/mascotas/alertas-activas");
  return response.data;
}
