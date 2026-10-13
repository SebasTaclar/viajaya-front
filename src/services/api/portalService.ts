import { apiClient } from './apiConfig'
import { clientAuthService } from './clientAuthService'
import { clientService } from './clientService'
import { documentService } from './documentService'
import type { Cliente, DocumentoEntity } from '@/types/crmTypes'

export interface PortalUserData {
  clientId: number
  client: Cliente
  documents: DocumentoEntity[]
}

class PortalService {
  async getPortalData(): Promise<PortalUserData> {
    const userInfo = clientAuthService.getUserInfo()
    if (!userInfo) {
      throw new Error('No hay sesión activa')
    }

    let clientId = 0
    let client: Cliente | null = null

    try {
      clientId = await this.getClientIdForUser()
      client = await clientService.getById(clientId).catch(() => null)
    } catch {
      // clientId puede quedar en 0 si falla
    }

    const documents = client ? await this.getDocumentsForClient(clientId) : []

    return {
      clientId,
      client: client as unknown as Cliente,
      documents,
    }
  }

  private async getClientIdForUser(): Promise<number> {
    const userInfo = clientAuthService.getUserInfo()
    if (!userInfo) {
      throw new Error('No hay sesión activa')
    }

    if (userInfo.clientId) {
      return userInfo.clientId
    }

    if (userInfo.teamId) {
      return userInfo.teamId
    }

    const clientList = await clientService.getAll({ search: userInfo.email || '' }).catch(() => null)
    if (clientList && clientList.data.length > 0) {
      return clientList.data[0].id
    }

    throw new Error('No se encontro un cliente asociado a esta cuenta')
  }

  private async getDocumentsForClient(clientId: number): Promise<DocumentoEntity[]> {
    try {
      return await documentService.getByEntity('client', clientId)
    } catch {
      return []
    }
  }
}

export const portalService = new PortalService()
