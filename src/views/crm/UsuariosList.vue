<template>
  <div class="usuarios-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Clientes</h1>
        <p class="page-subtitle">{{ filteredUsuarios.length }} Clientes registrados{{ totalPages > 1 ? ` — Página ${currentPage} de ${totalPages}` : '' }}{{ seleccionados.length > 0 ? ` — ${seleccionados.length} seleccionados` : '' }}</p>
      </div>
      <div class="header-actions">
        <button v-if="isAdmin" class="btn-secondary" @click="openBulkMsg()">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
          </svg>
          <span class="btn-label">Mensaje masivo</span>
        </button>

        <button class="btn-primary" @click="openCreateModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Crear Cliente
        </button>
      </div>
    </div>

    <!-- LISTADO -->
      <div class="filters-bar">
        <div class="search-box">
          <svg class="search-icon" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
          </svg>
          <input v-model="searchTerm" type="text" placeholder="Buscar por nombre, cédula, celular o ubicación..." class="search-input" />
          <button v-if="searchTerm" class="clear-btn" @click="searchTerm = ''">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="filter-group">
          <div class="filter-field">
            <label class="filter-label">Recaudo</label>
            <select v-model="periodFilter" class="form-select">
              <option value="">Todas</option>
              <option value="diario">Diario</option>
              <option value="mensual">Mensual</option>
              <option value="quincenal">Quincenal</option>
              <option value="semanal">Semanal</option>
            </select>
          </div>
        </div>
        <div class="filter-group">
          <div class="filter-field">
            <label class="filter-label">Estado</label>
            <select v-model="statusFilter" class="form-select">
              <option value="">Todos</option>
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>
      </div>

      <div v-if="isAdmin && seleccionados.length > 0" class="selection-bar">
        <span class="selection-bar-text">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          {{ seleccionados.length }} cliente{{ seleccionados.length === 1 ? '' : 's' }} seleccionado{{ seleccionados.length === 1 ? '' : 's' }}
        </span>
        <div class="selection-bar-actions">
          <button class="btn-primary" @click="openBulkMsg('seleccionados')">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            Enviar mensaje
          </button>
          <button class="btn-cancel" @click="seleccionados = []">Limpiar selección</button>
        </div>
      </div>

      <div class="table-card">
        <div v-if="actionError" class="modal-error action-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ actionError }}
        </div>
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando usuarios...</p>
        </div>
        <div v-else-if="usuariosError" class="loading-state">
          <p>{{ usuariosError }}</p>
          <button class="btn-cancel" @click="loadUsuarios(true)">Reintentar</button>
        </div>
        <div v-else-if="filteredUsuarios.length === 0" class="empty-state">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
            <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
            <circle cx="9" cy="7" r="4"/>
          </svg>
          <p>No se encontraron usuarios</p>
        </div>
        <div v-else class="table-responsive">
          <table class="data-table users-table">
            <thead>
              <tr>
                <th class="col-check">
                  <input type="checkbox" class="row-check" :checked="todosSeleccionados" title="Seleccionar todos" @change="toggleTodos" />
                </th>
                <th>Nombre completo</th>
                <th class="col-kebab">Info / acciones</th>
                <th class="col-cedula">Cédula</th>
                <th class="col-celular">Celular</th>
                <th class="col-ubicacion">Ubicación</th>
                <th class="col-periodo">Periodicidad</th>
                <th class="col-estado">Estado</th>
                <th class="col-actions">Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in paginatedUsuarios" :key="u.id">
                <td class="col-check">
                  <input type="checkbox" class="row-check" :checked="seleccionados.includes(u.id)" @change="toggleSeleccion(u.id)" />
                </td>
                <td class="col-user">
                  <div class="user-cell">
                    <div class="user-avatar" :style="{ background: getUserColor(u.id) }">
                      <span>{{ getUserInitials(u.name || 'U') }}</span>
                    </div>
                    <div class="user-meta">
                      <span class="user-name">{{ u.name }}</span>
                      <span class="user-email">{{ u.email || '—' }}</span>
                      <span class="user-cedula">CC {{ u.cedula }}</span>
                    </div>
                  </div>
                </td>
                <td class="col-kebab">
                  <button class="action-btn kebab-btn" title="Acciones" @click="sheetUser = u">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                      <circle cx="12" cy="5" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="12" cy="19" r="2"/>
                    </svg>
                  </button>
                </td>
                <td class="col-cedula" data-label="Cédula">{{ u.cedula }}</td>
                <td class="col-celular" data-label="Celular">{{ u.celular }}</td>
                <td class="col-ubicacion" data-label="Ubicación">{{ u.ubicacion || '—' }}</td>
                <td class="col-periodo" data-label="Periodicidad"><span class="period-badge">{{ u.periodicidad || '—' }}</span></td>
                <td class="col-estado" data-label="Estado">
                  <span class="status-badge" :class="u.isActive ? 'active' : 'inactive'">
                    {{ u.isActive ? 'Activo' : 'Inactivo' }}
                  </span>
                </td>
                <td class="col-actions">
                  <div class="actions-cell">
                    <button class="action-btn" title="Editar datos" @click="openEditModal(u)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn pass-btn" title="Cambiar contraseña" @click="openPasswordModal(u)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </button>
                    <button
                      v-if="isSuperAdmin"
                      class="action-btn"
                      :title="u.isActive ? 'Inactivar usuario' : 'Reactivar usuario'"
                      @click="toggleActive(u)"
                    >
                      <svg v-if="u.isActive" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M18.36 6.64A9 9 0 1 1 5.64 6.64"/><line x1="12" y1="2" x2="12" y2="12"/>
                      </svg>
                      <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
                      </svg>
                    </button>
                    <button class="msg-btn" title="Enviar mensaje" @click="openMsgOptions(u)">
                      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                      <span>Enviar mensaje</span>
                    </button>
                    <button v-if="isSuperAdmin" class="action-btn delete-btn" title="Eliminar" @click="deleteUsuario(u.id, u.name)">
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
        <div v-if="totalPages > 1" class="pagination">
          <button class="page-btn" :disabled="currentPage === 1" @click="currentPage--">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
          </button>
          <template v-for="p in totalPages" :key="p">
            <button v-if="p === 1 || p === totalPages || (p >= currentPage - 1 && p <= currentPage + 1)" class="page-btn" :class="{ active: p === currentPage }" @click="currentPage = p">{{ p }}</button>
            <span v-else-if="p === currentPage - 2 || p === currentPage + 2" class="page-dots">...</span>
          </template>
          <button class="page-btn" :disabled="currentPage === totalPages" @click="currentPage++">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="9 18 15 12 9 6"/></svg>
          </button>
        </div>
      </div>

    <!-- Create User Modal -->
    <div v-if="showCreateModal" class="modal-overlay" @click.self="showCreateModal = false">
      <div class="modal-content modal-md" @click.stop>
        <div class="modal-header">
          <h3>Crear Usuario</h3>
          <button class="modal-close" @click="showCreateModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="formError" class="modal-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ formError }}
        </div>

        <div class="modal-body">
          <div class="required-note">Campos con * son obligatorios. No se solicita dinero invertido o recaudado.</div>
          <div class="form-grid-modal">
            <div class="form-group">
              <label>Nombre completo *</label>
              <input v-model="createForm.name" type="text" class="form-input" :class="{ 'field-error': createSubmitted && !createForm.name }" placeholder="Ej. María Pérez López" />
            </div>

            <div class="form-group">
              <label>Cédula *</label>
              <input v-model="createForm.cedula" type="text" class="form-input" :class="{ 'field-error': createSubmitted && !createForm.cedula }" placeholder="Ej. 1032456789" maxlength="15" />
            </div>

            <div class="form-group">
              <label>Celular *</label>
              <input v-model="createForm.celular" type="tel" class="form-input" :class="{ 'field-error': createSubmitted && !createForm.celular }" placeholder="Ej. 300 123 4567" maxlength="15" />
            </div>

            <div class="form-group">
              <label>Ubicación *</label>
              <input v-model="createForm.ubicacion" type="text" class="form-input" :class="{ 'field-error': createSubmitted && !createForm.ubicacion }" placeholder="Ciudad / Departamento" />
            </div>

            <div class="form-group">
              <label>Periodicidad de recaudo</label>
              <select v-model="createForm.periodicidad" class="form-input">
                <option value="" disabled>Seleccionar</option>
                <option value="diario">Diario</option>
                <option value="mensual">Mensual</option>
                <option value="quincenal">Quincenal</option>
                <option value="semanal">Semanal</option>
              </select>
            </div>

            <div class="form-group">
              <label>Correo electrónico</label>
              <input v-model="createForm.email" type="email" class="form-input" placeholder="correo@ejemplo.com" />
            </div>

            <div class="form-group form-group-full">
              <label>Contraseña</label>
              <div class="password-input-wrap">
                <input v-model="createForm.password" :type="showPassword ? 'text' : 'password'" class="form-input" placeholder="Mínimo 6 caracteres (opcional)" />
                <button type="button" class="btn-toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                    <line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="mostrarPolitica" class="form-group form-group-full">
              <label class="policy-box" :class="{ 'field-error': createSubmitted && !createForm.acceptPolicy }">
                <input type="checkbox" v-model="createForm.acceptPolicy" />
                <div class="policy-text">
                  <strong>Política de tratamiento de datos personales — Ley 1581 de 2012</strong>
                  <p>
                    Declaro que he leído y acepto la política de tratamiento de datos personales de Viaja Ya.
                    Autorizo el uso de mis datos (nombre, cédula, celular, ubicación y periodicidad de recaudo)
                    para las finalidades descritas. Consentimiento registrado conforme a la Ley 1581.
                  </p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="showCreateModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleCreate">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Creando...' : 'Crear Usuario' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Edit User Modal — totalidad de datos -->
    <div v-if="showEditModal" class="modal-overlay" @click.self="showEditModal = false">
      <div class="modal-content modal-md" @click.stop>
        <div class="modal-header">
          <h3>Editar Usuario</h3>
          <button class="modal-close" @click="showEditModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="formError" class="modal-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ formError }}
        </div>

        <div class="modal-body">
          <div class="form-grid-modal">
            <div class="form-group">
              <label>Nombre completo *</label>
              <input v-model="editForm.name" type="text" class="form-input" placeholder="Nombre completo" />
            </div>

            <div class="form-group">
              <label>Cédula *</label>
              <input v-model="editForm.cedula" type="text" class="form-input" placeholder="Cédula" maxlength="15" />
            </div>

            <div class="form-group">
              <label>Celular *</label>
              <input v-model="editForm.celular" type="tel" class="form-input" placeholder="Celular" maxlength="15" />
            </div>

            <div class="form-group">
              <label>Ubicación</label>
              <input v-model="editForm.ubicacion" type="text" class="form-input" placeholder="Ciudad / Departamento" />
            </div>

            <div class="form-group">
              <label>Periodicidad de recaudo</label>
              <select v-model="editForm.periodicidad" class="form-input">
                <option value="diario">Diario</option>
                <option value="mensual">Mensual</option>
                <option value="quincenal">Quincenal</option>
                <option value="semanal">Semanal</option>
              </select>
            </div>

            <div class="form-group form-group-full">
              <label>Correo electrónico</label>
              <input v-model="editForm.email" type="email" class="form-input" placeholder="correo@ejemplo.com" />
            </div>

            <div class="form-group form-group-full">
              <label>Nueva contraseña (opcional)</label>
              <div class="password-input-wrap">
                <input
                  v-model="editForm.password"
                  :type="showPassword ? 'text' : 'password'"
                  class="form-input"
                  placeholder="Déjala vacía para no cambiarla (mínimo 6 caracteres)"
                />
                <button type="button" class="btn-toggle-password" @click="showPassword = !showPassword">
                  <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                  </svg>
                  <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94"/>
                    <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19"/>
                    <path d="M14.12 14.12a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/>
                  </svg>
                </button>
              </div>
            </div>

            <div v-if="mostrarPolitica" class="form-group form-group-full">
              <label>Consentimiento Ley 1581</label>
              <label class="policy-box policy-box-compact">
                <input type="checkbox" v-model="editForm.consentLey1581" />
                <div class="policy-text">
                  <p>Consentimiento de tratamiento de datos personales registrado.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" @click="showEditModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleUpdate">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Guardando...' : 'Guardar cambios' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Cambiar contraseña -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
      <div class="modal-content modal-sm" @click.stop>
        <div class="modal-header">
          <h3>Cambiar contraseña</h3>
          <button class="modal-close" @click="showPasswordModal = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>

        <div v-if="formError" class="modal-error">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
          </svg>
          {{ formError }}
        </div>

        <div class="modal-body">
          <p class="password-hint">Cliente: <strong>{{ passwordTargetName }}</strong></p>

          <div class="form-group">
            <label>Nueva contraseña *</label>
            <div class="password-input-wrap">
              <input
                v-model="passwordForm.password"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Mínimo 6 caracteres"
              />
              <button type="button" class="btn-toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
          </div>

          <div class="form-group">
            <label>Confirmar contraseña *</label>
            <input
              v-model="passwordForm.confirm"
              :type="showPassword ? 'text' : 'password'"
              class="form-input"
              placeholder="Repita la contraseña"
            />
          </div>
        </div>

        <div class="modal-footer">
          <button class="btn-cancel" :disabled="saving" @click="showPasswordModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handlePasswordChange">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Guardando...' : 'Guardar contraseña' }}
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
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
          <p class="delete-text">¿Estás seguro de eliminar a <strong>{{ deleteName }}</strong>? Esta acción no se puede deshacer.</p>
          <div v-if="deleteError" class="modal-error delete-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ deleteError }}
          </div>
          <div class="delete-actions">
            <button class="btn-cancel" :disabled="deleting" @click="showDeleteModal = false">Cancelar</button>
            <button class="btn-delete" :disabled="deleting" @click="confirmDelete">
              <span v-if="deleting" class="btn-spinner"></span>
              {{ deleting ? 'Eliminando...' : 'Eliminar' }}
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Message Options Modal -->
    <div v-if="showMsgOptions && msgTargetUser" class="modal-overlay" @click.self="showMsgOptions = false">
      <div class="modal-content modal-sm" @click.stop>
        <div class="modal-header">
          <h3>Enviar mensaje</h3>
          <button class="modal-close" @click="showMsgOptions = false">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <template v-if="!msgCompose && !claveMode">
            <p class="msg-options-sub">Selecciona qué quieres enviar a <strong>{{ msgTargetUser.name }}</strong></p>
            <div class="msg-options">
              <button class="msg-option" @click="chooseMsgOption('ultimo')">
                <span class="msg-option-icon ultimo">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Último Recaudo</strong>
                  <small>Informar sobre el último recaudo registrado</small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button class="msg-option" @click="chooseMsgOption('total')">
                <span class="msg-option-icon total">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M12 1v22"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Total Recaudo</strong>
                  <small>Informar sobre el total recaudado acumulado</small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button class="msg-option" @click="chooseMsgOption('libre')">
                <span class="msg-option-icon libre">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Mensaje libre</strong>
                  <small>Escribe y envía el mensaje que quieras</small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button class="msg-option" @click="chooseMsgOption('clave')">
                <span class="msg-option-icon clave">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Notificar clave</strong>
                  <small>Envía la clave actual o genera una nueva por SMS</small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </template>

          <template v-else-if="claveMode === 'menu'">
            <p class="msg-options-sub">¿Qué clave quieres enviar a <strong>{{ msgTargetUser.name }}</strong>?</p>
            <div class="msg-options">
              <button class="msg-option" @click="chooseClaveActual">
                <span class="msg-option-icon clave">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Enviar clave actual</strong>
                  <small>Escríbela y se envía por SMS sin cambiarla</small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button class="msg-option" @click="chooseClaveNueva">
                <span class="msg-option-icon clave">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Generar clave nueva</strong>
                  <small>Se genera, se guarda y se envía por SMS</small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
            <div class="msg-compose-actions">
              <button class="btn-cancel" @click="claveMode = null">Volver</button>
            </div>
          </template>

          <template v-else-if="claveMode === 'actual'">
            <p class="msg-options-sub">Escribe la clave actual de <strong>{{ msgTargetUser.name }}</strong> para enviarla por SMS</p>
            <div class="password-input-wrap">
              <input
                v-model="msgClaveActual"
                :type="showPassword ? 'text' : 'password'"
                class="form-input"
                placeholder="Clave actual"
              />
              <button type="button" class="btn-toggle-password" @click="showPassword = !showPassword">
                <svg v-if="!showPassword" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
                <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              </button>
            </div>
            <div v-if="msgClaveActual.trim()" class="bulk-preview">
              <span class="msg-vars-label">Vista previa para {{ msgTargetUser.name }}</span>
              <blockquote class="msg-compose-preview">{{ msgClaveActualPreview }}</blockquote>
            </div>
            <div class="msg-compose-actions">
              <button class="btn-cancel" @click="claveMode = 'menu'">Volver</button>
              <button class="btn-save" @click="confirmComposeClaveActual">Continuar</button>
            </div>
            <p v-if="msgError" class="field-error">{{ msgError }}</p>
          </template>

          <template v-else>
            <p class="msg-options-sub">Escribe el mensaje que quieres enviar a <strong>{{ msgTargetUser.name }}</strong></p>
            <textarea
              ref="msgFreeTextArea"
              v-model="msgFreeText"
              class="form-input msg-compose-input"
              rows="5"
              maxlength="1000"
              placeholder="Escribe tu mensaje..."
            ></textarea>
            <div class="msg-vars">
              <span class="msg-vars-label">Personaliza con:</span>
              <button
                v-for="v in MSG_VARS"
                :key="v.token"
                type="button"
                class="msg-var-chip"
                :title="`Inserta ${v.token}`"
                @click="insertMsgVar(v.token)"
              >{{ v.label }}</button>
            </div>
            <div v-if="msgFreeText.trim()" class="bulk-preview">
              <span class="msg-vars-label">Vista previa para {{ msgTargetUser.name }}</span>
              <blockquote class="msg-compose-preview">{{ msgFreePreview }}</blockquote>
            </div>
            <div class="msg-compose-actions">
              <button class="btn-cancel" @click="msgCompose = false">Volver</button>
              <button class="btn-save" @click="confirmComposeMsg">Continuar</button>
            </div>
            <p v-if="msgError" class="field-error">{{ msgError }}</p>
          </template>
        </div>
      </div>
    </div>

    <!-- Confirmar envío de mensaje -->
    <div v-if="msgConfirm && msgTargetUser" class="modal-overlay modal-overlay-confirm" @click.self="msgConfirm = false">
      <div class="modal-content modal-sm modal-confirm" @click.stop>
        <div class="modal-body confirm-body">
          <div class="confirm-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3>¿Estás seguro?</h3>
          <p v-if="msgKind === 'libre'">
            Vas a enviar un <strong>mensaje libre</strong>
            a <strong>{{ msgTargetUser.name }}</strong> (C.I. {{ msgTargetUser.cedula }}):
          </p>
          <p v-else-if="msgKind === 'clave'">
            Se generará una <strong>clave aleatoria</strong> para <strong>{{ msgTargetUser.name }}</strong>,
            se guardará de forma segura y se enviará por SMS al celular
            <strong>{{ msgTargetUser.celular || 'sin registrar' }}</strong>.
            La clave anterior dejará de funcionar.
          </p>
          <p v-else-if="msgKind === 'clave-actual'">
            Vas a enviar la <strong>clave actual</strong> de <strong>{{ msgTargetUser.name }}</strong>
            por SMS al celular <strong>{{ msgTargetUser.celular || 'sin registrar' }}</strong>.
            La clave no cambiará.
          </p>
          <p v-else>
            Vas a enviar un mensaje de <strong>{{ msgKindLabel }}</strong>.
          </p>
          <blockquote v-if="msgKind === 'ultimo'" class="msg-compose-preview">{{ msgPreviewText }}</blockquote>
          <blockquote v-if="msgKind === 'total'" class="msg-compose-preview">{{ msgPreviewText }}</blockquote>
          <blockquote v-if="msgKind === 'libre'" class="msg-compose-preview">{{ msgFreePreview }}</blockquote>
          <blockquote v-if="msgKind === 'clave-actual'" class="msg-compose-preview">{{ msgClaveActualPreview }}</blockquote>
          <div class="confirm-actions">
            <button class="btn-cancel" :disabled="msgStatus === 'sending'" @click="msgConfirm = false">Cancelar</button>
            <button class="btn-save" :disabled="msgStatus === 'sending'" @click="confirmSendMsg">
              {{ msgStatus === 'sending' ? 'Enviando...' : 'Sí, enviar' }}
            </button>
          </div>
          <p v-if="msgError" class="field-error">{{ msgError }}</p>
        </div>
      </div>
    </div>

    <!-- Mensaje masivo: elegir destinatarios / redactar -->
    <div v-if="showBulkMsg" class="modal-overlay" @click.self="closeBulkMsg">
      <div class="modal-content modal-md" @click.stop>
        <div class="modal-header">
          <h3>Enviar mensaje masivo</h3>
          <button class="modal-close" @click="closeBulkMsg">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
            </svg>
          </button>
        </div>
        <div class="modal-body">
          <template v-if="bulkStep === 'kind'">
            <p class="msg-options-sub">¿Qué quieres enviar masivamente?</p>
            <div class="msg-options">
              <button class="msg-option" @click="chooseBulkKind('libre')">
                <span class="msg-option-icon libre">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Mensaje libre</strong>
                  <small>Escribe un mensaje personalizado con variables</small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button class="msg-option" @click="chooseBulkKind('clave')">
                <span class="msg-option-icon clave">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0l3 3L22 7l-3-3"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Notificar clave nueva</strong>
                  <small>Genera una clave nueva para cada cliente y envíala por SMS</small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
          </template>

          <template v-else-if="bulkStep === 'target'">
            <p class="msg-options-sub">
              {{ bulkKind === 'clave' ? '¿Para quiénes quieres generar la clave nueva?' : '¿A quiénes quieres enviar el mensaje?' }}
            </p>
            <div class="msg-options">
              <button
                class="msg-option"
                :disabled="seleccionados.length === 0"
                @click="chooseBulkTarget('seleccionados')"
              >
                <span class="msg-option-icon libre">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Clientes seleccionados</strong>
                  <small>
                    {{ seleccionados.length === 0
                      ? 'Selecciona clientes en la tabla para habilitar esta opción'
                      : `${seleccionados.length} cliente${seleccionados.length === 1 ? '' : 's'} seleccionado${seleccionados.length === 1 ? '' : 's'}` }}
                  </small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
              <button class="msg-option" @click="chooseBulkTarget('todos')">
                <span class="msg-option-icon total">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/>
                    <path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
                  </svg>
                </span>
                <span class="msg-option-text">
                  <strong>Todos los clientes</strong>
                  <small v-if="bulkKind === 'clave'">{{ usuarios.length }} cliente{{ usuarios.length === 1 ? '' : 's' }} — a cada uno se le generará su propia clave</small>
                  <small v-else>{{ usuarios.length }} cliente{{ usuarios.length === 1 ? '' : 's' }} — personaliza el mensaje con variables para cada uno</small>
                </span>
                <svg class="msg-option-arrow" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="9 18 15 12 9 6"/>
                </svg>
              </button>
            </div>
            <div class="msg-compose-actions">
              <button class="btn-cancel" @click="bulkStep = 'kind'">Volver</button>
            </div>
          </template>

          <template v-else-if="bulkStep === 'compose'">
            <p class="msg-options-sub">
              El mensaje se enviará a
              <strong>{{ bulkRecipients.length }} cliente{{ bulkRecipients.length === 1 ? '' : 's' }}</strong>
              {{ bulkTarget === 'todos' ? '(todos los clientes)' : '(seleccionados)' }}.
              Usa las variables para que cada uno reciba un texto personalizado.
            </p>
            <textarea
              ref="bulkTextArea"
              v-model="bulkText"
              class="form-input msg-compose-input"
              rows="6"
              maxlength="1000"
              placeholder="Escribe tu mensaje..."
            ></textarea>
            <div class="msg-vars">
              <span class="msg-vars-label">Personaliza con:</span>
              <button
                v-for="v in MSG_VARS"
                :key="v.token"
                type="button"
                class="msg-var-chip"
                :title="`Inserta ${v.token}`"
                @click="insertBulkVar(v.token)"
              >{{ v.label }}</button>
            </div>
            <div v-if="bulkText.trim() && bulkPreviewUser" class="bulk-preview">
              <div class="bulk-preview-head">
                <span class="msg-vars-label">Vista previa personalizada</span>
                <select
                  v-if="bulkRecipients.length > 1"
                  v-model="bulkPreviewId"
                  class="form-select bulk-preview-select"
                >
                  <option v-for="u in bulkRecipients" :key="u.id" :value="u.id">{{ u.name }}</option>
                </select>
              </div>
              <blockquote class="msg-compose-preview">{{ bulkPreviewText }}</blockquote>
            </div>
            <div class="msg-compose-actions">
              <button class="btn-cancel" @click="bulkStep = 'target'">Volver</button>
              <button class="btn-save" @click="confirmBulkCompose">Continuar</button>
            </div>
            <p v-if="bulkError" class="msg-form-error">{{ bulkError }}</p>
          </template>
        </div>
      </div>
    </div>

    <!-- Confirmar envío masivo -->
    <div v-if="bulkConfirm" class="modal-overlay modal-overlay-confirm" @click.self="!bulkSending && (bulkConfirm = false)">
      <div class="modal-content modal-sm modal-confirm" @click.stop>
        <div class="modal-body confirm-body">
          <div class="confirm-icon">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
              <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
            </svg>
          </div>
          <h3>¿Estás seguro?</h3>
          <p v-if="bulkKind === 'clave'">
            Se generará una <strong>clave aleatoria</strong> para cada uno de los
            <strong>{{ bulkRecipients.length }} cliente{{ bulkRecipients.length === 1 ? '' : 's' }}</strong>
            {{ bulkTarget === 'todos' ? '(todos los clientes)' : '(seleccionados)' }}.
            Cada clave se guardará de forma segura y se enviará por SMS.
            Las claves anteriores dejarán de funcionar.
          </p>
          <p v-else>
            Vas a enviar este <strong>mensaje{{ bulkHasVars ? ' personalizado' : '' }}</strong> a
            <strong>{{ bulkRecipients.length }} cliente{{ bulkRecipients.length === 1 ? '' : 's' }}</strong>
            {{ bulkTarget === 'todos' ? '(todos los clientes)' : '(seleccionados)' }}:
          </p>
          <p v-if="bulkKind !== 'clave' && bulkHasVars && bulkPreviewUser" class="msg-options-sub">
            Vista previa para <strong>{{ bulkPreviewUser.name }}</strong> — cada cliente recibirá su propio texto:
          </p>
          <blockquote v-if="bulkKind !== 'clave'" class="msg-compose-preview">{{ bulkPreviewText }}</blockquote>
          <div v-if="bulkSending" class="bulk-progress">
            <div class="bulk-progress-bar"><span :style="{ width: bulkProgressPct + '%' }"></span></div>
            <span class="bulk-progress-text">
              Enviando {{ bulkProgress.sent }} / {{ bulkProgress.total }}{{ bulkProgress.failed ? ` · ${bulkProgress.failed} con error` : '' }}
            </span>
          </div>
          <div class="confirm-actions">
            <button class="btn-cancel" :disabled="bulkSending" @click="bulkConfirm = false">Cancelar</button>
            <button class="btn-save" :disabled="bulkSending" @click="sendBulkMsg">
              {{ bulkSending ? 'Enviando...' : 'Sí, enviar' }}
            </button>
          </div>
          <p v-if="bulkError" class="msg-form-error">{{ bulkError }}</p>
        </div>
      </div>
    </div>

    <!-- Simulación de envío de mensaje -->
    <transition name="msg-toast-fade">
      <div v-if="msgStatus" class="msg-sent-toast" :class="msgStatus" role="status">
        <span class="msg-sent-icon">
          <span v-if="msgStatus === 'sending'" class="msg-sent-spinner"></span>
          <svg v-else width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
        </span>
        <div class="msg-sent-text">
          <strong>{{ msgStatus === 'sending' ? 'Enviando mensaje...' : 'Mensaje enviado' }}</strong>
          <span>{{ msgSentTipo }} · {{ msgSentTo }}</span>
        </div>
        <button class="msg-sent-close" title="Cerrar" @click="msgStatus = null">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
    </transition>

    <!-- Bottom sheet de acciones (móvil) -->
    <div v-if="sheetUser" class="sheet-overlay" @click.self="sheetUser = null">
      <div class="sheet-panel">
        <div class="sheet-handle"></div>
        <button class="sheet-close" title="Cerrar" @click="sheetUser = null">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
        <div class="sheet-user">
          <div class="user-avatar" :style="{ background: getUserColor(sheetUser.id) }">
            <span>{{ getUserInitials(sheetUser.name || 'U') }}</span>
          </div>
          <div class="user-meta">
            <span class="user-name">{{ sheetUser.name }}</span>
            <span class="user-email">{{ sheetUser.email || '—' }}</span>
          </div>
        </div>
        <div class="sheet-info">
          <div class="sheet-info-row"><span>Cédula</span><strong>{{ sheetUser.cedula }}</strong></div>
          <div class="sheet-info-row"><span>Celular</span><strong>{{ sheetUser.celular || '—' }}</strong></div>
          <div class="sheet-info-row"><span>Ubicación</span><strong>{{ sheetUser.ubicacion || '—' }}</strong></div>
          <div class="sheet-info-row"><span>Periodicidad</span><strong>{{ sheetUser.periodicidad || '—' }}</strong></div>
          <div class="sheet-info-row">
            <span>Estado</span>
            <span class="status-badge" :class="sheetUser.isActive ? 'active' : 'inactive'">
              {{ sheetUser.isActive ? 'Activo' : 'Inactivo' }}
            </span>
          </div>
        </div>
        <div class="sheet-actions">
          <button class="sheet-item" @click="sheetAction(openEditModal)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
            Editar datos
          </button>
          <button class="sheet-item" @click="sheetAction(openPasswordModal)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
            Cambiar contraseña
          </button>
          <button v-if="isSuperAdmin" class="sheet-item" @click="sheetAction(toggleActive)">
            <svg v-if="sheetUser.isActive" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M18.36 6.64A9 9 0 1 1 5.64 6.64"/><line x1="12" y1="2" x2="12" y2="12"/></svg>
            <svg v-else width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M23 4v6h-6"/><path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/></svg>
            {{ sheetUser.isActive ? 'Inactivar usuario' : 'Reactivar usuario' }}
          </button>
          <button class="sheet-item" @click="sheetAction(openMsgOptions)">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
            Enviar mensaje
          </button>
          <button v-if="isSuperAdmin" class="sheet-item danger" @click="sheetDelete">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
            Eliminar usuario
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted, nextTick, type Ref } from 'vue'
import {
  usuarios,
  usuariosLoading,
  usuariosError,
  loadUsuarios,
  type MockUser,
} from '@/composables/useUsuariosStore'
import { viajeroService } from '@/services/api/viajeroService'
import { messageService } from '@/services/api/messageService'
import { recaudoService } from '@/services/api/recaudoService'
import { authService } from '@/services/api'

