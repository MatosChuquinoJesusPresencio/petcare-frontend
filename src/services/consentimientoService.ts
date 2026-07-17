import apiClient from "../api/client";

export const consentimientoService = {
  async registrar(data: any) {
    const res = await apiClient.post("/api/consentimientos", data);
    return res.data;
  },

  async listarTodos() {
    const res = await apiClient.get("/api/consentimientos");
    return res.data;
  },

  async listarPorMascota(mascotaId: number) {
    const res = await apiClient.get(`/api/mascotas/${mascotaId}/consentimientos`);
    return res.data;
  },

  async obtenerPorId(id: number) {
    const res = await apiClient.get(`/api/consentimientos/${id}`);
    return res.data;
  }
};
