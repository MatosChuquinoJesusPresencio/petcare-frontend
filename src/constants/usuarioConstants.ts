export const ROLES_USUARIO = [
  "ADMINISTRADOR",
  "VETERINARIO",
  "ASISTENTE",
  "DUENO",
] as const;

export type RolUsuario = typeof ROLES_USUARIO[number];

export const ROL_LABEL: Record<RolUsuario, string> = {
  ADMINISTRADOR: "Administrador",
  VETERINARIO: "Veterinario",
  ASISTENTE: "Asistente",
  DUENO: "Dueño",
};