const isSuperAdmin = computed(() => authService.getUserRole() === 'superadmin')
const isAdmin = computed(() => authService.isAdmin())

const loading = usuariosLoading
const searchTerm = ref('')
const periodFilter = ref('')
const statusFilter = ref<'' | 'activo' | 'inactivo'>('')
const currentPage = ref(1)
const perPage = 20

const showCreateModal = ref(false)
const showEditModal = ref(false)
const showPasswordModal = ref(false)
const showDeleteModal = ref(false)
const showMsgOptions = ref(false)
const msgTargetUser = ref<MockUser | null>(null)
const msgStatus = ref<'sending' | 'sent' | null>(null)
const msgConfirm = ref(false)
const msgKind = ref<'ultimo' | 'total' | 'libre' | 'clave' | 'clave-actual'>('ultimo')
const claveMode = ref<'menu' | 'actual' | null>(null)
const msgClaveActual = ref('')
const msgCompose = ref(false)
const msgFreeText = ref('')
const msgFreeTextArea = ref<HTMLTextAreaElement | null>(null)
const msgSentTo = ref('')
const msgSentTipo = ref('')
const msgError = ref('')
const saving = ref(false)
const deleting = ref(false)
const formError = ref('')
const deleteError = ref('')
const actionError = ref('')
const createSubmitted = ref(false)
const showPassword = ref(false)

