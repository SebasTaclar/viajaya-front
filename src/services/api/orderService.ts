import { apiClient } from './apiConfig'
import type {
  Orden,
  PaginatedResponse,
  PaginationParams,
} from '@/types/crmTypes'

class OrderService {
  async getOrderById(id: number): Promise<Orden> {
    const response = await apiClient.get<Orden>(`/order/${id}`)
    return response.data as unknown as Orden
  }

  async getAllOrders(params?: PaginationParams): Promise<PaginatedResponse<Orden>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Orden[]>(`/orders${query}`)
    return this.normalizeResponse(response.data)
  }

  async getPurchases(params?: PaginationParams): Promise<PaginatedResponse<Orden>> {
    const query = this.buildQuery(params)
    const response = await apiClient.get<Orden[]>(`/purchases${query}`)
    return this.normalizeResponse(response.data)
  }

  private buildQuery(params?: PaginationParams): string {
    if (!params) return ''
    const parts: string[] = []
    if (params.page) parts.push(`page=${params.page}`)
    const limit = params.pageSize ?? params.limit
    if (limit) parts.push(`limit=${limit}`)
    return parts.length > 0 ? `?${parts.join('&')}` : ''
  }

  private normalizeResponse(data: unknown): PaginatedResponse<Orden> {
    if (Array.isArray(data)) {
      return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 }
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      const nested =
        obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data'])
          ? (obj['data'] as Record<string, unknown>)
          : obj
      const candidate =
        (Array.isArray(nested['data']) ? nested['data'] : null) ||
        (Array.isArray(obj['data']) ? obj['data'] : null) ||
        nested['purchases'] ||
        nested['orders'] ||
        nested['items'] ||
        nested['rows'] ||
        nested['results'] ||
        obj['purchases'] ||
        obj['orders'] ||
        obj['items'] ||
        obj['rows'] ||
        obj['results']
      const rows = Array.isArray(candidate) ? candidate : []
      const total = Number(obj['total'] ?? nested['total'] ?? rows.length) || rows.length
      const page = Number(obj['page'] ?? nested['page']) || 1
      const limit = Number(obj['limit'] ?? obj['pageSize'] ?? nested['limit'] ?? nested['pageSize']) || rows.length || 10
      const totalPages = Number(obj['totalPages'] ?? nested['totalPages']) || Math.max(1, Math.ceil(total / (limit || 10)))
      return {
        data: rows as Orden[],
        total,
        page,
        pageSize: limit,
        totalPages,
      }
    }
    return { data: [], total: 0, page: 1, pageSize: 0, totalPages: 0 }
  }
}

export const orderService = new OrderService()
