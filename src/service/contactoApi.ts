import axios from "axios";
import { api } from "./api";
import type { ContactoEmergencia, ContactoEmergenciaRequest } from "../types/contacto";

/**
 * GET /api/duenos/{duenoId}/contactos
 * Obtiene los contactos de emergencia de un dueño específico
 */
export async function getContactosByDuenoId(duenoId: number): Promise<ContactoEmergencia[]> {
  const response = await api.get<ContactoEmergencia[]>(`/api/duenos/${duenoId}/contactos`);
  return response.data;
}

/**
 * POST /api/duenos/{duenoId}/contactos
 * Registra un contacto de emergencia asociado a un dueño
 */
export async function createContacto(
  duenoId: number, 
  contacto: ContactoEmergenciaRequest
): Promise<ContactoEmergencia> {
  try {
    const response = await api.post<ContactoEmergencia>(`/api/duenos/${duenoId}/contactos`, contacto);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      if (error.response) {
        console.error("Error del servidor en contacto:", error.response.status, error.response.data);
      } else {
        console.error("Error en petición de contacto:", error.message);
      }
    }
    throw error;
  }
}

/**
 * DELETE /api/duenos/contactos/{contactoId}
 * Elimina físicamente un contacto de la base de datos
 */
export async function deleteContacto(contactoId: number): Promise<void> {
  await api.delete(`/api/duenos/contactos/${contactoId}`);
}