export interface ServicioRequest {
  name: string
  description: string
  durationMinutes: number
  referentialCost: number
}

export interface ServicioResponse {
  id: number
  name: string
  description: string
  durationMinutes: number
  referenceCost: number
  active: boolean
}
