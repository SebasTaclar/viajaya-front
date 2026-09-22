<template>
  <div class="usuarios-page">
    <div class="page-header">
      <div>
        <h1 class="page-title">Usuarios</h1>
        <p class="page-subtitle">{{ filteredUsuarios.length }} usuarios registrados{{ totalPages > 1 ? ` — Página ${currentPage} de ${totalPages}` : '' }}</p>
      </div>
      <div class="header-actions">
        <div class="summary-cards">
          <div class="summary-card">
            <div class="summary-icon activos">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
                <polyline points="22 4 12 14.01 9 11.01"/>
              </svg>
            </div>
            <div class="summary-info">
              <span class="summary-count">{{ usuarios.length }}</span>
              <span class="summary-label">Usuarios</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon admins">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
              </svg>
            </div>
            <div class="summary-info">
              <span class="summary-count">{{ usuarios.filter(u => u.role === 'admin' || u.role === 'superadmin').length }}</span>
              <span class="summary-label">Admins</span>
            </div>
          </div>
          <div class="summary-card">
            <div class="summary-icon clientes">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                <circle cx="9" cy="7" r="4"/>
              </svg>
            </div>
            <div class="summary-info">
              <span class="summary-count">{{ usuarios.filter(u => u.role === 'user').length }}</span>
              <span class="summary-label">Clientes</span>
            </div>
          </div>
        </div>
        <button class="btn-primary" @click="openCreateModal">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
          </svg>
          Crear Usuario
        </button>
      </div>
    </div>

    <!-- Tabs -->
    <div class="view-tabs">
      <button class="view-tab" :class="{ active: activeTab === 'listado' }" @click="activeTab = 'listado'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
          <path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/>
        </svg>
        Listado
      </button>
      <button class="view-tab" :class="{ active: activeTab === 'mensajes' }" @click="activeTab = 'mensajes'">
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
        </svg>
        Mensajes SMS
        <span v-if="!canSendSms" class="tab-lock" title="Privilegio revocado">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
          </svg>
        </span>
      </button>
    </div>

    <!-- LISTADO -->
    <template v-if="activeTab === 'listado'">
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
            <label class="filter-label">Rol</label>
            <select v-model="roleFilter" class="form-select">
              <option value="">Todos</option>
              <option value="admin">Admin</option>
              <option value="user">Cliente</option>
            </select>
          </div>
          <div class="filter-field">
            <label class="filter-label">Recaudo</label>
            <select v-model="periodFilter" class="form-select">
              <option value="">Todas</option>
              <option value="mensual">Mensual</option>
              <option value="quincenal">Quincenal</option>
              <option value="semanal">Semanal</option>
            </select>
          </div>
        </div>
      </div>

      <div class="table-card">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando usuarios...</p>
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
                <th>Nombre completo</th>
                <th>Cédula</th>
                <th>Celular</th>
                <th>Ubicación</th>
                <th>Periodicidad</th>
                <th>Rol</th>
                <th>Consentimiento</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="u in paginatedUsuarios" :key="u.id">
                <td>
                  <div class="user-cell">
                    <div class="user-avatar" :style="{ background: getUserColor(u.id) }">
                      <span>{{ getUserInitials(u.name || 'U') }}</span>
                    </div>
                    <div class="user-meta">
                      <span class="user-name">{{ u.name }}</span>
                      <span class="user-email">{{ u.email || '—' }}</span>
                    </div>
                  </div>
                </td>
                <td>{{ u.cedula }}</td>
                <td>{{ u.celular }}</td>
                <td>{{ u.ubicacion }}</td>
                <td><span class="period-badge">{{ u.periodicidad }}</span></td>
                <td><span class="rol-badge" :class="u.role">{{ roleLabel(u.role) }}</span></td>
                <td>
                  <span v-if="u.consentLey1581" class="consent-ok" title="Ley 1581 — consentimiento registrado">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    Registrado
                  </span>
                  <span v-else class="consent-pending">Pendiente</span>
                </td>
                <td>
                  <div class="actions-cell">
                    <button class="action-btn" title="Editar datos" @click="openEditModal(u)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                        <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                      </svg>
                    </button>
                    <button class="action-btn" title="Enviar SMS" @click="openSmsForUser(u)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                      </svg>
                    </button>
                    <button class="action-btn" title="Cambiar contraseña" @click="openPasswordModal(u)">
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                        <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                      </svg>
                    </button>
                    <button class="action-btn delete-btn" title="Eliminar" @click="deleteUsuario(u.id, u.name)">
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
    </template>

    <!-- MENSAJES SMS -->
    <template v-else>
      <div v-if="!canSendSms" class="sms-privilege-banner">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
        </svg>
        <div>
          <strong>Privilegio de envío revocado</strong>
          <p>El rol Admin no tiene permiso para enviar SMS. Un Super Admin puede restaurarlo desde la lista de usuarios.</p>
        </div>
        <button v-if="currentRole === 'superadmin'" class="btn-restore" @click="canSendSms = true">Restaurar privilegio</button>
      </div>

      <div class="sms-layout">
        <!-- Compose -->
        <div class="sms-compose card-panel">
          <div class="panel-title">
            <h3>Enviar mensaje SMS</h3>
            <span class="panel-sub">Según periodicidad requerida</span>
          </div>

          <div class="form-group">
            <label>Destinatario</label>
            <div class="sms-target-tabs">
              <button class="target-tab" :class="{ active: smsForm.targetType === 'persona' }" @click="smsForm.targetType = 'persona'; smsForm.userId = null">
                Persona
              </button>
              <button class="target-tab" :class="{ active: smsForm.targetType === 'grupo' }" @click="smsForm.targetType = 'grupo'">
                Grupo
              </button>
              <button class="target-tab" :class="{ active: smsForm.targetType === 'todos' }" @click="smsForm.targetType = 'todos'">
                Todos
              </button>
            </div>
          </div>

          <div v-if="smsForm.targetType === 'persona'" class="form-group">
            <label>Usuario *</label>
            <select v-model="smsForm.userId" class="form-input">
              <option :value="null" disabled>Seleccionar usuario</option>
              <option v-for="u in usuarios" :key="u.id" :value="u.id">{{ u.name }} — {{ u.celular }}</option>
            </select>
          </div>

          <div v-if="smsForm.targetType === 'grupo'" class="form-group">
            <label>Grupo *</label>
            <select v-model="smsForm.groupId" class="form-input">
              <option :value="null" disabled>Seleccionar grupo</option>
              <option v-for="g in mockGroups" :key="g.id" :value="g.id">{{ g.name }} ({{ g.count }} usuarios)</option>
            </select>
          </div>

          <div v-if="smsForm.targetType !== 'persona'" class="form-group">
            <label>Periodicidad</label>
            <select v-model="smsForm.periodicidad" class="form-input">
              <option value="unica">Única vez</option>
              <option value="diaria">Diaria</option>
              <option value="semanal">Semanal</option>
              <option value="quincenal">Quincenal</option>
              <option value="mensual">Mensual</option>
            </select>
          </div>

          <div class="form-group">
            <label>Mensaje *</label>
            <textarea v-model="smsForm.message" class="form-input sms-textarea" rows="4" maxlength="160" placeholder="Escriba el mensaje (máx. 160 caracteres)..."></textarea>
            <span class="char-count">{{ smsForm.message.length }}/160</span>
          </div>

          <div v-if="smsError" class="modal-error sms-error">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <circle cx="12" cy="12" r="10"/><line x1="15" y1="9" x2="9" y2="15"/><line x1="9" y1="9" x2="15" y2="15"/>
            </svg>
            {{ smsError }}
          </div>

          <div class="sms-summary" v-if="smsRecipientCount > 0">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
            </svg>
            Se enviará a <strong>{{ smsRecipientCount }}</strong> destinatario{{ smsRecipientCount !== 1 ? 's' : '' }}
          </div>

          <button class="btn-primary btn-send" :disabled="smsSending || !canSendSms" @click="handleSendSms">
            <span v-if="smsSending" class="btn-spinner"></span>
            <svg v-else width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="22" y1="2" x2="11" y2="13"/><polygon points="22 2 15 22 11 13 2 9 22 2"/>
            </svg>
            {{ smsSending ? 'Enviando...' : 'Enviar SMS' }}
          </button>
        </div>

        <!-- Historial -->
        <div class="sms-history card-panel">
          <div class="panel-title history-header">
            <div>
              <h3>Historial de envíos</h3>
              <span class="panel-sub">{{ filteredHistory.length }} registros</span>
            </div>
            <div class="history-controls">
              <select v-model="historyFilter" class="form-select history-select">
                <option value="">Todos</option>
                <option value="persona">Persona</option>
                <option value="grupo">Grupo</option>
                <option value="todos">Todos</option>
              </select>
              <label v-if="currentRole === 'superadmin'" class="privilege-toggle" title="Suprimir/restore privilegio de envío al rol Admin">
                <input type="checkbox" :checked="!adminSmsPrivilege" @change="toggleAdminSmsPrivilege" />
                <span>Revocar SMS a Admin</span>
              </label>
            </div>
          </div>

          <div v-if="filteredHistory.length === 0" class="empty-state history-empty">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
            <p>No hay envíos registrados</p>
          </div>

          <div v-else class="history-list">
            <div v-for="h in filteredHistory" :key="h.id" class="history-item">
              <div class="history-icon" :class="h.targetType">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="history-body">
                <div class="history-top">
                  <span class="history-target">{{ h.targetLabel }}</span>
                  <span class="history-type-badge" :class="h.targetType">{{ typeLabel(h.targetType) }}</span>
                </div>
                <p class="history-message">{{ h.message }}</p>
                <div class="history-meta">
                  <span>{{ h.date }}</span>
                  <span>·</span>
                  <span>{{ h.recipients }} destinatario{{ h.recipients !== 1 ? 's' : '' }}</span>
                  <span v-if="h.periodicidad && h.periodicidad !== 'unica'">·</span>
                  <span v-if="h.periodicidad && h.periodicidad !== 'unica'" class="history-period">Recurrencia: {{ h.periodicidad }}</span>
                  <span>·</span>
                  <span>Por: {{ h.sentBy }}</span>
                </div>
              </div>
              <button class="action-btn delete-btn" title="Suprimir del historial" @click="deleteHistory(h.id)">
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>
    </template>

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
            <div class="form-group form-group-full">
              <label>Rol *</label>
              <select v-model="createForm.role" class="form-input">
                <option value="user">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>

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
              <label>Periodicidad de recaudo *</label>
              <select v-model="createForm.periodicidad" class="form-input" :class="{ 'field-error': createSubmitted && !createForm.periodicidad }">
                <option value="" disabled>Seleccionar</option>
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
              <label>Contraseña *</label>
              <div class="password-input-wrap">
                <input v-model="createForm.password" :type="showPassword ? 'text' : 'password'" class="form-input" :class="{ 'field-error': createSubmitted && !createForm.password }" placeholder="Mínimo 6 caracteres" />
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

            <div class="form-group form-group-full">
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
              <label>Rol</label>
              <select v-model="editForm.role" class="form-input">
                <option value="user">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>

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
              <label>Ubicación *</label>
              <input v-model="editForm.ubicacion" type="text" class="form-input" placeholder="Ciudad / Departamento" />
            </div>

            <div class="form-group">
              <label>Periodicidad de recaudo *</label>
              <select v-model="editForm.periodicidad" class="form-input">
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

    <!-- Change Password Modal -->
    <div v-if="showPasswordModal" class="modal-overlay" @click.self="showPasswordModal = false">
      <div class="modal-content modal-sm" @click.stop>
        <div class="modal-header">
          <h3>Cambiar Contraseña</h3>
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
          <p class="modal-info">Cambiar contraseña de <strong>{{ passwordUserName }}</strong></p>
          <div class="form-group">
            <label>Nueva contraseña *</label>
            <div class="password-input-wrap">
              <input v-model="passwordForm.newPassword" :type="showPasswordModal2 ? 'text' : 'password'" class="form-input" :class="{ 'field-error': passwordSubmitted && !passwordForm.newPassword }" placeholder="Mínimo 6 caracteres" />
              <button type="button" class="btn-toggle-password" @click="showPasswordModal2 = !showPasswordModal2">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                </svg>
              </button>
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="showPasswordModal = false">Cancelar</button>
          <button class="btn-save" :disabled="saving" @click="handleChangePassword">
            <span v-if="saving" class="btn-spinner"></span>
            {{ saving ? 'Guardando...' : 'Cambiar Contraseña' }}
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
          <div class="delete-actions">
            <button class="btn-cancel" @click="showDeleteModal = false">Cancelar</button>
            <button class="btn-delete" @click="confirmDelete">Eliminar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { authService } from '@/services/api/authService'

