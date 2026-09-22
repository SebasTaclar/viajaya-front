import { apiClient, type ApiResponse } from './apiConfig'
import type { LoginCredentials, LoginResponse, DecodedToken, UserInfo } from './authService'

export interface SmsCodeResponse {
  success: boolean
  message: string
  expiresIn?: number
}

class ClientAuthService {
  private readonly TOKEN_KEY = 'clientAuthToken'
  private readonly USER_INFO_KEY = 'clientUserInfo'
  private readonly MOCK_SMS_CODE = '123456'
  private readonly CODE_EXPIRY_MINUTES = 5
  private codeTimestamp: number | null = null

  async login(credentials: LoginCredentials): Promise<ApiResponse<LoginResponse>> {
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

  async sendSmsCode(cedula: string): Promise<SmsCodeResponse> {
    // Mock: simula envío de SMS con código 123456
    void cedula
    await new Promise(resolve => setTimeout(resolve, 1000))
    this.codeTimestamp = Date.now()
    return {
      success: true,
      message: 'Código de verificación enviado a su celular',
      expiresIn: this.CODE_EXPIRY_MINUTES * 60,
    }
  }

  isCodeExpired(): boolean {
    if (!this.codeTimestamp) return true
    const elapsed = Date.now() - this.codeTimestamp
    return elapsed > this.CODE_EXPIRY_MINUTES * 60 * 1000
  }

  async verifySmsCode(cedula: string, code: string): Promise<ApiResponse<LoginResponse>> {
    if (this.isCodeExpired()) {
      return {
        success: false,
        message: 'El código ha expirado. Solicite uno nuevo.',
        data: null as unknown as LoginResponse,
        timestamp: new Date().toISOString(),
        statusCode: 400,
      }
    }

    if (code !== this.MOCK_SMS_CODE) {
      return {
        success: false,
        message: 'Código de verificación inválido',
        data: null as unknown as LoginResponse,
        timestamp: new Date().toISOString(),
        statusCode: 400,
      }
    }

    // Mock: genera un token JWT falso
    const mockToken = this.generateMockToken(cedula)
    this.setToken(mockToken)
    const userInfo = this.decodeToken(mockToken)
    if (userInfo) {
      this.setUserInfo(userInfo)
    }
    this.codeTimestamp = null

    return {
      success: true,
      message: 'Inicio de sesión exitoso',
      data: { token: mockToken },
      timestamp: new Date().toISOString(),
      statusCode: 200,
    }
  }

  private generateMockToken(cedula: string): string {
    const header = btoa(JSON.stringify({ alg: 'HS256', typ: 'JWT' }))
    const now = Math.floor(Date.now() / 1000)
    const payload = btoa(JSON.stringify({
      id: 1,
      email: `${cedula}@mock.com`,
      name: 'Usuario Portal',
      role: 'user',
      membershipPaid: true,
      clientId: 1,
      teamId: null,
      iat: now,
      exp: now + 3600,
    }))
    const signature = btoa('mock-signature')
    return `${header}.${payload}.${signature}`
  }

  logout(): void {
    localStorage.removeItem(this.TOKEN_KEY)
    localStorage.removeItem(this.USER_INFO_KEY)
  }

  isAuthenticated(): boolean {
    const token = this.getToken()
    if (!token) return false
    const userInfo = this.getUserInfo()
    if (!userInfo) return false
    const currentTime = Date.now() / 1000
    return userInfo.exp > currentTime
  }

  getToken(): string | null {
    return localStorage.getItem(this.TOKEN_KEY)
  }

  private setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token)
  }

  getUserInfo(): DecodedToken | null {
    const userInfoStr = localStorage.getItem(this.USER_INFO_KEY)
    if (!userInfoStr) return null
    try {
      return JSON.parse(userInfoStr)
    } catch {
      return null
    }
  }

  private setUserInfo(userInfo: DecodedToken): void {
    localStorage.setItem(this.USER_INFO_KEY, JSON.stringify(userInfo))
  }

  private decodeToken(token: string): DecodedToken | null {
    try {
      const payload = token.split('.')[1]
      const decodedPayload = atob(payload)
      return JSON.parse(decodedPayload)
    } catch {
      return null
    }
  }

  getUserRole(): string | null {
    const userInfo = this.getUserInfo()
    return userInfo?.role || null
  }

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

export const clientAuthService = new ClientAuthService()
