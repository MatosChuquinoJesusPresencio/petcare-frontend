// Roles permitidos según la tabla de accesos
export type UserRole = 'ADMINISTRADOR' | 'VETERINARIO' | 'ASISTENTE' | 'DUENO';

// Estructura principal del Dueño (recibida desde el Backend)
export interface Dueno {
  id: number;
  firstName: string;
  lastName: string;
  dni: string;
  email: string;
  phone?: string;    // Opcional (X en la tabla)
  address?: string;  // Opcional (X en la tabla)
  userId?: number;   // Opcional (X en la tabla)
  activo: boolean;   // Controla el estado para la operación "Desactivar"
}

// Estructura requerida para Crear/Editar (DuenoRequest)
export interface DuenoRequest {
  firstName: string; // Obligatorio y no vacío
  lastName: string;  // Obligatorio y no vacío
  dni: string;       // Obligatorio (8-20 caracteres)
  email: string;     // Obligatorio (Formato email válido)
  phone?: string;    // Opcional
  address?: string;  // Opcional
  userId?: number | null; // Opcional (Debe ser un ID existente si se ingresa)
}

// Estructura para la respuesta paginada del GET /api/duenos
export interface PaginatedResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number; // Página actual
}