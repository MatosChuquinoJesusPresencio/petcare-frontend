// Estructura principal del Contacto de Emergencia (Almacenado)
export interface ContactoEmergencia {
  id: number;
  duenoId: number; // Relación con el dueño asociado
  name: string;    // Obligatorio, no vacío
  phone: string;   // Obligatorio, no vacío
  relation?: string; // Opcional (X en la tabla)
}

// Estructura para el formulario de agregar contacto
export interface ContactoEmergenciaRequest {
  name: string;
  phone: string;
  relation?: string;
}