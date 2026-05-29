import { api } from "./api";

import type { Mascota } from "../types/mascota";
import type { PageResponse } from "../types/pagination";
import type { MascotaRequest } from "../types/mascotaRequest";

export async function obtenerMascotas() {

  const response = await api.get<PageResponse<Mascota>>(
    "/api/mascotas?page=0&size=10"
  );

  return response.data;
}

export async function obtenerMascotaPorId(id: number) {

  const response = await api.get<Mascota>(
    `/api/mascotas/${id}`
  );

  return response.data;
}

export async function obtenerMascotasPorDueno(duenoId: number) {

  const response = await api.get<PageResponse<Mascota>>(
    `/api/mascotas/dueno/${duenoId}?page=0&size=10`
  );

  return response.data;
}

export async function crearMascota(data: MascotaRequest) {

  const response = await api.post(
    "/api/mascotas",
    data
  );

  return response.data;
}

export async function actualizarMascota(
  id: number,
  data: MascotaRequest
) {

  const response = await api.put(
    `/api/mascotas/${id}`,
    data
  );

  return response.data;
}

export async function eliminarMascota(id: number) {

  await api.delete(`/api/mascotas/${id}`);
}

export async function vincularDueno(
  mascotaId: number,
  duenoId: number,
  relacion: string
) {

  await api.post(
    `/api/mascotas/${mascotaId}/vincular-dueno/${duenoId}?relacion=${relacion}`
  );
}