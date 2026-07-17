export interface VeterinarioResponse {
  id: number;
  names: string;
  lastNames: string;
  email?: string;
  phone?: string;
  rol?: string;
  active?: boolean;
}

export type UsuarioResponse = VeterinarioResponse;

export interface ActualizarUsuarioRequest {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: string;
}

export interface CambiarContrasenaRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}
