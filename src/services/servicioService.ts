import apiClient from '../api/client';
import type { PaginatedResponse, ServicioRequest, ServicioResponse } from '../types';

export async function getServicios(params?: {
  soloActivos?: boolean;
  nombre?: string;
}): Promise<ServicioResponse[]> {
  const response = await apiClient.get<PaginatedResponse<ServicioResponse>>('/api/servicios', {
    params: {
      soloActivos: params?.soloActivos,
      nombre: params?.nombre || undefined,
    },
  });
  return response.data.content;
}


export async function createServicio(
  servicio: ServicioRequest,
): Promise<ServicioResponse> {
  const response = await apiClient.post<ServicioResponse>("/api/servicios", servicio);
  return response.data;
}

export async function updateServicio(id: number, servicio: ServicioRequest) {
  const response = await apiClient.put<ServicioResponse>(`/api/servicios/${id}`, servicio);
  return response.data;
}

export async function deleteServicio(id: number) {
  await apiClient.delete(`/api/servicios/${id}`);
}

export async function toggleServicio(id: number): Promise<ServicioResponse> {
  const response = await apiClient.patch<ServicioResponse>(`/api/servicios/${id}/toggle`);
  return response.data;
}
