import { apiClient } from './apiConfig'

export interface User {
  id: number
  clientId?: number
  clientName?: string
  email?: string
  name?: string
  role: string
  isActive?: boolean
  membershipPaid?: boolean
  teamId?: number | null
  createdAt?: string
  created_at?: string
}

export interface CreateUserRequest {
  clientId?: number | null
  password: string
  email?: string
  name?: string
  role?: string
}

export interface UpdateUserRequest {
  clientId?: number
  email?: string
  name?: string
  role?: string
}

export interface UserListResponse {
  data: User[]
  total: number
}

class UserService {
  private readonly endpoint = '/users'

  async getAll(): Promise<User[]> {
    const response = await apiClient.get<unknown>(this.endpoint)
    const raw = response.data as unknown

    const asArray = (value: unknown): User[] | null =>
      Array.isArray(value) ? (value as User[]) : null

    if (Array.isArray(raw)) return raw as User[]

    if (raw && typeof raw === 'object') {
      const obj = raw as Record<string, unknown>
      const candidates = [obj['users'], obj['data'], obj['items']]
      for (const candidate of candidates) {
        const direct = asArray(candidate)
        if (direct) return direct
        if (candidate && typeof candidate === 'object') {
          const nested = candidate as Record<string, unknown>
          const inner = asArray(nested['users']) || asArray(nested['data'])
          if (inner) return inner
        }
      }
    }

    return []
  }

  async create(data: CreateUserRequest): Promise<User> {
    const response = await apiClient.post<{ user: User } | User>('/user/create', data)
    const raw = response.data as unknown as Record<string, unknown> | User
    if (raw && typeof raw === 'object' && 'user' in raw) return (raw as { user: User }).user
    return raw as User
  }

  async update(id: number, data: UpdateUserRequest): Promise<User> {
    const response = await apiClient.patch<{ user: User } | User>(`${this.endpoint}/${id}`, data)
    const raw = response.data as unknown as Record<string, unknown> | User
    if (raw && typeof raw === 'object' && 'user' in raw) return (raw as { user: User }).user
    return raw as User
  }

  async changePassword(userId: number, newPassword: string): Promise<void> {
    await apiClient.patch('/user/change-password', { userId, newPassword })
  }

  async delete(id: number): Promise<void> {
    await apiClient.delete(`${this.endpoint}/${id}`)
  }
}

export const userService = new UserService()
