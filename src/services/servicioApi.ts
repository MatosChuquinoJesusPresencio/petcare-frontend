import { api, API_BASE_URL } from "./api";
import type { ServicioPageResponse, ServicioResponse } from "../types/servicios";

export async function getServicios(): Promise<ServicioResponse[]> {
  console.log("Consultando servicios desde:", `${API_BASE_URL}/api/servicios`);

  const response = await api.get<ServicioPageResponse>("/api/servicios");
  return response.data.content;
}
