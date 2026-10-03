<template>
  <div class="admin-layout" :class="{ 'sidebar-open': sidebarOpen }">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header">
        <router-link to="/" class="sidebar-logo">
          <img src="/images/Logo.png" alt="Viaja Ya" class="logo-img" />
        </router-link>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: currentSection === item.id }"
          @click="setSection(item.id)"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
          <svg v-if="'route' in item && item.route" class="external-icon" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </button>
      </nav>

      <div class="sidebar-footer">
        <button class="nav-item logout-btn" @click="handleLogout">
          <span class="nav-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
              <polyline points="16 17 21 12 16 7"/>
              <line x1="21" y1="12" x2="9" y2="12"/>
            </svg>
          </span>
          <span class="nav-label">Cerrar sesión</span>
        </button>
      </div>
    </aside>

    <!-- Sidebar overlay (mobile) -->
    <div class="sidebar-overlay" @click="sidebarOpen = false"></div>

    <!-- Main Area -->
    <div class="main-area">
      <!-- Topbar -->
      <header class="topbar">
        <button class="menu-toggle" @click="sidebarOpen = !sidebarOpen">
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="3" y1="6" x2="21" y2="6"/>
            <line x1="3" y1="12" x2="21" y2="12"/>
            <line x1="3" y1="18" x2="21" y2="18"/>
          </svg>
        </button>

        <router-link to="/" class="home-btn" title="Volver al inicio">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
            <polyline points="9 22 9 12 15 12 15 22"/>
          </svg>
        </router-link>

        <div class="topbar-greeting">
          <h1>¡Hola, {{ currentUser?.name || 'Usuario' }}! 👋</h1>
          <p>Bienvenido al panel de gestión Viaja Ya</p>
        </div>



        <div class="topbar-actions">
          <button class="action-btn" title="Notificaciones">


          </button>

        </div>
      </header>

      <!-- Content -->
      <main class="main-content">
        <!-- ========== DASHBOARD ========== -->
        <div v-if="currentSection === 'dashboard'">
          <!-- Dashboard Title -->
          <div class="dashboard-title-row">
            <h2 class="dashboard-title">Panel de control</h2>

          </div>

          <!-- Estado de las métricas del backend -->
          <div v-if="dashboardError" class="form-alert" style="margin-bottom: 14px;">{{ dashboardError }}</div>
          <div v-else-if="dashboardLoading" style="margin-bottom: 14px; font-size: 0.85rem; color: var(--c-gray);">Actualizando métricas...</div>

          <!-- Stats Cards -->
          <div class="stats-row">
            <div class="stat-card">
              <div class="stat-icon blue">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">Usuarios registrados</span>
                <span class="stat-value">{{ usuariosRegistrados }}</span>

              </div>
              <div class="stat-sparkline">
                <svg viewBox="0 0 80 30" class="sparkline-svg">
                  <polyline points="0,25 15,20 30,22 45,15 60,18 80,5" fill="none" stroke="#3B82F6" stroke-width="2"/>
                </svg>
              </div>
            </div>

            <div class="stat-card">
              <div class="stat-icon green">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/>
                  <path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/>
                  <path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
                </svg>
              </div>
              <div class="stat-content">
                <span class="stat-label">Dinero en Fondo Viajero</span>
                <span class="stat-value">{{ formatCurrency(fondoViajeroTotal) }}</span>

              </div>
              <div class="stat-sparkline">
                <svg viewBox="0 0 80 30" class="sparkline-svg">
                  <polyline points="0,24 15,21 30,17 45,14 60,10 80,4" fill="none" stroke="#10B981" stroke-width="2"/>
                </svg>
              </div>
            </div>
          </div>

          <!-- Widgets: Top presupuesto + Alertas de inactividad -->
          <div class="dashboard-widgets">
            <!-- Top usuarios por presupuesto -->
            <div class="card">
              <div class="card-header">
                <h3>Top usuarios por saldo</h3>
                <span class="card-badge">Top {{ topUsuariosPresupuesto.length }}</span>
              </div>
              <div class="widget-body">
                <div v-if="topUsuariosPresupuesto.length === 0" class="widget-empty">Sin datos de saldo</div>
                <div v-for="(u, idx) in topUsuariosPresupuesto" :key="u.id" class="rank-row">
                  <span class="rank-pos" :class="{ top: idx === 0 }">{{ idx + 1 }}</span>
                  <div class="rank-info">
                    <div class="rank-head">
                      <span class="rank-name">{{ u.name }}</span>
                      <span class="rank-amount">{{ formatCurrency(u.presupuesto) }}</span>
                    </div>
                    <div class="rank-track">
                      <div class="rank-fill" :style="{ width: rankPercent(u.presupuesto) + '%' }"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Alertas de inactividad -->
            <div class="card">
              <div class="card-header">
                <h3>Alertas de inactividad</h3>
                <span class="card-badge" :class="{ warn: alertasInactividad.length > 0 }">{{ alertasInactividad.length }}</span>
              </div>
              <div class="widget-body">
                <div v-if="alertasInactividad.length === 0" class="widget-empty">
                  Todos los usuarios están activos según su periodicidad de recaudo
                </div>
                <div v-for="a in alertasInactividad" :key="a.id" class="alert-row">
                  <div class="alert-icon">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                      <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                  </div>
                  <div class="alert-info">
                    <div class="alert-head">
                      <span class="alert-name">{{ a.name }}</span>
                      <span class="alert-days">{{ a.diasInactividad }} días</span>
                    </div>
                    <span class="alert-detail">Recaudo {{ a.periodicidad }} · sin actividad desde hace {{ a.diasInactividad }} días (límite {{ a.limiteDias }})</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          <!-- Cierre presupuestal automatizado -->
          <!-- <div class="card cierre-card">
            <div class="card-header">
              <div class="cierre-title">
                <h3>Cierre presupuestal del mes</h3>
                <span class="auto-badge">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 1 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 1 1-2.83-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 1 1 2.83-2.83l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 1 1 2.83 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/>
                  </svg>
                  Automático
                </span>
              </div>
              <span class="cierre-next">Próximo cierre: {{ proximoCierreFecha }}</span>
            </div>

            <div class="cierre-body">
              <div class="cierre-summary">
                <div class="cierre-metric">
                  <span class="cierre-label">Ingresos del mes</span>
                  <span class="cierre-value income">{{ formatCurrency(cierreActual.ingresos) }}</span>
                </div>
                <div class="cierre-metric">
                  <span class="cierre-label">Egresos del mes</span>
                  <span class="cierre-value expense">{{ formatCurrency(cierreActual.egresos) }}</span>
                </div>
                <div class="cierre-metric">
                  <span class="cierre-label">Utilidad consolidada</span>
                  <span class="cierre-value profit">{{ formatCurrency(cierreActual.utilidad) }}</span>
                </div>
                <div class="cierre-metric">
                  <span class="cierre-label">Proyectos del mes</span>
                  <span class="cierre-value">{{ cierreActual.proyectos }}</span>
                </div>
              </div>

              <div class="cierre-table-wrap">
                <table class="cierre-table">
                  <thead>
                    <tr>
                      <th>Mes</th>
                      <th>Ingresos</th>
                      <th>Egresos</th>
                      <th>Utilidad</th>
                      <th>Proyectos</th>
                      <th>Estado</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="c in cierresPresupuestales" :key="c.key">
                      <td class="cierre-month">{{ c.label }}</td>
                      <td>{{ formatCurrency(c.ingresos) }}</td>
                      <td>{{ formatCurrency(c.egresos) }}</td>
                      <td class="cierre-profit">{{ formatCurrency(c.utilidad) }}</td>
                      <td>{{ c.proyectos }}</td>
                      <td><span class="cierre-status" :class="c.estado === 'Cerrado' ? 'closed' : 'open'">{{ c.estado }}</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div> -->

        </div>

        <!-- ========== CLIENTES ========== -->
        <div v-if="currentSection === 'clientes'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Clientes</h2>
              <p class="page-subtitle">Gestiona la información de tus clientes.</p>
            </div>
          </div>
          <div class="empty-state">
            <div class="empty-icon">👥</div>
            <h3>Módulo de Clientes</h3>
            <p>Próximamente podrás gestionar todos tus clientes desde aquí.</p>
          </div>
        </div>

        <!-- ========== PROYECTOS ========== -->
        <div v-if="currentSection === 'proyectos'">
          <div v-if="selectedProjectId" class="project-detail-inline">
            <button class="back-btn" @click="backToProjects">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Volver a proyectos
            </button>
            <ProjectDetail :project-id="selectedProjectId" />
          </div>
          <ProjectsList v-else inline @view-project="viewProject" />
        </div>

        <!-- ========== LICITACIONES ========== -->
        <div v-if="currentSection === 'licitaciones'">
          <LicitacionesList />
        </div>

        <!-- ========== COTIZACIONES ========== -->
        <div v-if="currentSection === 'cotizaciones'">
          <QuotesList />
        </div>

        <!-- ========== DOCUMENTOS ========== -->
        <DocumentosList v-if="currentSection === 'documentos'" />

        <!-- ========== RECURSOS ========== -->
        <div v-if="currentSection === 'recursos'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Recursos</h2>
              <p class="page-subtitle">Clientes con recursos visibles — {{ recursosClientes.length }} clientes</p>
            </div>

          </div>

          <div v-if="recursoSuccessMessage" class="success-banner">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
            {{ recursoSuccessMessage }}
          </div>

          <div v-if="loadingRecursos" class="empty-state">
            <div class="btn-spinner"></div>
            <p>Cargando recursos...</p>
          </div>

          <div v-else-if="recursosClientes.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--c-gray-light); margin-bottom: 16px;">
              <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
            </svg>
            <h3>No hay clientes con recursos visibles</h3>
          </div>

          <div v-else class="table-card">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th>Cliente</th>
                    <th>NIT</th>
                    <th>Ciudad</th>
                    <th>Documentos</th>
                    <th>Tipo</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <template v-for="cd in recursosClientes" :key="cd.cliente.id">
                    <tr v-for="(doc, idx) in cd.documentos" :key="doc.id">
                      <td class="name-cell" v-if="idx === 0" :rowspan="cd.documentos.length">{{ cd.cliente.razonSocial }}</td>
                      <td v-if="idx === 0" :rowspan="cd.documentos.length">{{ cd.cliente.nit }}</td>
                      <td v-if="idx === 0" :rowspan="cd.documentos.length">{{ cd.cliente.ciudad }}</td>
                      <td>{{ doc.name }}</td>
                      <td>
                        <span class="type-badge" :class="'type-' + doc.type">{{ doc.type }}</span>
                      </td>
                      <td>
                        <div class="actions-cell">
                          <button class="action-btn" title="Ver" @click="viewRecursoDoc(doc)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                              <circle cx="12" cy="12" r="3"/>
                            </svg>
                          </button>
                          <button class="action-btn" title="Descargar" @click="downloadRecursoDoc(doc)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                              <polyline points="7 10 12 15 17 10"/>
                              <line x1="12" y1="15" x2="12" y2="3"/>
                            </svg>
                          </button>
                          <button class="action-btn delete-btn" title="Eliminar" @click="deleteRecursoDoc(doc)">
                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                              <polyline points="3 6 5 6 21 6"/>
                              <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                            </svg>
                          </button>
                        </div>
                      </td>
                    </tr>
                  </template>
                </tbody>
              </table>
            </div>
          </div>

        </div>

        <!-- ========== CALENDARIO ========== -->
        <div v-if="currentSection === 'calendario'">
          <div class="section-top">
            <div>
              <h2 class="page-title">Calendario</h2>
              <p class="page-subtitle">Organiza tus eventos y actividades.</p>
            </div>
          </div>

          <div class="calendar-full-layout">
            <!-- Calendario principal -->
            <div class="calendar-main-card">
              <div class="calendar-header">
                <button class="cal-nav-btn-large" @click="calPrevMonth">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="15 18 9 12 15 6"/>
                  </svg>
                </button>
                <h3 class="cal-month-title">{{ calMonthName }} {{ calYear }}</h3>
                <button class="cal-nav-btn-large" @click="calNextMonth">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <polyline points="9 18 15 12 9 6"/>
                  </svg>
                </button>
                <button class="cal-today-btn" @click="calGoToday">Hoy</button>
              </div>

              <div class="calendar-weekdays">
                <span>Lun</span><span>Mar</span><span>Mié</span><span>Jue</span><span>Vie</span><span>Sáb</span><span>Dom</span>
              </div>

              <div class="calendar-days-grid">
                <div
                  v-for="(day, idx) in calDays"
                  :key="idx"
                  class="cal-day-cell"
                  :class="{
                    'other-month': day.otherMonth,
                    'is-today': day.isToday,
                    'is-selected': day.dateStr === calSelectedDate,
                    'has-events': day.events.length > 0
                  }"
                  @click="calSelectDay(day)"
                >
                  <span class="cal-day-number">{{ day.day }}</span>
                   <div class="cal-day-dots" v-if="day.events.length > 0">
                    <span
                      v-for="(evt, eIdx) in day.events.slice(0, 3)"
                      :key="eIdx"
                      class="cal-event-dot"
                      :style="{ background: rawTypeColorMap[evt.rawType] || '#6B7280' }"
                    ></span>
                    <span v-if="day.events.length > 3" class="cal-more-events">+{{ day.events.length - 3 }}</span>
                  </div>
                </div>
              </div>


            </div>

            <!-- Panel lateral de eventos -->
            <div class="calendar-sidebar">
              <div class="sidebar-events-card">
                <h4 class="sidebar-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                    <line x1="16" y1="2" x2="16" y2="6"/>
                    <line x1="8" y1="2" x2="8" y2="6"/>
                    <line x1="3" y1="10" x2="21" y2="10"/>
                  </svg>
                  {{ calSelectedDate ? 'Eventos del ' + calSelectedDateFormatted : 'Selecciona un día' }}
                </h4>

                <div v-if="calSelectedDayEvents.length === 0" class="no-events-msg">
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--c-gray-light);">
                    <circle cx="12" cy="12" r="10"/>
                    <line x1="12" y1="8" x2="12" y2="12"/>
                    <line x1="12" y1="16" x2="12.01" y2="16"/>
                  </svg>
                  <p>No hay eventos programados</p>
                </div>

                <div v-else class="events-list">
                  <div v-for="(evt, idx) in calSelectedDayEvents" :key="idx" class="event-card-item" :style="{ borderLeftColor: rawTypeColorMap[evt.rawType] || '#6B7280' }">
                    <div class="event-card-header">
                      <span class="event-type-badge" :style="{ background: (rawTypeColorMap[evt.rawType] || '#6B7280') + '20', color: rawTypeColorMap[evt.rawType] || '#6B7280' }">{{ evt.rawType }}</span>
                      <span class="event-time-badge">{{ evt.time }}</span>
                    </div>
                    <h5 class="event-card-title">{{ evt.title }}</h5>
                    <p class="event-card-meta"><strong>Cliente / Entidad:</strong> {{ evt.client || '-' }}</p>
                    <p class="event-card-meta" v-if="evt.responsible"><strong>Responsable:</strong> {{ evt.responsible }}</p>
                    <p class="event-card-meta" v-if="evt.modalidad">Modalidad: {{ evt.modalidad }}</p>
                    <p class="event-card-desc" v-if="evt.description">{{ evt.description }}</p>
                  </div>
                </div>
              </div>

              <!-- Resumen del mes -->
              <div class="sidebar-summary-card">
                <h4 class="sidebar-title">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <path d="M22 12h-4l-3 9L9 3l-3 9H2"/>
                  </svg>
                  Resumen del mes
                </h4>
                <div class="summary-stats">
                  <div v-for="(item, idx) in calSummaryItems" :key="idx" class="summary-stat">
                    <span class="summary-dot" :style="{ background: item.color }"></span>
                    <span class="summary-label">{{ item.label }}</span>
                    <span class="summary-count">{{ item.count }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div class="calendar-text-summary" v-if="calMonthEventList.length > 0">
            <div class="summary-header">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
                <rect x="8" y="2" width="8" height="4" rx="1"/>
              </svg>
              <span>{{ calMonthName }} {{ calYear }}</span>
              <span class="summary-total-badge">{{ calMonthEventList.length }} eventos</span>
            </div>
            <div class="summary-events-list">
              <div v-for="(ev, idx) in calMonthEventList" :key="idx" class="summary-event-row">
                <span class="summary-event-date">{{ ev.startDate }}<template v-if="ev.endDate"> - {{ ev.endDate }}</template></span>
                <span class="summary-event-dot" :style="{ background: ev.color }"></span>
                <span class="summary-event-title">{{ ev.title }}</span>
                <span class="summary-event-type" :style="{ background: ev.color + '18', color: ev.color }">{{ ev.rawType }}</span>
                <span class="summary-event-time">{{ ev.time }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- ========== COLABORADORES ========== -->
        <div v-if="currentSection === 'colaboradores'">
          <div v-if="selectedColaboradorId" class="colaborador-detail-inline">
            <button class="back-btn" @click="backToColaboradores">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
              </svg>
              Volver a colaboradores
            </button>
            <ColaboradorDetail :colaborador-id="selectedColaboradorId" />
          </div>
          <ColaboradoresList v-else inline @view-colaborador="viewColaborador" />
        </div>

        <!-- ========== USUARIOS ========== -->
        <UsuariosList v-if="currentSection === 'usuarios'" />
        <PanelUsersList v-if="currentSection === 'panel-usuarios'" />

        <!-- ========== RECAUDOS ========== -->
        <div v-if="currentSection === 'recaudos'" class="section-recaudos">
          <div class="section-top">
            <div>
              <h2 class="page-title">Recaudos</h2>
              <p class="page-subtitle">{{ recaudosFiltrados.length }} de {{ recaudosList.length }} recaudos{{ recaudosSeleccionados.length > 0 ? ` — ${recaudosSeleccionados.length} seleccionados` : '' }}</p>
            </div>
            <button class="export-btn" style="background: var(--c-primary); color: #102857; border: none;" @click="openCreateRecaudo()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Crear Recaudo
            </button>
          </div>

          <!-- Error de recaudos (carga/escritura) -->
          <div v-if="recaudoError && !showCreateRecaudo && !recaudoEdit && !showMsgRecaudo" class="form-alert" style="margin-bottom: 16px;">
            {{ recaudoError }}
          </div>

          <!-- Filtros -->
          <div v-if="recaudosList.length > 0" class="coti-filters">
            <div class="coti-filter-group coti-filter-search">
              <label>Buscar</label>
              <input v-model="recaudoSearch" type="text" class="coti-select" placeholder="Buscar por nombre o cédula..." />
            </div>
            <div class="coti-filter-group">
              <label>Mes</label>
              <input v-model="recaudoMes" type="month" class="coti-select" />
            </div>
            <div class="coti-filter-group">
              <label>Fecha desde</label>
              <input v-model="recaudoDesde" type="date" class="coti-select" />
            </div>
            <div class="coti-filter-group">
              <label>Fecha hasta</label>
              <input v-model="recaudoHasta" type="date" class="coti-select" />
            </div>
            <div class="coti-filter-group">
              <label aria-hidden="true">&nbsp;</label>
              <button class="btn-outline" @click="clearRecaudoFilters">Limpiar</button>
            </div>
          </div>

          <div v-if="recaudosLoading" class="empty-state">
            <p>Cargando recaudos...</p>
          </div>

          <div v-else-if="recaudosList.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--c-gray-light); margin-bottom: 16px;">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
              <line x1="6" y1="15" x2="10" y2="15"/>
            </svg>
            <h3>Aún no hay recaudos registrados</h3>
            <p>Aquí aparecerán los recaudos cuando se registren.</p>
          </div>

          <div v-else-if="recaudosFiltrados.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" style="color: var(--c-gray-light); margin-bottom: 16px;">
              <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
            </svg>
            <h3>No se encontraron recaudos</h3>
            <p>Prueba con otros filtros o limpia la búsqueda.</p>
          </div>

          <div v-else class="table-card">
            <div class="table-responsive">
              <table class="data-table">
                <thead>
                  <tr>
                    <th style="width: 44px;">
                      <input type="checkbox" class="row-check" :checked="todosRecaudosSeleccionados" title="Seleccionar todos" @change="toggleAllRecaudos" />
                    </th>
                    <th style="width: 26%;">Nombre</th>
                    <th style="width: 17%;">Cédula</th>
                    <th style="width: 17%;">Fecha</th>
                    <th style="width: 17%;">Valor</th>
                    <th style="width: 17%;">Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in recaudosFiltrados" :key="r.id">
                    <td class="col-check">
                      <input type="checkbox" class="row-check" :checked="recaudosSeleccionados.includes(r.id)" @change="toggleRecaudo(r.id)" />
                    </td>
                    <td>{{ r.nombre }}</td>
                    <td>{{ r.cedula }}</td>
                    <td>{{ formatFecha(r.fecha) }}</td>
                    <td>{{ formatCurrency(r.valor) }}</td>
                    <td>
                      <div class="actions-cell">
                        <button class="action-btn" title="Editar" @click="openEditRecaudo(r)">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button class="action-btn" title="Ver detalle" @click="recaudoSelected = r">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button class="action-btn msg-btn-action" title="Enviar mensaje" @click="openMsgRecaudo(r)">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
                          </svg>
                        </button>
                        <button class="action-btn delete-btn" title="Eliminar" @click="removeRecaudo(r.id)">
                          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
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

          <!-- Detalle del recaudo -->
          <div v-if="recaudoSelected" class="modal-overlay" @click.self="recaudoSelected = null">
            <div class="modal-content modal-wide" @click.stop>
              <div class="modal-header">
                <h3>Detalle del recaudo</h3>
                <button class="modal-close" @click="recaudoSelected = null">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div class="modal-body">
                <div class="recaudo-detail">
                  <div class="recaudo-detail-row"><span>Nombre</span><strong>{{ recaudoSelected.nombre }}</strong></div>
                  <div class="recaudo-detail-row"><span>Cédula</span><strong>{{ recaudoSelected.cedula }}</strong></div>
                  <div class="recaudo-detail-row"><span>Fecha</span><strong>{{ formatFecha(recaudoSelected.fecha) }}</strong></div>
                  <div class="recaudo-detail-row"><span>Valor</span><strong>{{ formatCurrency(recaudoSelected.valor) }}</strong></div>
                  <div class="recaudo-detail-row"><span>Periodicidad</span><strong>{{ recaudoSelected.periodicidad }}</strong></div>
                </div>
              </div>
            </div>
          </div>

          <!-- Crear recaudo -->
          <div v-if="showCreateRecaudo" class="modal-overlay" @click.self="showCreateRecaudo = false">
            <div class="modal-content modal-wide" @click.stop>
              <div class="modal-header">
                <h3>Crear recaudo</h3>
                <button class="modal-close" @click="showCreateRecaudo = false">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div class="modal-body">
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Nombre</label>
                    <div class="combo">
                      <input
                        v-model="recaudoForm.nombre"
                        type="text"
                        class="form-input"
                        placeholder="Busca o selecciona un usuario"
                        autocomplete="off"
                        @focus="showRecaudoOptions = true"
                        @input="showRecaudoOptions = true"
                        @blur="showRecaudoOptions = false"
                      />
                      <div v-if="showRecaudoOptions" class="combo-list">
                        <button
                          v-for="u in recaudoUsuariosFiltrados"
                          :key="u.id"
                          type="button"
                          class="combo-option"
                          @mousedown.prevent="selectRecaudoUsuario(u)"
                        >
                          <span class="combo-option-name">{{ u.name }}</span>
                          <span class="combo-option-meta">C.I. {{ u.cedula }}</span>
                        </button>
                        <div v-if="recaudoUsuariosFiltrados.length === 0" class="combo-empty">Sin usuarios encontrados</div>
                      </div>
                    </div>
                  </div>
                  <div class="form-group">
                    <label>Cédula</label>
                    <input v-model="recaudoForm.cedula" type="text" class="form-input" readonly placeholder="Se completa al elegir el usuario" />
                  </div>
                  <div class="form-group">
                    <label>Periodicidad</label>
                    <select v-model="recaudoForm.periodicidad" class="form-input" disabled>
                      <option value="" disabled>Se completa al elegir el usuario</option>
                      <option value="Diaria">Diaria</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Quincenal">Quincenal</option>
                      <option value="Mensual">Mensual</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Fecha y hora</label>
                    <input v-model="recaudoForm.fecha" type="datetime-local" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Valor</label>
                    <input
                      :value="recaudoForm.valor ? formatCurrency(recaudoForm.valor) : ''"
                      type="text"
                      inputmode="numeric"
                      class="form-input"
                      placeholder="$ 0"
                      @input="onValorInput($event, 'create')"
                    />
                  </div>
                </div>
                <div v-if="recaudoError" class="form-alert" style="margin-top: 12px;">{{ recaudoError }}</div>
              </div>
              <div class="modal-footer">
                <button class="btn-outline" :disabled="recaudoSaving" @click="showCreateRecaudo = false">Cancelar</button>
                <button class="btn-outline" :disabled="!recaudoFormValid || recaudoSaving" @click="createRecaudoAndMsg">
                  {{ recaudoSaving ? 'Guardando...' : 'Crear y enviar mensaje' }}
                </button>
                <button class="btn-primary" :disabled="!recaudoFormValid || recaudoSaving" @click="createRecaudo">
                  {{ recaudoSaving ? 'Guardando...' : 'Crear Recaudo' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Editar recaudo -->
          <div v-if="recaudoEdit" class="modal-overlay" @click.self="recaudoEdit = null">
            <div class="modal-content modal-wide" @click.stop>
              <div class="modal-header">
                <h3>Editar recaudo</h3>
                <button class="modal-close" @click="recaudoEdit = null">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div class="modal-body">
                <div class="form-grid">
                  <div class="form-group full-width">
                    <label>Nombre</label>
                    <input v-model="recaudoEdit.nombre" type="text" class="form-input" readonly />
                  </div>
                  <div class="form-group">
                    <label>Cédula</label>
                    <input v-model="recaudoEdit.cedula" type="text" class="form-input" readonly />
                  </div>
                  <div class="form-group">
                    <label>Periodicidad</label>
                    <select v-model="recaudoEdit.periodicidad" class="form-input" disabled>
                      <option value="Diaria">Diaria</option>
                      <option value="Semanal">Semanal</option>
                      <option value="Quincenal">Quincenal</option>
                      <option value="Mensual">Mensual</option>
                    </select>
                  </div>
                  <div class="form-group">
                    <label>Fecha y hora</label>
                    <input v-model="recaudoEdit.fecha" type="datetime-local" class="form-input" />
                  </div>
                  <div class="form-group">
                    <label>Valor</label>
                    <input
                      :value="recaudoEdit.valor ? formatCurrency(recaudoEdit.valor) : ''"
                      type="text"
                      inputmode="numeric"
                      class="form-input"
                      placeholder="$ 0"
                      @input="onValorInput($event, 'edit')"
                    />
                  </div>
                </div>
                <div v-if="recaudoError" class="form-alert" style="margin-top: 12px;">{{ recaudoError }}</div>
              </div>
              <div class="modal-footer">
                <button class="btn-outline" :disabled="recaudoSaving" @click="recaudoEdit = null">Cancelar</button>
                <button class="btn-outline" :disabled="recaudoSaving" @click="saveRecaudoAndMsg">
                  {{ recaudoSaving ? 'Guardando...' : 'Guardar y enviar mensaje' }}
                </button>
                <button class="btn-primary" :disabled="recaudoSaving" @click="saveRecaudo">
                  {{ recaudoSaving ? 'Guardando...' : 'Guardar cambios' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Enviar mensaje del recaudo -->
          <div v-if="showMsgRecaudo" class="modal-overlay" @click.self="closeMsgRecaudo()">
            <div class="modal-content modal-wide" @click.stop>
              <div class="modal-header">
                <h3>Enviar mensaje</h3>
                <button class="modal-close" @click="closeMsgRecaudo()">
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                  </svg>
                </button>
              </div>
              <div class="modal-body">
                <div class="msg-recipient" v-if="msgTarget">
                  <strong>{{ msgTarget.nombre }}</strong>
                  <span>C.I. {{ msgTarget.cedula }} · {{ formatFecha(msgTarget.fecha) }} · {{ formatCurrency(msgTarget.valor) }}</span>
                </div>

                <div class="form-group">
                  <label>Mensaje</label>
                  <textarea v-model="msgText" rows="5" class="form-input" placeholder="Escribe el mensaje..."></textarea>
                </div>

                <div v-if="msgError" class="form-alert">{{ msgError }}</div>
              </div>
              <div class="modal-footer">
                <button class="btn-outline" @click="closeMsgRecaudo()">Cancelar</button>
                <button class="btn-primary" :disabled="!msgText.trim() || msgSending" @click="askSendRecaudoMsg">
                  {{ msgSending ? 'Enviando...' : 'Enviar' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Confirmar envío del mensaje -->
          <div v-if="msgConfirm && showMsgRecaudo" class="modal-overlay modal-overlay-confirm" @click.self="msgConfirm = false">
            <div class="modal-content modal-confirm" @click.stop>
              <div class="confirm-icon">
                <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
                  <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
                </svg>
              </div>
              <h3>¿Estás seguro?</h3>
              <p v-if="msgTarget">Vas a enviar este mensaje a <strong>{{ msgTarget.nombre }}</strong> (C.I. {{ msgTarget.cedula }}).</p>
              <div class="confirm-preview">{{ msgText }}</div>
              <div class="confirm-actions">
                <button class="btn-outline" @click="msgConfirm = false">Cancelar</button>
                <button class="btn-primary" :disabled="msgSending" @click="sendRecaudoMsg">
                  {{ msgSending ? 'Enviando...' : 'Sí, enviar' }}
                </button>
              </div>
            </div>
          </div>

          <!-- Confirmación de mensaje enviado -->
          <transition name="msg-toast-fade">
            <div v-if="msgSent" class="msg-sent-toast">
              <span class="msg-toast-icon">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              </span>
              Mensaje enviado
              <button class="msg-toast-close" @click="msgSent = false">
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
          </transition>
        </div>

        <!-- ========== ADM EVENTOS ========== -->
        <div v-if="currentSection === 'adm-eventos'">
          <div class="section-top">
            <div>
              <h2 class="page-title">ADM Eventos</h2>
              <p class="page-subtitle">{{ eventos.length }} eventos registrados</p>
            </div>
            <button class="export-btn" style="background: var(--c-primary); color: #102857; border: none;" @click="openEventModal()">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
              </svg>
              Nuevo Evento
            </button>
          </div>

          <!-- Filtros -->
          <div class="coti-filters">
            <div class="coti-filter-group coti-filter-search">
              <label>Buscar</label>
              <input v-model="eventoSearchTerm" type="text" class="coti-select" placeholder="Buscar por título, cliente, responsable..." />
            </div>
            <div class="coti-filter-group">
              <label>Estado</label>
              <select v-model="eventoFilterStatus" class="coti-select">
                <option value="">Todos</option>
                <option value="activo">Activo</option>
                <option value="terminado">Terminado</option>
              </select>
            </div>
          </div>
          <div class="coti-filters">
            <div class="coti-filter-group">
              <label>Tipo de entidad</label>
              <select v-model="eventoFilterEntity" class="coti-select">
                <option value="">Todas</option>
                <option value="client">Cliente</option>
                <option value="project">Proyecto</option>
                <option value="quote">Cotización</option>
                <option value="tender">Licitación</option>
              </select>
            </div>
            <div class="coti-filter-group">
              <label>Tipo de evento</label>
              <select v-model="eventoFilterType" class="coti-select">
                <option value="">Todos</option>
                <option value="Auditoría Interna">Auditoría Interna</option>
                <option value="Auditoría Interna Presencial">Auditoría Interna Presencial</option>
                <option value="Capacitación">Capacitación</option>
                <option value="Capacitación Presencial">Capacitación Presencial</option>
                <option value="Implementación">Implementación</option>
                <option value="Mantenimiento">Mantenimiento</option>
                <option value="Asesoría Virtual">Asesoría Virtual</option>
                <option value="Asesoría Presencial">Asesoría Presencial</option>
                <option value="Diagnóstico Inicial">Diagnóstico Inicial</option>
                <option value="Auditoría Interna Calidad">Auditoría Interna Calidad</option>
                <option value="Paquete de Capacitación Anual">Paquete de Capacitación Anual</option>
                <option value="Asesoría para la Implementación">Asesoría para la Implementación</option>
                <option value="Pasantía">Pasantía</option>
                <option value="Formación">Formación</option>
                <option value="Director de Calidad">Director de Calidad</option>
                <option value="Taller">Taller</option>
                <option value="Taller de Servicio al Cliente">Taller de Servicio al Cliente</option>
                <option value="Taller de Ventas y Negociación">Taller de Ventas y Negociación</option>
                <option value="Taller de Habilidades Blandas">Taller de Habilidades Blandas</option>
                <option value="Búsqueda de Personal">Búsqueda de Personal</option>
                <option value="Búsqueda y Selección de Personal">Búsqueda y Selección de Personal</option>
                <option value="Outsourcing In House">Outsourcing In House</option>
                <option value="Asesoría Certificación de Producto">Asesoría Certificación de Producto</option>
                <option value="Asesoría">Asesoría</option>
                <option value="Gestión Ensayos de Aptitud">Gestión Ensayos de Aptitud</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
            <div class="coti-filter-group">
              <label>Responsable</label>
              <select v-model="eventoFilterUser" class="coti-select">
                <option value="">Todos</option>
                <option value="Camila Escobar">Camila Escobar</option>
                <option value="Luis Eduardo Salcedo">Luis Eduardo Salcedo</option>
                <option value="Paula Salcedo">Paula Salcedo</option>
              </select>
            </div>
            <div class="coti-filter-group">
              <label>Modalidad</label>
              <select v-model="eventoFilterModalidad" class="coti-select">
                <option value="">Todas</option>
                <option value="Presencial">Presencial</option>
                <option value="Virtual">Virtual</option>
                <option value="Híbrida">Híbrida</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <!-- Tabla -->
          <div class="table-card">
            <div v-if="loadingEventos" style="text-align:center; padding: 40px; color: var(--c-gray);">Cargando eventos...</div>
            <div v-else-if="eventosFiltradas.length === 0" style="text-align:center; padding: 40px; color: var(--c-gray);">
              No se encontraron eventos
            </div>
            <div v-else class="table-responsive">
              <table class="data-table">
                <colgroup>
                  <col style="width: 16%;" />
                  <col style="width: 12%;" />
                  <col style="width: 17%;" />
                  <col style="width: 9%;" />
                  <col style="width: 10%;" />
                  <col style="width: 10%;" />
                  <col style="width: 11%;" />
                  <col style="width: 9%;" />
                  <col style="width: 9%;" />
                </colgroup>
                <thead>
                  <tr>
                    <th>Título del Evento / <br> Servicio</th>
                    <th>Tipo Evento</th>
                    <th>Cliente / Entidad</th>
                    <th>Modalidad</th>
                    <th>Descripción</th>
                    <th>Responsable</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                    <th>Acciones</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="ev in eventosFiltradas" :key="ev.id">
                    <td>{{ ev.title || '-' }}</td>
                    <td><span class="evento-type-badge" :class="'type-' + ev.type">{{ getEventoTypeLabel(ev.type, ev.typeOtro) }}</span></td>
                    <td>
                      <span v-if="ev.entityType && ev.entityId" class="evento-entity-badge">{{ getEntityLabel(ev.entityType) }} — {{ getEntityName(ev) }}</span>
                      <span v-else class="evento-entity-badge">{{ ev.client || '-' }}</span>
                    </td>
                    <td>{{ ev.modalidad || '-' }}</td>
                    <td class="evento-desc">
                      <button class="q-action" title="Ver descripción" @click="openDescModal(ev)">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                          <circle cx="12" cy="12" r="3"/>
                        </svg>
                      </button>
                    </td>
                    <td>{{ ev.user }}</td>
                    <td>{{ formatEventDate(ev.date) }}</td>
                    <td>
                      <span class="status-badge" :class="isEventoTerminado(ev) ? 'status-inactive' : 'status-active'">
                        {{ isEventoTerminado(ev) ? 'Terminado' : 'Activo' }}
                      </span>
                    </td>
                    <td>
                      <div class="q-actions">
                        <button class="q-action" title="Ver detalle" @click="openEventModal(ev, 'view')">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                            <circle cx="12" cy="12" r="3"/>
                          </svg>
                        </button>
                        <button class="q-action" title="Editar" @click="openEventModal(ev, 'edit')">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                          </svg>
                        </button>
                        <button class="q-action danger" title="Eliminar" @click="confirmDeleteEvent(ev)">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <polyline points="3 6 5 6 21 6"/>
                            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                          </svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        <!-- Modal Crear/Editar Evento -->
        <div v-if="showEventModal" class="modal-overlay" @click.self="showEventModal = false">
          <div class="modal-card modal-lg">
            <div class="modal-header">
              <h3>{{ viewingEvento ? 'Ver Evento' : (editingEvento ? 'Editar Evento' : 'Nuevo Evento') }}</h3>
              <button class="modal-close" @click="showEventModal = false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body" :class="{ 'view-mode': viewingEvento }">

              <div class="section-grid">
                <!-- SECCIÓN A: INFORMACIÓN GENERAL DEL EVENTO -->
                <div class="section-card">
                  <div class="section-header">
                    <span class="section-badge">SECCIÓN A</span>
                    <span class="section-title">INFORMACIÓN GENERAL DEL EVENTO</span>
                  </div>
                  <div class="section-body">
                    <div class="form-group">
                      <label>Título del Evento / Servicio *</label>
                      <input v-model="eventForm.title" type="text" class="form-input" placeholder="Ej: Auditoría Interna de Calidad ISO/IEC 17025" @input="clearFieldError('title')" />
                      <span v-if="fieldErrors.title" class="field-error">{{ fieldErrors.title }}</span>
                    </div>
                    <div class="form-group">
                      <label>Empresa / Cliente / Sede</label>
                      <input v-model="eventForm.client" type="text" class="form-input" placeholder="Nombre del cliente" />
                    </div>
                    <div class="form-group">
                      <label>Tipo de Evento / servicio *</label>
                      <select v-model="eventForm.type" class="form-input" @change="clearFieldError('type')">
                        <option value="">Seleccionar...</option>
                        <option value="Auditoría Interna">Auditoría Interna</option>
                        <option value="Auditoría Interna Presencial">Auditoría Interna Presencial</option>
                        <option value="Capacitación">Capacitación</option>
                        <option value="Capacitación Presencial">Capacitación Presencial</option>
                        <option value="Implementación">Implementación</option>
                        <option value="Mantenimiento">Mantenimiento</option>
                        <option value="Asesoría Virtual">Asesoría Virtual</option>
                        <option value="Asesoría Presencial">Asesoría Presencial</option>
                        <option value="Diagnóstico Inicial">Diagnóstico Inicial</option>
                        <option value="Auditoría Interna Calidad">Auditoría Interna Calidad</option>
                        <option value="Paquete de Capacitación Anual">Paquete de Capacitación Anual</option>
                        <option value="Asesoría para la Implementación">Asesoría para la Implementación</option>
                        <option value="Pasantía">Pasantía</option>
                        <option value="Formación">Formación</option>
                        <option value="Director de Calidad">Director de Calidad</option>
                        <option value="Taller">Taller</option>
                        <option value="Taller de Servicio al Cliente">Taller de Servicio al Cliente</option>
                        <option value="Taller de Ventas y Negociación">Taller de Ventas y Negociación</option>
                        <option value="Taller de Habilidades Blandas">Taller de Habilidades Blandas</option>
                        <option value="Búsqueda de Personal">Búsqueda de Personal</option>
                        <option value="Búsqueda y Selección de Personal">Búsqueda y Selección de Personal</option>
                        <option value="Outsourcing In House">Outsourcing In House</option>
                        <option value="Asesoría Certificación de Producto">Asesoría Certificación de Producto</option>
                        <option value="Asesoría">Asesoría</option>
                        <option value="Gestión Ensayos de Aptitud">Gestión Ensayos de Aptitud</option>
                        <option value="Otro">Otro</option>
                      </select>
                      <input
                        v-if="eventForm.type === 'Otro'"
                        v-model="eventForm.typeOtro"
                        type="text"
                        class="form-input"
                        placeholder="Especifique el tipo de evento..."
                        style="margin-top: 8px;"
                      />
                      <span v-if="fieldErrors.type" class="field-error">{{ fieldErrors.type }}</span>
                    </div>
                    <div class="form-group">
                      <label>Tipo de Entidad</label>
                      <select v-model="eventForm.entityType" class="form-input">
                        <option value="">Ninguna</option>
                        <option value="client">Cliente</option>
                        <option value="project">Proyecto</option>
                        <option value="quote">Cotización</option>
                        <option value="tender">Licitación</option>
                      </select>
                    </div>
                    <div v-if="eventForm.entityType" class="form-group entity-search-group">
                      <label>{{ entityLabel }}</label>
                      <div class="entity-dropdown">
                        <input
                          type="text"
                          class="form-input entity-dropdown-trigger"
                          :placeholder="loadingEntities ? 'Cargando...' : 'Seleccionar...'"
                          :value="entitySearchText"
                          :disabled="loadingEntities"
                          readonly
                          @click.stop="showEntityDropdown = !showEntityDropdown"
                        />
                        <svg class="entity-dropdown-arrow" :class="{ open: showEntityDropdown }" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                          <polyline points="6 9 12 15 18 9"/>
                        </svg>
                        <div v-if="showEntityDropdown" class="entity-dropdown-list">
                          <div class="entity-dropdown-search" @click.stop>
                            <input
                              ref="entitySearchInput"
                              v-model="entitySearchText"
                              type="text"
                              class="form-input"
                              placeholder="Buscar..."
                            />
                          </div>
                          <div
                            v-for="opt in filteredEntityOptions"
                            :key="opt.id"
                            class="entity-dropdown-item"
                            @click.stop="selectEntity(opt)"
                          >
                            {{ opt.label }}
                          </div>
                          <div v-if="filteredEntityOptions.length === 0" class="entity-dropdown-empty">
                            No se encontraron resultados
                          </div>
                        </div>
                      </div>
                      <span v-if="loadingEntities" class="entity-loading">Cargando...</span>
                    </div>
                    <div class="form-group">
                      <label>Descripción / Notas / Consecutivo Interno</label>
                      <textarea v-model="eventForm.description" rows="3" class="form-input" placeholder="Descripción del evento..."></textarea>
                    </div>
                  </div>
                </div>

                <!-- SECCIÓN B: FECHAS Y LOGÍSTICA -->
                <div class="section-card">
                  <div class="section-header">
                    <span class="section-badge">SECCIÓN B</span>
                    <span class="section-title">FECHAS Y LOGÍSTICA</span>
                  </div>
                  <div class="section-body">
                    <div class="form-group">
                      <label>Rango de Fechas *</label>
                      <div class="date-range-grid">
                        <div class="date-range-row">
                          <div class="date-field">
                            <input v-model="eventForm.startDate" type="date" class="form-input" @change="clearFieldError('startDate')" />
                          </div>
                          <div class="time-field">
                            <input v-model="eventForm.startTime" type="time" class="form-input" />
                          </div>
                          <span class="date-separator">to</span>
                        </div>
                        <div class="date-range-row">
                          <div class="date-field">
                            <input v-model="eventForm.endDate" type="date" class="form-input" />
                          </div>
                          <div class="time-field">
                            <input v-model="eventForm.endTime" type="time" class="form-input" />
                          </div>
                          <span class="date-estado-badge">
                            <span class="date-estado-label">Estado</span>
                            <span class="status-badge" :class="formEstadoLabel.cls">{{ formEstadoLabel.text }}</span>
                          </span>
                        </div>
                      </div>
                      <span v-if="fieldErrors.startDate" class="field-error">{{ fieldErrors.startDate }}</span>
                      <p class="form-hint">El estado se calcula automáticamente según la fecha de fin del evento.</p>
                    </div>
                    <div class="form-group">
                      <label>Modalidad *</label>
                      <select v-model="eventForm.modalidad" class="form-input" @change="clearFieldError('modalidad')">
                        <option value="">Seleccionar...</option>
                        <option value="Presencial">Presencial</option>
                        <option value="Virtual">Virtual</option>
                        <option value="Híbrida">Híbrida</option>
                        <option value="Otro">Otro</option>
                      </select>
                      <input
                        v-if="eventForm.modalidad === 'Otro'"
                        v-model="eventForm.modalidadOtro"
                        type="text"
                        class="form-input"
                        placeholder="Especifique la modalidad..."
                        style="margin-top: 8px;"
                      />
                      <span v-if="fieldErrors.modalidad" class="field-error">{{ fieldErrors.modalidad }}</span>
                    </div>
                    <div class="form-group">
                      <label>Ubicación</label>
                      <input v-model="eventForm.location" type="text" class="form-input" placeholder="Ej: Calle 17A #12-34, Planta Fontibón" />
                    </div>
                    <div class="form-group">
                      <label>Persona de Contacto</label>
                      <input v-model="eventForm.personaContacto" type="text" class="form-input" placeholder="Nombre de la persona de contacto" />
                    </div>
                    <div class="form-group">
                      <label>Responsable de Ejecución *</label>
                      <select v-model="eventForm.user" class="form-input" required @change="clearFieldError('user')">
                        <option value="">Seleccionar...</option>
                        <option value="Camila Escobar">Camila Escobar</option>
                        <option value="Luis Eduardo Salcedo">Luis Eduardo Salcedo</option>
                        <option value="Paula Salcedo">Paula Salcedo</option>
                        <option value="Otro">Otro</option>
                      </select>
                      <input
                        v-if="eventForm.user === 'Otro'"
                        v-model="eventForm.userOtro"
                        type="text"
                        class="form-input"
                        placeholder="Especifique el responsable..."
                        style="margin-top: 8px;"
                        @input="clearFieldError('userOtro')"
                      />
                      <span v-if="fieldErrors.user" class="field-error">{{ fieldErrors.user }}</span>
                      <span v-if="fieldErrors.userOtro" class="field-error">{{ fieldErrors.userOtro }}</span>

                      <input
                        v-if="eventForm.modalidad === 'Otro'"
                        v-model="eventForm.modalidadOtro"
                        type="text"
                        class="form-input"
                        placeholder="Especifique la modalidad..."
                        style="margin-top: 8px;"
                      />
                    </div>
                  </div>
                </div>
              </div>

              <div class="section-grid">
                <!-- SECCIÓN C: ASIGNACIÓN DE EQUIPO -->
                <div class="section-card">
                  <div class="section-header">
                    <span class="section-badge">SECCIÓN C</span>
                    <span class="section-title">ASIGNACIÓN DE EQUIPO</span>
                  </div>
                  <div class="section-body">
                    <div class="form-group">
                      <label>Colaborador</label>
                      <input v-model="eventForm.leadAuditor" type="text" class="form-input" placeholder="Nombre del auditor líder" />
                    </div>
                    <div class="form-group">
                      <label>Equipo Co-auditor <span class="label-hint">(separar con coma)</span></label>
                      <input
                        :value="eventForm.coAuditors.join(', ')"
                        @input="eventForm.coAuditors = ($event.target as HTMLInputElement).value.split(',').map(s => s.trim()).filter(Boolean)"
                        type="text"
                        class="form-input"
                        placeholder="Ej: Ing. Luis Gómez, Lic. Clara Sánchez"
                      />
                      <div v-if="eventForm.coAuditors.length" class="tags-container">
                        <span v-for="(auditor, idx) in eventForm.coAuditors" :key="idx" class="tag-badge">
                          {{ auditor }}
                          <button type="button" class="tag-remove" @click="eventForm.coAuditors.splice(idx, 1)">×</button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                <!-- SECCIÓN D: NORMATIVA Y DOCUMENTOS -->
                <div class="section-card">
                  <div class="section-header">
                    <span class="section-badge">SECCIÓN D</span>
                    <span class="section-title">NORMATIVA / NOTAS</span>
                  </div>
                  <div class="section-body">
                    <div class="form-group">
                      <label>Normas Aplicables</label>
                      <div class="normas-select-row">
                        <select v-model="selectedNorma" class="form-input" style="flex:1;">
                          <option value="">Seleccionar norma...</option>
                          <option v-for="n in normasDisponibles" :key="n" :value="n">{{ n }}</option>
                          <option value="Otro">Otro</option>
                        </select>
                        <button type="button" class="btn-add-norma" @click="addNorma">+</button>
                      </div>
                      <input
                        v-if="selectedNorma === 'Otro'"
                        v-model="normaOtra"
                        type="text"
                        class="form-input"
                        placeholder="Especifique la norma..."
                        style="margin-top: 8px;"
                        @keyup.enter="addNorma"
                      />
                      <div v-if="eventForm.normas.length" class="tags-container">
                        <span v-for="(norma, idx) in eventForm.normas" :key="idx" class="tag-badge norma-badge">
                          [{{ norma }}]
                          <button type="button" class="tag-remove" @click="eventForm.normas.splice(idx, 1)">×</button>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class="modal-footer">
              <template v-if="viewingEvento">
                <button class="btn-primary" @click="showEventModal = false">Cerrar</button>
              </template>
              <template v-else>
                <button class="btn-outline" @click="showEventModal = false">Cancelar</button>
                <button class="btn-primary" :disabled="savingEvento" @click="handleSaveEvento">
                  {{ savingEvento ? 'Guardando...' : (editingEvento ? 'Actualizar' : 'Crear Evento') }}
                </button>
              </template>
            </div>
          </div>
        </div>

        <!-- Modal Descripción -->
        <div v-if="showDescModal" class="modal-overlay" @click.self="showDescModal = false">
          <div class="modal-card" style="max-width: 420px;">
            <div class="modal-header">
              <h3>Descripción</h3>
              <button class="modal-close" @click="showDescModal = false">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                </svg>
              </button>
            </div>
            <div class="modal-body">
              <p style="font-size: 0.9rem; color: var(--c-black); line-height: 1.6; white-space: pre-wrap;">{{ descModalText }}</p>
            </div>
            <div class="modal-footer">
              <button class="btn-primary" @click="showDescModal = false">Cerrar</button>
            </div>
          </div>
        </div>

        <!-- Modal Confirmar Eliminar Evento -->
        <div v-if="showDeleteEventModal" class="modal-overlay" @click.self="showDeleteEventModal = false">
          <div class="modal-card" style="max-width: 400px; text-align: center;">
            <div class="modal-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
            </div>
            <h3>¿Eliminar evento?</h3>
            <p style="font-size: 0.88rem; color: var(--c-gray); margin-bottom: 24px; line-height: 1.5;">
              Se eliminará el evento <strong>{{ eventoToDelete?.description }}</strong>. Esta acción no se puede deshacer.
            </p>
            <div class="modal-actions">
              <button class="btn-outline" @click="showDeleteEventModal = false">Cancelar</button>
              <button class="btn-primary" style="background: var(--c-danger);" :disabled="deletingEvento" @click="handleDeleteEvento">
                {{ deletingEvento ? 'Eliminando...' : 'Eliminar' }}
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { authService } from '@/services/api/authService'
import { useCRM } from '@/composables/useCRM'
import { usuarios as usuariosCreados, loadUsuarios } from '@/composables/useUsuariosStore'
import { quoteService } from '@/services/api/quoteService'
import { collaboratorService } from '@/services/api/collaboratorService'

import type { Cotizacion, EstadoCotizacion } from '@/types/crmTypes'
import { eventService } from '@/services/api/eventService'
import { clientService } from '@/services/api/clientService'
import { projectService } from '@/services/api/projectService'
import { tenderService } from '@/services/api/tenderService'
import { documentService } from '@/services/api/documentService'
import { userService } from '@/services/api/userService'
import { recaudoService, type RecaudoRow } from '@/services/api/recaudoService'
import { dashboardService, type DashboardKpis } from '@/services/api/dashboardService'
import { messageService } from '@/services/api/messageService'
import type { Evento, CreateEventoRequest, EventEntityType, EventType, DocumentoEntity } from '@/types/crmTypes'
import {
  createMockClientes,
  createMockProyectos,
  createMockCotizaciones,
  createMockEventos,
  createMockColaboradores,
  createMockLicitaciones,
  createMockUsuarios,
  createMockEntityNames,
} from '@/mock/adminDashboard'
import ProjectsList from '@/views/crm/ProjectsList.vue'
import LicitacionesList from '@/views/crm/LicitacionesList.vue'
import QuotesList from '@/views/crm/QuotesList.vue'
import ProjectDetail from '@/views/crm/ProjectDetail.vue'
import ColaboradoresList from '@/views/crm/ColaboradoresList.vue'
import UsuariosList from '@/views/crm/UsuariosList.vue'
import PanelUsersList from '@/views/crm/PanelUsersList.vue'
import DocumentosList from '@/views/crm/DocumentosList.vue'
import ColaboradorDetail from '@/views/crm/ColaboradorDetail.vue'

const router = useRouter()
const { clientes, proyectos, fetchClientes, fetchProyectos } = useCRM()
const currentRole = ref(authService.getUserRole() || 'admin')
const isSuperAdmin = computed(() => currentRole.value === 'superadmin')
const currentSection = ref(isSuperAdmin.value ? 'dashboard' : 'usuarios')
const sidebarOpen = ref(false)
const userAvatar = ref<string | null>(null)
const selectedProjectId = ref<number | null>(null)
const selectedColaboradorId = ref<number | null>(null)
const currentUser = authService.getCurrentUser()

function getUserInitials(name: string): string {
  if (!name) return 'U'
  const parts = name.trim().split(/\s+/)
  if (parts.length >= 2) {
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase()
  }
  return name.substring(0, 2).toUpperCase()
}

function viewProject(id: number) {
  selectedProjectId.value = id
}

function backToProjects() {
  selectedProjectId.value = null
}

function viewColaborador(id: number) {
  selectedColaboradorId.value = id
}

function backToColaboradores() {
  selectedColaboradorId.value = null
}

const recursosClientes = ref<Array<{ cliente: any; documentos: DocumentoEntity[] }>>([])
const loadingRecursos = ref(false)

async function fetchRecursosClientes() {
  loadingRecursos.value = true
  try {
    const result = await clientService.getAll({ page: 1, limit: 9999 })
    const allClientes = Array.isArray(result.data) ? result.data : (result as any).data?.data || []
    const clientesConRecursos = allClientes.filter((c: any) => c.showResources === true)

    const clientesDocs = await Promise.all(
      clientesConRecursos.map(async (cliente: any) => {
        try {
          const docs = await documentService.getByEntity('client', cliente.id)
          const docsFiltrados = docs.filter((d: any) => d.type === 'comunicaciones' || d.type === 'acta')
          return { cliente, documentos: docsFiltrados }
        } catch {
          return { cliente, documentos: [] }
        }
      })
    )

    recursosClientes.value = clientesDocs.filter(cd => cd.documentos.length > 0)
  } catch (e) {
    console.error('Error fetching recursos clientes:', e)
    recursosClientes.value = []
  } finally {
    loadingRecursos.value = false
  }
}

function viewRecursoDoc(doc: DocumentoEntity) {
  if (doc.url) window.open(doc.url, '_blank')
}

function downloadRecursoDoc(doc: DocumentoEntity) {
  if (doc.url) {
    const a = document.createElement('a')
    a.href = doc.url
    a.download = doc.name || 'documento'
    a.target = '_blank'
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
  }
}

async function deleteRecursoDoc(doc: DocumentoEntity) {
  if (!confirm(`¿Eliminar el documento "${doc.name}"?`)) return
  try {
    await documentService.delete(doc.id)
    recursoSuccessMessage.value = 'Documento eliminado exitosamente'
    setTimeout(() => { recursoSuccessMessage.value = '' }, 3000)
    fetchRecursosClientes()
  } catch (e) {
    console.error('Error deleting doc:', e)
  }
}

const recursoSuccessMessage = ref('')

// ========== ADM EVENTOS ==========
const eventos = ref<Evento[]>([])
const loadingEventos = ref(false)
const eventoFilterEntity = ref('')
const eventoFilterType = ref('')
const eventoFilterUser = ref('')
const eventoFilterModalidad = ref('')
const eventoFilterStatus = ref('')
const eventoSearchTerm = ref('')
const showEventModal = ref(false)
const showDeleteEventModal = ref(false)
const viewingEvento = ref(false)
const editingEvento = ref<Evento | null>(null)
const eventoToDelete = ref<Evento | null>(null)
const showDescModal = ref(false)
const descModalText = ref('')
const savingEvento = ref(false)
const deletingEvento = ref(false)
const eventFormError = ref('')
const fieldErrors = ref({
  title: '',
  type: '',
  startDate: '',
  modalidad: '',
  user: '',
  userOtro: '',
})

// ========== COLABORADORES & LICITACIONES ==========
const colaboradores = ref<any[]>([])
const licitaciones = ref<any[]>([])

function validateFields() {
  let valid = true
  fieldErrors.value = { title: '', type: '', startDate: '', modalidad: '', user: '', userOtro: '' }
  if (!eventForm.value.title.trim()) { fieldErrors.value.title = 'El título es obligatorio.'; valid = false }
  if (!eventForm.value.type) { fieldErrors.value.type = 'El tipo de evento es obligatorio.'; valid = false }
  if (!eventForm.value.startDate) { fieldErrors.value.startDate = 'La fecha de inicio es obligatoria.'; valid = false }
  if (!eventForm.value.modalidad) { fieldErrors.value.modalidad = 'La modalidad es obligatoria.'; valid = false }
  if (!eventForm.value.user.trim()) { fieldErrors.value.user = 'El responsable es obligatorio.'; valid = false }
  if (eventForm.value.user === 'Otro' && !eventForm.value.userOtro.trim()) { fieldErrors.value.userOtro = 'Debe especificar el responsable.'; valid = false }
  return valid
}

function clearFieldError(field: keyof typeof fieldErrors.value) {
  fieldErrors.value[field] = ''
}

const eventForm = ref({
  entityType: '' as EventEntityType | '',
  entityId: '',
  type: '',
  typeOtro: '',
  title: '',
  client: '',
  startDate: '',
  startTime: '08:00',
  endDate: '',
  endTime: '17:00',
  modalidad: '',
  modalidadOtro: '',
  location: '',
  description: '',
  user: '',
  userOtro: '',
  personaContacto: '',
  leadAuditor: '',
  coAuditors: [] as string[],
  normas: [] as string[],
  date: '',
})

interface EntityOption { id: number; label: string }
const entityOptions = ref<EntityOption[]>([])
const loadingEntities = ref(false)
const showEntityDropdown = ref(false)
const entitySearchText = ref('')

const filteredEntityOptions = computed(() => {
  if (!entitySearchText.value) return entityOptions.value
  const term = entitySearchText.value.toLowerCase()
  return entityOptions.value.filter(opt => opt.label.toLowerCase().includes(term))
})

const entityNameMap = ref<Record<string, string>>({})

function getEntityName(ev: Evento): string {
  if (!ev.entityType || !ev.entityId) return '-'
  const key = `${ev.entityType}:${ev.entityId}`
  return entityNameMap.value[key] || `ID: ${ev.entityId}`
}

async function loadEntityNames() {
  const map: Record<string, string> = {}
  try {
    const [clients, projects, quotes, tenders] = await Promise.all([
      clientService.getAll({ page: 1, limit: 9999 } as any).catch(() => ({ data: [] })),
      projectService.getAll({ page: 1, limit: 9999 }).catch(() => ({ data: [] })),
      quoteService.getAll({ page: 1, pageSize: 9999 } as any).catch(() => ({ data: [] })),
      tenderService.getAll({ page: 1, pageSize: 9999 } as any).catch(() => ({ data: [] })),
    ])
    clients.data.forEach((c: any) => { map[`client:${c.id}`] = c.razonSocial || c.name || `Cliente ${c.id}` })
    projects.data.forEach((p: any) => { map[`project:${p.id}`] = p.offer || p.code || `Proyecto ${p.id}` })
    quotes.data.forEach((q: any) => { map[`quote:${q.id}`] = q.code || `Cotización ${q.id}` })
    tenders.data.forEach((t: any) => { map[`tender:${t.id}`] = t.oferta || `Licitación ${t.id}` })
  } catch {}
  entityNameMap.value = map
}

function selectEntity(opt: EntityOption) {
  eventForm.value.entityId = String(opt.id)
  entitySearchText.value = opt.label
  showEntityDropdown.value = false
}

async function fetchEntityOptions(entityType: EventEntityType) {
  if (!entityType) { entityOptions.value = []; return }
  loadingEntities.value = true
  try {
    if (entityType === 'client') {
      const res = await clientService.getAll({ page: 1, limit: 9999 } as any)
      entityOptions.value = res.data.map(c => ({ id: c.id, label: `${c.razonSocial} — ${c.nit || ''}` })).sort((a, b) => a.label.localeCompare(b.label))
    } else if (entityType === 'project') {
      const res = await projectService.getAll({ page: 1, limit: 9999 })
      entityOptions.value = res.data.map(p => {
        const offer = p.offer || (p as unknown as Record<string, unknown>).oferta || ''
        const client = p.client?.name || (p as unknown as Record<string, unknown>).clienteRazonSocial || ''
        return { id: p.id, label: `${offer} — ${client}` }
      }).sort((a, b) => a.label.localeCompare(b.label))
    } else if (entityType === 'quote') {
      const res = await quoteService.getAll({ page: 1, pageSize: 9999 } as any)
      entityOptions.value = res.data.map(q => ({ id: q.id, label: `${q.code} — ${q.client?.name || ''}` })).sort((a, b) => a.label.localeCompare(b.label))
    } else if (entityType === 'tender') {
      const res = await tenderService.getAll({ page: 1, pageSize: 9999 } as any)
      entityOptions.value = res.data.map(t => ({ id: t.id, label: `${t.oferta} — ${t.clienteNombre || ''}` })).sort((a, b) => a.label.localeCompare(b.label))
    }
  } catch {
    entityOptions.value = []
  } finally {
    loadingEntities.value = false
  }
}

watch(() => eventForm.value.entityType, (val) => {
  eventForm.value.entityId = ''
  entitySearchText.value = ''
  showEntityDropdown.value = false
  fetchEntityOptions(val || null)
})

function handleEntitySelect(e: Event) {
  const val = (e.target as HTMLSelectElement).value
  eventForm.value.entityId = val
}

const entityLabel = computed(() => {
  const map: Record<string, string> = {
    client: 'Buscar Cliente',
    project: 'Buscar Proyecto',
    quote: 'Buscar Cotización',
    tender: 'Buscar Licitación',
  }
  return map[eventForm.value.entityType || ''] || 'Buscar Entidad'
})

const selectedNorma = ref('')
const normaOtra = ref('')

const normasDisponibles = [
  'ANAB',
  'ASEGURAMIENTO METROLÓGICO',
  'BPM',
  'HABILIDADES BLANDAS',
  'HACCP',
  'ISO 14001:2015',
  'ISO 22000:2018',
  'ISO 27001:2022',
  'ISO 31000:2018',
  'ISO 45001:2018',
  'ISO 9001:2015',
  'ISO IEC 17020:2012',
  'ISO IEC 17021:2015',
  'ISO IEC 17024:2012',
  'ISO IEC 17025:2017',
  'ISO IEC 17043:2023',
  'ISO IEC 17065:2012',
  'PRESIÓN',
  'RETIE',
  'RETILAP',
  'RITEL',
  'RTE INEN 069',
  'RUC',
  'SERVICIO AL CLIENTE Y VENTAS',
  'SG - SST',
  'SG TRANSVERSAL',
  'TRINORMA (ISO 9001:2015 - ISO 14001:2015 - ISO 45001:2018)',
  'VARIABLES',
  'Medición correcta de temperatura',
]

function addNorma() {
  const val = selectedNorma.value === 'Otro' ? normaOtra.value.trim() : selectedNorma.value
  if (val && !eventForm.value.normas.includes(val)) {
    eventForm.value.normas.push(val)
  }
  selectedNorma.value = ''
  normaOtra.value = ''
}

const eventosFiltradas = computed(() => {
  return eventos.value.filter(ev => {
    const matchEntity = !eventoFilterEntity.value || ev.entityType === eventoFilterEntity.value
    const matchType = !eventoFilterType.value || ev.type === eventoFilterType.value
    const matchUser = !eventoFilterUser.value || ev.user === eventoFilterUser.value
    const matchModalidad = !eventoFilterModalidad.value || ev.modalidad === eventoFilterModalidad.value
    const matchSearch = !eventoSearchTerm.value || ev.title?.toLowerCase().includes(eventoSearchTerm.value.toLowerCase()) || ev.client?.toLowerCase().includes(eventoSearchTerm.value.toLowerCase()) || ev.description?.toLowerCase().includes(eventoSearchTerm.value.toLowerCase()) || ev.user?.toLowerCase().includes(eventoSearchTerm.value.toLowerCase())
    const matchStatus = !eventoFilterStatus.value || (eventoFilterStatus.value === 'activo' ? !isEventoTerminado(ev) : isEventoTerminado(ev))
    return matchEntity && matchType && matchUser && matchModalidad && matchSearch && matchStatus
  })
})

function getEventoTypeLabel(type: string, typeOtro?: string): string {
  if (type === 'Otro' && typeOtro) return typeOtro
  return type || type
}

function getEntityLabel(entityType: string): string {
  const map: Record<string, string> = { client: 'Cliente', project: 'Proyecto', quote: 'Cotización', tender: 'Licitación' }
  return map[entityType] || entityType || '-'
}

function utcToLocal(utcStr: string): { date: string; time: string } {
  const d = new Date(utcStr)
  return {
    date: d.toLocaleDateString('sv-SE'),
    time: d.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' }),
  }
}

function formatEventDate(dateStr: string): string {
  if (!dateStr) return '-'
  return new Date(dateStr).toLocaleDateString('es-CO', {
    year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit',
  })
}

function isEventoTerminado(ev: Evento): boolean {
  if (!ev.endDate) return false
  return new Date(ev.endDate) < new Date()
}

const formEstadoLabel = computed(() => {
  const end = eventForm.value.endDate
  if (!end) return { text: 'Activo', cls: 'status-active' }
  return new Date(end) < new Date()
    ? { text: 'Terminado', cls: 'status-inactive' }
    : { text: 'Activo', cls: 'status-active' }
})

function openEventModal(ev?: Evento, mode: 'view' | 'edit' = 'edit') {
  viewingEvento.value = mode === 'view'
  if (ev) {
    editingEvento.value = ev
    eventForm.value = {
      entityType: ev.entityType || '',
      entityId: ev.entityId != null ? String(ev.entityId) : '',
      type: ev.type,
      typeOtro: ev.typeOtro || '',
      title: ev.title || '',
      client: ev.client || '',
      startDate: ev.date ? utcToLocal(ev.date).date : '',
      startTime: ev.date ? utcToLocal(ev.date).time : '08:00',
      endDate: ev.endDate ? utcToLocal(ev.endDate).date : '',
      endTime: ev.endDate ? utcToLocal(ev.endDate).time : '17:00',
      modalidad: ev.modalidad || '',
      modalidadOtro: ev.modalidadOtro || '',
      location: ev.location || '',
      description: ev.description,
      user: ev.user,
      userOtro: ev.userOtro || '',
      personaContacto: ev.personaContacto || '',
      leadAuditor: ev.leadAuditor || '',
      coAuditors: ev.coAuditors ? ev.coAuditors.split(',').map(s => s.trim()).filter(Boolean) : [],
      normas: ev.normas ? ev.normas.split(',').map(s => s.trim()).filter(Boolean) : [],
      date: ev.date ? ev.date.slice(0, 16) : '',
    }
    if (ev.entityType) {
      fetchEntityOptions(ev.entityType).then(() => {
        const match = entityOptions.value.find(o => o.id === ev.entityId)
        entitySearchText.value = match ? match.label : ''
      })
    }
  } else {
    editingEvento.value = null
    eventForm.value = {
      entityType: '', entityId: '', type: '', typeOtro: '', title: '', client: '',
      startDate: '', startTime: '08:00', endDate: '', endTime: '17:00',
      modalidad: '', modalidadOtro: '', location: '', description: '',
      user: '', userOtro: '', personaContacto: '', leadAuditor: '', coAuditors: [], normas: [], date: ''
    }
  }
  eventFormError.value = ''
  showEventModal.value = true
}

async function fetchEventos() {
  loadingEventos.value = true
  try {
    const response = await eventService.getAll({ pageSize: 9999 })
    eventos.value = response.data
    await loadEntityNames()
    buildCalendarEvents()
  } catch {
    eventos.value = []
  } finally {
    loadingEventos.value = false
  }
}

async function fetchColaboradores() {
  try {
    const response = await collaboratorService.getAll()
    colaboradores.value = Array.isArray(response) ? response : []
  } catch {
    colaboradores.value = []
  }
}

async function fetchLicitaciones() {
  try {
    const response = await tenderService.getAll({ page: 1, pageSize: 9999 } as any)
    licitaciones.value = response.data
  } catch {
    licitaciones.value = []
  }
}

async function handleSaveEvento() {
  eventFormError.value = ''
  if (!validateFields()) return

  if (eventForm.value.startDate && eventForm.value.endDate) {
    const start = new Date(`${eventForm.value.startDate}T${eventForm.value.startTime}`)
    const end = new Date(`${eventForm.value.endDate}T${eventForm.value.endTime}`)
    if (end < start) { eventFormError.value = 'La fecha de fin no puede ser anterior a la fecha de inicio.'; return }
  }

  savingEvento.value = true
  try {
    const startISO = new Date(`${eventForm.value.startDate}T${eventForm.value.startTime}`).toISOString()
    const endISO = eventForm.value.endDate
      ? new Date(`${eventForm.value.endDate}T${eventForm.value.endTime}`).toISOString()
      : startISO

    const payload: CreateEventoRequest = {
      entityType: eventForm.value.entityType && eventForm.value.entityId ? eventForm.value.entityType : null,
      entityId: eventForm.value.entityType && eventForm.value.entityId ? (Number(eventForm.value.entityId) || null) : null,
      type: eventForm.value.type,
      typeOtro: eventForm.value.type === 'Otro' ? eventForm.value.typeOtro.trim() : undefined,
      title: eventForm.value.title.trim(),
      client: eventForm.value.client.trim(),
      modalidad: eventForm.value.modalidad,
      modalidadOtro: eventForm.value.modalidad === 'Otro' ? eventForm.value.modalidadOtro.trim() : undefined,
      location: eventForm.value.location.trim(),
      personaContacto: eventForm.value.personaContacto.trim(),
      description: eventForm.value.description.trim(),
      user: eventForm.value.user,
      userOtro: eventForm.value.user === 'Otro' ? eventForm.value.userOtro.trim() : undefined,
      date: startISO,
      endDate: endISO,
      leadAuditor: eventForm.value.leadAuditor.trim(),
      coAuditors: eventForm.value.coAuditors.length > 0 ? eventForm.value.coAuditors.join(', ') : undefined,
      normas: eventForm.value.normas.length > 0 ? eventForm.value.normas.join(', ') : undefined,
    }

    if (editingEvento.value) {
      await eventService.update(editingEvento.value.id, payload)
    } else {
      await eventService.create(payload)
    }
    showEventModal.value = false
    await fetchEventos()
  } catch (e) {
    eventFormError.value = e instanceof Error ? e.message : 'Error al guardar el evento'
  } finally {
    savingEvento.value = false
  }
}

function openDescModal(ev: Evento) {
  descModalText.value = ev.description || 'Sin descripción'
  showDescModal.value = true
}

function confirmDeleteEvent(ev: Evento) {
  eventoToDelete.value = ev
  showDeleteEventModal.value = true
}

async function handleDeleteEvento() {
  if (!eventoToDelete.value) return
  deletingEvento.value = true
  try {
    await eventService.delete(eventoToDelete.value.id)
    showDeleteEventModal.value = false
    eventoToDelete.value = null
    await fetchEventos()
  } catch (e) {
    alert(e instanceof Error ? e.message : 'Error al eliminar el evento')
  } finally {
    deletingEvento.value = false
  }
}

// ========== RECAUDOS ==========
interface RecaudoView extends RecaudoRow {
  nombre: string
  cedula: string
  periodicidad: string
}

interface RecaudoForm {
  clientId: number
  nombre: string
  cedula: string
  fecha: string
  valor: number
  periodicidad: string
}

const recaudosList = ref<RecaudoRow[]>([])
const recaudosLoading = ref(false)
const recaudoError = ref('')
const recaudoSaving = ref(false)

const PERIOD_LABEL: Record<string, string> = {
  diario: 'Diaria',
  diaria: 'Diaria',
  mensual: 'Mensual',
  quincenal: 'Quincenal',
  semanal: 'Semanal',
}

function periodLabel(value?: string): string {
  if (!value) return ''
  const normalized = value.trim().toLowerCase()
  return PERIOD_LABEL[normalized] || value
}

function toInputFecha(value?: string): string {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`
}

function fromInputFecha(value: string): string {
  if (!value) return ''
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? value : date.toISOString()
}

function recaudoErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof Error && error.message && error.message !== 'Sesión expirada') return error.message
  return fallback
}

function resolveRecaudo(row: RecaudoRow): RecaudoView {
  const viajero = usuariosCreados.value.find((u) => u.id === row.clientId)
  const client = row.client
  return {
    ...row,
    fecha: toInputFecha(row.fecha),
    nombre: client?.name || viajero?.name || '—',
    cedula: client?.cedula || viajero?.cedula || '—',
    periodicidad: periodLabel(client?.periodicidad || viajero?.periodicidad),
  }
}

async function fetchRecaudos() {
  recaudosLoading.value = true
  recaudoError.value = ''
  try {
    const response = await recaudoService.getAll({ page: 1, limit: 9999 })
    recaudosList.value = response.data
  } catch (error) {
    recaudosList.value = []
    recaudoError.value = recaudoErrorMessage(error, 'No se pudieron cargar los recaudos.')
  } finally {
    recaudosLoading.value = false
  }
}

function formatFecha(value: string): string {
  if (!value) return ''
  if (!value.includes('T')) return value
  const [datePart, timePart = '00:00'] = value.split('T')
  const [y, m, d] = datePart.split('-')
  if (!y || !m || !d) return value
  return `${d}/${m}/${y} ${timePart.slice(0, 5)}`
}

// ========== FILTROS DE RECAUDOS ==========
const recaudoSearch = ref('')
const recaudoMes = ref('')
const recaudoDesde = ref('')
const recaudoHasta = ref('')

const recaudosFiltrados = computed(() => {
  const rows = recaudosList.value.map(resolveRecaudo)
  const q = recaudoSearch.value.trim().toLowerCase()
  const mes = recaudoMes.value
  const desde = recaudoDesde.value
  const hasta = recaudoHasta.value
  if (!q && !mes && !desde && !hasta) return rows
  return rows.filter((r) => {
    if (q && !`${r.nombre} ${r.cedula}`.toLowerCase().includes(q)) return false
    if (mes && !r.fecha.startsWith(mes)) return false
    const fecha = r.fecha.slice(0, 10)
    if (desde && fecha < desde) return false
    if (hasta && fecha > hasta) return false
    return true
  })
})

function clearRecaudoFilters() {
  recaudoSearch.value = ''
  recaudoMes.value = ''
  recaudoDesde.value = ''
  recaudoHasta.value = ''
}

// ========== SELECCIÓN DE RECAUDOS ==========
const recaudosSeleccionados = ref<number[]>([])

const todosRecaudosSeleccionados = computed(() =>
  recaudosFiltrados.value.length > 0 && recaudosFiltrados.value.every((r) => recaudosSeleccionados.value.includes(r.id)),
)

function toggleRecaudo(id: number) {
  const idx = recaudosSeleccionados.value.indexOf(id)
  if (idx === -1) recaudosSeleccionados.value.push(id)
  else recaudosSeleccionados.value.splice(idx, 1)
}

function toggleAllRecaudos() {
  const ids = recaudosFiltrados.value.map((r) => r.id)
  if (todosRecaudosSeleccionados.value) {
    recaudosSeleccionados.value = recaudosSeleccionados.value.filter((id) => !ids.includes(id))
  } else {
    recaudosSeleccionados.value = Array.from(new Set([...recaudosSeleccionados.value, ...ids]))
  }
}

const recaudoSelected = ref<RecaudoView | null>(null)
const recaudoEdit = ref<RecaudoView | null>(null)
const showCreateRecaudo = ref(false)
const recaudoForm = ref<RecaudoForm>({ clientId: 0, nombre: '', cedula: '', fecha: '', valor: 0, periodicidad: '' })

const recaudoFormValid = computed(() => {
  const f = recaudoForm.value
  return f.clientId > 0 && !!f.fecha.trim() && !!f.valor
})

function openCreateRecaudo() {
  recaudoForm.value = { clientId: 0, nombre: '', cedula: '', fecha: '', valor: 0, periodicidad: '' }
  recaudoError.value = ''
  showCreateRecaudo.value = true
}

const showRecaudoOptions = ref(false)

const recaudoUsuariosFiltrados = computed(() => {
  const query = normalizeStr(recaudoForm.value.nombre)
  if (!query) return usuariosCreados.value
  return usuariosCreados.value.filter((u) => normalizeStr(u.name).includes(query) || u.cedula.includes(query))
})

watch(
  () => recaudoForm.value.nombre,
  (name) => {
    const user = usuariosCreados.value.find((u) => u.name === name)
    recaudoForm.value.cedula = user ? user.cedula : ''
    recaudoForm.value.periodicidad = user ? (PERIOD_LABEL[String(user.periodicidad).toLowerCase()] || 'Mensual') : ''
    recaudoForm.value.clientId = user ? user.id : 0
  },
)

function selectRecaudoUsuario(user: (typeof usuariosCreados.value)[number]) {
  recaudoForm.value.nombre = user.name
  showRecaudoOptions.value = false
}

function onValorInput(event: Event, target: 'create' | 'edit') {
  const digits = (event.target as HTMLInputElement).value.replace(/[^\d]/g, '')
  const value = digits ? Number.parseInt(digits, 10) : 0
  if (target === 'create') {
    recaudoForm.value.valor = value
  } else if (recaudoEdit.value) {
    recaudoEdit.value.valor = value
  }
}

async function createRecaudo(): Promise<RecaudoView | null> {
  const f = recaudoForm.value
  if (!recaudoFormValid.value) return null
  recaudoSaving.value = true
  recaudoError.value = ''
  try {
    const created = await recaudoService.create({
      clientId: f.clientId,
      fecha: fromInputFecha(f.fecha),
      valor: f.valor,
    })
    showCreateRecaudo.value = false
    await fetchRecaudos()
    const row = created && created.id
      ? created
      : recaudosList.value.filter((r) => r.clientId === f.clientId).sort((a, b) => String(b.createdAt).localeCompare(String(a.createdAt)))[0]
    return row ? resolveRecaudo(row) : null
  } catch (error) {
    recaudoError.value = recaudoErrorMessage(error, 'No se pudo crear el recaudo.')
    return null
  } finally {
    recaudoSaving.value = false
  }
}

async function removeRecaudo(id: number) {
  if (!window.confirm('¿Estás seguro de eliminar este recaudo?')) return
  recaudoError.value = ''
  try {
    await recaudoService.remove(id)
    recaudosSeleccionados.value = recaudosSeleccionados.value.filter((selected) => selected !== id)
    await fetchRecaudos()
  } catch (error) {
    recaudoError.value = recaudoErrorMessage(error, 'No se pudo eliminar el recaudo.')
  }
}

function openEditRecaudo(r: RecaudoView) {
  recaudoEdit.value = { ...r }
  recaudoError.value = ''
}

async function saveRecaudo(): Promise<RecaudoView | null> {
  const edit = recaudoEdit.value
  if (!edit) return null
  recaudoSaving.value = true
  recaudoError.value = ''
  try {
    const updated = await recaudoService.update(edit.id, {
      fecha: fromInputFecha(edit.fecha),
      valor: edit.valor,
    })
    recaudoEdit.value = null
    await fetchRecaudos()
    return updated && updated.id ? resolveRecaudo(updated) : resolveRecaudo(edit)
  } catch (error) {
    recaudoError.value = recaudoErrorMessage(error, 'No se pudo guardar el recaudo.')
    return null
  } finally {
    recaudoSaving.value = false
  }
}

// ========== MENSAJE DEL RECAUDO ==========
const showMsgRecaudo = ref(false)
const msgTarget = ref<RecaudoView | null>(null)
const msgText = ref('')
const msgSending = ref(false)
const msgSent = ref(false)
const msgConfirm = ref(false)
const msgError = ref('')
let msgSentTimer = 0

function openMsgRecaudo(r: RecaudoView) {
  msgTarget.value = r
  msgText.value = `Hola ${r.nombre}, te recordamos tu recaudo de ${formatCurrency(r.valor)} con fecha ${formatFecha(r.fecha)} (${r.periodicidad}). ¡Gracias por mantener tus pagos al día!`
  msgSending.value = false
  msgConfirm.value = false
  msgError.value = ''
  showMsgRecaudo.value = true
}

async function createRecaudoAndMsg() {
  const created = await createRecaudo()
  if (created) openMsgRecaudo(created)
}

async function saveRecaudoAndMsg() {
  const saved = await saveRecaudo()
  if (saved) openMsgRecaudo(saved)
}

function closeMsgRecaudo() {
  showMsgRecaudo.value = false
  msgConfirm.value = false
  msgError.value = ''
}

function askSendRecaudoMsg() {
  if (msgSending.value || !msgText.value.trim()) return
  msgError.value = ''
  msgConfirm.value = true
}

function resolveMsgPhone(): string | null {
  const target = msgTarget.value
  if (!target) return null
  const viajero = usuariosCreados.value.find((u) => u.id === target.clientId)
  return messageService.toInternationalPhone(viajero?.celular || target.client?.phone || null)
}

async function sendRecaudoMsg() {
  if (msgSending.value || !msgText.value.trim()) return
  msgConfirm.value = false
  const phone = resolveMsgPhone()
  if (!phone) {
    msgError.value = 'El viajero no tiene celular registrado.'
    return
  }
  msgSending.value = true
  try {
    await messageService.send(phone, msgText.value.trim())
    showMsgRecaudo.value = false
    msgSent.value = true
    clearTimeout(msgSentTimer)
    msgSentTimer = window.setTimeout(() => {
      msgSent.value = false
    }, 4000)
  } catch (error) {
    msgError.value = recaudoErrorMessage(error, 'No se pudo enviar el mensaje.')
  } finally {
    msgSending.value = false
  }
}

const navItems = [
  { id: 'dashboard', label: 'Dashboard', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>' },
  { id: 'usuarios', label: 'Usuarios', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { id: 'panel-usuarios', label: 'Usuarios del panel', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>' },
  { id: 'recaudos', label: 'Recaudos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>' },
].filter(
  (item) =>
    isSuperAdmin.value ||
    item.id === 'usuarios' ||
    item.id === 'recaudos',
)

// ========== CALENDARIO ==========
interface CalEvent {
  title: string
  client: string
  time: string
  type: 'audit' | 'training' | 'meeting' | 'commitment'
  typeLabel: string
  rawType: string
  responsible?: string
  description?: string
  modalidad?: string
}

interface CalDay {
  day: number
  dateStr: string
  otherMonth: boolean
  isToday: boolean
  events: CalEvent[]
}

const calCurrentDate = ref(new Date())
const calSelectedDate = ref<string | null>(null)

const calendarEvents = ref<Record<string, CalEvent[]>>({})

function mapEventType(type: string): CalEvent['type'] {
  const t = type.toLowerCase()
  if (t.includes('auditor')) return 'audit'
  if (t.includes('capacitación') || t.includes('capacitacion') || t.includes('formación') || t.includes('formacion') || t.includes('taller') || t.includes('pasantía') || t.includes('pasantia')) return 'training'
  if (t.includes('reunión') || t.includes('reunion') || t.includes('asesoría') || t.includes('asesoria') || t.includes('diagnóstico') || t.includes('diagnostico')) return 'meeting'
  return 'commitment'
}

function mapEventTypeLabel(type: string): string {
  const calType = mapEventType(type)
  if (calType === 'audit') return 'Auditoría'
  if (calType === 'training') return 'Capacitación'
  if (calType === 'meeting') return 'Reunión'
  return 'Compromiso'
}

function formatTime(dateStr: string): string {
  if (!dateStr) return ''
  return new Date(dateStr).toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit', hour12: false })
}

function buildCalendarEvents() {
  const map: Record<string, CalEvent[]> = {}
  for (const ev of eventos.value) {
    if (!ev.date) continue
    const start = new Date(ev.date)
    const startStr = `${start.getFullYear()}-${String(start.getMonth() + 1).padStart(2, '0')}-${String(start.getDate()).padStart(2, '0')}`
    const startTime = formatTime(ev.date)
    const endTime = ev.endDate ? formatTime(ev.endDate) : ''

    const calEvent: CalEvent = {
      title: ev.title || ev.type || 'Evento',
      client: ev.client || getEntityName(ev),
      time: startTime || 'Sin hora',
      type: mapEventType(ev.type),
      typeLabel: mapEventTypeLabel(ev.type),
      rawType: ev.type || '',
      responsible: ev.user || '',
      description: ev.description || undefined,
      modalidad: ev.modalidad || undefined,
    }

    if (!map[startStr]) map[startStr] = []
    map[startStr].push(calEvent)

    if (ev.endDate) {
      const end = new Date(ev.endDate)
      const endStr = `${end.getFullYear()}-${String(end.getMonth() + 1).padStart(2, '0')}-${String(end.getDate()).padStart(2, '0')}`
      if (endStr === startStr) {
        const last = map[startStr][map[startStr].length - 1]
        if (last === calEvent) last.time = (startTime || '') + (endTime ? ` - ${endTime}` : '')
      } else {
        const current = new Date(start)
        current.setDate(current.getDate() + 1)
        const endDateOnly = new Date(end.getFullYear(), end.getMonth(), end.getDate())
        while (current < endDateOnly) {
          const midStr = `${current.getFullYear()}-${String(current.getMonth() + 1).padStart(2, '0')}-${String(current.getDate()).padStart(2, '0')}`
          if (!map[midStr]) map[midStr] = []
          map[midStr].push({
            ...calEvent,
            time: '',
          })
          current.setDate(current.getDate() + 1)
        }
        if (!map[endStr]) map[endStr] = []
        map[endStr].push({
          ...calEvent,
          time: endTime || '',
        })
      }
    }
  }
  calendarEvents.value = map
}

const monthNames = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

const calMonthName = computed(() => monthNames[calCurrentDate.value.getMonth()])
const calYear = computed(() => calCurrentDate.value.getFullYear())

const calDays = computed<CalDay[]>(() => {
  const year = calCurrentDate.value.getFullYear()
  const month = calCurrentDate.value.getMonth()
  const today = new Date()

  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)

  let startDayOfWeek = firstDay.getDay()
  if (startDayOfWeek === 0) startDayOfWeek = 7

  const days: CalDay[] = []

  for (let i = startDayOfWeek - 1; i > 0; i--) {
    const d = new Date(year, month, 1 - i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({
      day: d.getDate(),
      dateStr,
      otherMonth: true,
      isToday: false,
      events: calendarEvents.value[dateStr] || []
    })
  }

  for (let d = 1; d <= lastDay.getDate(); d++) {
    const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
    const isToday = today.getFullYear() === year && today.getMonth() === month && today.getDate() === d
    days.push({
      day: d,
      dateStr,
      otherMonth: false,
      isToday,
      events: calendarEvents.value[dateStr] || []
    })
  }

  const remaining = 42 - days.length
  for (let i = 1; i <= remaining; i++) {
    const d = new Date(year, month + 1, i)
    const dateStr = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
    days.push({
      day: d.getDate(),
      dateStr,
      otherMonth: true,
      isToday: false,
      events: calendarEvents.value[dateStr] || []
    })
  }

  return days
})

const calSelectedDateFormatted = computed(() => {
  if (!calSelectedDate.value) return ''
  const [y, m, d] = calSelectedDate.value.split('-')
  const date = new Date(parseInt(y), parseInt(m) - 1, parseInt(d))
  return `${date.getDate()} de ${monthNames[date.getMonth()]} ${date.getFullYear()}`
})

const calSelectedDayEvents = computed(() => {
  if (!calSelectedDate.value) return []
  return calendarEvents.value[calSelectedDate.value] || []
})

const calMonthStats = computed(() => {
  const year = calCurrentDate.value.getFullYear()
  const month = calCurrentDate.value.getMonth()
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59)

  const counts: Record<string, number> = {}
  const seenKeys = new Set<string>()

  eventos.value.forEach(ev => {
    if (!ev.date) return
    const evStart = new Date(ev.date)
    const evEnd = ev.endDate ? new Date(ev.endDate) : evStart
    if (evStart > monthEnd || evEnd < monthStart) return
    const evtKey = `${ev.title}|${ev.client}|${ev.type}`
    if (seenKeys.has(evtKey)) return
    seenKeys.add(evtKey)
    const label = ev.type || ''
    if (!counts[label]) counts[label] = 0
    counts[label]++
  })

  const seenTypes: Record<string, string> = {}
  eventos.value.forEach(ev => {
    if (!ev.type) return
    if (!seenTypes[ev.type]) seenTypes[ev.type] = ev.type
  })

  return { counts, seen: seenTypes }
})

const calTypeLabels = computed(() => {
  const defaults: Record<string, string> = { audit: 'Auditorías', training: 'Capacitaciones', meeting: 'Reuniones', commitment: 'Compromisos' }
  const labels: Record<string, string> = {}
  for (const [k, v] of Object.entries(calMonthStats.value.seen)) {
    labels[k] = v || defaults[k]
  }
  for (const k of Object.keys(defaults)) {
    if (!labels[k]) labels[k] = defaults[k]
  }
  return labels
})

const rawTypeColorMap = computed(() => {
  const typeFirstColor: Record<string, string> = { audit: '#F59E0B', training: '#10B981', meeting: '#3B82F6', commitment: '#8B5CF6' }
  const extraColors = ['#EF4444', '#EC4899', '#06B6D4', '#84CC16', '#F97316', '#14B8A6']
  const counts = calMonthStats.value.counts
  const map: Record<string, string> = {}
  const usedPerType: Record<string, number> = {}
  let extraIdx = 0
  for (const rawType of Object.keys(counts)) {
    const calType = mapEventType(rawType)
    const idx = usedPerType[calType] || 0
    let color: string
    if (idx === 0) {
      color = typeFirstColor[calType] || extraColors[extraIdx % extraColors.length]
    } else {
      color = extraColors[extraIdx % extraColors.length]
      extraIdx++
    }
    map[rawType] = color
    usedPerType[calType] = idx + 1
  }
  return map
})

const calSummaryItems = computed(() => {
  const counts = calMonthStats.value.counts
  return Object.entries(counts)
    .filter(([, c]) => c > 0)
    .map(([rawType, count]) => ({ color: rawTypeColorMap.value[rawType] || '#6B7280', label: rawType, count }))
})

const calMonthEventList = computed(() => {
  const year = calCurrentDate.value.getFullYear()
  const month = calCurrentDate.value.getMonth()
  const monthStart = new Date(year, month, 1)
  const monthEnd = new Date(year, month + 1, 0, 23, 59, 59)
  const items: { startDate: string; endDate: string; title: string; rawType: string; color: string; time: string }[] = []
  const seenKeys = new Set<string>()
  const monthNames = ['ENE', 'FEB', 'MAR', 'ABR', 'MAY', 'JUN', 'JUL', 'AGO', 'SEP', 'OCT', 'NOV', 'DIC']
  const fmtDate = (d: string) => { const dt = new Date(d); return `${dt.getDate()} ${monthNames[dt.getMonth()]}` }

  eventos.value.forEach(ev => {
    if (!ev.date) return
    const evStart = new Date(ev.date)
    const evEnd = ev.endDate ? new Date(ev.endDate) : evStart
    const overlaps = evStart <= monthEnd && evEnd >= monthStart
    if (!overlaps) return
    const evtKey = `${ev.title}|${ev.client}|${ev.type}`
    if (seenKeys.has(evtKey)) return
    seenKeys.add(evtKey)
    const rawType = ev.type || ''
    items.push({
      startDate: fmtDate(ev.date),
      endDate: ev.endDate ? fmtDate(ev.endDate) : '',
      title: ev.title || ev.type || 'Evento',
      rawType,
      color: rawTypeColorMap.value[rawType] || '#6B7280',
      time: formatTime(ev.date) + (ev.endDate ? ` - ${formatTime(ev.endDate)}` : ''),
    })
  })
  items.sort((a, b) => {
    const dA = parseInt(a.startDate)
    const dB = parseInt(b.startDate)
    return dA - dB
  })
  return items
})

function calPrevMonth() {
  const d = calCurrentDate.value
  calCurrentDate.value = new Date(d.getFullYear(), d.getMonth() - 1, 1)
  calSelectedDate.value = null
}

function calNextMonth() {
  const d = calCurrentDate.value
  calCurrentDate.value = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  calSelectedDate.value = null
}

function calGoToday() {
  calCurrentDate.value = new Date()
  const today = new Date()
  calSelectedDate.value = `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
}

function calSelectDay(day: CalDay) {
  calSelectedDate.value = day.dateStr
}

const cotizaciones = ref<Cotizacion[]>([])

async function fetchCotizacionesData() {
  try {
    const response = await quoteService.getAll({ page: 1, pageSize: 9999 })
    cotizaciones.value = response.data
  } catch {
    cotizaciones.value = []
  }
}

const setSection = (section: string) => {
  if (
    !isSuperAdmin.value &&
    section !== 'usuarios' &&
    section !== 'recaudos'
  )
    return
  const item = navItems.find((n) => n.id === section)
  if (item && 'route' in item && item.route) {
    router.push(item.route)
    return
  }
  currentSection.value = section
  sidebarOpen.value = false
  if (section === 'recaudos' && recaudosList.value.length === 0 && !recaudosLoading.value) {
    fetchRecaudos()
  }
}

const handleLogout = () => {
  if (confirm('¿Estás seguro de cerrar sesión?')) {
    authService.logout()
    router.push('/')
  }
}

const totalClientes = computed(() => clientes.value.length)

function normalizeStr(s: string): string {
  return (s || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()
}

function matchStatus(status: string, target: string): boolean {
  return normalizeStr(status).includes(normalizeStr(target))
}

const proyectosEnEjecucion = computed(() => proyectos.value.filter(p => matchStatus(p.status, 'ejecucion')).length)

const usuariosRegistrados = ref(0)
const usuariosActivos = ref(0)

async function fetchUsuarios() {
  try {
    const users = await userService.getAll()
    if (users.length > 0) {
      usuariosRegistrados.value = users.length
      usuariosActivos.value = users.filter((u) => u.isActive !== false).length
      return
    }
  } catch {
    // sin datos del servicio: se usa el mock
  }
  const mocks = createMockUsuarios()
  usuariosRegistrados.value = mocks.length
  usuariosActivos.value = mocks.filter((u) => u.isActive !== false).length
}

// ========== FONDO VIAJERO, TOP PRESUPUESTO, ALERTAS, TIEMPO REAL ==========
const dashboardKpis = ref<DashboardKpis>({ fondoViajero: 0, usuariosRegistrados: 0, alertas: [] })
const dashboardLoading = ref(false)
const dashboardError = ref('')
const lastUpdated = ref(Date.now())
const nowTick = ref(Date.now())

async function fetchDashboard() {
  dashboardLoading.value = true
  dashboardError.value = ''
  try {
    const kpis = await dashboardService.getKpis()
    dashboardKpis.value = kpis
    if (kpis.usuariosRegistrados > 0) {
      usuariosRegistrados.value = kpis.usuariosRegistrados
    }
    lastUpdated.value = Date.now()
  } catch (error) {
    dashboardError.value = recaudoErrorMessage(error, 'No se pudo cargar el dashboard.')
  } finally {
    dashboardLoading.value = false
  }
}

const fondoViajeroTotal = computed(() => dashboardKpis.value.fondoViajero)

const topUsuariosPresupuesto = computed(() =>
  [...usuariosCreados.value]
    .sort((a, b) => b.saldo - a.saldo)
    .slice(0, 5)
    .map((u) => ({ id: u.id, name: u.name, presupuesto: u.saldo })),
)

const maxPresupuesto = computed(() => Math.max(...topUsuariosPresupuesto.value.map((u) => u.presupuesto), 1))

function rankPercent(value: number): number {
  return Math.round((value / maxPresupuesto.value) * 100)
}

const alertasInactividad = computed(() =>
  [...dashboardKpis.value.alertas].sort((a, b) => b.diasInactividad - a.diasInactividad),
)

const lastUpdatedLabel = computed(() => {
  const seconds = Math.max(0, Math.round((nowTick.value - lastUpdated.value) / 1000))
  if (seconds < 5) return 'ahora mismo'
  if (seconds < 60) return `hace ${seconds} s`
  const minutes = Math.floor(seconds / 60)
  if (minutes < 60) return `hace ${minutes} min`
  return `hace ${Math.floor(minutes / 60)} h`
})

// ========== CIERRE PRESUPUESTAL MENSUAL (AUTOMÁTICO) ==========
interface CierrePresupuestal {
  key: string
  label: string
  ingresos: number
  egresos: number
  utilidad: number
  proyectos: number
  estado: 'Cerrado' | 'En curso'
}

function buildCierre(offset: number): CierrePresupuestal {
  const now = new Date()
  const start = new Date(now.getFullYear(), now.getMonth() - offset, 1)
  const end = new Date(now.getFullYear(), now.getMonth() - offset + 1, 1)
  const delMes = proyectos.value.filter((p) => {
    const created = new Date(p.createdAt)
    return created >= start && created < end
  })
  let ingresos = 0
  let egresos = 0
  delMes.forEach((p) => {
    ingresos += p.totalCost || 0
    egresos += (p.services || []).reduce((sum, svc) => sum + (svc.providerTotalPrice || 0), 0)
  })
  return {
    key: `${start.getFullYear()}-${start.getMonth()}`,
    label: start.toLocaleDateString('es-CO', { month: 'long', year: 'numeric' }),
    ingresos,
    egresos,
    utilidad: Math.max(0, ingresos - egresos),
    proyectos: delMes.length,
    estado: offset === 0 ? 'En curso' : 'Cerrado',
  }
}

const cierresPresupuestales = computed(() => [0, 1, 2, 3].map((offset) => buildCierre(offset)))
const cierreActual = computed(() => cierresPresupuestales.value[0])

const proximoCierreFecha = computed(() => {
  const now = new Date()
  const lastDay = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return lastDay.toLocaleDateString('es-CO', { day: '2-digit', month: 'long' })
})

let clockTimer: number | undefined
let pollTimer: number | undefined

async function refreshDashboard() {
  await Promise.allSettled([fetchUsuarios(), fetchDashboard()])
  nowTick.value = Date.now()
}



const totalFacturacion = computed(() => {
  return proyectos.value.reduce((sum, p) => {
    if (!p.services || p.services.length === 0) return sum
    return sum + p.services.reduce((sSum, svc) => {
      const utilidad = (svc.totalPrice || 0) - (svc.providerTotalPrice || 0) - (svc.ica || 0) - (svc.simpleTax || 0)
      return sSum + Math.max(0, utilidad)
    }, 0)
  }, 0)
})

const facturacionMesActual = computed(() => {
  const now = new Date()
  const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  return proyectos.value
    .filter(p => new Date(p.createdAt) >= startOfMonth)
    .reduce((sum, p) => {
      if (!p.services || p.services.length === 0) return sum
      return sum + p.services.reduce((sSum, svc) => {
        const utilidad = (svc.totalPrice || 0) - (svc.providerTotalPrice || 0) - (svc.ica || 0) - (svc.simpleTax || 0)
        return sSum + Math.max(0, utilidad)
      }, 0)
    }, 0)
})

const facturacionMesAnterior = computed(() => {
  const now = new Date()
  const startOfPrevMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const endOfPrevMonth = new Date(now.getFullYear(), now.getMonth(), 0)
  return proyectos.value
    .filter(p => {
      const d = new Date(p.createdAt)
      return d >= startOfPrevMonth && d <= endOfPrevMonth
    })
    .reduce((sum, p) => {
      if (!p.services || p.services.length === 0) return sum
      return sum + p.services.reduce((sSum, svc) => {
        const utilidad = (svc.totalPrice || 0) - (svc.providerTotalPrice || 0) - (svc.ica || 0) - (svc.simpleTax || 0)
        return sSum + Math.max(0, utilidad)
      }, 0)
    }, 0)
})

const facturacionChange = computed(() => {
  if (facturacionMesAnterior.value === 0) return facturacionMesActual.value > 0 ? 100 : 0
  return Math.round((facturacionMesActual.value - facturacionMesAnterior.value) / facturacionMesAnterior.value * 100)
})

const tasaConversion = computed(() => {
  if (totalClientes.value === 0) return 0
  return Math.round(proyectosEnEjecucion.value / totalClientes.value * 100)
})

function formatCurrency(value: number): string {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value)
}

function getStatusLabel(status: EstadoCotizacion): string {
  const map: Record<EstadoCotizacion, string> = {
    pendiente: 'Pendiente',
    enviada: 'Enviada',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
    vencida: 'Vencida',
  }
  return map[status] || status
}

function seedDashboardIfEmpty() {
  if (clientes.value.length === 0) clientes.value = createMockClientes()
  if (proyectos.value.length === 0) proyectos.value = createMockProyectos()
  if (cotizaciones.value.length === 0) cotizaciones.value = createMockCotizaciones()
  if (eventos.value.length === 0) {
    eventos.value = createMockEventos()
    entityNameMap.value = createMockEntityNames()
    buildCalendarEvents()
  }
  if (colaboradores.value.length === 0) colaboradores.value = createMockColaboradores()
  if (licitaciones.value.length === 0) licitaciones.value = createMockLicitaciones()
}

async function loadDashboard() {
  await Promise.allSettled([
    fetchClientes({ page: 1, limit: 9999 }),
    fetchProyectos({ limit: 9999 }),
    fetchCotizacionesData(),
    fetchEventos(),
    fetchColaboradores(),
    fetchLicitaciones(),
    fetchUsuarios(),
    fetchDashboard(),
    fetchRecaudos(),
  ])
  seedDashboardIfEmpty()
}

onMounted(() => {
  loadDashboard()
  fetchRecursosClientes()
  loadUsuarios()

  document.addEventListener('click', () => {
    showEntityDropdown.value = false
  })

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (showDescModal.value) showDescModal.value = false
      else if (showDeleteEventModal.value) showDeleteEventModal.value = false
      else if (showEventModal.value) showEventModal.value = false
    }
  })

  clockTimer = window.setInterval(() => {
    nowTick.value = Date.now()
  }, 1000)

  pollTimer = window.setInterval(() => {
    refreshDashboard()
  }, 30000)
})

onUnmounted(() => {
  if (clockTimer) window.clearInterval(clockTimer)
  if (pollTimer) window.clearInterval(pollTimer)
})
</script>

<style scoped>
/* ===== RESET & VARIABLES ===== */
.admin-layout {
  --c-primary: #C89B2D;
  --c-primary-hover: #B8892A;
  --c-black: #1F2937;
  --c-dark: #111827;
  --c-sidebar: #FFFFFF;
  --c-white: #FFFFFF;
  --c-light: #F9FAFB;
  --c-gray: #6B7280;
  --c-gray-light: #9CA3AF;
  --c-border: #E5E7EB;
  --c-success: #10B981;
  --c-danger: #EF4444;
  --c-warning: #F59E0B;
  --c-info: #3B82F6;
  --sidebar-w: 220px;
  --topbar-h: 72px;
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  display: flex;
  min-height: 100vh;
  background: var(--c-light);
  color: var(--c-black);
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: var(--sidebar-w);
  background: var(--c-sidebar);
  border-right: 1px solid var(--c-border);
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 100;
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  overflow-y: auto;
}

.sidebar-header {
  padding: 10px;
  border-bottom: 1px solid var(--c-border);
}

.sidebar-logo {
  text-decoration: none;
  display: flex;
  align-items: center;
  justify-content: center;
}

.logo-img {
  height: 44px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.sidebar-nav {
  flex: 1;
  padding: 12px 10px;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 10px 14px;
  border-radius: 10px;
  border: none;
  background: none;
  color: var(--c-gray);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  text-align: left;
  width: 100%;
}

.nav-item:hover {
  background: var(--c-light);
  color: var(--c-black);
}

.external-icon {
  margin-left: auto;
  opacity: 0.4;
  flex-shrink: 0;
}
.nav-item:hover .external-icon { opacity: 0.7; }

.nav-item.active {
  background: rgba(200, 155, 45, 0.1);
  color: var(--c-primary);
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 20px;
  flex-shrink: 0;
}

.nav-item.active .nav-icon {
  color: var(--c-primary);
}

.sidebar-footer {
  padding: 16px;
  border-top: 1px solid var(--c-border);
}

.logout-btn {
  color: var(--c-gray) !important;
}

.logout-btn:hover {
  background: rgba(239, 68, 68, 0.08) !important;
  color: #DC2626 !important;
}

.sidebar-overlay { display: none; }

/* ===== MAIN AREA ===== */
.main-area {
  flex: 1;
  margin-left: var(--sidebar-w);
  display: flex;
  flex-direction: column;
  min-height: 100vh;
}

/* ===== TOPBAR ===== */
.topbar {
  height: var(--topbar-h);
  background: var(--c-white);
  border-bottom: 1px solid var(--c-border);
  display: flex;
  align-items: center;
  padding: 0 28px;
  gap: 20px;
  position: sticky;
  top: 0;
  z-index: 50;
}

.menu-toggle {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  color: var(--c-gray);
  padding: 6px;
  border-radius: 8px;
}
.menu-toggle:hover { background: var(--c-light); }

.home-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 8px;
  border: 1px solid var(--c-border);
  background: var(--c-white);
  color: var(--c-gray);
  text-decoration: none;
  transition: all 0.2s ease;
  flex-shrink: 0;
}

.home-btn:hover {
  border-color: var(--c-primary);
  color: var(--c-primary);
  background: rgba(200, 155, 45, 0.04);
}

.topbar-greeting {
  display: flex;
  flex-direction: column;
}

.topbar-greeting h1 {
  font-size: 1.2rem;
  font-weight: 700;
  color: var(--c-black);
}

.topbar-greeting p {
  font-size: 0.8rem;
  color: var(--c-gray);
}

.topbar-search {
  flex: 1;
  max-width: 320px;
  position: relative;
  display: flex;
  align-items: center;
  margin-left: auto;
}

.topbar-search .search-icon {
  position: absolute;
  left: 14px;
  color: var(--c-gray-light);
  pointer-events: none;
}

.topbar-search .search-input {
  width: 100%;
  padding: 10px 16px 10px 42px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-light);
  font-size: 0.88rem;
  color: var(--c-black);
  outline: none;
  transition: all 0.2s ease;
}

.topbar-search .search-input:focus {
  border-color: var(--c-primary);
  background: var(--c-white);
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.1);
}

.topbar-search .search-input::placeholder { color: var(--c-gray-light); }

.topbar-actions {
  display: flex;
  align-items: center;
  gap: 12px;
}

.action-btn {
  position: relative;
  background: none;
  border: none;
  padding: 8px;
  border-radius: 10px;
  cursor: pointer;
  color: var(--c-gray);
  transition: all 0.2s ease;
}
.action-btn:hover { background: var(--c-light); color: var(--c-black); }

.action-btn .badge {
  position: absolute;
  top: 2px;
  right: 2px;
  background: var(--c-primary);
  color: white;
  font-size: 0.6rem;
  font-weight: 700;
  width: 16px;
  height: 16px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.export-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: none;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  font-size: 0.82rem;
  font-weight: 500;
  color: var(--c-black);
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}
.export-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }

.topbar-user {
  display: flex;
  align-items: center;
}

.user-avatar-sm {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: linear-gradient(135deg, #8B5CF6, #6366F1);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 12px;
  font-weight: 700;
  overflow: hidden;
}

.user-avatar-sm img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  padding: 28px;
  overflow-y: auto;
}

.page-title {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 4px;
}

.page-subtitle {
  font-size: 0.88rem;
  color: var(--c-gray);
}

/* ===== MONTH FILTER ===== */
    .dashboard-title {
      font-size: 1.3rem;
      font-weight: 700;
      color: var(--c-black);
      margin: 0 0 16px 0;
    }

    .dashboard-title-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      flex-wrap: wrap;
      margin-bottom: 16px;
    }
    .dashboard-title-row .dashboard-title { margin: 0; }

    .live-indicator {
      display: inline-flex;
      align-items: center;
      gap: 8px;
      padding: 6px 12px;
      border: 1px solid var(--c-border);
      border-radius: 999px;
      background: var(--c-white);
      font-size: 0.74rem;
      color: var(--c-gray);
    }
    .live-dot {
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background: var(--c-success);
      box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5);
      animation: livePulse 1.6s infinite;
    }
    @keyframes livePulse {
      0% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0.5); }
      70% { box-shadow: 0 0 0 7px rgba(16, 185, 129, 0); }
      100% { box-shadow: 0 0 0 0 rgba(16, 185, 129, 0); }
    }
    .live-updated { color: var(--c-gray-light); }
    .refresh-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 26px;
      height: 26px;
      border: 1px solid var(--c-border);
      border-radius: 50%;
      background: none;
      color: var(--c-gray);
      cursor: pointer;
      transition: all 0.15s;
    }
    .refresh-btn:hover { color: var(--c-black); border-color: var(--c-gray); transform: rotate(90deg); }


