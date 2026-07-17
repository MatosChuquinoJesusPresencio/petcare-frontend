import apiClient from "../api/client";
import type { RegisterRequest, VeterinarioResponse, ActualizarUsuarioRequest, CambiarContrasenaRequest, PaginatedResponse } from "../types";

export async function obtenerVeterinarios(): Promise<VeterinarioResponse[]> {
  const response = await apiClient.get<PaginatedResponse<VeterinarioResponse>>("/api/usuarios/veterinarios");
  return response.data.content;
}

export async function obtenerTodosVeterinarios(): Promise<VeterinarioResponse[]> {
  const response = await apiClient.get<PaginatedResponse<VeterinarioResponse>>("/api/usuarios/veterinarios/todos");
  return response.data.content;
}

export async function cambiarEstadoUsuario(id: number, active: boolean): Promise<VeterinarioResponse> {
  const response = await apiClient.patch<VeterinarioResponse>(`/api/usuarios/${id}/estado`, { active });
  return response.data;
}

export async function crearUsuario(data: RegisterRequest): Promise<VeterinarioResponse> {
  const response = await apiClient.post<VeterinarioResponse>("/api/usuarios", data);
  return response.data;
}

export async function listarTodosUsuarios(): Promise<VeterinarioResponse[]> {
  const response = await apiClient.get<PaginatedResponse<VeterinarioResponse>>("/api/usuarios");
  return response.data.content;
}

export async function obtenerUsuarioPorId(id: number): Promise<VeterinarioResponse> {
  const response = await apiClient.get<VeterinarioResponse>(`/api/usuarios/${id}`);
  return response.data;
}

export async function actualizarUsuario(id: number, data: ActualizarUsuarioRequest): Promise<VeterinarioResponse> {
  const response = await apiClient.put<VeterinarioResponse>(`/api/usuarios/${id}`, data);
  return response.data;
}

export async function cambiarContrasena(data: CambiarContrasenaRequest): Promise<void> {
  await apiClient.post("/api/usuarios/cambiar-contrasena", data);
}
