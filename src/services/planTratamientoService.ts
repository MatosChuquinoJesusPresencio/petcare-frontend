import apiClient from "../api/client";

export const planTratamientoService = {
  async listarPorMascota(mascotaId: number) {
    const res = await apiClient.get(`/api/mascotas/${mascotaId}/planes-tratamiento`);
    return res.data;
  },

  async obtenerPorId(id: number) {
    const res = await apiClient.get(`/api/planes-tratamiento/${id}`);
    return res.data;
  },

  async crear(data: any) {
    const res = await apiClient.post("/api/planes-tratamiento", data);
    return res.data;
  },

  async cambiarEstado(id: number, estado: string) {
    const res = await apiClient.patch(`/api/planes-tratamiento/${id}/estado`, null, { params: { estado } });
    return res.data;
  }
};