const mostrarPolitica = false

const deleteId = ref(0)
const deleteName = ref('')
const editUserId = ref(0)
const passwordTargetId = ref(0)
const passwordTargetName = ref('')
const passwordForm = ref({ password: '', confirm: '' })

const createForm = ref({
  name: '',
  cedula: '',
  celular: '',
  ubicacion: '',
  periodicidad: '' as '' | MockUser['periodicidad'],
  email: '',
  password: '',
  acceptPolicy: false,
})

const editForm = ref({
  name: '',
  cedula: '',
  celular: '',
  ubicacion: '',
  periodicidad: 'mensual' as MockUser['periodicidad'],
  email: '',
  password: '',
  consentLey1581: false,
})

const filteredUsuarios = computed(() => {
  let result = [...usuarios.value]
  if (searchTerm.value) {
    const term = searchTerm.value.toLowerCase()
    result = result.filter(u =>
      u.name.toLowerCase().includes(term) ||
      u.cedula.includes(term) ||
      u.celular.includes(term) ||
      u.ubicacion.toLowerCase().includes(term) ||
      u.email.toLowerCase().includes(term),
    )
  }
  if (periodFilter.value) {
    result = result.filter(u => u.periodicidad === periodFilter.value)
  }
  if (statusFilter.value === 'activo') {
    result = result.filter(u => u.isActive)
  } else if (statusFilter.value === 'inactivo') {
    result = result.filter(u => !u.isActive)
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredUsuarios.value.length / perPage))
const paginatedUsuarios = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsuarios.value.slice(start, start + perPage)
})

