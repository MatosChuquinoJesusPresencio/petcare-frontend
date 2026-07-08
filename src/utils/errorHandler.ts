import { AxiosError } from 'axios'

interface ApiErrorResponse {
  mensaje?: string | Record<string, string>
  error?: string
  status?: number
}

export const getErrorMessage = (error: unknown): string => {
  if (error instanceof AxiosError && error.response?.data && typeof error.response.data === 'object') {
    const data = error.response.data as ApiErrorResponse
    const { status, mensaje } = data

    if (status === 401 && !mensaje) {
      return 'Credenciales inválidas'
    }

    if (typeof mensaje === 'object' && mensaje !== null) {
      const values = Object.values(mensaje)
      if (values.length > 0) return String(values[0])
    }

    if (typeof mensaje === 'string') return mensaje
    if (data.error) return data.error
  }

  if (error instanceof AxiosError && !error.response) {
    return 'Error de conexión con el servidor'
  }

  if (error instanceof Error) return error.message

  return 'Ocurrió un error inesperado'
}
