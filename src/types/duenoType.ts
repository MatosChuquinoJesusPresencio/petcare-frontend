export type UserRole = 'ADMINISTRADOR' | 'VETERINARIO' | 'ASISTENTE' | 'DUENO';

export interface Dueno {
  id: number;
  dni: string;
  phone?: string;
  address?: string;
  usuario?: {
    id: number;
    names: string;
    lastNames: string;
    email: string;
    phone: string;
    rol: string;
    active: boolean;
  } | null;
}

export interface DuenoRequest {
  dni: string;
  phone?: string;
  address?: string;
  userId?: number | null;
  firstName?: string;
  lastName?: string;
  email?: string;
  password?: string;
}

export type { PaginatedResponse } from "./pagination";
