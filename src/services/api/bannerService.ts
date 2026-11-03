import { apiClient, type ApiResponse } from './apiConfig'

export interface BannerContent {
  imageName?: string
  url: string
  link?: string
  clase?: string
  [key: string]: unknown
}

export interface Banner {
  id: number
  name: string
  content: BannerContent
  isActive: boolean
  sortOrder: number
  createdAt?: string
  updatedAt?: string
}

export interface CreateBannerRequest {
  name: string
  content: BannerContent
  isActive?: boolean
  sortOrder?: number
}

export type UpdateBannerRequest = Partial<CreateBannerRequest>

function parseBannerContent(value: unknown): BannerContent {
  if (typeof value === 'string') {
    try {
      return parseBannerContent(JSON.parse(value))
    } catch {
      return { url: value }
    }
  }
  if (value && typeof value === 'object' && typeof (value as { url?: unknown }).url === 'string') {
    return value as BannerContent
  }
  return { url: '' }
}

function extractBannerList(value: unknown): unknown[] {
  if (Array.isArray(value)) return value
  if (!value || typeof value !== 'object') return []

  const record = value as Record<string, unknown>
  for (const key of ['data', 'items', 'banners', 'records', 'results']) {
    const nested = record[key]
    if (Array.isArray(nested)) return nested
    const extracted = extractBannerList(nested)
    if (extracted.length > 0) return extracted
  }
  return []
}

function normalizeBanner(value: unknown): Banner | null {
  if (!value || typeof value !== 'object') return null
  const record = value as Record<string, unknown>
  const id = Number(record.id)
  if (!Number.isFinite(id) || typeof record.name !== 'string') return null

  return {
    ...record,
    id,
    name: record.name,
    content: parseBannerContent(record.content),
    isActive: record.isActive !== false,
    sortOrder: Number(record.sortOrder) || 0,
  } as Banner
}

class BannerService {
  async getAll(all = false): Promise<ApiResponse<Banner[]>> {
    const query = all ? '?all=true' : ''
    const response = await apiClient.get<unknown>(`/banners${query}`)
    const data = extractBannerList(response.data)
      .map(normalizeBanner)
      .filter((banner): banner is Banner => banner !== null)
    return { ...response, data }
  }

  async getById(id: number): Promise<ApiResponse<Banner>> {
    return apiClient.get<Banner>(`/banners/${id}`)
  }

  async create(data: CreateBannerRequest): Promise<ApiResponse<Banner>> {
    return apiClient.post<Banner>('/banners', data)
  }

  async update(id: number, data: UpdateBannerRequest): Promise<ApiResponse<Banner>> {
    return apiClient.put<Banner>(`/banners/${id}`, data)
  }

  async delete(id: number): Promise<ApiResponse<{ message: string }>> {
    return apiClient.delete<{ message: string }>(`/banners/${id}`)
  }
}

export const bannerService = new BannerService()
