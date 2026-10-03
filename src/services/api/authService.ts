import { apiClient, type ApiResponse } from './apiConfig'

// Tipos para autenticación
export interface LoginCredentials {
  email: string
  password: string
}

export interface LoginResponse {
  token: string
  user?: UserInfo | null
}

export interface DecodedToken {
  id: number
  email: string
  name: string
  role: string
  membershipPaid: boolean
  iat: number
  exp: number
  teamId?: number | null
  clientId?: number | null
}

export interface UserInfo {
  id: number
  email: string
  name: string
  role: string
  membershipPaid: boolean
  teamId?: number | null
  clientId?: number | null
}

/**
 * Extrae el JWT de la respuesta del backend sin asumir una forma única
 * (acepta { token }, { accessToken }, { data: { token } }, etc.)
 */
export function extractToken(payload: unknown): string | null {
  if (!payload || typeof payload !== 'object') return null
  const obj = payload as Record<string, unknown>
  const candidates = [
    obj.token,
    obj.accessToken,
    obj.access_token,
    obj.jwt,
    obj.data,
  ]
  for (const candidate of candidates) {
    if (typeof candidate === 'string' && candidate.split('.').length === 3) {
      return candidate
    }
    if (candidate && typeof candidate === 'object') {
      const nested = extractToken(candidate)
      if (nested) return nested
    }
  }
  return null
}

class AuthService {
  private readonly TOKEN_KEY = 'authToken'
  private readonly USER_INFO_KEY = 'userInfo'

  /**
   * Realiza el login del usuario (POST /v1/login con { email, password })
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    const raw = await apiClient.post<LoginResponse>('/login', {
      email: credentials.email.trim(),
      password: credentials.password,
    })

    return this.handleLoginResponse(raw)
  }

  /**
   * Procesa la respuesta del endpoint de login: guarda token y datos del usuario
   */
  handleLoginResponse(raw: ApiResponse<LoginResponse>): ApiResponse<LoginResponse> {
    const record = raw as unknown as Record<string, unknown>
    const token = extractToken(record.data) || extractToken(record)

    if (!token) {
      return {
        success: false,
        message: (typeof record.message === 'string' && record.message) || 'Credenciales inválidas',
        data: null as unknown as LoginResponse,
        timestamp: new Date().toISOString(),
        statusCode: 401,
      }
    }

    this.setToken(token)
    const userInfo = this.decodeToken(token)
    if (userInfo) {
      this.setUserInfo(userInfo)
    }

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      data: { token },
      timestamp: new Date().toISOString(),
      statusCode: 200,
    }
  }

  /**
   * Cierra la sesión del usuario
   */
  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_INFO_KEY)
  }

  /**
   * Verifica si el usuario está autenticado
   */
  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false

    const userInfo = this.getUserInfo()
    if (!userInfo) return false

    const currentTime = Date.now() / 1000
    return userInfo.exp > currentTime
  }

  /**
   * Obtiene el token de autenticación
   */
  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  /**
   * Guarda el token de autenticación
   */
  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  /**
   * Obtiene la información del usuario
   */
  getUserInfo(): DecodedToken | null {
    const userInfoStr = localStorage.getItem(this.USER_INFO_KEY)
    if (!userInfoStr) return null

    try {
      return JSON.parse(userInfoStr)
    } catch {
      return null
    }
  }

  /**
   * Guarda la información del usuario
   */
  private setUserInfo(userInfo: DecodedToken): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo))
  }

  /**
   * Decodifica el token JWT (simple parsing, sin verificación de firma)
   */
  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1]
      const decodedPayload = atob(payload)
      return JSON.parse(decodedPayload)
    } catch {
      return null
    }
  }

  /**
   * Obtiene el rol del usuario actual
   */
  getUserRole(): string | null {
    const userInfo = this.getUserInfo()
    return userInfo?.role || null
  }

  /**
   * Verifica si el usuario tiene un rol específico
   */
  hasRole(role: string): boolean {
    const userRole = this.getUserRole()
    return userRole === role
  }

  /**
   * Verifica si el usuario es administrador
   */
  isAdmin(): boolean {
    return this.hasRole('admin') || this.hasRole('superadmin')
  }

  /**
   * Obtiene información básica del usuario para mostrar en la UI
   */
  getCurrentUser(): UserInfo | null {
    const userInfo = this.getUserInfo()
    if (!userInfo) return null

    return {
      id: userInfo.id,
      email: userInfo.email,
      name: userInfo.name,
      role: userInfo.role,
      membershipPaid: userInfo.membershipPaid,
      teamId: userInfo.teamId || null,
      clientId: userInfo.clientId || null,
    }
  }
}

// Instancia singleton del servicio de autenticación
export const authService = new AuthService()