// ========== SELECCIÓN DE USUARIOS ==========
const seleccionados = ref<number[]>([])

const todosSeleccionados = computed(() =>
  filteredUsuarios.value.length > 0 && filteredUsuarios.value.every((u) => seleccionados.value.includes(u.id)),
)

function toggleSeleccion(id: number) {
  const idx = seleccionados.value.indexOf(id)
  if (idx === -1) seleccionados.value.push(id)
  else seleccionados.value.splice(idx, 1)
}

function toggleTodos() {
  const ids = filteredUsuarios.value.map((u) => u.id)
  if (todosSeleccionados.value) {
    seleccionados.value = seleccionados.value.filter((id) => !ids.includes(id))
  } else {
    seleccionados.value = Array.from(new Set([...seleccionados.value, ...ids]))
  }
}

watch([searchTerm, periodFilter, statusFilter], () => { currentPage.value = 1 })

function getUserInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

function getUserColor(id: number): string {
  const colors = ['#0E3570', '#16C2CA', '#E8483F', '#C89B2D', '#6366F1', '#10B981', '#F59E0B', '#8B5CF6']
  return colors[id % colors.length]
}

function openCreateModal() {
  createForm.value = {
    name: '',
    cedula: '',
    celular: '',
    ubicacion: '',
    periodicidad: '',
    email: '',
    password: '',
    acceptPolicy: false,
  }
  formError.value = ''
  createSubmitted.value = false
  showPassword.value = false
  showCreateModal.value = true
}

function openEditModal(u: MockUser) {
  editUserId.value = u.id
  editForm.value = {
    name: u.name,
    cedula: u.cedula,
    celular: u.celular,
    ubicacion: u.ubicacion,
    periodicidad: u.periodicidad,
    email: u.email,
    password: '',
    consentLey1581: u.consentLey1581,
  }
  formError.value = ''
  showPassword.value = false
  showEditModal.value = true
}

function extractError(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message && error.message !== 'Sesión expirada') {
    return error.message
  }
  return fallback
}

function openPasswordModal(u: MockUser) {
  passwordTargetId.value = u.id
  passwordTargetName.value = u.name
  passwordForm.value = { password: '', confirm: '' }
  formError.value = ''
  showPassword.value = false
  showPasswordModal.value = true
}

async function handlePasswordChange() {
  formError.value = ''
  const f = passwordForm.value
  if (!f.password) { formError.value = 'La contraseña es obligatoria.'; return }
  if (f.password.length < 6) { formError.value = 'La contraseña debe tener al menos 6 caracteres.'; return }
  if (f.password !== f.confirm) { formError.value = 'Las contraseñas no coinciden.'; return }

  saving.value = true
  try {
    await viajeroService.update(passwordTargetId.value, { password: f.password })
    showPasswordModal.value = false
  } catch (error) {
    formError.value = extractError(error, 'No se pudo cambiar la contraseña.')
  } finally {
    saving.value = false
  }
}

async function refreshList() {
  actionError.value = ''
  await loadUsuarios(true)
  const validIds = new Set(usuarios.value.map((u) => u.id))
  seleccionados.value = seleccionados.value.filter((id) => validIds.has(id))
}

async function handleCreate() {
  formError.value = ''
  createSubmitted.value = true
  const f = createForm.value

  if (!f.name.trim()) { formError.value = 'El nombre completo es obligatorio.'; return }
  if (!f.cedula.trim()) { formError.value = 'La cédula es obligatoria.'; return }
  if (!f.celular.trim()) { formError.value = 'El celular es obligatorio.'; return }
  if (!f.ubicacion.trim()) { formError.value = 'La ubicación es obligatoria.'; return }
  if (f.password && f.password.length < 6) { formError.value = 'La contraseña debe tener al menos 6 caracteres.'; return }
  if (mostrarPolitica && !f.acceptPolicy) {
    formError.value = 'Debe aceptar la Política de tratamiento de datos personales (Ley 1581) para crear el usuario.'
    return
  }

  saving.value = true
  try {
    await viajeroService.create({
      name: f.name.trim(),
      cedula: f.cedula.trim(),
      phone: f.celular.trim(),
      ubicacion: f.ubicacion.trim(),
      email: f.email.trim() || undefined,
      periodicidad: f.periodicidad || undefined,
      password: f.password || undefined,
    })
    showCreateModal.value = false
    await refreshList()
  } catch (error) {
    formError.value = extractError(error, 'No se pudo crear el usuario. Intente nuevamente.')
  } finally {
    saving.value = false
  }
}

async function handleUpdate() {
  formError.value = ''
  const f = editForm.value
  if (!f.name.trim() || !f.cedula.trim() || !f.celular.trim()) {
    formError.value = 'Complete los campos obligatorios.'
    return
  }
  if (f.password && f.password.length < 6) {
    formError.value = 'La nueva contraseña debe tener al menos 6 caracteres.'
    return
  }
  saving.value = true
  try {
    await viajeroService.update(editUserId.value, {
      name: f.name.trim(),
      cedula: f.cedula.trim(),
      phone: f.celular.trim(),
      ubicacion: f.ubicacion.trim(),
      email: f.email.trim(),
      periodicidad: f.periodicidad,
      password: f.password ? f.password : undefined,
    })
    showEditModal.value = false
    await refreshList()
  } catch (error) {
    formError.value = extractError(error, 'No se pudieron guardar los cambios. Intente nuevamente.')
  } finally {
    saving.value = false
  }
}

async function toggleActive(u: MockUser) {
  if (!isSuperAdmin.value) return
  try {
    await viajeroService.setActive(u.id, !u.isActive)
    await refreshList()
  } catch (error) {
    actionError.value = extractError(error, 'No se pudo cambiar el estado del usuario.')
  }
}