.month-filter {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
}

.month-filter label {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-gray);
}

.month-select {
  padding: 8px 12px;
  border: 1.5px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--c-black);
  background: var(--c-white);
  cursor: pointer;
}

.month-select:focus {
  outline: none;
  border-color: var(--c-primary);
}

/* ===== STATS ROW ===== */
    .stats-row {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
      margin-bottom: 24px;
    }

.stat-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  transition: all 0.2s ease;
  position: relative;
  overflow: hidden;
}

.stat-card:hover {
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.06);
  transform: translateY(-1px);
}

.stat-icon {
  width: 48px;
  height: 48px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.stat-icon.amber { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
.stat-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }
.stat-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }

.stat-content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.stat-label {
  font-size: 0.78rem;
  color: var(--c-gray);
  font-weight: 500;
}

.stat-value {
  font-size: 1.5rem;
  font-weight: 800;
  color: var(--c-black);
  line-height: 1.2;
}

.stat-change {
  font-size: 0.72rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 3px;
  margin-top: 2px;
}

.stat-change.up { color: var(--c-success); }
.stat-change.down { color: var(--c-danger); }

.stat-sub {
  font-size: 0.72rem;
  color: var(--c-gray);
  margin-top: 2px;
}

.stat-sparkline {
  position: absolute;
  bottom: 0;
  right: 0;
  width: 80px;
  height: 30px;
  opacity: 0.6;
}

