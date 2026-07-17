import apiClient from "../api/client";

export const seguimientoService = {
  async programar(atencionId: number, data: any) {
    const res = await apiClient.post(`/api/atenciones-clinicas/${atencionId}/seguimientos`, data);
    return res.data;
  },

  async listarPorAtencion(atencionId: number) {
    const res = await apiClient.get(`/api/atenciones-clinicas/${atencionId}/seguimientos`);
    return res.data;
  },

  async proximos() {
    const res = await apiClient.get("/api/seguimientos/proximos");
    return res.data;
  },

  async completar(id: number, resultado?: string) {
    const res = await apiClient.patch(`/api/seguimientos/${id}/completar`, null, { params: { resultado } });
    return res.data;
  },

  async cancelar(id: number) {
    const res = await apiClient.patch(`/api/seguimientos/${id}/cancelar`);
    return res.data;
  }
};
