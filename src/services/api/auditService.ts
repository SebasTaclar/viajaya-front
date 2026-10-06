import { apiClient } from './apiConfig'

export interface AuditLogData {
  before?: unknown
  after?: unknown
  reason?: string
  [key: string]: unknown
}

export interface AuditLog {
  id: number
  occurredAt: string
  action: string
  tableName: string | null
  entityId: number | string | null
  userId: number | null
  username: string | null
  status: string
  ipAddress: string | null
  userAgent: string | null
  data: AuditLogData | null
}

export interface AuditListParams {
  page?: number
  limit?: number
  tableName?: string
  action?: string
  status?: string
  userId?: number
  startDate?: string
  endDate?: string
}

export interface AuditListResponse {
  data: AuditLog[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

type RawRecord = Record<string, unknown>

function pick(source: RawRecord, ...keys: string[]): unknown {
  for (const key of keys) {
    const value = source[key]
    if (value !== undefined && value !== null && value !== '') return value
  }
  return null
}

class AuditService {
  private readonly endpoint = '/audit'

  async getAll(params?: AuditListParams): Promise<AuditListResponse> {
    const parts: string[] = []
    if (params?.page) parts.push(`page=${params.page}`)
    if (params?.limit) parts.push(`limit=${params.limit}`)
    if (params?.tableName) parts.push(`tableName=${encodeURIComponent(params.tableName)}`)
    if (params?.action) parts.push(`action=${encodeURIComponent(params.action)}`)
    if (params?.status) parts.push(`status=${encodeURIComponent(params.status)}`)
    if (params?.userId) parts.push(`userId=${params.userId}`)
    if (params?.startDate) parts.push(`startDate=${encodeURIComponent(params.startDate)}`)
    if (params?.endDate) parts.push(`endDate=${encodeURIComponent(params.endDate)}`)
    const query = parts.length > 0 ? `?${parts.join('&')}` : ''

    const response = await apiClient.get<unknown>(`${this.endpoint}${query}`)
    return this.normalizeListResponse(response.data, params)
  }

  private normalizeListResponse(data: unknown, params?: AuditListParams): AuditListResponse {
    let rows: unknown[] = []
    let total = 0
    let page = params?.page || 1
    let limit = params?.limit || 10

    if (Array.isArray(data)) {
      rows = data
      total = data.length
    } else if (data && typeof data === 'object') {
      const obj = data as RawRecord
      const nested =
        obj['data'] && typeof obj['data'] === 'object' && !Array.isArray(obj['data'])
          ? (obj['data'] as RawRecord)
          : obj
      const candidate =
        nested['logs'] ||
        nested['auditLogs'] ||
        nested['items'] ||
        nested['rows'] ||
        (Array.isArray(nested['data']) ? nested['data'] : null) ||
        (Array.isArray(obj['data']) ? obj['data'] : null)
      rows = Array.isArray(candidate) ? candidate : []
      const pagination = (nested['pagination'] || obj['pagination']) as RawRecord | undefined
      total =
        Number(
          obj['count'] ??
            obj['total'] ??
            nested['count'] ??
            nested['total'] ??
            pagination?.['total'] ??
            rows.length,
        ) || rows.length
      page = Number(obj['page'] ?? nested['page'] ?? pagination?.['page']) || page
      limit =
        Number(
          obj['limit'] ??
            obj['pageSize'] ??
            nested['limit'] ??
            nested['pageSize'] ??
            pagination?.['limit'],
        ) || limit
    }

    const logs = rows.filter((row): row is RawRecord => !!row && typeof row === 'object')

    if (!limit) limit = params?.limit || 10

    return {
      data: logs.map((row) => this.normalizeRow(row)),
      total,
      page,
      pageSize: limit,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    }
  }

  private normalizeRow(row: RawRecord): AuditLog {
    const userId = Number(pick(row, 'user_id', 'userId'))
    const rawEntityId = pick(row, 'entity_id', 'entityId')

    return {
      id: Number(pick(row, 'id') ?? 0),
      occurredAt: String(pick(row, 'occurred_at', 'occurredAt', 'createdAt', 'created_at') ?? ''),
      action: String(pick(row, 'action') ?? ''),
      tableName: pick(row, 'table_name', 'tableName') as string | null,
      entityId:
        typeof rawEntityId === 'number' || typeof rawEntityId === 'string' ? rawEntityId : null,
      userId: userId || null,
      username: pick(row, 'username', 'user') as string | null,
      status: String(pick(row, 'status') ?? 'SUCCESS'),
      ipAddress: pick(row, 'ip_address', 'ipAddress', 'ip') as string | null,
      userAgent: pick(row, 'user_agent', 'userAgent') as string | null,
      data: this.normalizeData(pick(row, 'data')),
    }
  }

  private normalizeData(raw: unknown): AuditLogData | null {
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) return raw as AuditLogData
    if (typeof raw === 'string' && raw.trim()) {
      try {
        const parsed: unknown = JSON.parse(raw)
        if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) {
          return parsed as AuditLogData
        }
      } catch {
        return { reason: raw }
      }
    }
    return null
  }
}

export const auditService = new AuditService()
