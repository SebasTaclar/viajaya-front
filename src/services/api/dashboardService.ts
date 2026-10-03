import { apiClient } from './apiConfig'

export interface DashboardAlert {
  id: number | string
  name: string
  cedula?: string
  periodicidad: string
  diasInactividad: number
  limiteDias: number
}

export interface DashboardKpis {
  fondoViajero: number
  usuariosRegistrados: number
  alertas: DashboardAlert[]
}

type RawRecord = Record<string, unknown>

export const LIMITE_DIAS_POR_PERIODICIDAD: Record<string, number> = {
  diario: 7,
  diaria: 7,
  semanal: 15,
  quincenal: 30,
  mensual: 30,
}

function toNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

function firstValue(obj: RawRecord, keys: string[]): unknown {
  for (const key of keys) {
    if (obj[key] !== undefined && obj[key] !== null) return obj[key]
  }
  return undefined
}

class DashboardService {
  private readonly endpoint = '/dashboard'

  async getKpis(): Promise<DashboardKpis> {
    const response = await apiClient.get<unknown>(this.endpoint)
    const raw = response.data

    let obj: RawRecord = {}
    if (raw && typeof raw === 'object' && !Array.isArray(raw)) {
      obj = raw as RawRecord
      const nested = obj['data']
      if (nested && typeof nested === 'object' && !Array.isArray(nested)) {
        obj = nested as RawRecord
      }
    }

    const alertasRaw = firstValue(obj, ['alertas', 'alertasInactividad', 'alerts'])
    const alertas = Array.isArray(alertasRaw) ? alertasRaw : []

    return {
      fondoViajero: toNumber(
        firstValue(obj, ['fondoViajero', 'fondo', 'totalFondo', 'totalRecaudos', 'saldoTotal', 'total']),
      ),
      usuariosRegistrados: toNumber(
        firstValue(obj, ['usuariosRegistrados', 'usuarios', 'totalUsuarios', 'count', 'clients']),
      ),
      alertas: alertas
        .filter((item): item is RawRecord => !!item && typeof item === 'object')
        .map((item, index) => this.mapAlert(item, index)),
    }
  }

  private mapAlert(item: RawRecord, index: number): DashboardAlert {
    const client = (item['client'] as RawRecord | undefined) || {}
    const periodicidad = String(
      firstValue(item, ['periodicidad']) ?? firstValue(client, ['periodicidad']) ?? '',
    ).toLowerCase()

    return {
      id: toNumber(firstValue(item, ['id', 'clientId']), index + 1),
      name: String(firstValue(item, ['name', 'nombre']) ?? firstValue(client, ['name', 'nombre']) ?? '—'),
      cedula: (firstValue(item, ['cedula']) ?? firstValue(client, ['cedula']))?.toString(),
      periodicidad,
      diasInactividad: toNumber(
        firstValue(item, ['diasInactividad', 'dias', 'diasSinRecaudo', 'diasDesdeUltimoRecaudo']),
      ),
      limiteDias:
        toNumber(firstValue(item, ['limiteDias', 'limite'])) ||
        LIMITE_DIAS_POR_PERIODICIDAD[periodicidad] ||
        30,
    }
  }
}

export const dashboardService = new DashboardService()