interface MockUser {
  id: number
  name: string
  email: string
  cedula: string
  celular: string
  ubicacion: string
  periodicidad: 'mensual' | 'quincenal' | 'semanal'
  role: 'user' | 'admin' | 'superadmin'
  consentLey1581: boolean
  consentDate?: string
}

interface SmsHistoryItem {
  id: number
  targetType: 'persona' | 'grupo' | 'todos'
  targetLabel: string
  message: string
  recipients: number
  periodicidad: string
  date: string
  sentBy: string
}

const currentRole = ref(authService.getUserRole() || 'admin')
const currentUser = authService.getCurrentUser()
const canSendSms = ref(true)
const adminSmsPrivilege = ref(true)
const activeTab = ref<'listado' | 'mensajes'>('listado')

const usuarios = ref<MockUser[]>([
  { id: 1, name: 'María Fernanda López', email: 'maria.lopez@correo.com', cedula: '1032456789', celular: '300 123 4567', ubicacion: 'Bogotá, Cundinamarca', periodicidad: 'mensual', role: 'user', consentLey1581: true, consentDate: '15/03/2026' },
  { id: 2, name: 'Carlos Andrés Gómez', email: 'carlos.gomez@correo.com', cedula: '80123456', celular: '310 987 6543', ubicacion: 'Medellín, Antioquia', periodicidad: 'quincenal', role: 'user', consentLey1581: true, consentDate: '02/04/2026' },
  { id: 3, name: 'Laura Valentina Ruiz', email: 'laura.ruiz@correo.com', cedula: '1098765432', celular: '320 456 7890', ubicacion: 'Cali, Valle del Cauca', periodicidad: 'semanal', role: 'user', consentLey1581: true, consentDate: '20/04/2026' },
  { id: 4, name: 'Jorge Eduardo Martínez', email: 'jorge.martinez@correo.com', cedula: '79876543', celular: '315 222 3344', ubicacion: 'Barranquilla, Atlántico', periodicidad: 'mensual', role: 'user', consentLey1581: false },
  { id: 5, name: 'Ana Sofía Hernández', email: 'ana.hernandez@correo.com', cedula: '1122334455', celular: '301 555 6677', ubicacion: 'Bucaramanga, Santander', periodicidad: 'quincenal', role: 'user', consentLey1581: true, consentDate: '10/05/2026' },
  { id: 6, name: 'Pedro Pablo Díaz', email: 'pedro.diaz@correo.com', cedula: '98765432', celular: '318 888 9900', ubicacion: 'Santa Marta, Magdalena', periodicidad: 'mensual', role: 'user', consentLey1581: true, consentDate: '28/05/2026' },
  { id: 7, name: 'Camila Restrepo', email: 'camila.restrepo@viajaya.com', cedula: '1055667788', celular: '312 111 2233', ubicacion: 'Bogotá, Cundinamarca', periodicidad: 'mensual', role: 'admin', consentLey1581: true, consentDate: '01/01/2026' },
  { id: 8, name: 'Diego Alberto Sánchez', email: 'diego.sanchez@viajaya.com', cedula: '81112223', celular: '304 444 5566', ubicacion: 'Medellín, Antioquia', periodicidad: 'quincenal', role: 'admin', consentLey1581: true, consentDate: '15/01/2026' },
  { id: 9, name: 'Valentina Ocampo', email: 'val.ocampo@correo.com', cedula: '1066778899', celular: '316 777 8899', ubicacion: 'Pereira, Risaralda', periodicidad: 'semanal', role: 'user', consentLey1581: true, consentDate: '03/06/2026' },
  { id: 10, name: 'Andrés Felipe Castro', email: 'andres.castro@correo.com', cedula: '72223334', celular: '319 000 1122', ubicacion: 'Manizales, Caldas', periodicidad: 'mensual', role: 'user', consentLey1581: false },
])

