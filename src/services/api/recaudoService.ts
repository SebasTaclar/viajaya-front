import { apiClient } from './apiConfig'

export interface RecaudoClient {
  id: number
  name?: string
  cedula?: string
  phone?: string
  periodicidad?: string
}

export interface RecaudoRow {
  id: number
  clientId: number
  fecha: string
  valor: number
  createdAt?: string
  updatedAt?: string
  client?: RecaudoClient | null
}

export interface RecaudoListParams {
  clientId?: number
  page?: number
  limit?: number
}

export interface RecaudoListResponse {
  data: RecaudoRow[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export interface CreateRecaudoRequest {
  clientId: number
  fecha?: string
  valor: number
}

export interface UpdateRecaudoRequest {
  fecha?: string
  valor?: number
}

type RawRecord = Record<string, unknown>

class RecaudoService {
  private readonly endpoint = '/recaudos'

  async getAll(params?: RecaudoListParams): Promise<RecaudoListResponse> {
    const parts: string[] = []
    if (params?.clientId) parts.push(`clientId=${params.clientId}`)
    if (params?.page) parts.push(`page=${params.page}`)
    if (params?.limit) parts.push(`limit=${params.limit}`)
    const query = parts.length > 0 ? `?${parts.join('&')}` : ''

    const response = await apiClient.get<unknown>(`${this.endpoint}${query}`)
    return this.normalizeListResponse(response.data, params)
  }

  async getById(id: number): Promise<RecaudoRow> {
    const response = await apiClient.get<unknown>(`${this.endpoint}/${id}`)
    return this.unwrap(response.data) as unknown as RecaudoRow
  }

  async create(data: CreateRecaudoRequest): Promise<RecaudoRow> {
    const payload: RawRecord = { clientId: data.clientId, valor: data.valor }
    if (data.fecha) payload['fecha'] = data.fecha
    const response = await apiClient.post<unknown>(this.endpoint, payload)
    return this.unwrap(response.data) as unknown as RecaudoRow
  }

  async update(id: number, data: UpdateRecaudoRequest): Promise<RecaudoRow> {
    const payload: RawRecord = {}
    if (data.valor !== undefined) payload['valor'] = data.valor
    if (data.fecha !== undefined) payload['fecha'] = data.fecha
    const response = await apiClient.patch<unknown>(`${this.endpoint}/${id}`, payload)
    return this.unwrap(response.data) as unknown as RecaudoRow
  }

  async remove(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }

  private unwrap(data: unknown): RawRecord {
    if (!data || typeof data !== 'object') return {}
    const obj = data as RawRecord
    const nested = obj['recaudo'] || obj['data']
    if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
      return nested as RawRecord
    }
    return obj
  }

  private normalizeListResponse(data: unknown, params?: RecaudoListParams): RecaudoListResponse {
    let rows: unknown[] = []
    let total = 0
    let page = params?.page || 1
    let limit = params?.limit || 0

    if (Array.isArray(data)) {
      rows = data
      total = data.length
    } else if (data && typeof data === 'object') {
      const obj = data as RawRecord
      const candidate = obj['recaudos'] || obj['data'] || obj['items']
      rows = Array.isArray(candidate) ? candidate : []
      const pagination = (obj['pagination'] as RawRecord | undefined) || {}
      total = Number(obj['count'] ?? obj['total'] ?? pagination['total'] ?? rows.length) || rows.length
      page = Number(pagination['page'] ?? obj['page']) || page
      limit = Number(pagination['limit'] ?? obj['limit']) || limit
    }

    const recaudos = rows.filter(
      (row): row is RawRecord => !!row && typeof row === 'object',
    )

    if (!limit) limit = total || recaudos.length || 1

    return {
      data: recaudos as unknown as RecaudoRow[],
      total,
      page,
      pageSize: limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  }
}

export const recaudoService = new RecaudoService()