.sparkline-svg {
  width: 100%;
  height: 100%;
}

/* ===== DASHBOARD MIDDLE ===== */
.dashboard-middle {
  display: grid;
  grid-template-columns: 1fr;
  gap: 20px;
  margin-bottom: 24px;
}

/* ===== CARDS ===== */
.card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px 20px;
}

.card-header h3 {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--c-black);
}

.link-btn {
  background: none;
  border: none;
  color: var(--c-primary);
  font-size: 0.8rem;
  font-weight: 600;
  cursor: pointer;
  padding: 4px 8px;
  border-radius: 6px;
}
.link-btn:hover { background: rgba(200, 155, 45, 0.08); }

/* ===== ACTIVITY ===== */
.activity-list {
  padding: 0 20px 16px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--c-border);
}

.activity-item:last-child { border-bottom: none; }

.activity-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.activity-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.activity-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
.activity-icon.amber { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
.activity-icon.purple { background: rgba(139, 92, 246, 0.1); color: #8B5CF6; }

.activity-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.activity-text {
  font-size: 0.82rem;
  color: var(--c-black);
  line-height: 1.4;
}

.activity-time {
  font-size: 0.72rem;
  color: var(--c-gray);
}

/* ===== CALENDAR ===== */
.calendar-card .card-header {
  flex-wrap: wrap;
  gap: 8px;
}

.calendar-nav {
  display: flex;
  align-items: center;
  gap: 8px;
}

.calendar-month {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-black);
}

.cal-nav-btn {
  background: none;
  border: 1px solid var(--c-border);
  border-radius: 6px;
  padding: 4px;
  cursor: pointer;
  color: var(--c-gray);
  display: flex;
  align-items: center;
  justify-content: center;
}
.cal-nav-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }

