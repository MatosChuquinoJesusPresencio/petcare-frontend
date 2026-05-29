import { api } from "./api";

import type { Dueno } from "../types/dueno";
import type { PageResponse } from "../types/pagination";

export async function obtenerDuenos() {

  const response = await api.get<PageResponse<Dueno>>(
    "/api/duenos?page=0&size=100"
  );

  return response.data;
}