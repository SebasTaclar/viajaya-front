import { apiClient } from './apiConfig'
import type {
  DocumentoEntity,
  DocumentEntityType,
  DocumentType,
  PaginatedResponse,
  PaginationParams,
} from '@/types/crmTypes'

class DocumentService {
  private readonly endpoint = '/documents'

  async getAll(params?: PaginationParams & { entityType?: DocumentEntityType; entityId?: number }): Promise<PaginatedResponse<DocumentoEntity>> {
    const query = this.buildQuery(params as Record<string, unknown>)
    const response = await apiClient.get<DocumentoEntity[]>(`${this.endpoint}${query}`)
    return this.normalizeResponse(response.data)
  }

  async getById(id: number): Promise<DocumentoEntity> {
    const response = await apiClient.get<DocumentoEntity>(`${this.endpoint}/${id}`)
    return response.data as unknown as DocumentoEntity
  }

  async getByEntity(entityType: DocumentEntityType, entityId: number): Promise<DocumentoEntity[]> {
    const response = await apiClient.get<DocumentoEntity[]>(
      `${this.endpoint}?entityType=${entityType}&entityId=${entityId}`,
    )
    const normalized = this.normalizeResponse(response.data)
    return normalized.data
  }

  async upload(file: File, options?: { entityType?: DocumentEntityType; entityId?: number; type?: DocumentType; name?: string; isVisible?: boolean }): Promise<DocumentoEntity> {
    const formData = new FormData()
    if (options?.entityType) formData.append('entityType', options.entityType)
    if (options?.entityId) formData.append('entityId', String(options.entityId))
    if (options?.type) formData.append('type', options.type)
    formData.append('isVisible', String(options?.isVisible ?? true))

    const fileName = options?.name || file.name
    const ext = file.name.split('.').pop() || ''
    const renamedFile = new File([file], `${fileName}.${ext}`, { type: file.type })
    formData.append('file', renamedFile)

    const response = await apiClient.post<DocumentoEntity>(this.endpoint, formData)
    return response.data as unknown as DocumentoEntity
  }

  async update(id: number, data: { name?: string; type?: DocumentType; isVisible?: boolean }): Promise<DocumentoEntity> {
    const response = await apiClient.patch<DocumentoEntity>(`${this.endpoint}/${id}`, data)
    return response.data as unknown as DocumentoEntity
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

  private normalizeResponse(data: unknown): PaginatedResponse<DocumentoEntity> {
    if (Array.isArray(data)) {
      return { data, total: data.length, page: 1, pageSize: data.length, totalPages: 1 }
    }
    if (data && typeof data === 'object') {
      const obj = data as Record<string, unknown>
      const nested = obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data'])
        ? obj['data'] as Record<string, unknown>
        : obj

      let items = nested['documents'] || nested['items'] || nested['data'] || []
      if (!Array.isArray(items) && items && typeof items === 'object') {
        items = (items as Record<string, unknown>)['documents'] || []
      }

      const pagination = (obj['pagination'] || nested['pagination']) as Record<string, unknown> | undefined
      const total = Number(obj['total'] ?? obj['count'] ?? nested['total'] ?? nested['count'] ?? pagination?.['total'])
        || (Array.isArray(items) ? items.length : 0)
      const page = Number(obj['page'] ?? nested['page'] ?? pagination?.['page']) || 1
      const pageSize = Number(obj['limit'] ?? obj['pageSize'] ?? nested['limit'] ?? pagination?.['limit']) || 0
      const totalPages = Number(obj['totalPages'] ?? nested['totalPages'] ?? pagination?.['totalPages'])
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

export const documentService = new DocumentService()
