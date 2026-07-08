import apiClient from "../api/client";

import type { CambioDuenoPrincipalRequest, Dueno, MascotaRequest, MascotaResponse, PaginatedResponse } from "../types";

export async function obtenerMascotas(params?: { nombre?: string; especie?: string; raza?: string; sexo?: string; activo?: boolean; duenoId?: number }): Promise<MascotaResponse[]> {
  const response = await apiClient.get<PaginatedResponse<MascotaResponse>>("/api/mascotas", { params });
  return response.data.content;
}

export async function obtenerMascotaPorId(id: number): Promise<MascotaResponse> {
  const response = await apiClient.get<MascotaResponse>(`/api/mascotas/${id}`);
  return response.data;
}

export async function obtenerMascotasPorDueno(duenoId: number): Promise<MascotaResponse[]> {
  const response = await apiClient.get<PaginatedResponse<MascotaResponse>>(`/api/mascotas/dueno/${duenoId}`);
  return response.data.content;
}

export async function crearMascota(data: MascotaRequest): Promise<MascotaResponse> {
  const response = await apiClient.post<MascotaResponse>("/api/mascotas", data);
  return response.data;
}

export async function actualizarMascota(id: number, data: MascotaRequest): Promise<MascotaResponse> {
  const response = await apiClient.put<MascotaResponse>(`/api/mascotas/${id}`, data);
  return response.data;
}

export async function eliminarMascota(id: number): Promise<void> {
  await apiClient.delete(`/api/mascotas/${id}`);
}

export async function toggleMascota(id: number): Promise<MascotaResponse> {
  const response = await apiClient.patch<MascotaResponse>(`/api/mascotas/${id}/toggle`);
  return response.data;
}

export async function vincularDueno(mascotaId: number, duenoId: number, relacion: string): Promise<void> {
  await apiClient.post(`/api/mascotas/${mascotaId}/vincular-dueno/${duenoId}`, null, { params: { relacion } });
}

export async function cambiarDuenoPrincipal(mascotaId: number, data: CambioDuenoPrincipalRequest): Promise<void> {
  await apiClient.patch(`/api/mascotas/${mascotaId}/cambiar-dueno-principal`, data);
}

export async function obtenerDuenoPrincipal(mascotaId: number): Promise<Dueno | null> {
  try {
    const response = await apiClient.get<Dueno>(`/api/mascotas/${mascotaId}/dueno-principal`);
    return response.data;
  } catch {
    return null;
  }
}