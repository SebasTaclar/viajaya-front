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

class AuthService {
  private readonly TOKEN_KEY = 'authToken'
  private readonly USER_INFO_KEY = 'userInfo'
  private readonly MOCK_ADMINS = [
    {
      email: 'admin@somosviajaya.com',
      password: 'ViajaYa2026',
      name: 'Coordinador Viaja Ya',
      role: 'admin',
    },
    {
      email: 'superadmin@somosviajaya.com',
      password: 'ViajaYaAdmin2026',
      name: 'Super Admin Viaja Ya',
      role: 'superadmin',
    },
  ]

  /**
   * Realiza el login del usuario
   */
  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
    // Mock: acceso admin sin backend
    const email = credentials.email.trim().toLowerCase()
    const mockAdmin = this.MOCK_ADMINS.find(
      m => m.email === email && m.password === credentials.password,
    )

    if (mockAdmin) {
      await new Promise(resolve => setTimeout(resolve, 600))
      const mockToken = this.generateMockAdminToken(mockAdmin)
      this.setToken(mockToken)
      const userInfo = this.decodeToken(mockToken)
      if (userInfo) {
        this.setUserInfo(userInfo)
      }
      return {
        success: true,
        message: 'Inicio de sesión exitoso',
        data: { token: mockToken },
        timestamp: new Date().toISOString(),
        statusCode: 200,
      }
    }

    const response = await apiClient.post<LoginResponse>('/login', credentials)

    if (response.success && response.data.token) {
      this.setToken(response.data.token)

      const userInfo = this.decodeToken(response.data.token)
      if (userInfo) {
        this.setUserInfo(userInfo)
      }
    }

    return response
  }

  private generateMockAdminToken(mockAdmin: { email: string; name: string; role: string }): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const now = Math.floor(Date.now() / 1000)
    const payload = btoa(
      JSON.stringify({
        id: mockAdmin.role === 'superadmin' ? 2 : 1,
        email: mockAdmin.email,
        name: mockAdmin.name,
        role: mockAdmin.role,
        membershipPaid: true,
        teamId: null,
        clientId: null,
        iat: now,
        exp: now + 3600,
      }),
    )
    const signature = btoa('mock-admin-signature')
    return `${header}.${payload}.${signature}`
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
