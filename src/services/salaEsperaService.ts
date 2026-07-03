import apiClient from "../api/client";
import type { SalaEsperaRequest, SalaEsperaEstadoRequest, SalaEsperaResponse } from "../types";

export async function obtenerSalaEspera(): Promise<SalaEsperaResponse[]> {
  const response = await apiClient.get<SalaEsperaResponse[]>("/api/sala-espera");
  return response.data;
}

export async function obtenerSalaEsperaPorEstado(estado: string): Promise<SalaEsperaResponse[]> {
  const response = await apiClient.get<SalaEsperaResponse[]>(`/api/sala-espera/estado/${estado}`);
  return response.data;
}

export async function registrarLlegada(data: SalaEsperaRequest): Promise<SalaEsperaResponse> {
  const response = await apiClient.post<SalaEsperaResponse>("/api/sala-espera", data);
  return response.data;
}

export async function cambiarEstadoSalaEspera(id: number, data: SalaEsperaEstadoRequest): Promise<SalaEsperaResponse> {
  const response = await apiClient.patch<SalaEsperaResponse>(`/api/sala-espera/${id}/estado`, data);
  return response.data;
}
