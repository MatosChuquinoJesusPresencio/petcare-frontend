import apiClient from "../api/client";
import type { RecetaRequest, RecetaResponse } from "../types";

export async function crearReceta(atencionId: number, data: RecetaRequest): Promise<RecetaResponse> {
  const response = await apiClient.post<RecetaResponse>(`/api/atenciones-clinicas/${atencionId}/recetas`, data);
  return response.data;
}

export async function listarRecetasPorAtencion(atencionId: number): Promise<RecetaResponse[]> {
  const response = await apiClient.get<RecetaResponse[]>(`/api/atenciones-clinicas/${atencionId}/recetas`);
  return response.data;
}

export async function obtenerRecetaPorId(id: number): Promise<RecetaResponse> {
  const response = await apiClient.get<RecetaResponse>(`/api/recetas/${id}`);
  return response.data;
}

export async function actualizarReceta(id: number, data: RecetaRequest): Promise<RecetaResponse> {
  const response = await apiClient.put<RecetaResponse>(`/api/recetas/${id}`, data);
  return response.data;
}

export async function listarRecetasPorMascota(mascotaId: number): Promise<RecetaResponse[]> {
  const response = await apiClient.get<RecetaResponse[]>(`/api/mascotas/${mascotaId}/recetas`);
  return response.data;
}
