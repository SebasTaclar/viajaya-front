<template>
  <div class="audit-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Auditoría</h1>
        <p class="page-subtitle">{{ totalItems }} movimientos registrados</p>
      </div>
      <div class="header-actions">
        <button class="btn-secondary" :disabled="loading || !isSuperAdmin" @click="loadLogs()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polyline points="23 4 23 10 17 10" />
            <polyline points="1 20 1 14 7 14" />
            <path
              d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"
            />
          </svg>
          Actualizar
        </button>
      </div>
    </div>

    <div v-if="!isSuperAdmin" class="restricted-state">
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
        <rect x="3" y="11" width="18" height="11" rx="2" />
        <path d="M7 11V7a5 5 0 0 1 10 0v4" />
      </svg>
      <p>Solo el superadmin puede consultar los movimientos de auditoría.</p>
    </div>

    <template v-else>
      <div class="filters-wrap">
        <div class="filters-bar">
          <div class="filter-group filter-group-search">
            <label>Buscar</label>
            <input
              v-model="searchTerm"
              class="filter-control"
              type="text"
              placeholder="Usuario, correo o módulo..."
            />
          </div>
        </div>
        <div class="filters-bar">
          <div class="filter-group">
            <label>Acción</label>
            <select v-model="filters.action" class="filter-control" @change="applyFilters">
              <option value="">Todas</option>
              <option v-for="a in actionOptions" :key="a" :value="a">{{ actionLabel(a) }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Estado</label>
            <select v-model="filters.status" class="filter-control" @change="applyFilters">
              <option value="">Todos</option>
              <option value="SUCCESS">Exitoso</option>
              <option value="FAILURE">Fallido</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Modulo</label>
            <select v-model="filters.tableName" class="filter-control" @change="applyFilters">
              <option value="">Todas</option>
              <option value="clients">{{ tableLabel('clients') }}</option>
              <option value="recaudos">{{ tableLabel('recaudos') }}</option>
              <option value="users">{{ tableLabel('users') }}</option>
            </select>
          </div>
          <div class="filter-group">
            <label>Mes</label>
            <input
              v-model="selectedMonth"
              class="filter-control"
              type="month"
              placeholder="Seleccionar mes"
              @change="onMonthChange"
            />
          </div>
          <div class="filter-group">
            <label>Desde</label>
            <input
              v-model="filters.startDate"
              class="filter-control"
              type="date"
              @change="onDateChange"
            />
          </div>
          <div class="filter-group">
            <label>Hasta</label>
            <input
              v-model="filters.endDate"
              class="filter-control"
              type="date"
              @change="onDateChange"
            />
          </div>
          <button v-if="hasFilters" class="btn-clear" @click="clearFilters">Limpiar filtros</button>
        </div>
      </div>

      <div class="table-card">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando movimientos...</p>
        </div>
        <div v-else-if="loadError" class="loading-state">
          <p>{{ loadError }}</p>
          <button class="btn-secondary" @click="loadLogs()">Reintentar</button>
        </div>
        <div v-else-if="filteredLogs.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M3 3v5h5" />
            <path d="M3.05 13A9 9 0 1 0 6 5.3L3 8" />
            <path d="M12 7v5l4 2" />
          </svg>
          <p>
            {{
              hasFilters
                ? 'No se encontraron movimientos con los filtros aplicados.'
                : 'Aún no hay movimientos de auditoría.'
            }}
          </p>
          <button v-if="hasFilters" class="btn-secondary" @click="clearFilters()">
            Limpiar filtros
          </button>
        </div>
        <template v-else>
          <div class="table-responsive">
            <table class="data-table">
              <thead>
                <tr>
                  <th>Fecha / Hora</th>
                  <th>Acción</th>
                  <th>Modulo</th>
                  <th>Usuario / cliente</th>
                  <th>Estado</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="log in filteredLogs" :key="log.id">
                  <td class="cell-date">{{ formatDate(log.occurredAt) }}</td>
                  <td>
                    <span class="action-badge" :class="actionClass(log.action)">
                      {{ actionLabel(log.action) }}
                    </span>
                  </td>
                  <td>{{ tableLabel(log.tableName) }}</td>
                  <td>
                    <div class="user-cell">
                      <span class="user-name">{{ logUserName(log) }}</span>
                      <span v-if="logUserDetail(log)" class="user-id">{{ logUserDetail(log) }}</span>
                    </div>
                  </td>
                  <td>
                    <span
                      class="status-badge"
                      :class="log.status === 'FAILURE' ? 'failure' : 'success'"
                    >
                      {{ statusLabel(log.status) }}
                    </span>
                  </td>
                  <td>
                    <button class="action-btn" title="Ver detalle" @click="openDetail(log)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    </button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div class="pagination-bar">
            <span class="pagination-info">
              <template v-if="searchTerm.trim()">
                {{ filteredLogs.length }} resultado{{ filteredLogs.length === 1 ? '' : 's' }} en esta página
              </template>
              <template v-else>
                Mostrando {{ rangeStart }}-{{ rangeEnd }} de {{ totalItems }}
              </template>
            </span>
            <div class="pagination-controls">
              <select
                v-model.number="pageSize"
                class="page-size-select"
                title="Movimientos por página"
                @change="changePageSize"
              >
                <option :value="10">10 / pág.</option>
                <option :value="25">25 / pág.</option>
                <option :value="50">50 / pág.</option>
                <option :value="100">100 / pág.</option>
              </select>
              <button class="page-btn" :disabled="page === 1" @click="goToPage(page - 1)">
                ‹
              </button>
              <button
                v-for="p in visiblePages"
                :key="p"
                class="page-btn"
                :class="{ active: page === p }"
                @click="goToPage(p)"
              >
                {{ p }}
              </button>
              <button
                class="page-btn"
                :disabled="page === totalPages"
                @click="goToPage(page + 1)"
              >
                ›
              </button>
            </div>
          </div>
        </template>
      </div>
    </template>

    <!-- Detalle del movimiento -->
    <div v-if="detailLog" class="modal-overlay" @click.self="detailLog = null">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Detalle del movimiento</h3>
          <button class="modal-close" @click="detailLog = null">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div class="detail-grid">
            <div class="detail-item">
              <span class="detail-label">Fecha</span>
              <span class="detail-value">{{ formatDate(detailLog.occurredAt, true) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Acción</span>
              <span class="detail-value">
                <span class="action-badge" :class="actionClass(detailLog.action)">
                  {{ actionLabel(detailLog.action) }}
                </span>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Estado</span>
              <span class="detail-value">
                <span
                  class="status-badge"
                  :class="detailLog.status === 'FAILURE' ? 'failure' : 'success'"
                >
                  {{ statusLabel(detailLog.status) }}
                </span>
              </span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Módulo</span>
              <span class="detail-value">{{ tableLabel(detailLog.tableName) }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Registro</span>
              <span class="detail-value">{{ recordLabel }}</span>
            </div>
            <div class="detail-item">
              <span class="detail-label">Usuario</span>
              <span class="detail-value">
                {{ logUserName(detailLog) }}
                <span v-if="logUserDetail(detailLog)" class="detail-sub">{{ logUserDetail(detailLog) }}</span>
              </span>
            </div>
          </div>

          <div v-if="detailGroups.length" class="detail-data">
            <span class="detail-label">Datos del movimiento</span>
            <div class="data-groups">
              <div v-for="(group, gi) in detailGroups" :key="gi" class="data-card">
                <div v-if="group.title" class="data-card-title">{{ group.title }}</div>
                <div class="data-card-body">
                  <div v-for="(row, ri) in group.rows" :key="ri" class="data-row">
                    <span class="data-key">{{ row.label }}</span>
                    <span class="data-val">{{ row.value }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <p v-else class="detail-empty">
            {{ detailLog.status === 'FAILURE' ? 'No se registraron detalles del error.' : 'Sin datos adicionales para este movimiento.' }}
          </p>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="detailLog = null">Cerrar</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import {
  auditService,
  authService,
  userService,
  type AuditLog,
  type AuditListParams,
  type User,
} from '@/services/api'
import { usuarios as viajeros, loadUsuarios } from '@/composables/useUsuariosStore'

defineOptions({
  name: 'AuditList',
})

const isSuperAdmin = computed(() => authService.getUserRole() === 'superadmin')

const logs = ref<AuditLog[]>([])
const loading = ref(true)
const loadError = ref('')
const page = ref(1)
const pageSize = ref(10)
const totalItems = ref(0)
const totalPages = ref(1)

const filters = ref({
  action: '',
  status: '',
  tableName: '',
  startDate: '',
  endDate: '',
})
const detailLog = ref<AuditLog | null>(null)
const panelUsers = ref<User[]>([])
const searchTerm = ref('')
const selectedMonth = ref('')

const adminNameById = computed(() => {
  const map = new Map<number, string>()
  for (const u of panelUsers.value) {
    if (u.id && u.name) map.set(u.id, u.name)
  }
  return map
})

const viajeroNameById = computed(() => {
  const map = new Map<number, string>()
  for (const u of viajeros.value) {
    if (u.id && u.name) map.set(u.id, u.name)
  }
  return map
})

const nameByKey = computed(() => {
  const map = new Map<string, string>()
  for (const u of panelUsers.value) {
    if (u.email && u.name) map.set(u.email.toLowerCase(), u.name)
  }
  for (const u of viajeros.value) {
    if (u.cedula && u.name) map.set(u.cedula, u.name)
    if (u.email && u.name) map.set(u.email.toLowerCase(), u.name)
  }
  return map
})

function logUserName(log: AuditLog): string {
  const username = (log.username || '').trim()
  if (username) {
    const byKey = nameByKey.value.get(username.toLowerCase()) ?? nameByKey.value.get(username)
    if (byKey) return byKey
  }
  if (log.userId) {
    const isClientActor = log.action === 'LOGIN_CLIENT' || (!!username && !username.includes('@'))
    const byId = isClientActor
      ? (viajeroNameById.value.get(log.userId) ?? adminNameById.value.get(log.userId))
      : (adminNameById.value.get(log.userId) ?? viajeroNameById.value.get(log.userId))
    if (byId) return byId
  }
  if (username) return username
  return log.userId ? `ID ${log.userId}` : '—'
}

function logUserDetail(log: AuditLog): string {
  const name = logUserName(log)
  const username = (log.username || '').trim()
  return username && username !== name ? username : ''
}

// ========== DETALLE LEGIBLE ==========
interface DetailRow {
  group: string
  label: string
  value: string
}

interface DetailGroup {
  title: string
  rows: DetailRow[]
}

const DATA_FIELD_LABELS: Record<string, string> = {
  id: 'ID',
  name: 'Nombre',
  nombre: 'Nombre',
  email: 'Correo electrónico',
  correo: 'Correo electrónico',
  phone: 'Teléfono',
  celular: 'Celular',
  cedula: 'Cédula',
  role: 'Rol',
  status: 'Estado',
  estado: 'Estado',
  isactive: 'Cuenta activa',
  valor: 'Valor',
  amount: 'Valor',
  money: 'Valor',
  fecha: 'Fecha',
  clientid: 'ID del cliente',
  userid: 'ID del usuario',
  periodicidad: 'Periodicidad',
  ubicacion: 'Ubicación',
  password: 'Contraseña',
  oldpassword: 'Contraseña anterior',
  newpassword: 'Nueva contraseña',
  createdat: 'Creado el',
  updatedat: 'Actualizado el',
  consentley1581: 'Consentimiento Ley 1581',
  consentdate: 'Fecha de consentimiento',
  reason: 'Motivo',
  error: 'Error',
  message: 'Mensaje',
  errorcode: 'Código de error',
}

const DATA_GROUP_LABELS: Record<string, string> = {
  user: 'Usuario',
  client: 'Cliente',
  changes: 'Cambios',
  previousvalues: 'Valores anteriores',
  newvalues: 'Valores nuevos',
  before: 'Antes',
  after: 'Después',
  data: 'Datos',
  fields: 'Campos',
}

function dataFieldLabel(key: string): string {
  return DATA_FIELD_LABELS[key.toLowerCase().replace(/[^a-z0-9]/g, '')] || key
}

const MONEY_KEYS = ['valor', 'amount', 'money', 'precio', 'price', 'saldo', 'presupuesto', 'total', 'subtotal', 'monto', 'costo', 'cost']

const REASON_LABELS: Record<string, string> = {
  // Autenticación
  missing_credentials: 'Faltan el correo o la contraseña',
  invalid_credentials: 'Correo o contraseña incorrectos',
  invalid_login: 'Correo o contraseña incorrectos',
  login_failed: 'No se pudo iniciar sesión, revisa tus datos',
  authentication_failed: 'No se pudo iniciar sesión, revisa tus datos',
  bad_credentials: 'Correo o contraseña incorrectos',
  invalid_password: 'Contraseña incorrecta',
  wrong_password: 'Contraseña incorrecta',
  user_not_found: 'Usuario no encontrado',
  user_does_not_exist: 'Usuario no encontrado',
  email_not_found: 'Correo no encontrado',
  account_disabled: 'La cuenta está desactivada',
  account_inactive: 'La cuenta está inactiva',
  inactive_user: 'El usuario está inactivo',
  account_locked: 'La cuenta está bloqueada, contacta al administrador',
  user_locked: 'La cuenta está bloqueada, contacta al administrador',
  email_not_verified: 'El correo aún no está verificado',
  weak_password: 'La contraseña no cumple los requisitos',
  password_too_weak: 'La contraseña no cumple los requisitos',
  token_invalid: 'El enlace o token ya no es válido',
  token_expired: 'El enlace o token expiró, solicita uno nuevo',
  // Permisos y sesión
  forbidden: 'No tienes permisos para realizar esta acción',
  insufficient_permissions: 'No tienes permisos para realizar esta acción',
  missing_permissions: 'No tienes permisos para realizar esta acción',
  permission_denied: 'No tienes permisos para realizar esta acción',
  unauthorized: 'Debes iniciar sesión para realizar esta acción',
  unauthenticated: 'Debes iniciar sesión para realizar esta acción',
  not_authenticated: 'Debes iniciar sesión para realizar esta acción',
  session_expired: 'La sesión expiró, vuelve a iniciar sesión',
  // Registros
  not_found: 'Registro no encontrado',
  record_not_found: 'Registro no encontrado',
  entity_not_found: 'Registro no encontrado',
  client_not_found: 'Cliente no encontrado',
  admin_not_found: 'Usuario no encontrado',
  recaudo_not_found: 'Recaudo no encontrado',
  project_not_found: 'Proyecto no encontrado',
  quote_not_found: 'Cotización no encontrada',
  tender_not_found: 'Licitación no encontrada',
  document_not_found: 'Documento no encontrado',
  event_not_found: 'Evento no encontrado',
  collaborator_not_found: 'Colaborador no encontrado',
  already_deleted: 'El registro ya fue eliminado',
  has_dependencies: 'No se puede eliminar: tiene registros relacionados',
  has_related_records: 'No se puede eliminar: tiene registros relacionados',
  related_records: 'No se puede eliminar: tiene registros relacionados',
  foreign_key_constraint: 'No se puede eliminar: tiene registros relacionados',
  conflict: 'El registro ya existe o fue modificado por otro usuario',
  duplicate: 'El registro ya existe',
  duplicate_email: 'El correo ya está registrado',
  already_exists: 'El registro ya existe',
  email_in_use: 'El correo ya está registrado',
  version_conflict: 'El registro fue modificado por otro usuario, recarga e intenta de nuevo',
  // Validación
  validation_error: 'Datos inválidos',
  validation_failed: 'Datos inválidos, revisa los campos',
  invalid_data: 'Datos inválidos',
  invalid_format: 'El formato de los datos es inválido',
  invalid_email: 'El correo no tiene un formato válido',
  required_field: 'Faltan campos obligatorios',
  missing_field: 'Faltan campos obligatorios',
  missing_required_fields: 'Faltan campos obligatorios',
  // Infraestructura
  server_error: 'Error interno del servidor',
  internal_error: 'Error interno del servidor',
  database_error: 'Error interno al guardar los datos',
  unhandled_exception: 'Ocurrió un error inesperado, intenta nuevamente',
  unknown: 'Ocurrió un error inesperado, intenta nuevamente',
  rate_limited: 'Demasiados intentos, intenta más tarde',
  timeout: 'Tiempo de espera agotado',
  network_error: 'Error de conexión con el servidor',
  service_unavailable: 'El servicio no está disponible, intenta más tarde',
  operation_failed: 'La operación falló, intenta nuevamente',
  failed: 'La operación falló, intenta nuevamente',
}

function translateFailureText(value: unknown): string | null {
  const s = String(value).toLowerCase().trim()
  const code = s.replace(/[\s.\-]+/g, '_')
  const hit = REASON_LABELS[code] ?? REASON_LABELS[s]
  if (hit) return hit
  if (/(^|_)not_found$/.test(code)) return 'Registro no encontrado'
  return null
}

function formatDataValue(key: string, value: unknown): string {
  const k = key.toLowerCase().replace(/[^a-z0-9]/g, '')
  if (k.includes('password')) return '••••••'
  if (value === null || value === undefined || value === '') return '—'
  if (typeof value === 'boolean') return value ? 'Sí' : 'No'
  if (k === 'reason' || k === 'error' || k === 'errorcode') {
    const translated = translateFailureText(value)
    if (translated) return translated
    return k === 'reason' ? String(value).replace(/_/g, ' ') : String(value)
  }
  if (MONEY_KEYS.includes(k)) {
    const n = typeof value === 'number' ? value : Number(String(value).replace(/[^\d.-]/g, ''))
    if (Number.isFinite(n)) {
      return n.toLocaleString('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 })
    }
  }
  if (typeof value === 'number' && Number.isFinite(value) && Math.abs(value) >= 1000 && Math.abs(value) < 1e9) {
    return value.toLocaleString('es-CO')
  }
  const s = String(value)
  if (k === 'role') {
    const role = s.toLowerCase()
    if (role === 'superadmin') return 'Super Admin'
    if (role === 'admin') return 'Admin'
    if (role === 'user') return 'Usuario'
    return s
  }
  if (/^\d{4}-\d{2}-\d{2}([T ]\d{2}:\d{2})/.test(s)) {
    const date = new Date(s)
    if (!Number.isNaN(date.getTime())) {
      return date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })
    }
  }
  return s
}

const HIDDEN_DATA_KEYS = ['logintype']

function flattenData(value: unknown, prefix = ''): DetailRow[] {
  if (Array.isArray(value)) {
    return value.flatMap((item, index) =>
      flattenData(item, prefix ? `${prefix} ${index + 1}` : `Elemento ${index + 1}`),
    )
  }
  if (value && typeof value === 'object') {
    return Object.entries(value as Record<string, unknown>).flatMap(([key, nested]) => {
      const k = key.toLowerCase().replace(/[^a-z0-9]/g, '')
      if (k === 'id' || k.endsWith('id') || HIDDEN_DATA_KEYS.includes(k)) return []
      const label = dataFieldLabel(key)
      const groupLabel = DATA_GROUP_LABELS[k] || label
      const full = prefix ? `${prefix} · ${groupLabel}` : groupLabel
      if (nested && typeof nested === 'object') return flattenData(nested, full)
      return [{ group: prefix, label, value: formatDataValue(key, nested) }]
    })
  }
  return [{ group: '', label: prefix || 'Valor', value: formatDataValue(prefix, value) }]
}

const detailGroups = computed<DetailGroup[]>(() => {
  const data = detailLog.value?.data
  if (!data) return []
  const titles: string[] = []
  const map = new Map<string, DetailRow[]>()
  for (const row of flattenData(data)) {
    if (!map.has(row.group)) {
      map.set(row.group, [])
      titles.push(row.group)
    }
    map.get(row.group)?.push(row)
  }
  return titles.map((title) => ({ title, rows: map.get(title) ?? [] }))
})

function entityName(log: AuditLog): string {
  const table = (log.tableName || '').toLowerCase()
  if (table === 'users') {
    const u = panelUsers.value.find((x) => x.id === log.entityId)
    return u ? (u.name || u.email || '') : ''
  }
  if (table === 'clients' || table === 'viajeros') {
    const u = viajeros.value.find((x) => x.id === log.entityId)
    return u?.name || ''
  }
  return ''
}

const recordLabel = computed(() => {
  const log = detailLog.value
  if (!log || !log.entityId) return '—'
  const name = entityName(log)
  return name ? `#${log.entityId} · ${name}` : `#${log.entityId}`
})

const actionOptions = ['LOGIN', 'LOGIN_CLIENT', 'CREATE', 'UPDATE', 'DELETE', 'ASSIGN_USER']

const hasFilters = computed(() =>
  Object.values(filters.value).some((value) => value !== '') || searchTerm.value.trim() !== '',
)

const filteredLogs = computed(() => {
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return logs.value
  return logs.value.filter(
    (log) =>
      logUserName(log).toLowerCase().includes(term) ||
      (log.username || '').toLowerCase().includes(term) ||
      tableLabel(log.tableName).toLowerCase().includes(term) ||
      actionLabel(log.action).toLowerCase().includes(term) ||
      statusLabel(log.status).toLowerCase().includes(term),
  )
})

function toDateParam(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

function onMonthChange() {
  if (!selectedMonth.value) {
    filters.value.startDate = ''
    filters.value.endDate = ''
  } else {
    const [y, m] = selectedMonth.value.split('-').map(Number)
    filters.value.startDate = toDateParam(new Date(y, m - 1, 1))
    filters.value.endDate = toDateParam(new Date(y, m, 0))
  }
  applyFilters()
}

function onDateChange() {
  selectedMonth.value = ''
  applyFilters()
}

const rangeStart = computed(() =>
  totalItems.value === 0 ? 0 : (page.value - 1) * pageSize.value + 1,
)
const rangeEnd = computed(() => Math.min(page.value * pageSize.value, totalItems.value))

const visiblePages = computed(() => {
  const total = totalPages.value
  const current = page.value
  let start = Math.max(1, current - 2)
  const end = Math.min(total, start + 4)
  start = Math.max(1, end - 4)
  const pages: number[] = []
  for (let i = start; i <= end; i++) pages.push(i)
  return pages
})

function extractError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message && error.message !== 'Sesión expirada') {
    return error.message
  }
  return fallback
}

async function loadLogs() {
  if (!isSuperAdmin.value) {
    loading.value = false
    return
  }
  loading.value = true
  loadError.value = ''
  try {
    const f = filters.value
    const params: AuditListParams = { page: page.value, limit: pageSize.value }
    if (f.tableName) params.tableName = f.tableName
    if (f.action) params.action = f.action
    if (f.status) params.status = f.status
    if (f.startDate) params.startDate = f.startDate
    if (f.endDate) params.endDate = f.endDate

    const response = await auditService.getAll(params)
    logs.value = response.data
    totalItems.value = response.total
    totalPages.value = response.totalPages
    if (response.page && response.page !== page.value) page.value = response.page
  } catch (error) {
    logs.value = []
    totalItems.value = 0
    totalPages.value = 1
    loadError.value = extractError(error, 'No se pudieron cargar los movimientos de auditoría.')
  } finally {
    loading.value = false
  }
}

function applyFilters() {
  page.value = 1
  loadLogs()
}

function clearFilters() {
  filters.value = {
    action: '',
    status: '',
    tableName: '',
    startDate: '',
    endDate: '',
  }
  searchTerm.value = ''
  selectedMonth.value = ''
  page.value = 1
  loadLogs()
}

function goToPage(target: number) {
  if (target < 1 || target > totalPages.value || target === page.value) return
  page.value = target
  loadLogs()
}

function changePageSize() {
  page.value = 1
  loadLogs()
}

function openDetail(log: AuditLog) {
  detailLog.value = log
}

function formatDate(value: string, full = false): string {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  if (full) {
    return date.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'medium' })
  }
  return date.toLocaleString('es-CO', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}

function actionClass(action: string): string {
  const a = (action || '').toUpperCase()
  if (a.includes('LOGIN')) return 'act-login'
  if (a.includes('CREATE')) return 'act-create'
  if (a.includes('UPDATE')) return 'act-update'
  if (a.includes('DELETE')) return 'act-delete'
  if (a.includes('ASSIGN')) return 'act-assign'
  return 'act-other'
}

function actionLabel(action: string): string {
  const labels: Record<string, string> = {
    UPDATE: 'Actualizar',
    CREATE: 'Crear',
    DELETE: 'Borrar',
    LOGIN: 'Ingreso admin',
    LOGIN_CLIENT: 'Ingreso cliente',
    ASSIGN_USER: 'Asignar usuario',
    UPDATE_PASSWORD: 'Cambio de contraseña',
    LOGOUT: 'Cierre de sesión',
  }
  const key = (action || '').toUpperCase()
  if (labels[key]) return labels[key]
  return action ? action.replace(/_/g, ' ') : '—'
}

function statusLabel(status: string): string {
  if (status === 'SUCCESS') return 'Exitoso'
  if (status === 'FAILURE') return 'Fallido'
  return status || '—'
}

function tableLabel(table: string | null): string {
  const labels: Record<string, string> = {
    clients: 'Clientes',
    viajeros: 'Clientes',
    recaudos: 'Recaudos',
    users: 'Usuarios del panel',
  }
  const key = (table || '').toLowerCase()
  return labels[key] || table || '—'
}

async function fetchPanelUsers() {
  try {
    panelUsers.value = await userService.getAll()
  } catch {
    panelUsers.value = []
  }
}

async function loadNameSources() {
  if (!isSuperAdmin.value) return
  await Promise.allSettled([loadUsuarios(), fetchPanelUsers()])
}

onMounted(() => {
  loadLogs()
  loadNameSources()
})
</script>

<style scoped>
.audit-page {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.page-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 12px;
}
.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--c-black, #e7ecf6);
}
.page-subtitle {
  font-size: 0.85rem;
  color: var(--c-gray, #98a4bf);
  margin-top: 4px;
}
.header-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.restricted-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  padding: 48px;
  background: var(--c-white, #141d36);
  border: 1px solid var(--c-border, #26334f);
  border-radius: 14px;
  color: var(--c-gray, #98a4bf);
  text-align: center;
}
.restricted-state p {
  margin: 0;
  font-size: 0.9rem;
}

.filters-bar {
  display: flex;
  gap: 10px;
  flex-wrap: wrap;
  align-items: flex-end;
}
.filters-wrap {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.filter-group {
  display: flex;
  flex-direction: column;
  gap: 3px;
}
.filter-group label {
  font-size: 0.66rem;
  font-weight: 600;
  color: var(--c-gray, #98a4bf);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}
.filter-control {
  padding: 6px 10px;
  border: 1.5px solid var(--c-border, #26334f);
  border-radius: 7px;
  font-size: 0.8rem;
  font-family: inherit;
  background: var(--c-white, #141d36);
  color: var(--c-black, #e7ecf6);
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}
.filter-control:focus {
  border-color: var(--c-primary, #f0c009);
  box-shadow: 0 0 0 3px rgba(240, 192, 9, 0.15);
}
.filter-control option {
  background: var(--c-white, #141d36);
  color: var(--c-black, #e7ecf6);
}
.filter-control[type='date'],
.filter-control[type='month'] {
  color-scheme: dark;
}
.filter-group-search {
  width: 100%;
  max-width: 480px;
}
.filter-group-search .filter-control {
  width: 100%;
  min-width: 200px;
}
.filter-num {
  width: 110px;
}
.btn-clear {
  padding: 6px 14px;
  border: 1.5px solid var(--c-border, #26334f);
  border-radius: 7px;
  background: transparent;
  color: var(--c-black, #e7ecf6);
  font-size: 0.8rem;
  font-weight: 600;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-clear:hover {
  border-color: var(--c-primary, #f0c009);
  color: var(--c-primary, #f0c009);
}

.table-card {
  background: var(--c-white, #141d36);
  border: 1px solid var(--c-border, #26334f);
  border-radius: 14px;
  overflow: hidden;
}
.table-responsive {
  overflow-x: auto;
}
.data-table {
  width: 100%;
  border-collapse: collapse;
  min-width: 900px;
}
.data-table th {
  padding: 12px 14px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--c-gray, #98a4bf);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--c-light, #0e162c);
  border-bottom: 1px solid var(--c-border, #26334f);
  white-space: nowrap;
}
.data-table td {
  padding: 12px 14px;
  font-size: 0.84rem;
  color: var(--c-black, #e7ecf6);
  border-bottom: 1px solid var(--c-border, #26334f);
  vertical-align: middle;
  white-space: nowrap;
}
.data-table tr:last-child td {
  border-bottom: none;
}
.data-table tr:hover td {
  background: rgba(255, 255, 255, 0.05);
}

.cell-date {
  font-variant-numeric: tabular-nums;
}
.cell-mono {
  font-family: 'SFMono-Regular', Consolas, 'Liberation Mono', monospace;
  font-size: 0.78rem;
  color: var(--c-gray, #98a4bf);
}

.user-cell {
  display: flex;
  flex-direction: column;
  gap: 2px;
}
.user-name {
  font-weight: 600;
  font-size: 0.84rem;
}
.user-id {
  font-size: 0.7rem;
  color: var(--c-gray-light, #6f7d99);
}

.action-badge {
  display: inline-block;
  padding: 3px 10px;
  border-radius: 20px;
  font-size: 0.74rem;
  font-weight: 700;
  letter-spacing: 0.02em;
}
.act-login {
  background: rgba(96, 165, 250, 0.16);
  color: #93c5fd;
}
.act-create {
  background: rgba(74, 222, 128, 0.14);
  color: #86efac;
}
.act-update {
  background: rgba(240, 192, 9, 0.16);
  color: #fcd34d;
}
.act-delete {
  background: rgba(248, 113, 113, 0.16);
  color: #fca5a5;
}
.act-assign {
  background: rgba(167, 139, 250, 0.18);
  color: #c4b5fd;
}
.act-other {
  background: rgba(148, 163, 184, 0.16);
  color: #cbd5e1;
}

.status-badge {
  display: inline-block;
  padding: 3px 8px;
  border-radius: 6px;
  font-size: 0.74rem;
  font-weight: 600;
}
.status-badge.success {
  background: rgba(74, 222, 128, 0.14);
  color: #86efac;
}
.status-badge.failure {
  background: rgba(248, 113, 113, 0.16);
  color: #fca5a5;
}

.action-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--c-gray, #98a4bf);
  border-radius: 6px;
  cursor: pointer;
  transition: all 0.15s;
}
.action-btn:hover {
  color: var(--c-black, #e7ecf6);
  background: rgba(255, 255, 255, 0.08);
}

.loading-state,
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 48px;
  gap: 12px;
  color: var(--c-gray, #98a4bf);
  text-align: center;
}
.loading-state p,
.empty-state p {
  margin: 0;
}
.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--c-border, #26334f);
  border-top-color: var(--c-primary, #f0c009);
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}
@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.pagination-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 12px;
  padding: 14px 16px;
  border-top: 1px solid var(--c-border, #26334f);
}
.pagination-info {
  font-size: 0.82rem;
  color: var(--c-gray, #98a4bf);
}
.pagination-controls {
  display: flex;
  align-items: center;
  gap: 6px;
  flex-wrap: wrap;
}
.page-size-select {
  height: 34px;
  padding: 0 8px;
  border: 1.5px solid var(--c-border, #26334f);
  border-radius: 8px;
  background: var(--c-white, #141d36);
  color: var(--c-black, #e7ecf6);
  font-size: 0.8rem;
  font-family: inherit;
  cursor: pointer;
  outline: none;
}
.page-size-select:focus {
  border-color: var(--c-primary, #f0c009);
}
.page-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 34px;
  height: 34px;
  padding: 0 10px;
  border: 1.5px solid var(--c-border, #26334f);
  border-radius: 8px;
  background: var(--c-white, #141d36);
  color: var(--c-gray, #98a4bf);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.page-btn:hover:not(:disabled) {
  border-color: var(--c-primary, #f0c009);
  color: var(--c-primary, #f0c009);
}
.page-btn.active {
  background: var(--c-primary, #f0c009);
  border-color: var(--c-primary, #f0c009);
  color: #102857;
  font-weight: 700;
}
.page-btn:disabled {
  opacity: 0.4;
  cursor: not-allowed;
}

.btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 18px;
  background: var(--c-white, #141d36);
  color: var(--c-black, #e7ecf6);
  border: 1.5px solid var(--c-border, #26334f);
  border-radius: 10px;
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.btn-secondary:hover:not(:disabled) {
  border-color: var(--c-primary, #f0c009);
  color: var(--c-primary, #f0c009);
}
.btn-secondary:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(3, 8, 20, 0.65);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
  backdrop-filter: blur(4px);
}
.modal-content {
  background: var(--c-white, #141d36);
  border-radius: 16px;
  width: 100%;
  max-width: 640px;
  max-height: 92vh;
  overflow-y: auto;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55);
  border: 1px solid var(--c-border, #26334f);
}
.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 18px 24px;
  border-bottom: 1px solid var(--c-border, #26334f);
  background: var(--c-light, #0e162c);
  border-radius: 16px 16px 0 0;
}
.modal-header h3 {
  font-size: 1.05rem;
  font-weight: 700;
  color: var(--c-black, #e7ecf6);
  margin: 0;
}
.modal-close {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: none;
  background: none;
  color: var(--c-gray, #98a4bf);
  border-radius: 8px;
  cursor: pointer;
}
.modal-close:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--c-black, #e7ecf6);
}
.modal-body {
  padding: 24px;
  display: flex;
  flex-direction: column;
  gap: 18px;
}
.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  padding: 16px 24px;
  border-top: 1px solid var(--c-border, #26334f);
  background: var(--c-light, #0e162c);
  border-radius: 0 0 16px 16px;
}

.detail-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 14px;
}
.detail-item {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 4px;
}
.detail-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--c-gray, #98a4bf);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.detail-value {
  font-size: 0.88rem;
  color: var(--c-black, #e7ecf6);
  word-break: break-word;
  white-space: normal;
}
.detail-sub {
  display: block;
  margin-top: 2px;
  font-size: 0.74rem;
  color: var(--c-gray-light, #6f7d99);
  word-break: break-all;
}
.detail-data {
  display: flex;
  flex-direction: column;
  gap: 10px;
}
.data-groups {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
  gap: 12px;
}
.data-card {
  border: 1px solid var(--c-border, #26334f);
  border-radius: 12px;
  overflow: hidden;
  background: var(--c-light, #0e162c);
}
.data-card-title {
  padding: 8px 14px;
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--c-gray, #98a4bf);
  background: rgba(255, 255, 255, 0.03);
  border-bottom: 1px solid var(--c-border, #26334f);
}
.data-card-body {
  display: flex;
  flex-direction: column;
}
.data-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  gap: 14px;
  padding: 9px 14px;
  font-size: 0.84rem;
}
.data-row + .data-row {
  border-top: 1px solid rgba(38, 51, 79, 0.6);
}
.data-key {
  color: var(--c-gray, #98a4bf);
  flex-shrink: 0;
}
.data-val {
  color: var(--c-black, #e7ecf6);
  font-weight: 600;
  text-align: right;
  word-break: break-word;
}
.detail-empty {
  margin: 0;
  font-size: 0.85rem;
  color: var(--c-gray, #98a4bf);
}

.btn-cancel {
  padding: 10px 20px;
  border: 1.5px solid var(--c-border, #26334f);
  border-radius: 10px;
  background: transparent;
  color: var(--c-black, #e7ecf6);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}
.btn-cancel:hover {
  background: rgba(255, 255, 255, 0.06);
  border-color: var(--c-gray, #98a4bf);
}

@media (max-width: 768px) {
  .page-header {
    flex-direction: column;
    align-items: stretch;
  }
  .header-actions {
    width: 100%;
  }
  .btn-secondary {
    width: 100%;
    justify-content: center;
    padding: 13px;
  }
  .filters-bar {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 10px;
    align-items: end;
  }
  .filter-group-search {
    grid-column: 1 / -1;
  }
  .filter-group-search .filter-control {
    min-width: 0;
  }
  .filter-group,
  .filter-control {
    width: 100%;
  }
  .filter-num {
    width: 100%;
  }
  .btn-clear {
    grid-column: 1 / -1;
    width: 100%;
    justify-content: center;
  }
  .data-table {
    min-width: 880px;
  }
  .pagination-bar {
    flex-direction: column;
    align-items: stretch;
    gap: 12px;
  }
  .pagination-controls {
    justify-content: center;
  }
  .modal-overlay {
    padding: 10px;
  }
  .detail-grid {
    grid-template-columns: 1fr;
  }
}
</style>