const mockGroups = [
  { id: 1, name: 'Recaudo mensual', count: 5 },
  { id: 2, name: 'Recaudo quincenal', count: 3 },
  { id: 3, name: 'Bogotá y alrededores', count: 3 },
  { id: 4, name: 'Clientes sin consentimiento', count: 2 },
]

const smsHistory = ref<SmsHistoryItem[]>([
  { id: 1, targetType: 'todos', targetLabel: 'Todos los usuarios', message: 'Recordatorio: mañana es fecha de pago del recibo de recaudo. Gracias por su puntualidad.', recipients: 8, periodicidad: 'unica', date: '18/06/2026 09:15', sentBy: 'Camila Restrepo' },
  { id: 2, targetType: 'grupo', targetLabel: 'Recaudo mensual', message: 'Su cuota mensual vence el 30 de junio. Consulte el portal para más detalles.', recipients: 5, periodicidad: 'mensual', date: '16/06/2026 14:30', sentBy: 'Camila Restrepo' },
  { id: 3, targetType: 'persona', targetLabel: 'María Fernanda López', message: 'Hola María, confirmamos su pago del 15. ¡Gracias!', recipients: 1, periodicidad: 'unica', date: '15/06/2026 11:02', sentBy: 'Diego Alberto Sánchez' },
  { id: 4, targetType: 'grupo', targetLabel: 'Bogotá y alrededores', message: 'Nuevo punto de recaudo disponible en Chapinero. Atención de 8am a 5pm.', recipients: 3, periodicidad: 'quincenal', date: '12/06/2026 08:45', sentBy: 'Camila Restrepo' },
])

