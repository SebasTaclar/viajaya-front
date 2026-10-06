<template>
  <div class="panel-users-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Usuarios del panel</h1>
        <p class="page-subtitle">{{ filteredUsers.length }} usuarios registrados</p>
      </div>
      <div class="header-actions">

        <button v-if="isSuperAdmin" class="btn-primary" @click="openCreateModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Crear admin
        </button>
      </div>
    </div>

    <div class="filters-bar">
      <div class="search-box">
        <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
        </svg>
        <input v-model="searchTerm" type="text" placeholder="Buscar por nombre, correo o rol..." class="search-input" />
        <button v-if="searchTerm" class="clear-btn" @click="searchTerm = ''">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <div class="filter-field">
        <select v-model="roleFilter" class="form-select">
          <option value="">Todos los roles</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
          <option value="user">Usuario</option>
        </select>
      </div>
    </div>

    <div class="table-card">
      <div v-if="actionError" class="action-error">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
        </svg>
        {{ actionError }}
      </div>

      <div v-if="loading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando usuarios...</p>
      </div>
      <div v-else-if="loadError" class="loading-state">
        <p>{{ loadError }}</p>
        <button class="btn-secondary" @click="loadUsers()">Reintentar</button>
      </div>
      <div v-else-if="filteredUsers.length === 0" class="empty-state">
        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
          <circle cx="9" cy="7" r="4"/>
        </svg>
        <p>No se encontraron usuarios del panel</p>
      </div>
      <div v-else class="table-responsive">
        <table class="data-table">
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Correo</th>
              <th>Rol</th>
              <th>Estado</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="u in filteredUsers" :key="u.id" :class="{ 'row-current': u.id === currentUserId }">
              <td>
                <div class="user-cell">
                  <div class="user-avatar" :style="{ background: getColor(u.id) }">
                    <span>{{ getInitials(u.name || u.email || 'U') }}</span>
                  </div>
                  <div class="user-meta">
                    <span class="user-name">{{ u.name || '—' }}</span>
                    <span v-if="u.id === currentUserId" class="you-tag">Tu cuenta</span>
                  </div>
                </div>
              </td>
              <td>{{ u.email || '—' }}</td>
              <td><span class="rol-badge" :class="u.role">{{ roleLabel(u.role) }}</span></td>
              <td>
                <span class="status-badge" :class="u.isActive === false ? 'inactive' : 'active'">
                  {{ u.isActive === false ? 'Inactivo' : 'Activo' }}
                </span>
              </td>
              <td>
                <div class="actions-cell">
                  <button
                    v-if="u.id !== currentUserId"
                    class="action-btn edit-btn"
                    title="Editar usuario"
                    @click="openEditModal(u)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                      <path d="M18.5 2.5a2.12 2.12 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                    </svg>
                  </button>
                  <button
                    class="action-btn pass-btn"
                    title="Cambiar contraseña"
                    @click="openUserPasswordModal(u)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                    </svg>
                  </button>
                  <button
                    v-if="isSuperAdmin && u.id !== currentUserId"
                    class="action-btn delete-btn"
                    title="Eliminar usuario"
                    @click="openDeleteModal(u)"
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                    </svg>
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- Crear usuario -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Crear usuario del panel</h3>
          <button class="modal-close" @click="showCreateModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="formError" class="modal-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ formError }}
          </div>

          <div class="form-group">
            <label>Nombre completo *</label>
            <input v-model="createForm.name" type="text" class="form-input" :class="{ 'field-error': submitted && !createForm.name }" placeholder="Ej. Admin Viajaya" />
          </div>
          <div class="form-group">
            <label>Correo electrónico *</label>
            <input v-model="createForm.email" type="email" class="form-input" :class="{ 'field-error': submitted && !createForm.email }" placeholder="correo@viajaya.com" />
          </div>
          <div class="form-group">
            <label>Contraseña *</label>
            <input v-model="createForm.password" type="password" class="form-input" :class="{ 'field-error': submitted && !createForm.password }" placeholder="Mínimo 6 caracteres" />
          </div>
          <div class="form-group">
            <label>Rol</label>
            <select v-model="createForm.role" class="form-input" disabled>
              <option value="admin">Admin</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" :disabled="saving" @click="showCreateModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleCreate">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Creando...' : 'Crear usuario' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Editar usuario -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Editar usuario</h3>
          <button class="modal-close" @click="showEditModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="formError" class="modal-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ formError }}
          </div>

          <div class="form-group">
            <label>Nombre completo *</label>
            <input v-model="editForm.name" type="text" class="form-input" placeholder="Ej. Admin Viajaya" />
          </div>
          <div class="form-group">
            <label>Correo electrónico *</label>
            <input v-model="editForm.email" type="email" class="form-input" placeholder="correo@viajaya.com" />
          </div>
          <div class="form-group">
            <label>Rol *</label>
            <select v-model="editForm.role" class="form-input" :disabled="editForm.role === 'superadmin'">
              <option value="admin">Admin</option>
              <option value="user">Usuario</option>
              <option v-if="editForm.role === 'superadmin'" value="superadmin">Super Admin</option>
            </select>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" :disabled="saving" @click="showEditModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleEdit">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cambiar contraseña de un usuario -->
    <div v-if="showUserPasswordModal" class="modal-overlay" @click.self="showUserPasswordModal = false">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3>Cambiar contraseña</h3>
          <button class="modal-close" @click="showUserPasswordModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div class="modal-body">
          <div v-if="formError" class="modal-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ formError }}
          </div>

          <p class="modal-hint">
            Usuario: <strong>{{ passwordTarget?.name || passwordTarget?.email }}</strong>
          </p>

          <div class="form-group">
            <label>Nueva contraseña *</label>
            <input v-model="userPasswordForm.password" type="password" class="form-input" placeholder="Mínimo 6 caracteres" />
          </div>
          <div class="form-group">
            <label>Confirmar contraseña *</label>
            <input v-model="userPasswordForm.confirm" type="password" class="form-input" placeholder="Repita la contraseña" />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" :disabled="saving" @click="showUserPasswordModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleUserPassword">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Guardando...' : 'Guardar contraseña' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Eliminar usuario -->
    <div v-if="showDeleteModal" class="modal-overlay" @click.self="showDeleteModal = false">
      <div class="modal-content modal-sm" @click.stop>
        <div class="delete-modal-body">
          <div class="delete-icon">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
          </div>
          <h3 class="delete-title">Eliminar usuario</h3>
          <p class="delete-text">
            ¿Estás seguro de eliminar a <strong>{{ deleteTarget?.name || deleteTarget?.email }}</strong>?
            Esta acción no se puede deshacer.
          </p>
          <div v-if="formError" class="modal-error delete-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ formError }}
          </div>
          <div class="delete-actions">
            <button class="btn-cancel" :disabled="saving" @click="showDeleteModal = false">Cancelar</button>
            <button class="btn-delete" :disabled="saving" @click="handleDelete">
              <span v-if="saving" class="btn-spinner"></span>
              {{ saving ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { userService, authService, type User } from '@/services/api'

defineOptions({
  name: 'PanelUsersList',
})

const users = ref<User[]>([])
const loading = ref(true)
const loadError = ref('')
const actionError = ref('')
const searchTerm = ref('')
const roleFilter = ref('admin')

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showUserPasswordModal = ref(false)
const showDeleteModal = ref(false)
const saving = ref(false)
const submitted = ref(false)
const formError = ref('')

const deleteTarget = ref<User | null>(null)
const passwordTarget = ref<User | null>(null)

const createForm = ref({ name: '', email: '', password: '', role: 'admin' as string })
const editForm = ref({ id: 0, name: '', email: '', role: 'user' as string })
const userPasswordForm = ref({ password: '', confirm: '' })

const currentUserId = authService.getCurrentUser()?.id ?? null
const isSuperAdmin = computed(() => authService.getUserRole() === 'superadmin')

const filteredUsers = computed(() => {
  const base = roleFilter.value
    ? users.value.filter((u) => u.role === roleFilter.value)
    : users.value
  const term = searchTerm.value.trim().toLowerCase()
  if (!term) return base
  return base.filter(
    (u) =>
      (u.name || '').toLowerCase().includes(term) ||
      (u.email || '').toLowerCase().includes(term) ||
      (u.role || '').toLowerCase().includes(term),
  )
})

function roleLabel(role?: string): string {
  if (role === 'superadmin') return 'Super Admin'
  if (role === 'admin') return 'Admin'
  return 'Usuario'
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .substring(0, 2)
    .toUpperCase()
}

function getColor(id: number): string {
  const colors = ['#0E3570', '#16C2CA', '#E8483F', '#C89B2D', '#6366F1', '#10B981', '#F59E0B', '#8B5CF6']
  return colors[id % colors.length]
}

function extractError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message && error.message !== 'Sesión expirada') {
    return error.message
  }
  return fallback
}

