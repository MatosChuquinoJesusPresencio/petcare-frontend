export type Role = 'ADMINISTRADOR' | 'VETERINARIO' | 'ASISTENTE' | 'DUENO';

export interface User {
  username: string;
  role: Role;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  username: string;
  role: Role;
}
