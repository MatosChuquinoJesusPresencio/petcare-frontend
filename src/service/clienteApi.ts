import axios from "axios";
import { api } from "./api"; // Importamos tu instancia configurada de Axios
import type { Dueno, DuenoRequest } from "../types/cliente";

/**
 * GET /api/duenos
 * Obtiene la lista completa de dueños desde el backend
 */
export async function getDuenos(): Promise<Dueno[]> {
  const response = await api.get<Dueno[]>("/api/duenos");
  return response.data;
}

/**
 * GET /api/duenos/{id}
 * Busca un dueño específico por su ID
 */
export async function getDuenoById(id: number): Promise<Dueno> {
  const response = await api.get<Dueno>(`/api/duenos/${id}`);
  return response.data;
}

/**
 * POST /api/duenos
 * Crea un nuevo dueño en la base de datos centralizada
 */
export async function createDueno(dueno: DuenoRequest): Promise<Dueno> {
  try {
    const response = await api.post<Dueno>("/api/duenos", dueno);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error del servidor al crear dueño:", error.response.status, error.response.data);
      } else if (error.request) {
        console.error("No se recibió respuesta del servidor al crear dueño:", error.request);
      } else {
        console.error("Error al configurar la petición de dueño:", error.message);
      }
    } else {
      console.error("Error desconocido:", error);
    }
    throw error;
  }
}

/**
 * PUT /api/duenos/{id}
 * Modifica los datos de un dueño existente
 */
export async function updateDueno(id: number, dueno: DuenoRequest): Promise<Dueno> {
  const response = await api.put<Dueno>(`/api/duenos/${id}`, dueno);
  return response.data;
}

/**
 * DELETE /api/duenos/{id}
 * Cambia el estado a inactivo (Desactivación lógica en el backend)
 */
export async function deactivateDueno(id: number): Promise<void> {
  await api.delete(`/api/duenos/${id}`);
}