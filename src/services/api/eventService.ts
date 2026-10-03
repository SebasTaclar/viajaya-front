import { apiClient } from './apiConfig'
import type {
  Evento,
  CreateEventoRequest,
  EventEntityType,
  PaginatedResponse,
  PaginationParams,
} from '@/types/crmTypes'

class EventService {
  private readonly endpoint = '/events'

  async getAll(params?: PaginationParams & { entityType?: EventEntityType; entityId?: number }): Promise<PaginatedResponse<Evento>> {
    const query = this.buildQuery(params as Record<string, unknown>)
    const response = await apiClient.get<Evento[]>(`${this.endpoint}${query}`)
    return this.normalizeResponse(response.data)
  }

  async getById(id: number): Promise<Evento> {
    const response = await apiClient.get<Evento>(`${this.endpoint}/${id}`)
    return response.data as unknown as Evento
  }

  async getByEntity(entityType: EventEntityType, entityId: number): Promise<Evento[]> {
    const response = await apiClient.get<Evento[]>(
      `${this.endpoint}?entityType=${entityType}&entityId=${entityId}`,
    )
    return Array.isArray(response.data) ? response.data : []
  }

  async create(data: CreateEventoRequest): Promise<Evento> {
    const response = await apiClient.post<Evento>(this.endpoint, data)
    return response.data as unknown as Evento
  }

  async update(id: number, data: CreateEventoRequest): Promise<Evento> {
    const response = await apiClient.patch<Evento>(`${this.endpoint}/${id}`, data)
    return response.data as unknown as Evento
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }

  private buildQuery(params?: Record<string, unknown>): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    if (params.pageSize) parts.push(`limit=${params.pageSize}`)
    if (params.entityType) parts.push(`entityType=${params.entityType}`)
    if (params.entityId) parts.push(`entityId=${params.entityId}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private normalizeResponse(data: unknown): PaginatedResponse<Evento> {
    if (Array.isArray(data)) {
      return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 }
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      const nested = obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data'])
        ? obj['data'] as Record<string, unknown>
        : obj

      let items = nested['events'] || nested['items'] || nested['data'] || []
      if (!Array.isArray(items) && items && typeof items === 'object') {
        items = (items as Record<string, unknown>)['events'] || []
      }

      const pagination = (obj['pagination'] || nested['pagination']) as Record<string, unknown> | undefined
      const total = Number(obj['total'] ?? obj['count'] ?? nested['total'] ?? nested['count'] ?? pagination?.['total'])
        || (Array.isArray(items) ? items.length : 0)
      const page = Number(obj['page'] ?? nested['page'] ?? pagination?.['page']) || 1
      const pageSize = Number(obj['limit'] ?? obj['pageSize'] ?? nested['limit'] ?? pagination?.['limit']) || 0
      const totalPages = Number(obj['totalPages'] ?? nested['totalPages'] ?? pagination?.totalPages)
        || Math.max(1, pageSize > 0 ? Math.ceil(total / pageSize) : 1)

      return {
        data: Array.isArray(items) ? items : [],
        total,
        page,
        pageSize,
        totalPages,
      }
    }
    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const eventService = new EventService()
