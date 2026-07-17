import apiClient from "../api/client";

export const dashboardService = {
  async obtenerResumen() {
    const res = await apiClient.get("/api/dashboard/resumen-diario");
    return res.data;
  }
};
