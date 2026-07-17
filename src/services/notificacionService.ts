import apiClient from "../api/client";

export const notificacionService = {
  async listarTodas() {
    const res = await apiClient.get("/api/notificaciones");
    return res.data;
  },

  async listarPorUsuario(usuarioId: number) {
    const res = await apiClient.get(`/api/notificaciones/usuario/${usuarioId}`);
    return res.data;
  },

  async contarNoLeidas(usuarioId: number): Promise<number> {
    const res = await apiClient.get(`/api/notificaciones/no-leidas?usuarioId=${usuarioId}`);
    return res.data;
  },

  async marcarComoLeidas(usuarioId: number) {
    await apiClient.patch(`/api/notificaciones/marcar-leidas?usuarioId=${usuarioId}`);
  },
};