function deleteUsuario(id: number, name: string) {
  if (!isSuperAdmin.value) return
  deleteId.value = id
  deleteName.value = name
  deleteError.value = ''
  showDeleteModal.value = true
}

const sheetUser = ref<MockUser | null>(null)

function sheetAction(fn: (u: MockUser) => void) {
  const u = sheetUser.value
  sheetUser.value = null
  if (u) fn(u)
}

function sheetDelete() {
  sheetAction((u) => deleteUsuario(u.id, u.name))
}

async function confirmDelete() {
  if (!isSuperAdmin.value) return
  deleteError.value = ''
  deleting.value = true
  try {
    await viajeroService.remove(deleteId.value)
    showDeleteModal.value = false
    await refreshList()
  } catch (error) {
    deleteError.value = extractError(error, 'No se pudo eliminar el usuario.')
  } finally {
    deleting.value = false
  }
}

onMounted(() => {
  loadUsuarios()
})

const ultimoRecaudo = ref<{ valor: number; fecha: string } | null>(null)
const totalRecaudos = ref(0)

async function fetchRecaudosUsuario(userId: number) {
  ultimoRecaudo.value = null
  totalRecaudos.value = 0
  try {
    const resp = await recaudoService.getAll({ clientId: userId, page: 1, limit: 100 })
    const rows = (resp.data || [])
      .filter(r => Number.isFinite(new Date(r.fecha).getTime()))
      .sort((a, b) => new Date(b.fecha).getTime() - new Date(a.fecha).getTime())
    const last = rows[0]
    ultimoRecaudo.value = last ? { valor: Number(last.valor) || 0, fecha: last.fecha } : null
    totalRecaudos.value = rows.reduce((sum, r) => sum + (Number(r.valor) || 0), 0)
  } catch {
    ultimoRecaudo.value = null
    totalRecaudos.value = 0
  }
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value)
}

function formatFechaLarga(value: string): string {
  const d = new Date(value)
  if (Number.isNaN(d.getTime())) return ''
  return d.toLocaleDateString('es-CO', { day: '2-digit', month: 'long', year: 'numeric' })
}

// ========== PERSONALIZACIÓN DE MENSAJES ==========
const MSG_VARS = [
  { token: '{nombre}', label: 'Nombre' },
  { token: '{cedula}', label: 'Cédula' },
  { token: '{celular}', label: 'Celular' },
  { token: '{saldo}', label: 'Saldo' },
]

function personalizeMsg(text: string, u: MockUser): string {
  return text
    .replace(/\{nombre\}/g, u.name || '')
    .replace(/\{cedula\}/g, u.cedula || '')
    .replace(/\{celular\}/g, u.celular || '')
    .replace(/\{saldo\}/g, Number.isFinite(u.saldo) ? formatCurrency(u.saldo) : '')
}

function insertVarAtCursor(el: HTMLTextAreaElement | null, model: Ref<string>, token: string) {
  const start = el?.selectionStart ?? model.value.length
  const end = el?.selectionEnd ?? start
  model.value = model.value.slice(0, start) + token + model.value.slice(end)
  if (el) {
    nextTick(() => {
      el.focus()
      const pos = start + token.length
      el.setSelectionRange(pos, pos)
    })
  }
}

function insertMsgVar(token: string) {
  insertVarAtCursor(msgFreeTextArea.value, msgFreeText, token)
}

function openMsgOptions(u: MockUser) {
  msgTargetUser.value = u
  msgConfirm.value = false
  msgError.value = ''
  msgKind.value = 'ultimo'
  msgCompose.value = false
  msgFreeText.value = ''
  claveMode.value = null
  msgClaveActual.value = ''
  showMsgOptions.value = true
  fetchRecaudosUsuario(u.id)
}

let msgTimer: ReturnType<typeof setTimeout> | undefined

const msgKindLabel = computed(() =>
  msgKind.value === 'ultimo' ? 'Último Recaudo'
    : msgKind.value === 'total' ? 'Total Recaudo'
      : msgKind.value === 'clave' ? 'Clave nueva por SMS'
        : msgKind.value === 'clave-actual' ? 'Clave actual por SMS'
          : 'Mensaje libre'
)

function chooseMsgOption(kind: 'ultimo' | 'total' | 'libre' | 'clave') {
  msgError.value = ''
  if (kind === 'libre') {
    msgKind.value = kind
    msgFreeText.value = ''
    msgCompose.value = true
    return
  }
  if (kind === 'clave') {
    msgKind.value = kind
    claveMode.value = 'menu'
    return
  }
  msgKind.value = kind
  showMsgOptions.value = false
  msgConfirm.value = true
}

function chooseClaveActual() {
  msgKind.value = 'clave-actual'
  msgClaveActual.value = ''
  msgError.value = ''
  showPassword.value = false
  claveMode.value = 'actual'
}

function chooseClaveNueva() {
  msgKind.value = 'clave'
  claveMode.value = null
  showMsgOptions.value = false
  msgConfirm.value = true
}

function buildMsgTexto(kind: 'ultimo' | 'total' | 'libre', u: MockUser): string {
  if (kind === 'libre') return personalizeMsg(msgFreeText.value, u)
  const cedula = u.cedula ? ` (C.C. ${u.cedula})` : ''
  if (kind === 'ultimo') {
    const last = ultimoRecaudo.value
    if (!last) {
      return `Hola, ${u.name}${cedula},\n\nViaja Ya te informa que aún no tienes recaudos registrados.\n\n¡Gracias por confiar en nosotros!`
    }
    const fecha = last.fecha ? `\nFecha: ${formatFechaLarga(last.fecha)}` : ''
    return `Hola, ${u.name}${cedula},\n\nViaja Ya te informa sobre tu último recaudo registrado\n\nValor: ${formatCurrency(last.valor)}${fecha}\n\n¡Gracias por confiar en nosotros!`
  }
  if (kind === 'total') {
    if (!totalRecaudos.value) {
      return `Hola, ${u.name}${cedula},\n\nViaja Ya te informa que aún no tienes recaudos registrados.\n\n¡Gracias por confiar en nosotros!`
    }
    return `Hola, ${u.name}${cedula},\n\nTu total recaudado a la fecha del envío de este mensaje es:\n\nValor: ${formatCurrency(totalRecaudos.value)}\n\n¡Gracias por confiar en nosotros!`
  }
  return ''
}

const msgPreviewText = computed(() => {
  const u = msgTargetUser.value
  if (!u) return ''
  return buildMsgTexto(msgKind.value === 'total' ? 'total' : 'ultimo', u)
})

const msgFreePreview = computed(() => {
  const u = msgTargetUser.value
  return u ? personalizeMsg(msgFreeText.value, u) : msgFreeText.value
})

const msgClaveActualPreview = computed(() => {
  const u = msgTargetUser.value
  if (!u) return ''
  return `Hola, ${u.name},\n\nViaja Ya te informa tu clave actual para acceder al portal:\n\nClave: ${msgClaveActual.value}\n\n¡Gracias por confiar en nosotros!`
})

function confirmComposeMsg() {
  const text = msgFreeText.value.trim()
  if (!text) {
    msgError.value = 'El mensaje no puede estar vacío.'
    return
  }
  msgFreeText.value = text
  msgError.value = ''
  showMsgOptions.value = false
  msgConfirm.value = true
}

function confirmComposeClaveActual() {
  if (!msgClaveActual.value.trim()) {
    msgError.value = 'La clave es obligatoria.'
    return
  }
  msgError.value = ''
  claveMode.value = null
  showMsgOptions.value = false
  msgConfirm.value = true
}

async function confirmSendMsg() {
  const u = msgTargetUser.value
  if (!u || msgStatus.value === 'sending') return

  const tipo = msgKindLabel.value
  const kind = msgKind.value

  msgError.value = ''
  msgStatus.value = 'sending'
  clearTimeout(msgTimer)
  try {
    if (kind === 'clave') {
      await viajeroService.notifyPassword(u.id)
    } else {
      const phone = messageService.toInternationalPhone(u.celular)
      if (!phone) {
        msgStatus.value = null
        msgError.value = 'El usuario no tiene celular registrado.'
        return
      }
      const texto = kind === 'clave-actual' ? msgClaveActualPreview.value : buildMsgTexto(kind, u)
      await messageService.send(phone, texto)
    }
    msgConfirm.value = false
    msgSentTo.value = u.name
    msgSentTipo.value = tipo
    msgStatus.value = 'sent'
    msgClaveActual.value = ''
    msgTimer = setTimeout(() => { msgStatus.value = null }, 4000)
  } catch (error) {
    msgStatus.value = null
    msgError.value = extractError(error, 'No se pudo enviar el mensaje.')
  }
}

// ========== MENSAJE MASIVO (ADMIN / SUPERADMIN) ==========
const showBulkMsg = ref(false)
const bulkStep = ref<'kind' | 'target' | 'compose'>('kind')
const bulkKind = ref<'libre' | 'clave'>('libre')
const bulkPrefer = ref<'seleccionados' | 'todos' | null>(null)
const bulkTarget = ref<'seleccionados' | 'todos'>('seleccionados')
const bulkText = ref('')
const bulkError = ref('')
const bulkConfirm = ref(false)
const bulkSending = ref(false)
const bulkProgress = ref({ sent: 0, total: 0, failed: 0 })
const bulkTextArea = ref<HTMLTextAreaElement | null>(null)
const bulkPreviewId = ref<number | null>(null)

const bulkRecipients = computed(() => {
  if (bulkTarget.value === 'todos') return usuarios.value
  const ids = new Set(seleccionados.value)
  return usuarios.value.filter((u) => ids.has(u.id))
})

const bulkPreviewUser = computed(() => {
  const list = bulkRecipients.value
  return list.find((u) => u.id === bulkPreviewId.value) || list[0] || null
})

const bulkPreviewText = computed(() => {
  const u = bulkPreviewUser.value
  return u ? personalizeMsg(bulkText.value, u) : bulkText.value
})