async function loadUsers() {
  loading.value = true
  loadError.value = ''
  actionError.value = ''
  try {
    users.value = await userService.getAll()
  } catch (error) {
    users.value = []
    loadError.value = extractError(error, 'No se pudieron cargar los usuarios del panel.')
  } finally {
    loading.value = false
  }
}

function openCreateModal() {
  createForm.value = { name: '', email: '', password: '', role: 'admin' }
  formError.value = ''
  submitted.value = false
  showCreateModal.value = true
}

async function handleCreate() {
  formError.value = ''
  submitted.value = true
  const f = createForm.value

  if (!f.name.trim()) { formError.value = 'El nombre completo es obligatorio.'; return }
  if (!f.email.trim()) { formError.value = 'El correo electrónico es obligatorio.'; return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) { formError.value = 'Ingrese un correo válido.'; return }
  if (!f.password || f.password.length < 6) { formError.value = 'La contraseña debe tener al menos 6 caracteres.'; return }

  saving.value = true
  try {
    await userService.create({
      name: f.name.trim(),
      email: f.email.trim(),
      password: f.password,
      role: f.role,
    })
    showCreateModal.value = false
    await loadUsers()
  } catch (error) {
    formError.value = extractError(error, 'No se pudo crear el usuario.')
  } finally {
    saving.value = false
  }
}