const loading = ref(false)
const searchTerm = ref('')
const roleFilter = ref('')
const periodFilter = ref('')
const currentPage = ref(1)
const perPage = 20

const showCreateModal = ref(false)
const showPasswordModal = ref(false)
const showEditModal = ref(false)
const showDeleteModal = ref(false)
const saving = ref(false)
const formError = ref('')
const createSubmitted = ref(false)
const passwordSubmitted = ref(false)
const showPassword = ref(false)
const showPasswordModal2 = ref(false)

const deleteId = ref(0)
const deleteName = ref('')
const passwordUserId = ref(0)
const passwordUserName = ref('')
const editUserId = ref(0)

const createForm = ref({
  role: 'user' as 'user' | 'admin',
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
  role: 'user' as 'user' | 'admin',
  name: '',
  cedula: '',
  celular: '',
  ubicacion: '',
  periodicidad: 'mensual' as MockUser['periodicidad'],
  email: '',
  consentLey1581: false,
})

const passwordForm = ref({ newPassword: '' })

const smsForm = ref({
  targetType: 'persona' as 'persona' | 'grupo' | 'todos',
  userId: null as number | null,
  groupId: null as number | null,
  periodicidad: 'unica',
  message: '',
})
const smsSending = ref(false)
const smsError = ref('')
const historyFilter = ref('')

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
  if (roleFilter.value) {
    result = result.filter(u => u.role === roleFilter.value)
  }
  if (periodFilter.value) {
    result = result.filter(u => u.periodicidad === periodFilter.value)
  }
  return result
})

const totalPages = computed(() => Math.ceil(filteredUsuarios.value.length / perPage))
const paginatedUsuarios = computed(() => {
  const start = (currentPage.value - 1) * perPage
  return filteredUsuarios.value.slice(start, start + perPage)
})

const smsRecipientCount = computed(() => {
  if (smsForm.value.targetType === 'persona') return smsForm.value.userId ? 1 : 0
  if (smsForm.value.targetType === 'grupo') {
    const g = mockGroups.find(x => x.id === smsForm.value.groupId)
    return g ? g.count : 0
  }
  return usuarios.value.length
})

const filteredHistory = computed(() => {
  if (!historyFilter.value) return smsHistory.value
  return smsHistory.value.filter(h => h.targetType === historyFilter.value)
})

watch([searchTerm, roleFilter, periodFilter], () => { currentPage.value = 1 })

function roleLabel(role: string): string {
  if (role === 'admin') return 'Admin'
  if (role === 'superadmin') return 'Super Admin'
  return 'Cliente'
}

function typeLabel(t: string): string {
  if (t === 'persona') return 'Persona'
  if (t === 'grupo') return 'Grupo'
  return 'Todos'
}

function getUserInitials(name: string): string {
  return name.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase()
}

