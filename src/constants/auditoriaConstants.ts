export const TABLAS_AUDITABLES = [
  "mascotas",
  "citas",
  "atenciones_clinicas",
  "triajes",
  "recetas",
  "planes_tratamiento",
  "seguimientos",
  "vacunaciones",
  "consentimientos",
  "notificaciones",
  "duenos",
  "usuarios",
  "disponibilidad_veterinarios",
  "bloqueos_veterinarios",
  "sala_espera",
] as const;

export type TablaAuditable = typeof TABLAS_AUDITABLES[number];

export const TABLA_LABEL: Record<TablaAuditable, string> = {
  mascotas: "Mascotas",
  citas: "Citas",
  atenciones_clinicas: "Atenciones Clínicas",
  triajes: "Triajes",
  recetas: "Recetas",
  planes_tratamiento: "Planes de Tratamiento",
  seguimientos: "Seguimientos",
  vacunaciones: "Vacunaciones",
  consentimientos: "Consentimientos",
  notificaciones: "Notificaciones",
  duenos: "Dueños",
  usuarios: "Usuarios",
  disponibilidad_veterinarios: "Disponibilidad Veterinarios",
  bloqueos_veterinarios: "Bloqueos Veterinarios",
  sala_espera: "Sala de Espera",
};

export const TIPOS_OPERACION_AUDITORIA = ["CREATE", "UPDATE", "DELETE"] as const;

export type TipoOperacionAuditoria = typeof TIPOS_OPERACION_AUDITORIA[number];

export const OPERACION_LABEL: Record<TipoOperacionAuditoria, string> = {
  CREATE: "Creación",
  UPDATE: "Actualización",
  DELETE: "Eliminación",
};

export const OPERACION_BADGE: Record<TipoOperacionAuditoria, string> = {
  CREATE: "etiqueta--activo",
  UPDATE: "bg-primary",
  DELETE: "etiqueta--inactivo",
};