function openEditModal(u: User) {
  editForm.value = { id: u.id, name: u.name || '', email: u.email || '', role: u.role || 'user' }
  formError.value = ''
  showEditModal.value = true
}

async function handleEdit() {
  formError.value = ''
  const f = editForm.value

  if (!f.name.trim()) { formError.value = 'El nombre completo es obligatorio.'; return }
  if (!f.email.trim()) { formError.value = 'El correo electrónico es obligatorio.'; return }
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(f.email.trim())) { formError.value = 'Ingrese un correo válido.'; return }

  saving.value = true
  try {
    await userService.update(f.id, {
      name: f.name.trim(),
      email: f.email.trim(),
      role: f.role,
    })
    showEditModal.value = false
    await loadUsers()
  } catch (error) {
    formError.value = extractError(error, 'No se pudieron guardar los cambios.')
  } finally {
    saving.value = false
  }
}

function openUserPasswordModal(u: User) {
  passwordTarget.value = u
  userPasswordForm.value = { password: '', confirm: '' }
  formError.value = ''
  showUserPasswordModal.value = true
}

async function handleUserPassword() {
  formError.value = ''
  const f = userPasswordForm.value

  if (!f.password || f.password.length < 6) {
    formError.value = 'La nueva contraseña debe tener al menos 6 caracteres.'
    return
  }
  if (f.password !== f.confirm) {
    formError.value = 'Las contraseñas no coinciden.'
    return
  }
  if (!passwordTarget.value) {
    formError.value = 'No se pudo identificar el usuario.'
    return
  }

  saving.value = true
  try {
    await userService.changePassword(passwordTarget.value.id, f.password)
    showUserPasswordModal.value = false
    passwordTarget.value = null
  } catch (error) {
    formError.value = extractError(error, 'No se pudo cambiar la contraseña.')
  } finally {
    saving.value = false
  }
}

function openDeleteModal(u: User) {
  deleteTarget.value = u
  formError.value = ''
  showDeleteModal.value = true
}

async function handleDelete() {
  if (!deleteTarget.value) return
  formError.value = ''
  saving.value = true
  try {
    await userService.delete(deleteTarget.value.id)
    showDeleteModal.value = false
    deleteTarget.value = null
    await loadUsers()
  } catch (error) {
    formError.value = extractError(error, 'No se pudo eliminar el usuario.')
  } finally {
    saving.value = false
  }
}

onMounted(() => {
  loadUsers()
})
</script>

