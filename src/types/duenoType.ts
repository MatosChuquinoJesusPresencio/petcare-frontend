export type UserRole = 'ADMINISTRADOR' | 'VETERINARIO' | 'ASISTENTE' | 'DUENO';

export interface Dueno {
  id: number;
  nombre: string;
  apellido: string;
  dni: string;
  email: string;
  telefono?: string;
  direccion?: string;
  usuario?: {
    id: number;
    username: string;
    nombre: string;
    apellido: string;
    email: string;
    telefono: string;
    rol: string;
    activo: boolean;
  } | null;
  activo: boolean;
}

export interface DuenoRequest {
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone?: string;
  address?: string;
  userId?: number | null;
}

export type { PaginatedResponse } from "./pagination";
