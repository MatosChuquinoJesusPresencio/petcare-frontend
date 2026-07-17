import apiClient from "../api/client";
import type { AuditoriaResponse } from "../types";

export async function buscarAuditoria(params?: {
  tabla?: string;
  usuarioId?: number;
  fechaDesde?: string;
  fechaHasta?: string;
}): Promise<AuditoriaResponse[]> {
  const response = await apiClient.get<AuditoriaResponse[]>("/api/auditoria", { params });
  return response.data;
}
