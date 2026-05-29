import apiClient from "../api/client";
import type { VeterinarioResponse } from "../types/citaType";

export async function obtenerVeterinarios(): Promise<VeterinarioResponse[]> {
  const response = await apiClient.get<VeterinarioResponse[]>("/api/usuarios/veterinarios");
  return response.data;
}