.calendar-grid {
  padding: 0 20px 12px;
}

.cal-header {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  margin-bottom: 8px;
}

.cal-header span {
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--c-gray);
  padding: 4px 0;
}

.cal-body {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  gap: 2px;
}

.cal-day {
  font-size: 0.78rem;
  padding: 6px 0;
  border-radius: 6px;
  color: var(--c-black);
  cursor: pointer;
}

.cal-day:hover { background: var(--c-light); }
.cal-day.other { color: var(--c-gray-light); }

.cal-day.today {
  background: var(--c-primary);
  color: white;
  font-weight: 700;
}

.cal-day {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.cal-day-dots-inline {
  display: flex;
  gap: 2px;
  justify-content: center;
  min-height: 4px;
}

.cal-dot-inline {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  display: inline-block;
}

.calendar-legend {
  display: flex;
  flex-wrap: wrap;
  gap: 8px 12px;
  padding: 8px 16px;
  border-top: 1px solid var(--c-border);
}

.legend-item {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.65rem;
  color: var(--c-gray);
}

.legend-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.legend-dot.amber { background: #F59E0B; }
.legend-dot.blue { background: #3B82F6; }
.legend-dot.green { background: #10B981; }

/* ===== UPCOMING ===== */
.upcoming-list {
  padding: 0 20px 16px;
}

.upcoming-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  padding: 12px 0;
  border-bottom: 1px solid var(--c-border);
}

.upcoming-item:last-child { border-bottom: none; }

.upcoming-date {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 40px;
}

.day-num {
  font-size: 1.2rem;
  font-weight: 800;
  color: var(--c-primary);
  line-height: 1;
}

.day-month {
  font-size: 0.65rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
}

.upcoming-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;
}

.upcoming-title-row {
  display: flex;
  align-items: center;
  gap: 8px;
}

.upcoming-title {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
}

.upcoming-client {
  font-size: 0.72rem;
  color: var(--c-gray);
}

.upcoming-time {
  font-size: 0.7rem;
  color: var(--c-gray-light);
  white-space: nowrap;
}

.upcoming-badge {
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 600;
  white-space: nowrap;
}

.upcoming-badge.audit { background: rgba(245, 158, 11, 0.1); color: #D97706; }
.upcoming-badge.meeting { background: rgba(59, 130, 246, 0.1); color: #2563EB; }
.upcoming-badge.training { background: rgba(16, 185, 129, 0.1); color: #059669; }
.upcoming-badge.commitment { background: rgba(139, 92, 246, 0.1); color: #7C3AED; }

.upcoming-empty {
  text-align: center;
  padding: 24px 16px;
  color: var(--c-gray-light);
  font-size: 0.82rem;
}

/* ===== DASHBOARD BOTTOM ===== */
.dashboard-bottom {
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 20px;
  margin-bottom: 24px;
}

/* ===== PROJECTS CHART ===== */
.projects-chart-area {
  display: flex;
  align-items: center;
  gap: 32px;
  padding: 20px;
}

.donut-container {
  position: relative;
  width: 140px;
  height: 140px;
  flex-shrink: 0;
}

.donut-svg {
  width: 100%;
  height: 100%;
}

.donut-center {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  text-align: center;
  display: flex;
  flex-direction: column;
}

.donut-value {
  font-size: 1.4rem;
  font-weight: 800;
  color: var(--c-black);
  line-height: 1;
}

.donut-label {
  font-size: 0.7rem;
  color: var(--c-gray);
}

.projects-legend {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.legend-row {
  display: flex;
  align-items: center;
  gap: 6px;
}

.legend-dot-rect {
  width: 10px;
  height: 10px;
  border-radius: 2px;
  flex-shrink: 0;
}

.legend-dot-rect.amber { background: #F59E0B; }
.legend-dot-rect.blue { background: #3B82F6; }
.legend-dot-rect.green { background: #10B981; }
.legend-dot-rect.purple { background: #8B5CF6; }
.legend-dot-rect.red { background: #EF4444; }

.legend-text {
  font-size: 0.72rem;
  color: var(--c-black);
  flex: 1;
}

.legend-count {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-black);
}

/* ===== BAR CHART ===== */
.bar-chart-container {
  padding: 20px 24px 16px;
}

.bar-chart {
  display: flex;
  align-items: flex-end;
  gap: 12px;
  height: 180px;
}

.bar-col {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  height: 100%;
}

.bar-value {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--c-black);
}

.bar-wrapper {
  flex: 1;
  width: 100%;
  max-width: 48px;
  display: flex;
  align-items: flex-end;
}

.bar-fill {
  width: 100%;
  background: var(--c-primary);
  border-radius: 6px 6px 0 0;
  transition: height 0.4s ease;
  min-height: 4px;
}

.bar-label {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: capitalize;
}

/* ===== TABLE ACTIONS ===== */
.q-actions {
  display: flex;
  gap: 4px;
}

.q-action {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  color: var(--c-gray);
  border-radius: 4px;
}
.q-action:hover { background: var(--c-light); color: var(--c-black); }
.q-action.danger:hover { background: rgba(239, 68, 68, 0.1); color: #DC2626; }

.card-footer-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  width: 100%;
  padding: 12px;
  background: none;
  border: none;
  border-top: 1px solid var(--c-border);
  color: var(--c-primary);
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
}
.card-footer-btn:hover { background: rgba(200, 155, 45, 0.04); }

    /* ===== DASHBOARD WIDGETS ===== */
    .dashboard-widgets {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 20px;
      margin-bottom: 24px;
    }

    .card-badge {
      font-size: 0.7rem;
      font-weight: 700;
      padding: 3px 10px;
      border-radius: 999px;
      background: rgba(59, 130, 246, 0.14);
      color: var(--c-info);
    }
    .card-badge.warn { background: rgba(245, 158, 11, 0.16); color: var(--c-warning); }

    .widget-body {
      display: flex;
      flex-direction: column;
      gap: 12px;
      padding: 4px 20px 20px;
      max-height: 280px;
      overflow-y: auto;
    }
    .widget-empty { font-size: 0.82rem; color: var(--c-gray); padding: 16px 0; }

    .rank-row { display: flex; align-items: center; gap: 12px; }
    .rank-pos {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 24px;
      height: 24px;
      border-radius: 8px;
      font-size: 0.72rem;
      font-weight: 700;
      background: var(--c-light);
      color: var(--c-gray);
      flex-shrink: 0;
    }
    .rank-pos.top { background: rgba(240, 192, 9, 0.18); color: var(--c-primary); }
    .rank-info { flex: 1; min-width: 0; display: flex; flex-direction: column; gap: 6px; }
    .rank-head { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; }
    .rank-name { font-size: 0.82rem; font-weight: 600; color: var(--c-black); }
    .rank-amount { font-size: 0.78rem; font-weight: 700; color: var(--c-black); white-space: nowrap; }
    .rank-track { height: 6px; background: var(--c-light); border-radius: 999px; overflow: hidden; }
    .rank-fill { height: 100%; background: linear-gradient(90deg, var(--c-primary), var(--c-primary-hover)); border-radius: 999px; }

    .alert-row {
      display: flex;
      align-items: flex-start;
      gap: 10px;
      padding: 10px 12px;
      border: 1px solid var(--c-border);
      border-radius: 10px;
      background: var(--c-light);
    }
    .alert-icon {
      display: flex;
      align-items: center;
      justify-content: center;
      width: 28px;
      height: 28px;
      border-radius: 8px;
      background: rgba(245, 158, 11, 0.16);
      color: var(--c-warning);
      flex-shrink: 0;
    }
    .alert-info { display: flex; flex-direction: column; gap: 3px; min-width: 0; }
    .alert-head { display: flex; align-items: baseline; justify-content: space-between; gap: 8px; }
    .alert-name { font-size: 0.82rem; font-weight: 600; color: var(--c-black); }
    .alert-days {
      font-size: 0.72rem;
      font-weight: 700;
      color: var(--c-danger);
      background: rgba(239, 68, 68, 0.14);
      padding: 2px 8px;
      border-radius: 999px;
      white-space: nowrap;
    }
    .alert-detail { font-size: 0.72rem; color: var(--c-gray); text-transform: capitalize; }

    /* ===== CIERRE PRESUPUESTAL ===== */
    .cierre-card { margin-bottom: 24px; }
    .cierre-title { display: flex; align-items: center; gap: 10px; flex-wrap: wrap; }
    .auto-badge {
      display: inline-flex;
      align-items: center;
      gap: 5px;
      font-size: 0.68rem;
      font-weight: 700;
      text-transform: uppercase;
      letter-spacing: 0.04em;
      padding: 3px 9px;
      border-radius: 999px;
      background: rgba(16, 185, 129, 0.14);
      color: var(--c-success);
    }
    .cierre-next { font-size: 0.76rem; color: var(--c-gray); }
    .cierre-body { padding: 0 20px 20px; display: flex; flex-direction: column; gap: 18px; }

    .cierre-summary {
      display: grid;
      grid-template-columns: repeat(4, 1fr);
      gap: 12px;
    }
    .cierre-metric {
      display: flex;
      flex-direction: column;
      gap: 6px;
      padding: 14px;
      border: 1px solid var(--c-border);
      border-radius: 10px;
      background: var(--c-light);
    }
    .cierre-label { font-size: 0.7rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.03em; }
    .cierre-value { font-size: 1.05rem; font-weight: 800; color: var(--c-black); }
    .cierre-value.income { color: var(--c-info); }
    .cierre-value.expense { color: var(--c-danger); }
    .cierre-value.profit { color: var(--c-success); }

    .cierre-table-wrap { overflow-x: auto; border: 1px solid var(--c-border); border-radius: 10px; }
    .cierre-table { width: 100%; border-collapse: collapse; min-width: 620px; }
    .cierre-table th {
      padding: 10px 14px;
      text-align: left;
      font-size: 0.68rem;
      font-weight: 600;
      color: var(--c-gray);
      text-transform: uppercase;
      letter-spacing: 0.05em;
      background: var(--c-light);
      border-bottom: 1px solid var(--c-border);
      white-space: nowrap;
    }
    .cierre-table td {
      padding: 10px 14px;
      font-size: 0.82rem;
      color: var(--c-black);
      border-bottom: 1px solid var(--c-border);
      white-space: nowrap;
    }
    .cierre-table tr:last-child td { border-bottom: none; }
    .cierre-table tbody tr:hover td { background: rgba(255, 255, 255, 0.05); }
    .cierre-month { text-transform: capitalize; font-weight: 600; }
    .cierre-profit { font-weight: 700; color: var(--c-success); }
    .cierre-status {
      display: inline-block;
      padding: 3px 9px;
      border-radius: 999px;
      font-size: 0.7rem;
      font-weight: 700;
    }
    .cierre-status.closed { background: rgba(16, 185, 129, 0.14); color: var(--c-success); }
    .cierre-status.open { background: rgba(59, 130, 246, 0.14); color: var(--c-info); }

    /* ===== METRICS ROW ===== */
.metrics-row {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 16px;
}

.metric-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 18px;
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.metric-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.metric-icon.blue { background: rgba(59, 130, 246, 0.1); color: #3B82F6; }
.metric-icon.amber { background: rgba(245, 158, 11, 0.1); color: #F59E0B; }
.metric-icon.green { background: rgba(16, 185, 129, 0.1); color: #10B981; }
.metric-icon.red { background: rgba(239, 68, 68, 0.1); color: #EF4444; }

.metric-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
}

.metric-label {
  font-size: 0.75rem;
  color: var(--c-gray);
  font-weight: 500;
}

.metric-value {
  font-size: 1.1rem;
  font-weight: 800;
  color: var(--c-black);
  line-height: 1.2;
}

.metric-sub {
  font-size: 0.7rem;
  color: var(--c-gray);
}

.metric-sparkline {
  width: 60px;
  height: 24px;
  flex-shrink: 0;
}

/* ===== SECTION TOP ===== */
.section-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 24px;
  flex-wrap: wrap;
  gap: 12px;
}

.section-top h2 {
  font-size: 1.4rem;
  font-weight: 700;
  color: var(--c-black);
}

.success-banner {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 10px 16px;
  background: #DCFCE7;
  color: #16A34A;
  border-radius: 8px;
  font-size: 0.85rem;
  font-weight: 500;
  margin-bottom: 16px;
}

.recurso-form { display: flex; flex-direction: column; gap: 16px; }

/* ===== EMPTY STATE ===== */
.empty-state {
  text-align: center;
  padding: 60px 20px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
}

.empty-icon {
  font-size: 3rem;
  margin-bottom: 16px;
}

.empty-state h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 8px;
}

.empty-state p {
  font-size: 0.88rem;
  color: var(--c-gray);
}

/* ===== PROJECT DETAIL INLINE ===== */
.project-detail-inline {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  background: none;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  color: var(--c-gray);
  font-size: 0.85rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.15s;
  width: fit-content;
}
.back-btn:hover { border-color: var(--c-primary); color: var(--c-primary); }

/* ===== USER TABLE ===== */
.table-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
}
.table-responsive { overflow-x: auto; }
.data-table { width: 100%; border-collapse: collapse; table-layout: fixed; }
.data-table th {
  padding: 8px 10px;
  text-align: left;
  font-size: 0.68rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  background: var(--c-light);
  border-bottom: 1px solid var(--c-border);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
.data-table td {
  padding: 8px 10px;
  font-size: 0.78rem;
  color: var(--c-black);
  border-bottom: 1px solid var(--c-border);
  vertical-align: middle;
  word-break: break-word;
}
.data-table tr:last-child td { border-bottom: none; }
.data-table tr:hover td { background: rgba(249, 250, 251, 0.5); }

.type-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  text-transform: capitalize;
}
.type-comunicaciones { background: #FEF3C7; color: #D97706; }
.type-acta { background: #FFF7ED; color: #C2410C; }
.type-contrato { background: #EFF6FF; color: #2563EB; }
.type-cotizacion { background: #F0FDF4; color: #16A34A; }
.type-informe { background: #FEF3C7; color: #D97706; }
.type-certificado { background: #FDF4FF; color: #9333EA; }
.type-presentacion { background: #F0FDFA; color: #0D9488; }

.actions-cell { display: flex; gap: 4px; }
.action-btn {
  width: 30px;
  height: 30px;
  border: none;
  border-radius: 6px;
  background: transparent;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #6B7280;
  transition: all 0.15s;
}
.action-btn:hover { background: #F3F4F6; color: #111827; }
.action-btn.delete-btn:hover { background: #FEE2E2; color: #DC2626; }

.recaudo-detail { display: flex; flex-direction: column; gap: 10px; }
.recaudo-detail-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; padding: 11px 14px; background: var(--c-light); border: 1px solid var(--c-border); border-radius: 10px; }
.recaudo-detail-row span { font-size: 0.72rem; font-weight: 600; color: var(--c-gray); text-transform: uppercase; letter-spacing: 0.04em; }
.recaudo-detail-row strong { font-size: 0.88rem; color: var(--c-black); text-align: right; word-break: break-word; }

.action-btn.msg-btn-action { background: var(--c-primary); color: #102857; box-shadow: 0 2px 8px rgba(240, 192, 9, 0.35); }
.action-btn.msg-btn-action:hover { background: var(--c-primary-hover); color: #102857; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(240, 192, 9, 0.45); }

.data-table .col-check { width: 44px; text-align: center; }
.data-table .col-check input { vertical-align: middle; }
.row-check { width: 16px; height: 16px; accent-color: var(--c-primary); cursor: pointer; }

.msg-recipient { display: flex; flex-direction: column; gap: 3px; padding: 12px 14px; background: var(--c-light); border: 1px solid var(--c-border); border-radius: 10px; margin-bottom: 14px; }
.msg-recipient strong { font-size: 0.92rem; color: var(--c-black); }
.msg-recipient span { font-size: 0.78rem; color: var(--c-gray); }

.msg-sent-toast { position: fixed; bottom: 24px; right: 24px; z-index: 45000; display: flex; align-items: center; gap: 10px; background: #0E3570; color: #fff; padding: 12px 16px; border-radius: 10px; box-shadow: 0 10px 30px rgba(0, 0, 0, 0.25); font-size: 0.85rem; font-weight: 600; }
.msg-toast-icon { display: flex; align-items: center; justify-content: center; width: 20px; height: 20px; border-radius: 50%; background: #16A34A; color: #fff; flex-shrink: 0; }
.msg-toast-close { display: flex; align-items: center; justify-content: center; background: none; border: none; color: rgba(255, 255, 255, 0.7); cursor: pointer; padding: 2px; }
.msg-toast-close:hover { color: #fff; }
.msg-toast-fade-enter-active, .msg-toast-fade-leave-active { transition: all 0.3s ease; }
.msg-toast-fade-enter-from, .msg-toast-fade-leave-to { opacity: 0; transform: translateY(12px); }

.modal-overlay-confirm { z-index: 44500; }
.modal-content.modal-confirm { max-width: 460px; padding: 28px 24px 24px; text-align: center; }
.confirm-icon { display: flex; align-items: center; justify-content: center; width: 52px; height: 52px; margin: 0 auto 14px; border-radius: 50%; background: rgba(240, 192, 9, 0.16); color: var(--c-primary); }
.modal-confirm h3 { margin: 0 0 8px; font-size: 1.05rem; font-weight: 700; color: var(--c-black); }
.modal-confirm p { margin: 0 0 14px; font-size: 0.85rem; color: var(--c-gray); line-height: 1.5; }
.confirm-preview { background: var(--c-light); border: 1px solid var(--c-border); border-radius: 10px; padding: 12px 14px; margin-bottom: 18px; font-size: 0.82rem; color: var(--c-black); text-align: left; line-height: 1.5; word-break: break-word; }
.confirm-actions { display: flex; justify-content: center; gap: 10px; }

.user-cell {
  display: flex;
  align-items: center;
  gap: 10px;
}
.user-avatar {
  width: 34px;
  height: 34px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}
.user-avatar span {
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
}
.user-name { font-weight: 600; }

.rol-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
  white-space: nowrap;
  background: var(--c-light);
  color: var(--c-gray);
}
.rol-badge.admin, .rol-badge.Administrador { background: #FEF3C7; color: #B45309; }
.rol-badge.gerente, .rol-badge.Gerente { background: #EFF6FF; color: #1D4ED8; }
.rol-badge.manager, .rol-badge.Community { background: #F3E8FF; color: #7C3AED; }
.rol-badge.colaborador, .rol-badge.Colaborador { background: #F0FDF4; color: #15803D; }

.estado-badge {
  display: inline-block;
  padding: 4px 10px;
  border-radius: 6px;
  font-size: 0.78rem;
  font-weight: 600;
}
.estado-badge.disponible { background: #F0FDF4; color: #15803D; }

.status-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
}
.status-badge.status-active { background: #F0FDF4; color: #15803D; }
.status-badge.status-inactive { background: #FEF2F2; color: #DC2626; }

.url-input-wrapper {
  display: flex;
  align-items: center;
  gap: 8px;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 0 10px;
  max-width: 260px;
  transition: border-color 0.2s;
}
.url-input-wrapper:focus-within { border-color: var(--c-primary); }
.url-icon { color: var(--c-gray-light); flex-shrink: 0; }
.url-input {
  width: 100%;
  padding: 8px 0;
  border: none;
  font-size: 0.82rem;
  font-family: inherit;
  color: var(--c-black);
  background: transparent;
  outline: none;
}
.url-input::placeholder { color: var(--c-gray-light); }

/* ===== CALENDARIO FULL PAGE ===== */
.calendar-full-layout {
  display: grid;
  grid-template-columns: 1fr 340px;
  gap: 24px;
  align-items: start;
}

.calendar-main-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  overflow: hidden;
}

.calendar-header {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 20px 24px;
  border-bottom: 1px solid var(--c-border);
}

.cal-month-title {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--c-black);
  min-width: 180px;
  text-align: center;
}

.cal-nav-btn-large {
  background: none;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  padding: 8px;
  cursor: pointer;
  color: var(--c-gray);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.15s ease;
}
.cal-nav-btn-large:hover { border-color: var(--c-primary); color: var(--c-primary); background: rgba(200, 155, 45, 0.04); }

.cal-today-btn {
  margin-left: auto;
  padding: 6px 16px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 8px;
  font-size: 0.82rem;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.15s ease;
}
.cal-today-btn:hover { background: var(--c-primary-hover); }

.calendar-weekdays {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  text-align: center;
  padding: 12px 16px;
  border-bottom: 1px solid var(--c-border);
}

.calendar-weekdays span {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.calendar-days-grid {
  display: grid;
  grid-template-columns: repeat(7, 1fr);
  padding: 8px 16px 16px;
  gap: 4px;
}

.cal-day-cell {
  min-height: 80px;
  border-radius: 10px;
  padding: 8px;
  cursor: pointer;
  transition: all 0.15s ease;
  border: 2px solid transparent;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.cal-day-cell:hover { background: var(--c-light); }

.cal-day-cell.other-month {
  opacity: 0.35;
}

.cal-day-cell.is-today {
  border-color: var(--c-primary);
  background: rgba(200, 155, 45, 0.04);
}

.cal-day-cell.is-selected {
  background: rgba(200, 155, 45, 0.1);
  border-color: var(--c-primary);
}

.cal-day-cell.has-events {
  background: rgba(249, 250, 251, 0.8);
}

.cal-day-number {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--c-black);
  margin-bottom: 4px;
}

.cal-day-cell.is-today .cal-day-number {
  background: var(--c-primary);
  color: white;
  width: 26px;
  height: 26px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.cal-day-dots {
  display: flex;
  gap: 3px;
  flex-wrap: wrap;
  justify-content: center;
}

.cal-event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.cal-event-dot.audit { background: #F59E0B; }
.cal-event-dot.training { background: #10B981; }
.cal-event-dot.meeting { background: #3B82F6; }
.cal-event-dot.commitment { background: #8B5CF6; }

.cal-more-events {
  font-size: 0.6rem;
  color: var(--c-gray);
  font-weight: 600;
}

.calendar-legend-full {
  display: flex;
  gap: 20px;
  padding: 14px 24px;
  border-top: 1px solid var(--c-border);
  flex-wrap: wrap;
}

.calendar-legend-full .legend-item {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.78rem;
  color: var(--c-gray);
  font-weight: 500;
}

.calendar-legend-full .legend-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}

/* ===== CALENDAR SIDEBAR ===== */
.calendar-sidebar {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.calendar-text-summary {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 12px;
  padding: 18px 20px;
  margin-top: 4px;
}

.summary-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 14px;
  color: var(--c-text);
  font-weight: 600;
  font-size: 0.9rem;
}

.summary-header svg {
  color: var(--c-primary);
  flex-shrink: 0;
}

.summary-total-badge {
  margin-left: auto;
  background: var(--c-primary);
  color: white;
  font-size: 0.72rem;
  font-weight: 600;
  padding: 3px 10px;
  border-radius: 20px;
}

.summary-events-list {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.summary-event-row {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 8px 12px;
  background: var(--c-bg);
  border-radius: 8px;
  font-size: 0.8rem;
}

.summary-event-date {
  font-weight: 700;
  color: var(--c-text);
  min-width: 85px;
  font-size: 0.72rem;
  white-space: nowrap;
}

.summary-event-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  flex-shrink: 0;
}

.summary-event-title {
  color: var(--c-text);
  font-weight: 500;
  flex: 1;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.summary-event-type {
  font-size: 0.68rem;
  font-weight: 600;
  padding: 2px 8px;
  border-radius: 6px;
  white-space: nowrap;
}

.summary-event-time {
  color: var(--c-gray);
  font-size: 0.72rem;
  white-space: nowrap;
}

.sidebar-events-card,
.sidebar-summary-card {
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 14px;
  padding: 20px;
}

.sidebar-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--c-black);
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--c-border);
}

.sidebar-title svg { color: var(--c-primary); }

.no-events-msg {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px 12px;
  text-align: center;
}

.no-events-msg p {
  font-size: 0.82rem;
  color: var(--c-gray);
}

.events-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  max-height: 360px;
  overflow-y: auto;
}

.event-card-item {
  padding: 14px;
  border-radius: 10px;
  border-left: 4px solid transparent;
  background: var(--c-light);
}

.event-card-item.audit { border-left-color: #F59E0B; }
.event-card-item.training { border-left-color: #10B981; }
.event-card-item.meeting { border-left-color: #3B82F6; }
.event-card-item.commitment { border-left-color: #8B5CF6; }

.event-card-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
}

.event-type-badge {
  padding: 3px 10px;
  border-radius: 6px;
  font-size: 0.68rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.3px;
}

.event-type-badge.audit { background: rgba(245, 158, 11, 0.15); color: #D97706; }
.event-type-badge.training { background: rgba(16, 185, 129, 0.15); color: #059669; }
.event-type-badge.meeting { background: rgba(59, 130, 246, 0.15); color: #2563EB; }
.event-type-badge.commitment { background: rgba(139, 92, 246, 0.15); color: #7C3AED; }

.event-time-badge {
  font-size: 0.72rem;
  color: var(--c-gray);
  font-weight: 500;
}

.event-card-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 4px;
}

.event-card-client {
  font-size: 0.78rem;
  color: var(--c-gray);
  margin-bottom: 4px;
}

.event-card-meta {
  font-size: 0.72rem;
  color: var(--c-gray);
  margin-bottom: 2px;
}

.event-card-desc {
  font-size: 0.72rem;
  color: var(--c-gray-light);
  font-style: italic;
}

/* ===== SUMMARY STATS ===== */
.summary-stats {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.summary-stat {
  display: flex;
  align-items: center;
  gap: 10px;
}

.summary-dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  flex-shrink: 0;
}
.summary-dot.amber { background: #F59E0B; }
.summary-dot.green { background: #10B981; }
.summary-dot.blue { background: #3B82F6; }
.summary-dot.purple { background: #8B5CF6; }

.summary-label {
  font-size: 0.82rem;
  color: var(--c-gray);
  flex: 1;
}

.summary-count {
  font-size: 1rem;
  font-weight: 800;
  color: var(--c-black);
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1200px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .dashboard-widgets { grid-template-columns: 1fr; }
  .cierre-summary { grid-template-columns: repeat(2, 1fr); }
  .dashboard-middle { grid-template-columns: 1fr; }
  .dashboard-bottom { grid-template-columns: 1fr; }
  .metrics-row { grid-template-columns: repeat(2, 1fr); }
  .calendar-full-layout { grid-template-columns: 1fr; }
}

@media (max-width: 768px) {
  .sidebar {
    transform: translateX(-100%);
    width: min(var(--sidebar-w), 78vw);
  }
  .sidebar-open .sidebar {
    transform: translateX(0);
  }
  .sidebar-open .sidebar-overlay {
    display: block;
    position: fixed;
    inset: 0;
    background: rgba(0,0,0,0.4);
    z-index: 90;
  }
  .main-area {
    margin-left: 0;
    min-width: 0;
    max-width: 100%;
  }
  .main-content {
    min-width: 0;
    max-width: 100%;
  }
  .menu-toggle {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 38px;
    height: 38px;
    flex-shrink: 0;
  }
  .topbar {
    padding: 0 14px;
    gap: 10px;
    height: 64px;
  }
  .topbar-greeting { min-width: 0; }
  .topbar-greeting h1 {
    font-size: 0.85rem;
    line-height: 1.25;
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
  }
  .topbar-greeting p { display: none; }
  .topbar-search { display: none; }
  .export-btn { display: none; }
  .section-recaudos .export-btn { display: flex; }
  .action-btn { width: 36px; height: 36px; }

  /* Recaudos: móvil */
  .section-recaudos .section-top { flex-direction: column; align-items: stretch; }
  .section-recaudos .section-top .export-btn { width: 100%; justify-content: center; }
  .section-recaudos .coti-filters { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; align-items: end; }
  .section-recaudos .coti-filter-group { width: 100%; min-width: 0; }
  .section-recaudos .coti-filter-search { grid-column: 1 / -1; min-width: 0; }
  .section-recaudos .coti-select,
  .section-recaudos .coti-input { min-width: 0; width: 100%; }
  .section-recaudos .coti-filter-group .btn-outline { width: 100%; }
  .section-recaudos .table-card .data-table { min-width: 640px; }
  .section-recaudos .actions-cell { flex-wrap: wrap; }
  .section-recaudos .empty-state { padding: 40px 16px; }
  .section-recaudos .modal-content { width: calc(100% - 24px); max-width: none; }
  .section-recaudos .modal-content.modal-wide { max-width: none; }
  .section-recaudos .modal-header,
  .section-recaudos .modal-body { padding: 16px; }
  .section-recaudos .modal-body { max-height: calc(100vh - 140px); }
  .section-recaudos .modal-footer { padding: 12px 16px; }
  .section-recaudos .form-grid { grid-template-columns: 1fr; gap: 12px; }

  .main-content { padding: 16px 14px; }
  .page-title { font-size: 1.2rem; }
  .section-top { margin-bottom: 16px; }
  .dashboard-title-row { margin-bottom: 14px; }
  .dashboard-title { font-size: 1.15rem; }

  .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .stats-row > * { min-width: 0; }
  .stat-card { padding: 12px 10px; gap: 8px; min-width: 0; border-radius: 12px; }
  .stat-icon { width: 34px; height: 34px; border-radius: 9px; }
  .stat-icon svg { width: 17px; height: 17px; }
  .stat-value { font-size: 1rem; overflow-wrap: anywhere; line-height: 1.2; }
  .stat-label { font-size: 0.68rem; line-height: 1.3; }
  .stat-change { font-size: 0.65rem; margin-top: 0; }
  .stat-sub { font-size: 0.65rem; margin-top: 0; }
  .stat-content { min-width: 0; gap: 1px; }
  .stat-sparkline { display: none; }

  .dashboard-widgets { grid-template-columns: 1fr; gap: 14px; }
  .card-header { padding: 14px 16px; flex-wrap: wrap; gap: 6px; }
  .widget-body { padding: 4px 16px 16px; gap: 10px; }
  .rank-head { gap: 4px; }
  .rank-name { font-size: 0.8rem; }
  .rank-amount { font-size: 0.76rem; }
  .alert-row { padding: 10px; gap: 8px; }
  .alert-detail { line-height: 1.35; }

  .cierre-summary { grid-template-columns: 1fr; gap: 10px; }
  .cierre-body { padding: 0 16px 16px; gap: 14px; }
  .cierre-table { min-width: 540px; }
  .cierre-table th,
  .cierre-table td { padding: 8px 10px; font-size: 0.76rem; }

  .modal-overlay { padding: 12px; }
  .modal-card { padding: 20px; }
  .modal-actions { flex-direction: column-reverse; }
  .modal-actions > * { width: 100%; justify-content: center; }

  .cal-day-cell { min-height: 60px; padding: 4px; }
  .calendar-legend-full { gap: 12px; }
}

@media (max-width: 480px) {
  .main-content { padding: 12px; }
  .topbar { padding: 0 12px; gap: 8px; }
  .topbar-greeting h1 { font-size: 0.8rem; }
  .stats-row { gap: 8px; }
  .stat-card { padding: 10px 8px; gap: 6px; flex-wrap: wrap; }
  .stat-icon { width: 30px; height: 30px; border-radius: 8px; }
  .stat-icon svg { width: 15px; height: 15px; }
  .stat-value { font-size: 0.95rem; }
  .dashboard-title-row { gap: 8px; }
  .live-indicator { width: 100%; justify-content: center; }
  .cierre-title { gap: 6px; }
  .modal-card { padding: 16px; }

  /* Recaudos: móvil pequeño */
  .section-recaudos .coti-filters { grid-template-columns: 1fr; }
  .section-recaudos .modal-content { width: calc(100% - 16px); }
  .section-recaudos .modal-footer { flex-direction: column-reverse; }
  .section-recaudos .modal-footer > * {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
  }
  .section-recaudos .msg-sent-toast { left: 12px; right: 12px; bottom: 12px; justify-content: center; }
}

/* ===== ADM EVENTOS ===== */
.coti-filter-search { min-width: 280px; }
.entity-loading { font-size: 0.75rem; color: var(--c-gray); margin-top: 4px; }
.field-error { display: block; color: #DC2626; font-size: 0.78rem; margin-top: 4px; }
.form-alert { display: block; color: #DC2626; font-size: 0.82rem; background: #FEF2F2; border: 1px solid #FECACA; border-radius: 8px; padding: 10px 12px; }
.form-input.input-error { border-color: #DC2626; }

.entity-search-group { position: relative; width: 100%; }
.entity-dropdown { position: relative; width: 100%; }
.entity-dropdown-arrow { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); color: var(--c-gray); pointer-events: none; transition: transform 0.2s; }
.entity-dropdown-arrow.open { transform: translateY(-50%) rotate(180deg); }
.entity-dropdown-list {
  position: absolute; top: calc(100% + 4px); left: 0; right: 0;
  background: var(--c-white); border: 1px solid var(--c-border); border-radius: 8px;
  max-height: 260px; overflow-y: auto; z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.1);
}
.entity-dropdown-search { padding: 8px; border-bottom: 1px solid var(--c-border); }
.entity-dropdown-search .form-input { padding: 8px 10px; font-size: 0.85rem; }
.entity-dropdown-item {
  padding: 10px 12px; font-size: 0.85rem; color: var(--c-black);
  cursor: pointer; transition: background 0.15s;
}
.entity-dropdown-item:hover { background: var(--c-light); }
.entity-dropdown-empty { padding: 12px; text-align: center; color: var(--c-gray); font-size: 0.85rem; }
.entity-dropdown-trigger { cursor: pointer; padding-right: 32px !important; width: 100%; }
.entity-select { width: 100%; max-width: 400px; }
.entity-select option { overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.evento-type-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 600;
  word-break: break-word;
  background: var(--c-light);
  color: var(--c-gray);
}
.evento-type-badge.type-llamada { background: #EFF6FF; color: #1D4ED8; }
.evento-type-badge.type-correo { background: #F0FDF4; color: #15803D; }
.evento-type-badge.type-reunion { background: #FEF3C7; color: #B45309; }
.evento-type-badge.type-visita { background: #F3E8FF; color: #7C3AED; }
.evento-type-badge.type-compromiso { background: #FEF2F2; color: #DC2626; }

.evento-entity-badge {
  display: inline-block;
  padding: 2px 6px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 500;
  background: var(--c-light);
  border: 1px solid var(--c-border);
  color: var(--c-gray);
  text-transform: capitalize;
  word-break: break-word;
}

.evento-desc {
  max-width: 260px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

/* ===== MODAL GENERAL ===== */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 44000;
}
.modal-content {
  background: var(--c-white);
  border-radius: 14px;
  width: 90%;
  max-width: 480px;
  max-height: 90vh;
  overflow-y: auto;
}
.modal-content.modal-wide { max-width: 860px; }
.modal-card {
  background: var(--c-white);
  border-radius: 14px;
  padding: 32px;
  max-width: 20px;
  width: 100%;
}
.modal-card.modal-lg {
  max-width: 1200px;
  padding: 0;
}
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 20px 24px;
  border-bottom: 1px solid var(--c-border);
}
.modal-header h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-black);
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
  color: var(--c-gray);
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
}
.modal-close:hover {
  background: var(--c-light);
  color: var(--c-black);
}
.modal-body {
  padding: 20px 24px;
  overflow-y: auto;
  max-height: calc(100vh - 160px);
}
.modal-footer {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  justify-content: flex-end;
  padding: 16px 20px;
  border-top: 1px solid var(--c-border);
}
.modal-footer .btn-outline,
.modal-footer .btn-primary {
  padding: 9px 14px;
  font-size: 0.82rem;
  white-space: nowrap;
}
.modal-icon {
  color: #dc2626;
  margin-bottom: 16px;
}
.modal-card h3 {
  font-size: 1.1rem;
  font-weight: 700;
  color: var(--c-black);
  margin-bottom: 8px;
}
.modal-card p {
  font-size: 0.88rem;
  color: var(--c-gray);
  margin-bottom: 24px;
  line-height: 1.5;
}
.modal-actions {
  display: flex;
  justify-content: center;
  gap: 10px;
}

/* ===== FORM GRID ===== */
.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}
.form-grid .full-width {
  grid-column: 1 / -1;
}
.form-group {
  display: flex;
  flex-direction: column;
  gap: 6px;
}
.form-group label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--c-black);
}
.form-input {
  padding: 10px 12px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.88rem;
  font-family: inherit;
  color: var(--c-black);
  background: var(--c-white);
  outline: none;
  transition: border-color 0.2s;
  resize: vertical;
}
.form-input:focus {
  border-color: var(--c-primary);
}
.form-input[readonly] {
  background: var(--c-light);
  color: var(--c-gray);
  cursor: not-allowed;
}
.form-input:disabled {
  background: var(--c-light);
  color: var(--c-gray);
  cursor: not-allowed;
  opacity: 1;
}

.combo { position: relative; width: 100%; }
.combo .form-input { width: 100%; }
.combo-list {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  z-index: 46000;
  background: var(--c-white);
  border: 1px solid var(--c-border);
  border-radius: 10px;
  box-shadow: 0 14px 34px rgba(0, 0, 0, 0.28);
  max-height: 230px;
  overflow-y: auto;
  padding: 4px;
}
.combo-option {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  width: 100%;
  padding: 9px 10px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  text-align: left;
  font-family: inherit;
  transition: background 0.15s;
}
.combo-option:hover { background: rgba(240, 192, 9, 0.14); }
.combo-option-name { font-size: 0.85rem; font-weight: 600; color: var(--c-black); }
.combo-option-meta { font-size: 0.75rem; color: var(--c-gray); white-space: nowrap; }
.combo-empty { padding: 12px 10px; font-size: 0.8rem; color: var(--c-gray); text-align: center; }

/* ===== SECTION CARDS ===== */
.section-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}
.section-grid:last-child {
  margin-bottom: 0;
}
.section-card {
  border: 1px solid var(--c-border);
  border-radius: 10px;
  margin-bottom: 16px;
  background: var(--c-white);
}
.section-card:last-child {
  margin-bottom: 0;
}
.section-header {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: var(--c-light);
  border-bottom: 1px solid var(--c-border);
  border-radius: 10px 10px 0 0;
  white-space: nowrap;
}
.section-badge {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 4px;
  font-size: 0.7rem;
  font-weight: 700;
  background: #1E3A5F;
  color: #fff;
  letter-spacing: 0.5px;
  white-space: nowrap;
  flex-shrink: 0;
}
.section-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--c-black);
  letter-spacing: 0.3px;
  white-space: nowrap;
}
.section-body {
  padding: 14px 16px;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

/* ===== FORM ROWS ===== */
.form-row-2 {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 14px;
}

/* ===== DATE RANGE ===== */
.date-range-grid {
  display: flex;
  flex-direction: column;
  gap: 0;
}
.date-range-row {
  display: flex;
  align-items: center;
  gap: 6px;
}
.date-field {
  flex: 0 1 auto;
  min-width: 140px;
}
.time-field {
  width: 100px;
  flex-shrink: 0;
}
.date-separator {
  color: var(--c-gray);
  font-size: 0.85rem;
  font-weight: 500;
  flex-shrink: 0;
  padding-left: 34px;
}
.date-estado-badge {
  margin-left: auto;
  flex-shrink: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  align-self: center;
}
.date-estado-label {
  font-size: 0.78rem;
  font-weight: 700;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}
.date-estado-badge .status-badge {
  font-size: 0.82rem;
  padding: 4px 14px;
}
.form-hint {
  margin-top: 6px;
  font-size: 0.72rem;
  color: var(--c-gray);
  font-style: italic;
}

/* ===== TAGS / BADGES ===== */
.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-top: 4px;
}
.tag-badge {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  padding: 3px 8px;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 500;
  background: #EFF6FF;
  color: #1D4ED8;
}
.tag-badge.norma-badge {
  background: #FEF3C7;
  color: #92400E;
}
.tag-remove {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 16px;
  height: 16px;
  border: none;
  background: none;
  color: inherit;
  cursor: pointer;
  font-size: 0.85rem;
  line-height: 1;
  opacity: 0.6;
  transition: opacity 0.2s;
}
.tag-remove:hover {
  opacity: 1;
}
.label-hint {
  font-weight: 400;
  color: var(--c-gray-light);
  font-size: 0.75rem;
}
.normas-select-row {
  display: flex;
  gap: 8px;
  align-items: center;
}
.btn-add-norma {
  width: 36px;
  height: 36px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  background: var(--c-white);
  color: var(--c-primary);
  font-size: 1.2rem;
  font-weight: 700;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s;
  flex-shrink: 0;
}
.btn-add-norma:hover {
  border-color: var(--c-primary);
  background: var(--c-light);
}
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 10px 20px;
  background: var(--c-primary);
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 0.88rem;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}
.btn-primary:hover { background: var(--c-primary-hover); }
.btn-primary:disabled { opacity: 0.6; cursor: not-allowed; }
.btn-outline {
  padding: 10px 20px;
  border: 1px solid var(--c-border);
  border-radius: 10px;
  background: var(--c-white);
  color: var(--c-gray);
  font-size: 0.88rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}
.btn-outline:hover { border-color: var(--c-gray-light); color: var(--c-black); }

/* ===== FILTROS ===== */
.coti-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 16px;
  margin-bottom: 20px;
}
.coti-filter-group {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
.coti-filter-group label {
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--c-gray);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}
.coti-select, .coti-input {
  padding: 8px 12px;
  border: 1px solid var(--c-border);
  border-radius: 8px;
  font-size: 0.85rem;
  color: var(--c-black);
  background: var(--c-white);
  outline: none;
  min-width: 200px;
}
.coti-select:focus, .coti-input:focus {
  border-color: var(--c-primary);
  box-shadow: 0 0 0 3px rgba(200, 155, 45, 0.1);
}
.coti-select::placeholder, .coti-input::placeholder {
  color: var(--c-gray-light);
  opacity: 1;
}
.coti-filter-group .btn-outline { padding: 8px 16px; }

.view-mode input,
.view-mode select,
.view-mode textarea {
  pointer-events: none;
  opacity: 0.7;
  background: var(--c-light);
  cursor: default;
}
.view-mode .tag-remove,
.view-mode .btn-add-norma,
.view-mode .entity-dropdown {
  display: none !important;
}

/* ===== TEMA OSCURO ===== */
.admin-layout {
  color-scheme: dark;
  --c-primary: #F0C009;
  --c-primary-hover: #FFD84D;
  --c-black: #E7ECF6;
  --c-dark: #0B1220;
  --c-sidebar: #0A1327;
  --c-white: #141D36;
  --c-light: #0E162C;
  --c-gray: #98A4BF;
  --c-gray-light: #6F7D99;
  --c-border: #26334F;
}

/* Fondos dorados llevan texto oscuro para mantener contraste */
.btn-primary,
.cal-day.today,
.cal-today-btn,
.summary-total-badge,
.cal-day-cell.is-today .cal-day-number,
.action-btn .badge {
  color: #102857;
}
.btn-primary:hover {
  background: var(--c-primary-hover);
}

/* Superficies de tablas y acciones */
.data-table tr:hover td {
  background: rgba(255, 255, 255, 0.05);
}
.cal-day-cell.has-events {
  background: rgba(255, 255, 255, 0.05);
}
.action-btn {
  color: var(--c-gray);
}
.action-btn:hover {
  background: rgba(255, 255, 255, 0.08);
  color: var(--c-black);
}

/* Chips y badges: tinte claro -> tinte oscuro */
.success-banner {
  background: rgba(16, 185, 129, 0.14);
  color: #6EE7B7;
}
.type-comunicaciones,
.type-informe,
.rol-badge.admin,
.rol-badge.Administrador,
.evento-type-badge.type-reunion {
  background: rgba(245, 158, 11, 0.16);
  color: #FBBF24;
}
.type-acta,
.tag-badge.norma-badge {
  background: rgba(245, 158, 11, 0.12);
  color: #FDBA74;
}
.type-contrato,
.rol-badge.gerente,
.rol-badge.Gerente,
.evento-type-badge.type-llamada,
.tag-badge {
  background: rgba(59, 130, 246, 0.16);
  color: #93C5FD;
}
.type-cotizacion,
.rol-badge.colaborador,
.rol-badge.Colaborador,
.estado-badge.disponible,
.status-badge.status-active,
.evento-type-badge.type-correo {
  background: rgba(16, 185, 129, 0.16);
  color: #6EE7B7;
}
.type-certificado,
.rol-badge.manager,
.rol-badge.Community,
.evento-type-badge.type-visita {
  background: rgba(139, 92, 246, 0.18);
  color: #C4B5FD;
}
.type-presentacion {
  background: rgba(20, 184, 166, 0.16);
  color: #5EEAD4;
}
.status-badge.status-inactive,
.action-btn.delete-btn:hover,
.evento-type-badge.type-compromiso {
  background: rgba(239, 68, 68, 0.16);
  color: #FCA5A5;
}

/* Iconos de KPIs con mas presencia sobre fondo oscuro */
.stat-icon.blue { background: rgba(59, 130, 246, 0.2); }
.stat-icon.amber { background: rgba(245, 158, 11, 0.2); }
.stat-icon.purple { background: rgba(139, 92, 246, 0.2); }
.stat-icon.green { background: rgba(16, 185, 129, 0.2); }

/* Selects nativos */
.admin-layout select option {
  background: var(--c-white);
  color: var(--c-black);
}

/* Scrollbars */
.admin-layout ::-webkit-scrollbar {
  width: 10px;
  height: 10px;
}
.admin-layout ::-webkit-scrollbar-track {
  background: var(--c-light);
}
.admin-layout ::-webkit-scrollbar-thumb {
  background: #2C3B5E;
  border-radius: 6px;
}
.admin-layout ::-webkit-scrollbar-thumb:hover {
  background: #3A4C74;
}
</style>
