import { apiClient } from './apiConfig'

class MessageService {
  private readonly endpoint = '/messages/send'

  async send(recipients: string | string[], message: string): Promise<void> {
    await apiClient.post(this.endpoint, { recipients, message })
  }

  /**
   * Normaliza un celular colombiano a formato internacional (+57...)
   * Acepta "3001234567", "300 123 4567", "+573001234567", "573001234567"
   */
  toInternationalPhone(raw?: string | null): string | null {
    if (!raw) return null
    const digits = raw.replace(/\D/g, '')
    if (!digits) return null
    if (digits.startsWith('57') && digits.length === 12) return `+${digits}`
    if (digits.length === 10) return `+57${digits}`
    if (digits.length === 12) return `+${digits}`
    return `+57${digits}`
  }
}

export const messageService = new MessageService()
