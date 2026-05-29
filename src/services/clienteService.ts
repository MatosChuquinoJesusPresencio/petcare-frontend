import apiClient from "../api/client";
import type { Dueno, DuenoRequest, PaginatedResponse } from "../types";

export async function getDuenos(params?: {
  soloActivos?: boolean;
  nombre?: string;
  dni?: string;
}): Promise<Dueno[]> {
  const response = await apiClient.get<PaginatedResponse<Dueno>>("/api/duenos", {
    params: {
      soloActivos: params?.soloActivos,
      nombre: params?.nombre || undefined,
      dni: params?.dni || undefined,
    },
  });
  return response.data.content;
}

export async function getDuenoById(id: number): Promise<Dueno> {
  const response = await apiClient.get<Dueno>(`/api/duenos/${id}`);
  return response.data;
}

export async function createDueno(dueno: DuenoRequest): Promise<Dueno> {
  const response = await apiClient.post<Dueno>("/api/duenos", dueno);
  return response.data;
}

export async function updateDueno(id: number, dueno: DuenoRequest): Promise<Dueno> {
  const response = await apiClient.put<Dueno>(`/api/duenos/${id}`, dueno);
  return response.data;
}

export async function deleteDueno(id: number): Promise<void> {
  await apiClient.delete(`/api/duenos/${id}`);
}

export async function toggleDueno(id: number): Promise<Dueno> {
  const response = await apiClient.patch<Dueno>(`/api/duenos/${id}/toggle`);
  return response.data;
}
