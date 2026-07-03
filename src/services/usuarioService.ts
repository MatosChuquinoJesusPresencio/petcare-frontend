import apiClient from "../api/client";
import type { RegisterRequest, VeterinarioResponse } from "../types";

export async function obtenerVeterinarios(): Promise<VeterinarioResponse[]> {
  const response = await apiClient.get<VeterinarioResponse[]>("/api/usuarios/veterinarios");
  return response.data;
}

export async function obtenerTodosVeterinarios(): Promise<VeterinarioResponse[]> {
  const response = await apiClient.get<VeterinarioResponse[]>("/api/usuarios/veterinarios/todos");
  return response.data;
}

export async function cambiarEstadoUsuario(id: number, active: boolean): Promise<VeterinarioResponse> {
  const response = await apiClient.patch<VeterinarioResponse>(`/api/usuarios/${id}/estado`, { active });
  return response.data;
}

export async function crearUsuario(data: RegisterRequest): Promise<VeterinarioResponse> {
  const response = await apiClient.post<VeterinarioResponse>("/api/usuarios", data);
  return response.data;
}