function getUserColor(id: number): string {
  const colors = ['#0E3570', '#16C2CA', '#E8483F', '#C89B2D', '#6366F1', '#10B981', '#F59E0B', '#8B5CF6']
  return colors[id % colors.length]
}

function openCreateModal() {
  createForm.value = {
    role: 'user',
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
    role: u.role === 'admin' || u.role === 'superadmin' ? 'admin' : 'user',
    name: u.name,
    cedula: u.cedula,
    celular: u.celular,
    ubicacion: u.ubicacion,
    periodicidad: u.periodicidad,
    email: u.email,
    consentLey1581: u.consentLey1581,
  }
  formError.value = ''
  showEditModal.value = true
}

function openPasswordModal(u: MockUser) {
  passwordUserId.value = u.id
  passwordUserName.value = u.name
  passwordForm.value = { newPassword: '' }
  formError.value = ''
  passwordSubmitted.value = false
  showPasswordModal2.value = false
  showPasswordModal.value = true
}

function handleCreate() {
  formError.value = ''
  createSubmitted.value = true
  const f = createForm.value

  if (!f.name.trim()) { formError.value = 'El nombre completo es obligatorio.'; return }
  if (!f.cedula.trim()) { formError.value = 'La cédula es obligatoria.'; return }
  if (!f.celular.trim()) { formError.value = 'El celular es obligatorio.'; return }
  if (!f.ubicacion.trim()) { formError.value = 'La ubicación es obligatoria.'; return }
  if (!f.periodicidad) { formError.value = 'La periodicidad de recaudo es obligatoria.'; return }
  if (!f.password || f.password.length < 6) { formError.value = 'La contraseña debe tener al menos 6 caracteres.'; return }
  if (!f.acceptPolicy) {
    formError.value = 'Debe aceptar la Política de tratamiento de datos personales (Ley 1581) para crear el usuario.'
    return
  }

  saving.value = true
  setTimeout(() => {
    const nextId = Math.max(...usuarios.value.map(u => u.id), 0) + 1
    usuarios.value.unshift({
      id: nextId,
      name: f.name.trim(),
      email: f.email.trim() || `${f.cedula}@mock.com`,
      cedula: f.cedula.trim(),
      celular: f.celular.trim(),
      ubicacion: f.ubicacion.trim(),
      periodicidad: f.periodicidad as MockUser['periodicidad'],
      role: f.role,
      consentLey1581: true,
      consentDate: new Date().toLocaleDateString('es-CO'),
    })
    saving.value = false
    showCreateModal.value = false
  }, 500)
}

function handleUpdate() {
  formError.value = ''
  const f = editForm.value
  if (!f.name.trim() || !f.cedula.trim() || !f.celular.trim() || !f.ubicacion.trim()) {
    formError.value = 'Complete los campos obligatorios.'
    return
  }
  saving.value = true
  setTimeout(() => {
    const u = usuarios.value.find(x => x.id === editUserId.value)
    if (u) {
      u.name = f.name.trim()
      u.cedula = f.cedula.trim()
      u.celular = f.celular.trim()
      u.ubicacion = f.ubicacion.trim()
      u.periodicidad = f.periodicidad
      u.email = f.email.trim()
      u.role = f.role
      u.consentLey1581 = f.consentLey1581
    }
    saving.value = false
    showEditModal.value = false
  }, 400)
}

function handleChangePassword() {
  formError.value = ''
  passwordSubmitted.value = true
  if (!passwordForm.value.newPassword || passwordForm.value.newPassword.length < 6) {
    formError.value = 'La contraseña debe tener al menos 6 caracteres.'
    return
  }
  saving.value = true
  setTimeout(() => {
    saving.value = false
    showPasswordModal.value = false
  }, 400)
}

function deleteUsuario(id: number, name: string) {
  deleteId.value = id
  deleteName.value = name
  showDeleteModal.value = true
}

function confirmDelete() {
  usuarios.value = usuarios.value.filter(u => u.id !== deleteId.value)
  showDeleteModal.value = false
}

function openSmsForUser(u: MockUser) {
  activeTab.value = 'mensajes'
  smsForm.value.targetType = 'persona'
  smsForm.value.userId = u.id
  smsForm.value.message = ''
  smsError.value = ''
}

function handleSendSms() {
  smsError.value = ''
  if (!canSendSms.value) {
    smsError.value = 'No tiene privilegio para enviar SMS.'
    return
  }
  if (!smsForm.value.message.trim()) {
    smsError.value = 'El mensaje es obligatorio.'
    return
  }
  if (smsForm.value.targetType === 'persona' && !smsForm.value.userId) {
    smsError.value = 'Seleccione el usuario destinatario.'
    return
  }
  if (smsForm.value.targetType === 'grupo' && !smsForm.value.groupId) {
    smsError.value = 'Seleccione el grupo destinatario.'
    return
  }

  smsSending.value = true
  setTimeout(() => {
    const count = smsRecipientCount.value
    let label = 'Todos los usuarios'
    if (smsForm.value.targetType === 'persona') {
      label = usuarios.value.find(u => u.id === smsForm.value.userId)?.name || 'Persona'
    } else if (smsForm.value.targetType === 'grupo') {
      label = mockGroups.find(g => g.id === smsForm.value.groupId)?.name || 'Grupo'
    }

    smsHistory.value.unshift({
      id: Date.now(),
      targetType: smsForm.value.targetType,
      targetLabel: label,
      message: smsForm.value.message.trim(),
      recipients: count,
      periodicidad: smsForm.value.periodicidad,
      date: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
      sentBy: currentUser?.name || 'Admin',
    })

    smsForm.value.message = ''
    smsForm.value.userId = null
    smsForm.value.groupId = null
    smsForm.value.periodicidad = 'unica'
    smsSending.value = false
  }, 600)
}

