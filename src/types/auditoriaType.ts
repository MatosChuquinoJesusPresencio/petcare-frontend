export interface AuditoriaResponse {
  id: number;
  tablaAfectada: string;
  registroId: number;
  campo: string;
  valorAnterior: string | null;
  valorNuevo: string | null;
  tipoOperacion: string;
  usuarioId: number | null;
  usuarioNombre: string | null;
  fechaCambio: string;
  motivo: string | null;
}