const bulkHasVars = computed(() => MSG_VARS.some((v) => bulkText.value.includes(v.token)))

function insertBulkVar(token: string) {
  insertVarAtCursor(bulkTextArea.value, bulkText, token)
}

const bulkProgressPct = computed(() =>
  bulkProgress.value.total ? Math.round((bulkProgress.value.sent / bulkProgress.value.total) * 100) : 0,
)

function openBulkMsg(prefer?: 'seleccionados' | 'todos') {
  if (!isAdmin.value) return
  bulkError.value = ''
  bulkText.value = ''
  bulkConfirm.value = false
  bulkPreviewId.value = null
  bulkProgress.value = { sent: 0, total: 0, failed: 0 }
  bulkKind.value = 'libre'
  bulkPrefer.value = prefer && !(prefer === 'seleccionados' && seleccionados.value.length === 0) ? prefer : null
  if (bulkPrefer.value) bulkTarget.value = bulkPrefer.value
  bulkStep.value = 'kind'
  showBulkMsg.value = true
}

function closeBulkMsg() {
  if (bulkSending.value) return
  showBulkMsg.value = false
}

function chooseBulkKind(kind: 'libre' | 'clave') {
  bulkKind.value = kind
  bulkError.value = ''
  bulkPreviewId.value = null
  if (bulkPrefer.value) {
    bulkTarget.value = bulkPrefer.value
    if (kind === 'clave') {
      showBulkMsg.value = false
      bulkConfirm.value = true
    } else {
      bulkStep.value = 'compose'
    }
    return
  }
  bulkStep.value = 'target'
}

function chooseBulkTarget(target: 'seleccionados' | 'todos') {
  if (target === 'seleccionados' && seleccionados.value.length === 0) return
  bulkTarget.value = target
  bulkError.value = ''
  bulkPreviewId.value = null
  if (bulkKind.value === 'clave') {
    showBulkMsg.value = false
    bulkConfirm.value = true
    return
  }
  bulkStep.value = 'compose'
}

function confirmBulkCompose() {
  const text = bulkText.value.trim()
  if (!text) {
    bulkError.value = 'El mensaje no puede estar vacío.'
    return
  }
  if (bulkRecipients.value.length === 0) {
    bulkError.value = 'No hay clientes destinatarios.'
    return
  }
  bulkText.value = text
  bulkError.value = ''
  showBulkMsg.value = false
  bulkConfirm.value = true
}

async function sendBulkMsg() {
  if (!isAdmin.value || bulkSending.value) return

  const recipients = bulkRecipients.value
  if (recipients.length === 0) {
    bulkError.value = 'No hay clientes destinatarios.'
    return
  }

  bulkError.value = ''
  bulkSending.value = true
  bulkProgress.value = { sent: 0, total: recipients.length, failed: 0 }
  let ok = 0
  let failed = 0

  if (bulkKind.value === 'clave') {
    for (const u of recipients) {
      try {
        await viajeroService.notifyPassword(u.id)
        ok++
      } catch {
        failed++
      }
      bulkProgress.value = { sent: ok + failed, total: recipients.length, failed }
    }
    bulkSending.value = false

    if (ok === 0) {
      bulkError.value = 'No se pudo generar la clave para ningún cliente.'
      return
    }

    bulkConfirm.value = false
    showBulkMsg.value = false
    clearTimeout(msgTimer)
    msgSentTipo.value = 'Clave nueva masiva'
    const extras: string[] = []
    if (failed) extras.push(`${failed} con error`)
    msgSentTo.value = `${ok} de ${recipients.length} clientes${extras.length ? ` — ${extras.join(' · ')}` : ''}`
    msgStatus.value = 'sent'
    msgTimer = setTimeout(() => { msgStatus.value = null }, 6000)
    return
  }

  const text = bulkText.value.trim()
  if (!text) {
    bulkSending.value = false
    bulkError.value = 'El mensaje no puede estar vacío.'
    return
  }

  const withPhone: { phone: string; text: string }[] = []
  let sinCelular = 0
  for (const u of recipients) {
    const phone = messageService.toInternationalPhone(u.celular)
    if (phone) withPhone.push({ phone, text: personalizeMsg(text, u) })
    else sinCelular++
  }
  if (withPhone.length === 0) {
    bulkSending.value = false
    bulkError.value = 'Ningún cliente destinatario tiene celular registrado.'
    return
  }

  bulkProgress.value = { sent: 0, total: withPhone.length, failed: 0 }
  for (const r of withPhone) {
    try {
      await messageService.send(r.phone, r.text)
      ok++
    } catch {
      failed++
    }
    bulkProgress.value = { sent: ok + failed, total: withPhone.length, failed }
  }
  bulkSending.value = false

  if (ok === 0) {
    bulkError.value = 'No se pudo enviar el mensaje a ningún cliente.'
    return
  }

  bulkConfirm.value = false
  showBulkMsg.value = false
  clearTimeout(msgTimer)
  msgSentTipo.value = 'Mensaje masivo'
  const extras: string[] = []
  if (failed) extras.push(`${failed} con error`)
  if (sinCelular) extras.push(`${sinCelular} sin celular`)
  msgSentTo.value = `${ok} de ${withPhone.length} clientes${extras.length ? ` — ${extras.join(' · ')}` : ''}`
  msgStatus.value = 'sent'
  msgTimer = setTimeout(() => { msgStatus.value = null }, 6000)
}
</script>

<style scoped>
.usuarios-page { display: flex; flex-direction: column; gap: 24px; }

.page-header { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }
.page-title { font-size: 1.4rem; font-weight: 700; color: var(--c-black); }
.page-subtitle { font-size: 0.85rem; color: var(--c-gray); margin-top: 4px; }
.header-actions { display: flex; align-items: center; gap: 12px; flex-wrap: wrap; }