function deleteHistory(id: number) {
  smsHistory.value = smsHistory.value.filter(h => h.id !== id)
}

function toggleAdminSmsPrivilege() {
  adminSmsPrivilege.value = !adminSmsPrivilege.value
  if (currentRole.value === 'admin') {
    canSendSms.value = adminSmsPrivilege.value
  }
}

onMounted(() => {
  if (currentRole.value === 'admin' && !adminSmsPrivilege.value) {
    canSendSms.value = false
  }
})
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
.summary-icon.admins { background: #DBEAFE; color: #2563EB; }
.summary-icon.clientes { background: #FEF3C7; color: #D97706; }
.summary-info { display: flex; flex-direction: column; }
.summary-count { font-size: 1.1rem; font-weight: 700; color: var(--c-black); line-height: 1; }
.summary-label { font-size: 0.68rem; color: var(--c-gray); margin-top: 2px; white-space: nowrap; }

.view-tabs { display: flex; gap: 6px; border-bottom: 1px solid var(--c-border); padding-bottom: 0; }
.view-tab {
  display: inline-flex; align-items: center; gap: 8px;
  padding: 10px 16px; border: none; background: none;
  font-size: 0.88rem; font-weight: 600; color: var(--c-gray);
  cursor: pointer; border-bottom: 2px solid transparent;
  margin-bottom: -1px; transition: all 0.15s; font-family: inherit;
}
.view-tab:hover { color: #0E3570; }
.view-tab.active { color: #0E3570; border-bottom-color: #16C2CA; }
.tab-lock { color: #E8483F; display: inline-flex; }

.filters-bar { display: flex; flex-direction: column; gap: 10px; }
.search-box { position: relative; max-width: 420px; }
.search-icon { position: absolute; left: 14px; top: 50%; transform: translateY(-50%); color: var(--c-gray-light); pointer-events: none; }
.search-input { width: 100%; padding: 10px 14px 10px 42px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: all 0.2s; box-sizing: border-box; }
.search-input:focus { border-color: #0E3570; box-shadow: 0 0 0 3px rgba(14, 53, 112, 0.12); }
.search-input::placeholder { color: var(--c-gray-light); }
.filter-group { display: flex; gap: 8px; align-items: flex-end; flex-wrap: wrap; }
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
.data-table tr:hover td { background: rgba(249, 250, 251, 0.5); }

.user-cell { display: flex; align-items: center; gap: 10px; }
.user-avatar { display: flex; align-items: center; justify-content: center; width: 34px; height: 34px; border-radius: 8px; color: white; font-size: 0.7rem; font-weight: 700; flex-shrink: 0; }
.user-meta { display: flex; flex-direction: column; min-width: 0; }
.user-name { font-weight: 600; font-size: 0.86rem; }
.user-email { font-size: 0.72rem; color: var(--c-gray); }

.rol-badge { display: inline-block; padding: 3px 10px; border-radius: 20px; font-size: 0.74rem; font-weight: 600; }
.rol-badge.admin { background: #EFF6FF; color: #2563EB; }
.rol-badge.superadmin { background: #F5F3FF; color: #7C3AED; }
.rol-badge.user { background: #F0FDF4; color: #16A34A; }

.period-badge { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 0.74rem; font-weight: 600; background: #EEF2FF; color: #4338CA; text-transform: capitalize; }

.consent-ok { display: inline-flex; align-items: center; gap: 4px; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; background: #DCFCE7; color: #16A34A; }
.consent-pending { display: inline-block; padding: 3px 8px; border-radius: 6px; font-size: 0.72rem; font-weight: 600; background: #FEF3C7; color: #D97706; }

.loading-state, .empty-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 48px; gap: 12px; color: var(--c-gray); }
.spinner { width: 32px; height: 32px; border: 3px solid var(--c-border); border-top-color: #0E3570; border-radius: 50%; animation: spin 0.8s linear infinite; }
@keyframes spin { to { transform: rotate(360deg); } }

.actions-cell { display: flex; gap: 4px; }
.action-btn { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: var(--c-gray); border-radius: 6px; cursor: pointer; transition: all 0.15s; }
.action-btn:hover { background: var(--c-light); color: #0E3570; }
.action-btn.delete-btn:hover { background: rgba(232, 72, 63, 0.1); color: #E8483F; }

.pagination { display: flex; align-items: center; justify-content: center; gap: 4px; padding: 16px; border-top: 1px solid var(--c-border); }
.page-btn { display: flex; align-items: center; justify-content: center; min-width: 32px; height: 32px; padding: 0 8px; border: 1px solid var(--c-border); border-radius: 6px; background: var(--c-white); color: var(--c-dark); font-size: 0.82rem; cursor: pointer; transition: all 0.15s; }
.page-btn:hover:not(:disabled):not(.active) { border-color: #0E3570; color: #0E3570; }
.page-btn.active { background: #0E3570; color: white; border-color: #0E3570; }
.page-btn:disabled { opacity: 0.4; cursor: not-allowed; }
.page-dots { color: var(--c-gray); font-size: 0.85rem; padding: 0 4px; }

.btn-primary { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #0E3570; color: white; border: none; border-radius: 10px; font-size: 0.88rem; font-weight: 600; cursor: pointer; transition: all 0.2s; white-space: nowrap; font-family: inherit; }
.btn-primary:hover:not(:disabled) { background: #0B2A5A; }
.btn-primary:disabled { opacity: 0.55; cursor: not-allowed; }

/* SMS layout */
.sms-privilege-banner {
  display: flex; align-items: center; gap: 14px;
  padding: 14px 18px; border-radius: 12px;
  background: #FEF2F2; border: 1px solid #FECACA; color: #B91C1C;
}
.sms-privilege-banner p { margin: 2px 0 0; font-size: 0.8rem; opacity: 0.9; }
.btn-restore { margin-left: auto; padding: 8px 14px; border: 1px solid #B91C1C; background: white; color: #B91C1C; border-radius: 8px; font-size: 0.8rem; font-weight: 600; cursor: pointer; white-space: nowrap; }
.btn-restore:hover { background: #FEF2F2; }

.sms-layout { display: grid; grid-template-columns: 1fr 1.2fr; gap: 20px; align-items: start; }
.card-panel { background: var(--c-white); border: 1px solid var(--c-border); border-radius: 14px; padding: 22px; }
.panel-title { margin-bottom: 18px; }
.panel-title h3 { margin: 0; font-size: 1rem; font-weight: 700; color: var(--c-black); }
.panel-sub { font-size: 0.78rem; color: var(--c-gray); }

.sms-target-tabs { display: flex; gap: 6px; background: var(--c-light); padding: 4px; border-radius: 10px; }
.target-tab {
  flex: 1; padding: 8px 10px; border: none; background: transparent;
  border-radius: 8px; font-size: 0.82rem; font-weight: 600; color: var(--c-gray);
  cursor: pointer; transition: all 0.15s; font-family: inherit;
}
.target-tab.active { background: white; color: #0E3570; box-shadow: 0 1px 4px rgba(0,0,0,0.08); }

.form-group { display: flex; flex-direction: column; gap: 6px; margin-bottom: 14px; position: relative; }
.form-group label { font-size: 0.76rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; }
.form-input { padding: 11px 14px; border: 1.5px solid #d1d5db; border-radius: 10px; font-size: 0.88rem; font-family: inherit; background: var(--c-white); color: var(--c-black); outline: none; transition: all 0.2s; width: 100%; box-sizing: border-box; }
.form-input:focus { border-color: #0E3570; box-shadow: 0 0 0 3px rgba(14, 53, 112, 0.12); }
.field-error { border-color: #dc2626 !important; box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.1) !important; }
.sms-textarea { resize: vertical; min-height: 90px; }
.char-count { align-self: flex-end; font-size: 0.72rem; color: var(--c-gray); }

.sms-error { margin: 0 0 12px; padding: 10px 12px; display: flex; align-items: center; gap: 8px; background: #FEF2F2; color: #DC2626; border-radius: 8px; font-size: 0.82rem; border: 1px solid #FECACA; }

.sms-summary {
  display: flex; align-items: center; gap: 8px;
  padding: 10px 12px; margin-bottom: 14px;
  background: #EFF6FF; border: 1px solid #BFDBFE;
  border-radius: 8px; font-size: 0.82rem; color: #1E40AF;
}
.btn-send { width: 100%; justify-content: center; }

.history-header { display: flex; justify-content: space-between; align-items: flex-start; gap: 12px; flex-wrap: wrap; }
.history-controls { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
.history-select { width: auto; padding: 8px 28px 8px 12px; font-size: 0.8rem; }
.privilege-toggle { display: inline-flex; align-items: center; gap: 6px; font-size: 0.76rem; font-weight: 600; color: #B91C1C; cursor: pointer; text-transform: none; letter-spacing: 0; }
.privilege-toggle input { accent-color: #E8483F; }

.history-list { display: flex; flex-direction: column; gap: 10px; max-height: 520px; overflow-y: auto; }
.history-item {
  display: flex; align-items: flex-start; gap: 12px;
  padding: 12px 14px; border: 1px solid var(--c-border);
  border-radius: 10px; background: #FAFAF8; transition: border-color 0.15s;
}
.history-item:hover { border-color: #c7d0de; }
.history-icon {
  display: flex; align-items: center; justify-content: center;
  width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
}
.history-icon.persona { background: #DBEAFE; color: #2563EB; }
.history-icon.grupo { background: #FEF3C7; color: #D97706; }
.history-icon.todos { background: #DCFCE7; color: #16A34A; }
.history-body { flex: 1; min-width: 0; }
.history-top { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
.history-target { font-weight: 700; font-size: 0.86rem; color: var(--c-black); }
.history-type-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.68rem; font-weight: 700; text-transform: uppercase; letter-spacing: 0.04em; }
.history-type-badge.persona { background: #EFF6FF; color: #2563EB; }
.history-type-badge.grupo { background: #FFFBEB; color: #B45309; }
.history-type-badge.todos { background: #F0FDF4; color: #16A34A; }
.history-message { margin: 6px 0; font-size: 0.82rem; color: #374151; line-height: 1.4; word-break: break-word; }
.history-meta { display: flex; flex-wrap: wrap; gap: 4px; font-size: 0.72rem; color: var(--c-gray); }
.history-period { color: #4338CA; font-weight: 600; }
.history-empty { padding: 36px; }

/* Modals */
.modal-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.4); display: flex; align-items: center; justify-content: center; z-index: 1000; padding: 20px; backdrop-filter: blur(4px); }
.modal-content { background: var(--c-white); border-radius: 16px; width: 100%; max-width: 640px; max-height: 92vh; overflow-y: auto; box-shadow: 0 20px 60px rgba(0,0,0,0.15); border: 1px solid #e5e7eb; }
.modal-content.modal-sm { max-width: 480px; }
.modal-content.modal-md { max-width: 580px; }
.modal-header { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid #e5e7eb; background: #0E3570; border-radius: 16px 16px 0 0; }
.modal-header h3 { font-size: 1.05rem; font-weight: 700; color: white; margin: 0; }
.modal-close { display: flex; align-items: center; justify-content: center; width: 32px; height: 32px; border: none; background: none; color: white; border-radius: 8px; cursor: pointer; transition: all 0.15s; }
.modal-close:hover { background: rgba(255,255,255,0.2); }
.modal-error { display: flex; align-items: center; gap: 8px; padding: 12px 16px; margin: 16px 24px 0; background: #FEF2F2; color: #DC2626; border-radius: 8px; font-size: 0.85rem; border: 1px solid #FECACA; }
.modal-body { padding: 24px; background: #f1f2f3; }
.modal-info { margin: 0 0 16px; font-size: 0.88rem; color: #374151; }
.required-note {
  font-size: 0.75rem; color: #6B7280; margin-bottom: 16px;
  padding: 8px 12px; background: #EFF6FF; border-radius: 8px;
  border: 1px solid #BFDBFE;
}
.form-grid-modal { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.form-group-full { grid-column: 1 / -1; }
.form-group label { font-size: 0.76rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.3px; }

.policy-box {
  display: flex; gap: 12px; align-items: flex-start;
  padding: 14px; background: #FFFBEB; border: 1.5px solid #FCD34D;
  border-radius: 10px; cursor: pointer; text-transform: none !important;
  letter-spacing: 0 !important;
}
.policy-box input[type="checkbox"] { margin-top: 3px; accent-color: #0E3570; width: 16px; height: 16px; flex-shrink: 0; }
.policy-box .policy-text strong { display: block; font-size: 0.82rem; color: #92400E; margin-bottom: 6px; font-weight: 700; }
.policy-box .policy-text p { margin: 0; font-size: 0.76rem; color: #78350F; line-height: 1.45; }
.policy-box-compact { background: #F0FDF4; border-color: #86EFAC; }
.policy-box-compact .policy-text p { color: #166534; }

.password-input-wrap { position: relative; }
.password-input-wrap .form-input { padding-right: 40px; }
.btn-toggle-password {
  position: absolute; right: 8px; top: 50%; transform: translateY(-50%);
  display: flex; align-items: center; justify-content: center;
  width: 28px; height: 28px; border: none; background: none;
  color: var(--c-gray); cursor: pointer; border-radius: 6px;
}
.btn-toggle-password:hover { background: #f3f4f6; color: var(--c-black); }

.modal-footer { display: flex; justify-content: flex-end; gap: 10px; padding: 16px 24px; border-top: 1px solid #e5e7eb; background: #EFF6FF; border-radius: 0 0 16px 16px; }
.btn-cancel { padding: 10px 20px; border: 1.5px solid #d1d5db; border-radius: 10px; background: var(--c-white); color: #374151; font-size: 0.85rem; font-weight: 500; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-cancel:hover { background: #f9fafb; border-color: #9ca3af; }
.btn-save { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; background: #16C2CA; color: white; border: none; border-radius: 10px; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.btn-save:hover { opacity: 0.9; transform: translateY(-1px); }
.btn-save:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }
.btn-spinner { width: 14px; height: 14px; border: 2px solid rgba(255,255,255,0.3); border-top-color: white; border-radius: 50%; animation: spin 0.8s linear infinite; }

.delete-modal-body { padding: 32px 28px; text-align: center; }
.delete-icon { color: #E8483F; margin-bottom: 12px; }
.delete-title { font-size: 1.1rem; font-weight: 700; color: var(--c-black); margin: 0 0 8px; }
.delete-text { font-size: 0.88rem; color: var(--c-gray); margin: 0 0 24px; line-height: 1.5; }
.delete-actions { display: flex; gap: 10px; justify-content: center; }
.delete-actions .btn-delete { padding: 10px 20px; border: none; border-radius: 10px; background: #E8483F; color: white; font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: all 0.2s; font-family: inherit; }
.delete-actions .btn-delete:hover { background: #c93a32; transform: translateY(-1px); }

@media (max-width: 1024px) {
  .sms-layout { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .page-header { flex-direction: column; align-items: flex-start; }
  .header-actions { width: 100%; flex-direction: column; align-items: stretch; }
  .summary-cards { width: 100%; }
  .btn-primary { margin-left: 0; justify-content: center; }
  .form-grid-modal { grid-template-columns: 1fr; }
  .view-tabs { overflow-x: auto; }
  .history-header { flex-direction: column; }
}
</style>
