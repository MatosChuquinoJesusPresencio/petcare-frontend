import axios from "axios";
import { api, API_BASE_URL } from "./api";
import type {
  ServicioPageResponse,
  ServicioRequest,
  ServicioResponse,
} from "../types/serviciosType";

export async function getServicios(): Promise<ServicioResponse[]> {
  console.log("Consultando servicios desde:", `${API_BASE_URL}/api/servicios`);

  const response = await api.get<ServicioPageResponse>("/api/servicios");
  return response.data.content;
}


export async function createServicio(
  servicio: ServicioRequest,
): Promise<ServicioResponse> {
  try {
    const response = await api.post<ServicioResponse>("/api/servicios", servicio);

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error del servidor:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor:", error.request);
      } else {
        console.error("Error al configurar la petición:", error.message);
      }
    } else {
      console.error("Error desconocido:", error);
    }

    throw error;
  }
}

export async function updateServicio(id: number, servicio: ServicioRequest) {
  const response = await api.put<ServicioResponse>(`/api/servicios/${id}`, servicio);
  return response.data;
}

export async function deleteServicio(id: number) {
  await api.delete(`/api/servicios/${id}`);
}
