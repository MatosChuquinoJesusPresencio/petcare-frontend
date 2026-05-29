import apiClient from "../api/client";
import type { ContactoEmergencia, ContactoEmergenciaRequest } from "../types/contactoType";
import type { PaginatedResponse } from "../types/duenoType";

export async function getContactosByDuenoId(
  duenoId: number,
  params?: { nombre?: string; telefono?: string; relacion?: string }
): Promise<ContactoEmergencia[]> {
  const response = await apiClient.get<PaginatedResponse<ContactoEmergencia>>(`/api/duenos/${duenoId}/contactos`, {
    params: {
      nombre: params?.nombre || undefined,
      telefono: params?.telefono || undefined,
      relacion: params?.relacion || undefined,
    },
  });
  return response.data.content;
}

export async function createContacto(
  duenoId: number,
  contacto: ContactoEmergenciaRequest
): Promise<ContactoEmergencia> {
  const response = await apiClient.post<ContactoEmergencia>(`/api/duenos/${duenoId}/contactos`, contacto);
  return response.data;
}

export async function deleteContacto(contactoId: number): Promise<void> {
  await apiClient.delete(`/api/duenos/contactos/${contactoId}`);
}