<style scoped>
.panel-users-page { display: flex; flex-direction: column; gap: 24px; }

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black, #E7ECF6); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray, #98A4BF); margin-top: 4px; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.filters-bar { display: flex; gap: 12px; flex-wrap: wrap; align-items: center; }
.filter-field { display: flex; }
.form-select {
  padding: 10px 14px;
  border: 1.5px solid var(--c-border, #26334F);
  border-radius: 10px;
  font-size: 0.88rem;
  font-family: inherit;
  background: var(--c-white, #141D36);
  color: var(--c-black, #E7ECF6);
  outline: none;
  transition: all 0.2s;
  min-width: 170px;
  cursor: pointer;
}
.form-select:focus { border-color: var(--c-primary, #F0C009); box-shadow: 0 0 0 3px rgba(240, 192, 9, 0.15); }
.form-select option { background: var(--c-white, #141D36); color: var(--c-black, #E7ECF6); }
.search-box { position: relative; max-width: 420px; flex: 1; min-width: 240px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light, #6F7D99); pointer-events: none; }
.search-input {
  width: 100%;
  padding: 10px 40px 10px 42px;
  border: 1.5px solid var(--c-border, #26334F);
  border-radius: 10px;
  font-size: 0.88rem;
  font-family: inherit;
  background: var(--c-white, #141D36);
  color: var(--c-black, #E7ECF6);
  outline: none;
  transition: all 0.2s;
  box-sizing: border-box;
}
.search-input::placeholder { color: var(--c-gray-light, #6F7D99); }
.search-input:focus { border-color: var(--c-primary, #F0C009); box-shadow: 0 0 0 3px rgba(240, 192, 9, 0.15); }
.clear-btn { position: absolute; right: 8px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border: none; background: none; color: var(--c-gray-light, #6F7D99); border-radius: 6px; cursor: pointer; }
.clear-btn:hover { background: rgba(255, 255, 255, 0.08); color: var(--c-black, #E7ECF6); }

.table-card { background: var(--c-white, #141D36); border: 1px solid var(--c-border, #26334F); border-radius: 14px; overflow: hidden; }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 640px; }
.data-table th {
  padding: 12px 14px;
  text-align: left;
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--c-gray, #98A4BF);
  text-transform: uppercase;
  letter-spacing: 0.05em;
  background: var(--c-light, #0E162C);
  border-bottom: 1px solid var(--c-border, #26334F);
  white-space: nowrap;
}
.data-table td {
  padding: 12px 14px;
  font-size: 0.84rem;
  color: var(--c-black, #E7ECF6);
  border-bottom: 1px solid var(--c-border, #26334F);
  vertical-align: middle;
  white-space: nowrap;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(255, 255, 255, 0.05); }
.data-table tr.row-current td { background: rgba(96, 165, 250, 0.10); }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; color: #fff; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
.user-meta { display: flex; flex-direction: column; gap: 2px; }
.user-name { font-weight: 600; font-size: 0.86rem; }
.you-tag { font-size: 0.68rem; color: var(--c-primary, #F0C009); font-weight: 600; }

.rol-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.74rem; font-weight: 600; }
.rol-badge.admin { background: rgba(96, 165, 250, 0.16); color: #93C5FD; }
.rol-badge.superadmin { background: rgba(167, 139, 250, 0.18); color: #C4B5FD; }
.rol-badge.user { background: rgba(74, 222, 128, 0.14); color: #86EFAC; }

.status-badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 0.74rem; font-weight: 600; }
.status-badge.active { background: rgba(74, 222, 128, 0.14); color: #86EFAC; }
.status-badge.inactive { background: rgba(248, 113, 113, 0.16); color: #FCA5A5; }

.loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; gap: 12px; color: var(--c-gray, #98A4BF); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border, #26334F); border-top-color: var(--c-primary, #F0C009); border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.action-error { display: flex; align-items: center; gap: 8px; margin: 12px 16px 0; padding: 12px 16px; background: rgba(239, 68, 68, 0.16); color: #FCA5A5; border-radius: 8px; font-size: 0.85rem; border: 1px solid rgba(248, 113, 113, 0.4); }

.actions-cell { display: flex; gap: 6px; align-items: center; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray, #98A4BF); border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.action-btn:hover { color: var(--c-black, #E7ECF6); background: rgba(255, 255, 255, 0.08); }
.action-btn.edit-btn:hover { background: rgba(96, 165, 250, 0.18); color: #93C5FD; }
.action-btn.pass-btn:hover { background: rgba(240, 192, 9, 0.18); color: var(--c-primary, #F0C009); }
.action-btn.delete-btn:hover { background: rgba(232, 72, 63, 0.18); color: #F87171; }

.modal-hint { margin: 0; font-size: 0.85rem; color: var(--c-gray, #98A4BF); }
.modal-hint strong { color: var(--c-black, #E7ECF6); }

.btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--c-primary, #F0C009); color: #102857; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; font-family: inherit; }
.btn-primary:hover:not(:disabled) { background: var(--c-primary-hover, #FFD84D); }
.btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: var(--c-white, #141D36); color: var(--c-black, #E7ECF6); border: 1.5px solid var(--c-border, #26334F); border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-secondary:hover { border-color: var(--c-primary, #F0C009); color: var(--c-primary, #F0C009); }
.btn-secondary:disabled { opacity: 0.6; cursor: not-allowed; }

.modal-overlay { position: fixed; inset: 0; background: rgba(3, 8, 20, 0.65); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(4px); }
.modal-content { background: var(--c-white, #141D36); border-radius: 16px; width: 100%; max-width: 480px; max-height: 92vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0, 0, 0, 0.55); border: 1px solid var(--c-border, #26334F); }
.modal-content.modal-sm { max-width: 420px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid var(--c-border, #26334F); background: var(--c-light, #0E162C); border-radius: 16px 16px 0 0; }
.modal-header h3 { font-size: 1.05rem; font-weight: 700; color: var(--c-black, #E7ECF6); margin: 0; }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray, #98A4BF); border-radius: 8px; cursor: pointer; }
.modal-close:hover { background: rgba(255, 255, 255, 0.08); color: var(--c-black, #E7ECF6); }
.modal-error { display: flex; align-items: center; gap: 8px; padding: 12px 16px; background: rgba(239, 68, 68, 0.16); color: #FCA5A5; border-radius: 8px; font-size: 0.85rem; border: 1px solid rgba(248, 113, 113, 0.4); }
.modal-body { padding: 24px; display: flex; flex-direction: column; gap: 14px; }
.form-group { display: flex; flex-direction: column; gap: 6px; }
.form-group label { font-size: 0.76rem; font-weight: 600; color: var(--c-gray, #98A4BF); text-transform: uppercase; letter-spacing: 0.3px; }
.form-input { padding: 11px 14px; border: 1.5px solid var(--c-border, #26334F); border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-light, #0E162C); color: var(--c-black, #E7ECF6); outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box; }
.form-input::placeholder { color: var(--c-gray-light, #6F7D99); }
.form-input:focus { border-color: var(--c-primary, #F0C009); box-shadow: 0 0 0 3px rgba(240, 192, 9, 0.15); }
.form-input:disabled { opacity: 0.7; cursor: not-allowed; }
.form-input option { background: var(--c-white, #141D36); color: var(--c-black, #E7ECF6); }
.field-error { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.18) !important; }
.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--c-border, #26334F); background: var(--c-light, #0E162C); border-radius: 0 0 16px 16px; }
.btn-cancel { padding: 10px 20px; border: 1.5px solid var(--c-border, #26334F); border-radius: 10px; background: transparent; color: var(--c-black, #E7ECF6); font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-cancel:hover { background: rgba(255, 255, 255, 0.06); border-color: var(--c-gray, #98A4BF); }
.btn-cancel:disabled, .btn-delete:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-save { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--c-primary, #F0C009); color: #102857; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-save:hover:not(:disabled) { background: var(--c-primary-hover, #FFD84D); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(16, 40, 87, 0.3); border-top-color: #102857; border-radius: 50%; animation: spin 0.8s linear infinite; }

.delete-modal-body { padding: 32px 28px; text-align: center; }
.delete-icon { color: #F87171; margin-bottom: 12px; }
.delete-title { font-size: 1.1rem; font-weight: 700; color: var(--c-black, #E7ECF6); margin: 0 0 8px; }
.delete-text { font-size: 0.88rem; color: var(--c-gray, #98A4BF); margin: 0 0 24px; line-height: 1.5; }
.delete-error { margin: 0 auto 20px; text-align: left; }
.delete-actions { display: flex; gap: 10px; justify-content: center; }
.btn-delete { padding: 10px 20px; border: none; border-radius: 10px; background: #E8483F; color: #fff; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; display: inline-flex; align-items: center; gap: 8px; }
.btn-delete:hover:not(:disabled) { background: #c93a32; }

@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: stretch; }
  .header-actions { width: 100%; flex-direction: column; }
  .btn-primary, .btn-secondary { width: 100%; justify-content: center; padding: 13px; }
  .search-box { max-width: 100%; width: 100%; }
  .data-table { min-width: 620px; }
  .modal-overlay { padding: 10px; }
  .modal-footer { flex-direction: column; }
  .modal-footer .btn-cancel, .modal-footer .btn-save { width: 100%; justify-content: center; padding: 13px; }
  .delete-actions { flex-direction: column; }
  .delete-actions .btn-cancel, .delete-actions .btn-delete { width: 100%; justify-content: center; padding: 13px; }
}
</style>
