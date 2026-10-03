import { ref } from 'vue'
import { viajeroService, type Viajero } from '@/services/api/viajeroService'

export interface ViajeroUsuario {
  id: number
  name: string
  email: string
  cedula: string
  celular: string
  ubicacion: string
  periodicidad: string
  role: 'user' | 'admin' | 'superadmin'
  isActive: boolean
  saldo: number
  consentLey1581: boolean
  consentDate?: string
}

export type MockUser = ViajeroUsuario

export const usuarios = ref<ViajeroUsuario[]>([])
export const usuariosLoading = ref(false)
export const usuariosError = ref('')

let loadedOnce = false

function mapViajero(v: Viajero): ViajeroUsuario {
  return {
    id: v.id,
    name: v.name,
    email: v.email,
    cedula: v.cedula,
    celular: v.celular,
    ubicacion: v.ubicacion,
    periodicidad: v.periodicidad,
    role: (v.role === 'admin' || v.role === 'superadmin' ? v.role : 'user'),
    isActive: v.isActive,
    saldo: v.saldo,
    consentLey1581: true,
    consentDate: v.createdAt ? new Date(v.createdAt).toLocaleDateString('es-CO') : undefined,
  }
}

export async function loadUsuarios(force = false): Promise<void> {
  if (usuariosLoading.value) return
  if (loadedOnce && !force) return

  usuariosLoading.value = true
  usuariosError.value = ''
  try {
    const response = await viajeroService.getAll({ page: 1, limit: 9999 })
    usuarios.value = response.data.map(mapViajero)
    loadedOnce = true
  } catch (error) {
    usuariosError.value =
      error instanceof Error ? error.message : 'No se pudieron cargar los viajeros'
    usuarios.value = []
  } finally {
    usuariosLoading.value = false
  }
}

export function resetUsuarios(): void {
  usuarios.value = []
  usuariosError.value = ''
  loadedOnce = false
}