.summary-cards { display: flex; gap: 10px; flex-wrap: wrap; }
.summary-card { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: var(--c-white); border: 1px solid var(--c-border); border-radius: 10px; }
.summary-icon { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border-radius: 8px; }
.summary-icon.activos { background: #DCFCE7; color: #16A34A; }
.summary-info { display: flex; flex-direction: column; }
.summary-count { font-size: 1.1rem; font-weight: 700; color: var(--c-black); line-height: 1; }
.summary-label { font-size: 0.68rem; color: var(--c-gray); margin-top: 2px; white-space: nowrap; }

.filters-bar { display: flex; align-items: flex-end; gap: 12px; flex-wrap: wrap; margin-bottom: 4px; }
.search-box { position: relative; max-width: 420px; flex: 1; min-width: 240px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 14px 10px 42px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: all 0.2s; box-sizing: border-box; }
.search-input:focus { border-color: #0E3570; box-shadow: 0 0 0 3px rgba(14, 53, 112, 0.12); }
.search-input::placeholder { color: var(--c-gray-light); }
.filter-group { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; margin-left: auto; }
.filter-field { display: flex; flex-direction: column; gap: 4px; }
.filter-label { font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; }
.form-select { padding: 11px 32px 11px 14px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; cursor: pointer; width: 150px; transition: all 0.2s; }
.form-select:focus { border-color: #0E3570; box-shadow: 0 0 0 3px rgba(14, 53, 112, 0.12); }
.clear-btn { position: absolute; right: 6px; top: 50%; transform: translateY(-50%); display: flex; align-items: center; justify-content: center; width: 24px; height: 24px; border: none; background: none; color: var(--c-gray-light); border-radius: 4px; cursor: pointer; }
.clear-btn:hover { background: var(--c-light); color: var(--c-black); }

.table-card { background: var(--c-white); border: 1px solid var(--c-border); border-radius: 14px; overflow: hidden; }
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; min-width: 960px; }
.data-table th { padding: 12px 14px; text-align: left; font-size: 0.7rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.05em; background: var(--c-light); border-bottom: 1px solid var(--c-border); white-space: nowrap; }
.data-table td { padding: 12px 14px; font-size: 0.84rem; color: var(--c-black); border-bottom: 1px solid var(--c-border); vertical-align: middle; white-space: nowrap; }
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(240, 192, 9, 0.07); }
.data-table .col-check { width: 42px; text-align: center; }
.row-check { width: 16px; height: 16px; accent-color: var(--c-primary); cursor: pointer; }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; color: white; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
.user-meta { display: flex; flex-direction: column; min-width: 0; }
.user-name { font-weight: 600; font-size: 0.86rem; }
.user-email { font-size: 0.72rem; color: var(--c-gray); }
.user-cedula { display: none; font-size: 0.72rem; color: var(--c-gray); }

.rol-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.74rem; font-weight: 600; }
.rol-badge.admin { background: #EFF6FF; color: #2563EB; }
.rol-badge.superadmin { background: #F5F3FF; color: #7C3AED; }
.rol-badge.user { background: #F0FDF4; color: #16A34A; }

.period-badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 0.74rem; font-weight: 600; background: #EEF2FF; color: #4338CA; text-transform: capitalize; }

.status-badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 0.74rem; font-weight: 600; }
.status-badge.active { background: #F0FDF4; color: #16A34A; }
.status-badge.inactive { background: #FEF2F2; color: #DC2626; }
.delete-error { margin: 0 auto 20px; text-align: left; }
.action-error { margin: 12px 16px 0; }

.loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; gap: 12px; color: var(--c-gray); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border); border-top-color: #0E3570; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.actions-cell { display: flex; gap: 6px; align-items: center; }
.col-kebab { display: none; }
.kebab-btn { display: none; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.action-btn:hover { background: rgba(255, 255, 255, 0.08); color: var(--c-black); }
.action-btn.delete-btn:hover { background: rgba(232, 72, 63, 0.1); color: #E8483F; }
.action-btn.pass-btn:hover { background: rgba(240, 192, 9, 0.18); color: var(--c-primary); }
.password-hint { margin: 0; font-size: 0.85rem; color: var(--c-gray); }
.password-hint strong { color: var(--c-black); }

.msg-btn { display: inline-flex; align-items: center; gap: 6px; padding: 7px 12px; border: none; border-radius: 8px; background: linear-gradient(135deg, var(--c-primary), #E8C25A); color: #102857; font-size: 0.76rem; font-weight: 700; font-family: inherit; white-space: nowrap; cursor: pointer; box-shadow: 0 2px 8px rgba(200, 155, 45, 0.4); transition: all 0.15s; }
.msg-btn:hover { transform: translateY(-1px); box-shadow: 0 5px 12px rgba(200, 155, 45, 0.5); }
.msg-btn:active { transform: translateY(0); }

.msg-options-sub { margin: 0 0 16px; font-size: 0.86rem; color: var(--c-gray); }
.msg-options { display: flex; flex-direction: column; gap: 10px; }
.msg-option { display: flex; align-items: center; gap: 12px; width: 100%; padding: 14px; border: 1.5px solid var(--c-border); border-radius: 12px; background: var(--c-light); cursor: pointer; text-align: left; font-family: inherit; transition: all 0.15s; }
.msg-option:hover { border-color: var(--c-primary); background: rgba(200, 155, 45, 0.12); transform: translateY(-1px); }
.msg-option-icon { display: flex; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0; }
.msg-option-icon.ultimo { background: rgba(59, 130, 246, 0.15); color: #3B82F6; }
.msg-option-icon.total { background: rgba(16, 185, 129, 0.15); color: #10B981; }
.msg-option-icon.libre { background: rgba(139, 92, 246, 0.15); color: #8B5CF6; }
.msg-option-icon.clave { background: rgba(240, 192, 9, 0.15); color: #F0C009; }
.msg-option-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.msg-option-text strong { font-size: 0.9rem; font-weight: 700; color: var(--c-black); }
.msg-option-text small { font-size: 0.76rem; color: var(--c-gray); }
.msg-option-arrow { color: var(--c-gray-light); flex-shrink: 0; }
.msg-option:hover .msg-option-arrow { color: var(--c-primary); }

.msg-option:disabled { opacity: 0.5; cursor: not-allowed; }
.msg-option:disabled:hover { border-color: var(--c-border); background: var(--c-light); transform: none; }
.msg-option:disabled:hover .msg-option-arrow { color: var(--c-gray-light); }

.msg-form-error { margin: 10px 0 0; font-size: 0.82rem; color: #ef4444; text-align: left; }

.btn-secondary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 18px; background: var(--c-white); color: var(--c-black); border: 1.5px solid var(--c-border); border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; white-space: nowrap; }
.btn-secondary:hover:not(:disabled) { border-color: var(--c-primary); color: var(--c-primary); }
.btn-secondary:disabled { opacity: 0.55; cursor: not-allowed; }

.selection-bar { display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap; padding: 12px 16px; background: rgba(200, 155, 45, 0.1); border: 1px solid rgba(200, 155, 45, 0.35); border-radius: 12px; }
.selection-bar-text { display: inline-flex; align-items: center; gap: 8px; font-size: 0.86rem; font-weight: 600; color: var(--c-black); }
.selection-bar-text svg { color: var(--c-primary); }
.selection-bar-actions { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }

.bulk-progress { margin: 0 auto 16px; max-width: 320px; text-align: center; }
.bulk-progress-bar { height: 8px; background: var(--c-border); border-radius: 999px; overflow: hidden; }
.bulk-progress-bar span { display: block; height: 100%; background: var(--c-primary); border-radius: 999px; transition: width 0.25s ease; }
.bulk-progress-text { display: block; margin-top: 6px; font-size: 0.78rem; color: var(--c-gray); }

.msg-compose-input { width: 100%; min-height: 130px; resize: vertical; line-height: 1.5; }
.msg-compose-actions { display: flex; justify-content: flex-end; gap: 10px; margin-top: 14px; }
.msg-compose-preview { margin: 10px 0 0; padding: 10px 12px; background: var(--c-light); border: 1px solid var(--c-border); border-radius: 10px; font-size: 0.85rem; color: var(--c-black); white-space: pre-wrap; text-align: left; }

.msg-vars { display: flex; flex-wrap: wrap; align-items: center; gap: 6px; margin-top: 10px; }
.msg-vars-label { font-size: 0.78rem; color: var(--c-gray); font-weight: 600; }
.msg-var-chip { padding: 4px 10px; border: 1px dashed var(--c-border); border-radius: 999px; background: var(--c-light); color: var(--c-black); font-size: 0.75rem; font-weight: 600; font-family: inherit; cursor: pointer; transition: all 0.15s; }
.msg-var-chip:hover { border-color: var(--c-primary); border-style: solid; color: var(--c-primary); background: rgba(200, 155, 45, 0.12); }

.bulk-preview { margin-top: 14px; padding: 12px 14px; border: 1px solid var(--c-border); border-radius: 12px; background: var(--c-light); }
.bulk-preview-head { display: flex; justify-content: space-between; align-items: center; gap: 8px; flex-wrap: wrap; margin-bottom: 8px; }
.bulk-preview-select { max-width: 220px; padding: 6px 10px; font-size: 0.8rem; }
.bulk-preview .msg-compose-preview { margin: 0; background: var(--c-white); }

.msg-sent-toast { position: fixed; right: 24px; bottom: 24px; z-index: 1200; display: flex; align-items: center; gap: 12px; min-width: 280px; max-width: 90vw; padding: 14px 16px; border-radius: 12px; background: var(--c-white); border: 1px solid var(--c-border); box-shadow: 0 12px 32px rgba(0, 0, 0, 0.25); }
.msg-sent-toast.sent { border-color: rgba(16, 185, 129, 0.5); }
.msg-sent-icon { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 50%; flex-shrink: 0; background: rgba(59, 130, 246, 0.15); color: #3B82F6; }
.msg-sent-toast.sent .msg-sent-icon { background: rgba(16, 185, 129, 0.18); color: #10B981; }
.msg-sent-spinner { width: 16px; height: 16px; border: 2px solid rgba(59, 130, 246, 0.3); border-top-color: #3B82F6; border-radius: 50%; animation: spin 0.8s linear infinite; }
.msg-sent-text { display: flex; flex-direction: column; gap: 2px; flex: 1; min-width: 0; }
.msg-sent-text strong { font-size: 0.86rem; font-weight: 700; color: var(--c-black); }
.msg-sent-text span { font-size: 0.76rem; color: var(--c-gray); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.msg-sent-close { display: flex; align-items: center; justify-content: center; width: 26px; height: 26px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; flex-shrink: 0; }
.msg-sent-close:hover { background: var(--c-light); color: var(--c-black); }
.msg-toast-fade-enter-active, .msg-toast-fade-leave-active { transition: all 0.25s ease; }
.msg-toast-fade-enter-from, .msg-toast-fade-leave-to { opacity: 0; transform: translateY(12px); }

.pagination { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 16px; border-top: 1px solid var(--c-border); }
.page-btn { display: flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; padding: 0 8px; border: 1px solid var(--c-border); border-radius: 6px; background: var(--c-white); color: var(--c-dark); font-size: 0.82rem; cursor: pointer; transition: all 0.15s; }
.page-btn:hover:not(:disabled):not(.active) { border-color: #0E3570; color: #0E3570; }
.page-btn.active { background: #0E3570; color: white; border-color: #0E3570; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-dots { color: var(--c-gray); font-size: 0.85rem; padding: 0 4px; }

.btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--c-primary); color: #102857; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 700; cursor: pointer; transition: all 0.2s; white-space: nowrap; font-family: inherit; }
.btn-primary:hover:not(:disabled) { background: var(--c-primary-hover); }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; position: relative; }
.form-group label { font-size: 0.76rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; }
.form-input { padding: 11px 14px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box; }
.form-input:focus { border-color: #0E3570; box-shadow: 0 0 0 3px rgba(14, 53, 112, 0.12); }
.field-error { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important; }

/* Modals */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(4px); }
.modal-content { background: var(--c-white); border-radius: 16px; width: 100%; max-width: 640px; max-height: 92vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.45); border: 1px solid var(--c-border); }
.modal-content.modal-sm { max-width: 480px; }
.modal-content.modal-md { max-width: 580px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid var(--c-border); background: var(--c-light); border-radius: 16px 16px 0 0; }
.modal-header h3 { font-size: 1.05rem; font-weight: 700; color: var(--c-black); margin: 0; }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 8px; cursor: pointer; transition: all 0.15s; }
.modal-close:hover { background: rgba(255,255,255,0.1); color: var(--c-black); }
.modal-error { display: flex; align-items: center; gap: 8px; padding: 12px 16px; margin: 16px 24px 0; background: rgba(239, 68, 68, 0.14); color: #FCA5A5; border-radius: 8px; font-size: 0.85rem; border: 1px solid rgba(248, 113, 113, 0.35); }
.modal-body { padding: 24px; background: var(--c-white); }
.modal-info { margin: 0 0 16px; font-size: 0.88rem; color: var(--c-gray); }
.required-note {
  font-size: 0.75rem; color: #93C5FD; margin-bottom: 16px;
  padding: 8px 12px; background: rgba(59, 130, 246, 0.12); border-radius: 8px;
  border: 1px solid rgba(96, 165, 250, 0.3);
}
.form-grid-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group-full { grid-column: 1 / -1; }
.form-group label { font-size: 0.76rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; }

/* Campos dentro del modal: fondo más profundo que el body para que resalten */
.modal-content .form-input { background: var(--c-light); border: 1.5px solid var(--c-border); color: var(--c-black); }
.modal-content .form-input::placeholder { color: var(--c-gray-light); }
.modal-content .form-input:focus { border-color: #4C63E6; box-shadow: 0 0 0 3px rgba(76, 99, 230, 0.3); }

.policy-box {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 14px; background: rgba(245, 158, 11, 0.12); border: 1.5px solid rgba(252, 211, 77, 0.45);
  border-radius: 10px; cursor: pointer; text-transform: none !important;
  letter-spacing: 0 !important;
}
.policy-box input[type="checkbox"] { margin-top: 3px; accent-color: var(--c-primary); width: 16px; height: 16px; flex-shrink: 0; }
.policy-box .policy-text strong { display: block; font-size: 0.82rem; color: #FBBF24; margin-bottom: 6px; font-weight: 700; }
.policy-box .policy-text p { margin: 0; font-size: 0.76rem; color: var(--c-gray); line-height: 1.45; }
.policy-box-compact { background: rgba(16, 185, 129, 0.12); border-color: rgba(110, 231, 183, 0.4); }
.policy-box-compact .policy-text p { color: #6EE7B7; }

.password-input-wrap { position: relative; }
.password-input-wrap .form-input { padding-right: 40px; }
.btn-toggle-password {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border: none; background: none;
  color: var(--c-gray); cursor: pointer; border-radius: 6px;
}
.btn-toggle-password:hover { background: rgba(255,255,255,0.08); color: var(--c-black); }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid var(--c-border); background: var(--c-light); border-radius: 0 0 16px 16px; }
.btn-cancel { padding: 10px 20px; border: 1.5px solid var(--c-border); border-radius: 10px; background: var(--c-white); color: var(--c-black); font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-cancel:hover { background: rgba(255,255,255,0.08); border-color: var(--c-gray); }
.btn-save { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: var(--c-primary); color: #102857; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 700; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-save:hover { background: var(--c-primary-hover); transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

.modal-overlay-confirm { z-index: 1100; }
.modal-content.modal-confirm { max-width: 440px; }
.confirm-body { text-align: center; padding: 30px 24px; }
.confirm-icon { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; margin: 0 auto 14px; border-radius: 50%; background: rgba(240, 192, 9, 0.16); color: var(--c-primary); }
.confirm-body h3 { margin: 0 0 8px; font-size: 1.05rem; font-weight: 700; color: var(--c-black); }
.confirm-body p { margin: 0 0 20px; font-size: 0.87rem; color: var(--c-gray); line-height: 1.6; }
.confirm-actions { display: flex; justify-content: center; gap: 10px; padding-top: 10px; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }

.delete-modal-body { padding: 32px 28px; text-align: center; }
.delete-icon { color: #E8483F; margin-bottom: 12px; }
.delete-title { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin: 0 0 8px; }
.delete-text { font-size: 0.88rem; color: var(--c-gray); margin: 0 0 24px; line-height: 1.5; }
.delete-actions { display: flex; gap: 10px; justify-content: center; }
.delete-actions .btn-delete { padding: 10px 20px; border: none; border-radius: 10px; background: #E8483F; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.delete-actions .btn-delete:hover { background: #c93a32; transform: translateY(-1px); }

/* Bottom sheet de acciones */
.sheet-overlay {
  position: fixed;
  inset: 0;
  background: rgba(17, 24, 39, 0.45);
  z-index: 130;
  display: flex;
  align-items: flex-end;
}
.sheet-panel {
  width: 100%;
  position: relative;
  background: var(--c-white);
  border-radius: 16px 16px 0 0;
  padding: 10px 16px calc(16px + env(safe-area-inset-bottom));
  box-shadow: 0 -8px 30px rgba(0, 0, 0, 0.18);
  animation: sheetUp 0.18s ease-out;
}
.sheet-close {
  position: absolute;
  top: 12px;
  right: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border: 1px solid var(--c-border);
  background: var(--c-light);
  border-radius: 50%;
  color: var(--c-gray);
  cursor: pointer;
}
.sheet-close:hover { background: var(--c-border); color: var(--c-black); }
@keyframes sheetUp {
  from { transform: translateY(28px); opacity: 0.6; }
  to { transform: none; opacity: 1; }
}
.sheet-handle { width: 40px; height: 4px; border-radius: 999px; background: var(--c-border); margin: 2px auto 12px; }
.sheet-user { display: flex; align-items: center; gap: 10px; padding: 0 40px 12px 0; border-bottom: 1px solid var(--c-border); margin-bottom: 6px; }
.sheet-info { display: flex; flex-direction: column; gap: 6px; padding: 10px 8px 8px; border-bottom: 1px solid var(--c-border); margin-bottom: 4px; }
.sheet-info-row { display: flex; justify-content: space-between; gap: 12px; font-size: 0.82rem; }
.sheet-info-row span { color: var(--c-gray); font-weight: 600; }
.sheet-info-row strong { color: var(--c-black); font-weight: 600; text-align: right; }
.sheet-actions { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.sheet-item {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 13px 10px;
  border: none;
  background: none;
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
  text-align: left;
  border-radius: 10px;
  cursor: pointer;
  font-family: inherit;
  line-height: 1.25;
}
.sheet-item:hover { background: var(--c-light); }
.sheet-item.danger { color: #DC2626; }
.sheet-item.danger:hover { background: #FEF2F2; }

@media (max-width: 768px) {
  .usuarios-page { gap: 16px; }
  .page-header { flex-direction: row; align-items: center; gap: 10px; flex-wrap: nowrap; }
  .page-header > div:first-child { min-width: 0; flex: 1; }
  .page-subtitle { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .page-title { font-size: 1.2rem; }
  .header-actions { width: auto; flex-direction: row; align-items: center; gap: 10px; margin-left: auto; }
  .summary-cards { width: 100%; display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
  .summary-card { padding: 10px; gap: 8px; justify-content: center; }
  .summary-icon { width: 28px; height: 28px; }
  .summary-count { font-size: 1rem; }
  .summary-label { font-size: 0.6rem; white-space: normal; text-align: center; }
  .btn-primary { margin-left: 0; justify-content: center; width: auto; padding: 8px 14px; font-size: 0.78rem; gap: 5px; flex-shrink: 0; }
  .btn-primary svg { width: 13px; height: 13px; }
  .btn-secondary { justify-content: center; padding: 8px 12px; font-size: 0.78rem; gap: 5px; flex-shrink: 0; }
  .btn-secondary svg { width: 13px; height: 13px; }
  .selection-bar { padding: 10px 12px; }
  .selection-bar-actions { width: 100%; }
  .selection-bar-actions .btn-primary,
  .selection-bar-actions .btn-cancel { flex: 1; justify-content: center; padding-top: 9px; padding-bottom: 9px; }

  .filters-bar { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; align-items: end; margin-bottom: 2px; }
  .search-box { grid-column: 1 / -1; max-width: 100%; width: 100%; min-width: 0; }
  .search-icon { left: 10px; width: 15px; height: 15px; }
  .search-input { padding: 7px 30px 7px 32px; font-size: 0.82rem; border-radius: 8px; }
  .clear-btn { right: 4px; width: 22px; height: 22px; }
  .filter-group { width: auto; margin-left: 0; gap: 6px; }
  .filter-field { flex: 1; min-width: 0; width: 100%; gap: 3px; }
  .filter-label { font-size: 0.62rem; }
  .form-select { width: 100%; padding: 7px 26px 7px 10px; font-size: 0.82rem; border-radius: 8px; }

  .table-responsive { -webkit-overflow-scrolling: touch; overflow-x: hidden; }
  .data-table { min-width: 760px; }

  /* La tabla de usuarios se ajusta al ancho de la pantalla: sin scroll horizontal */
  .users-table { min-width: 0; width: 100%; table-layout: fixed; }
  .users-table th,
  .users-table td { padding: 10px 8px; }
  .users-table th { white-space: normal; }
  .users-table td { white-space: normal; }
  .users-table th.col-check { width: 40px; }
  .users-table th.col-kebab { width: 78px; }
  .users-table .col-check { width: 40px; }
  .users-table .user-cell { min-width: 0; gap: 8px; }
  .users-table .user-avatar { width: 30px; height: 30px; border-radius: 8px; font-size: 0.62rem; }
  .users-table .user-meta { min-width: 0; }
  .users-table .user-name {
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
    white-space: normal;
    word-break: break-word;
    line-height: 1.25;
  }
  .users-table .user-email { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
  .users-table .user-cedula { display: block; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }

  /* En móvil solo quedan: checkbox, nombre (con cédula) y ⋮ al extremo derecho */
  .users-table .col-cedula,
  .users-table .col-celular,
  .users-table .col-ubicacion,
  .users-table .col-estado,
  .users-table .col-periodo { display: none; }
  .users-table .col-kebab { display: table-cell; width: 64px; text-align: right; padding-right: 12px; }
  .users-table th.col-kebab { text-align: center; font-size: 0.58rem; line-height: 1.15; padding: 12px 6px; white-space: normal; }
  .users-table .col-actions { display: none; }
  .users-table .kebab-btn {
    display: inline-flex;
    width: 34px;
    height: 34px;
    border: 1px solid var(--c-border);
    background: var(--c-light);
    border-radius: 8px;
  }

  .action-btn { width: 38px; height: 38px; }
  .pagination { flex-wrap: wrap; gap: 6px; }

  .form-grid-modal { grid-template-columns: 1fr; gap: 14px; }

  .form-input { font-size: 16px; }

  .modal-overlay { padding: 10px; }
  .modal-content { max-height: 94vh; border-radius: 14px; }
  .modal-header { padding: 14px 16px; }
  .modal-header h3 { font-size: 0.98rem; }
  .modal-body { padding: 16px; }
  .modal-error { margin: 12px 16px 0; padding: 10px 12px; }
  .policy-box { padding: 12px; gap: 10px; }
  .modal-footer { padding: 14px 16px; flex-direction: column; }
  .modal-footer .btn-cancel,
  .modal-footer .btn-save { width: 100%; justify-content: center; padding: 13px; }
  .delete-modal-body { padding: 24px 16px; }
  .delete-actions { flex-direction: column; }
  .delete-actions .btn-cancel,
  .delete-actions .btn-delete { width: 100%; justify-content: center; padding: 13px; }
}

@media (max-width: 480px) {
  .page-title { font-size: 1.1rem; }
  .summary-count { font-size: 0.95rem; }
  .summary-icon { width: 26px; height: 26px; }
  .filter-group { flex-direction: column; align-items: stretch; }
  .data-table { min-width: 680px; }
  .users-table { min-width: 0; }
  .modal-header h3 { font-size: 0.92rem; }
  .delete-title { font-size: 1rem; }
  .header-actions .btn-secondary .btn-label { display: none; }
}
</style>
