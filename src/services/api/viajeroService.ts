import { apiClient } from './apiConfig'

export type Periodicidad = 'diario' | 'semanal' | 'quincenal' | 'mensual'

export const PERIODICIDADES: Periodicidad[] = ['diario', 'semanal', 'quincenal', 'mensual']

export interface Viajero {
  id: number
  name: string
  cedula: string
  phone: string
  celular: string
  ubicacion: string
  email: string
  periodicidad: string
  isActive: boolean
  role: string
  saldo: number
  clientId?: number | null
  createdAt?: string
  updatedAt?: string
}

export interface CreateViajeroRequest {
  name: string
  cedula: string
  phone: string
  ubicacion: string
  email?: string
  periodicidad?: string
  password?: string
}

export interface UpdateViajeroRequest {
  name?: string
  cedula?: string
  phone?: string
  ubicacion?: string
  email?: string
  periodicidad?: string
  password?: string
  isActive?: boolean
}

export interface ViajeroListParams {
  page?: number
  limit?: number
  search?: string
}

export interface ViajeroListResponse {
  data: Viajero[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

type RawRecord = Record<string, unknown>

class ViajeroService {
  private readonly endpoint = '/clients'

  async getAll(params?: ViajeroListParams): Promise<ViajeroListResponse> {
    const query = this.buildListQuery(params)
    const response = await apiClient.get<unknown>(`${this.endpoint}${query}`)
    return this.normalizeListResponse(response.data, params)
  }

  async getById(id: number): Promise<Viajero> {
    const response = await apiClient.get<unknown>(`${this.endpoint}/${id}`)
    return this.mapViajero(this.unwrap(response.data))
  }

  async create(data: CreateViajeroRequest): Promise<Viajero> {
    const response = await apiClient.post<unknown>(this.endpoint, {
      name: data.name.trim(),
      cedula: data.cedula.trim(),
      phone: data.phone.trim(),
      ubicacion: data.ubicacion.trim(),
      email: data.email?.trim() || undefined,
      periodicidad: data.periodicidad || undefined,
      password: data.password || undefined,
    })
    return this.mapViajero(this.unwrap(response.data))
  }

  async update(id: number, data: UpdateViajeroRequest): Promise<Viajero> {
    const payload: RawRecord = {}
    if (data.name !== undefined) payload['name'] = data.name.trim()
    if (data.cedula !== undefined) payload['cedula'] = data.cedula.trim()
    if (data.phone !== undefined) payload['phone'] = data.phone.trim()
    if (data.ubicacion !== undefined) payload['ubicacion'] = data.ubicacion.trim()
    if (data.email !== undefined) payload['email'] = data.email.trim()
    if (data.periodicidad !== undefined) payload['periodicidad'] = data.periodicidad
    if (data.password !== undefined) payload['password'] = data.password
    if (data.isActive !== undefined) payload['isActive'] = data.isActive

    const response = await apiClient.patch<unknown>(`${this.endpoint}/${id}`, payload)
    return this.mapViajero(this.unwrap(response.data))
  }

  async setActive(id: number, isActive: boolean): Promise<Viajero> {
    return this.update(id, { isActive })
  }

  async remove(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }

  async assignUser(id: number, userId: number): Promise<Viajero> {
    const response = await apiClient.patch<unknown>(`${this.endpoint}/${id}/assign-user`, { userId })
    return this.mapViajero(this.unwrap(response.data))
  }

  // ====== MAPPERS / HELPERS ======

  private buildListQuery(params?: ViajeroListParams): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    if (params.limit) parts.push(`limit=${params.limit}`)
    if (params.search) parts.push(`search=${encodeURIComponent(params.search)}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private unwrap(data: unknown): RawRecord {
    if (!data || typeof data !== 'object') return {}
    const obj = data as RawRecord
    const nested = obj['client'] || obj['data'] || obj['viajero']
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return nested as RawRecord
    }
    return obj
  }

  private normalizeListResponse(data: unknown, params?: ViajeroListParams): ViajeroListResponse {
    let rows: unknown[] = []
    let total = 0
    let page = params?.page || 1
    let limit = params?.limit || 0

    if (Array.isArray(data)) {
      rows = data
      total = data.length
    } else if (data && typeof data === 'object') {
      const obj = data as RawRecord
      const candidate = obj['clients'] || obj['data'] || obj['items'] || obj['usuarios']
      rows = Array.isArray(candidate)
        ? candidate
        : candidate && typeof candidate === 'object'
          ? (((candidate as RawRecord)['clients'] as unknown[]) ||
            ((candidate as RawRecord)['data'] as unknown[]) ||
            [])
          : []
      const pagination = (obj['pagination'] as RawRecord | undefined) || {}
      total = Number(obj['count'] ?? obj['total'] ?? pagination['total'] ?? rows.length) || rows.length
      page = Number(pagination['page'] ?? obj['page']) || page
      limit = Number(pagination['limit'] ?? obj['limit']) || limit
    }

    const viajeros = rows
      .filter((row): row is RawRecord => !!row && typeof row === 'object')
      .map((row) => this.mapViajero(row))

    if (!limit) limit = total || viajeros.length || 1

    return {
      data: viajeros,
      total,
      page,
      pageSize: limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  }

  private mapViajero(raw: RawRecord): Viajero {
    const phone = String(raw['phone'] ?? raw['celular'] ?? '')
    const saldo = Number(raw['saldo'] ?? raw['balance'] ?? 0)
    return {
      id: Number(raw['id'] ?? raw['clientId'] ?? 0),
      name: String(raw['name'] ?? ''),
      cedula: String(raw['cedula'] ?? ''),
      phone,
      celular: phone,
      ubicacion: String(raw['ubicacion'] ?? ''),
      email: String(raw['email'] ?? ''),
      periodicidad: String(raw['periodicidad'] ?? ''),
      isActive: raw['isActive'] !== false,
      role: String(raw['role'] ?? 'user'),
      saldo: Number.isFinite(saldo) ? saldo : 0,
      clientId: (raw['clientId'] as number | null | undefined) ?? null,
      createdAt: raw['createdAt'] as string | undefined,
      updatedAt: raw['updatedAt'] as string | undefined,
    }
  }
}

export const viajeroService = new ViajeroService()
