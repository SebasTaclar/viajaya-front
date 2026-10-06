<template>
  <div class="portal-app">
    <!-- Sidebar -->
    <aside class="sidebar">
      <div class="sidebar-header" @click="router.push('/')" style="cursor: pointer;">
        <img src="/images/Logo.png" alt="Viaja Ya" class="sidebar-logo" />
        <span class="sidebar-brand">Portal de Viajes</span>
      </div>

      <nav class="sidebar-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="nav-item"
          :class="{ active: activeSection === item.id }"
          @click="activeSection = item.id"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
          <span v-if="item.count" class="nav-badge">{{ item.count }}</span>
        </button>
      </nav>

      <div class="sidebar-footer">
        <div class="sidebar-user">
          <div class="sidebar-avatar">{{ clientInitials }}</div>
          <div class="sidebar-user-info">
            <span class="sidebar-user-name">{{ displayName }}</span>
            <span class="sidebar-user-company">{{ clientData?.razonSocial || '' }}</span>
          </div>
        </div>
        <button class="sidebar-logout" @click="handleLogout">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          Cerrar sesion
        </button>
      </div>
    </aside>

    <!-- Mobile header -->
    <header class="mobile-header">
      <button class="mobile-menu-btn" @click="showMobileMenu = !showMobileMenu">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <line x1="3" y1="6" x2="21" y2="6"/>
          <line x1="3" y1="12" x2="21" y2="12"/>
          <line x1="3" y1="18" x2="21" y2="18"/>
        </svg>
      </button>
      <img src="/images/Logo.png" alt="Viaja Ya" class="mobile-title" />
      <button class="mobile-logout-btn" @click="handleLogout">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
          <polyline points="16 17 21 12 16 7"/>
          <line x1="21" y1="12" x2="9" y2="12"/>
        </svg>
      </button>
    </header>

    <!-- Mobile overlay -->
    <div v-if="showMobileMenu" class="mobile-overlay" @click="showMobileMenu = false"></div>
    <div class="mobile-sidebar" :class="{ open: showMobileMenu }">
      <div class="mobile-sidebar-header">
        <div class="mobile-sidebar-brand">
          <button class="mobile-brand-btn" @click="goToHome" aria-label="Ir al banner principal">
            <img src="/images/Logo.png" alt="Viaja Ya" class="mobile-sidebar-logo" />
          </button>
          <button class="mobile-home-btn" @click="goToHome" aria-label="Ir al banner principal">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
              <polyline points="9 22 9 12 15 12 15 22"/>
            </svg>
          </button>
        </div>
        <button class="mobile-close-btn" @click="showMobileMenu = false">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <line x1="18" y1="6" x2="6" y2="18"/>
            <line x1="6" y1="6" x2="18" y2="18"/>
          </svg>
        </button>
      </div>
      <nav class="mobile-nav">
        <button
          v-for="item in navItems"
          :key="item.id"
          class="mobile-nav-item"
          :class="{ active: activeSection === item.id }"
          @click="activeSection = item.id; showMobileMenu = false"
        >
          <span class="nav-icon" v-html="item.icon"></span>
          <span class="nav-label">{{ item.label }}</span>
        </button>
      </nav>
    </div>

    <!-- Main content -->
    <main class="main-content">
      <!-- Top header bar -->
      <div class="top-header">
        <div></div>
        <div class="top-header-right">
          <div class="top-user-info">
            <span class="top-hola">Hola, {{ displayName }}</span>
          </div>
          <div class="top-avatar">{{ clientInitials }}</div>

        </div>
      </div>

      <!-- Loading -->
      <div v-if="loading" class="state-container">
        <div class="loader"></div>
        <p>Cargando tu informacion...</p>
      </div>

      <!-- Error with welcome fallback -->
      <template v-else-if="error">
        <!-- INICIO with welcome -->
        <section v-if="activeSection === 'inicio'" class="section">
          <div class="greeting-card">
            <div class="greeting-text">
              <h1>Bienvenido, {{ displayName }}</h1>
              <p>Tu portal de viajes con <strong>Viaja Ya</strong></p>
            </div>
            <div class="greeting-decoration">
              <svg width="120" height="120" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="0.5" opacity="0.1">
                <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
              </svg>
            </div>
          </div>

          <div class="welcome-info-card">
            <div class="welcome-icon">
              <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#16C2CA" stroke-width="1.5">
                <path d="M17.8 19.2L16 11l3.5-3.5C21 6 21.5 4 21 3c-1-.5-3 0-4.5 1.5L13 8 4.8 6.2c-.5-.1-.9.1-1.1.5l-.3.5c-.2.5-.1 1 .3 1.3L9 12l-2 3H4l-1 1 3 2 2 3 1-1v-3l3-2 3.5 5.3c.3.4.8.5 1.3.3l.5-.2c.4-.3.6-.7.5-1.2z"/>
              </svg>
            </div>
            <h2>Hola, {{ displayName }}</h2>
            <p class="welcome-subtitle">Bienvenido a tu espacio de viajes y reservas</p>
            <div class="welcome-divider"></div>
            <p class="welcome-message">{{ error }}</p>
            <button class="retry-btn" @click="reloadData">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="23 4 23 10 17 10"/>
                <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
              </svg>
              Intentar de nuevo
            </button>
          </div>
        </section>

        <!-- Other sections with error -->
        <div v-else class="state-container error">
          <div class="error-box">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2">
              <circle cx="12" cy="12" r="10"/>
              <line x1="12" y1="8" x2="12" y2="12"/>
              <line x1="12" y1="16" x2="12.01" y2="16"/>
            </svg>
            <h3>Algo salio mal</h3>
            <p>{{ error }}</p>
            <button class="retry-btn" @click="reloadData">Intentar de nuevo</button>
          </div>
        </div>
      </template>

      <!-- Content -->
      <template v-else>
        <!-- INICIO -->
        <section v-if="activeSection === 'inicio'" class="section">
          <div class="greeting-card">
            <div class="greeting-text">
              <h1>Hola, {{ displayName || 'Usuario' }}</h1>
              <p>Bienvenido a tu portal de viajes con <strong>Viaja Ya</strong></p>
            </div>
          </div>

          <div class="stats-row">
            <div class="stat-card gold">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4"/><path d="M3 5v14a2 2 0 0 0 2 2h16v-5"/><path d="M18 12a2 2 0 0 0 0 4h4v-4z"/>
                </svg>
              </div>
              <div class="stat-data">
                <template v-if="ultimoRecaudo">
                  <span class="stat-number">{{ formatRecaudoFecha(ultimoRecaudo.fecha) }}</span>
                  <span class="stat-date">{{ formatRecaudoValor(ultimoRecaudo.valor) }}</span>
                  <span class="stat-text">Ultimo recaudo</span>
                </template>
                <template v-else>
                  <span class="stat-number">—</span>
                  <span class="stat-text">Ultimo recaudo</span>
                </template>
              </div>
            </div>
          </div>

          <div class="saldo-banner">
            <div class="saldo-left">
              <span class="saldo-label">Saldo ahorrado:</span>
              <span class="saldo-amount">{{ formatRecaudoValor(recaudosTotal) }}</span>
            </div>
          </div>
        </section>

        <!-- PROYECTOS -->
        <section v-if="activeSection === 'proyectos'" class="section">
          <div class="section-head">
            <h2>Mis Viajes</h2>
            <p>Tus viajes en curso de pago por cuotas</p>
          </div>

          <div class="projects-list">
            <div v-for="trip in simulatedTrips" :key="trip.id" class="project-row installment-row">
              <div class="project-status-bar active"></div>
              <div class="project-body">
                <div class="project-top">
                  <h3>{{ trip.name }}</h3>
                  <span class="status-pill active">Pagando por cuotas</span>
                </div>
                <div class="project-details">
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>
                    {{ trip.destination }}
                  </span>
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                    {{ trip.dates }}
                  </span>
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    Cuota: ${{ trip.installmentAmount.toLocaleString('es-CO') }}
                  </span>
                </div>

                <div class="installment-summary">
                  <div class="installment-stat">
                    <span class="installment-stat-label">Total</span>
                    <span class="installment-stat-value">${{ trip.total.toLocaleString('es-CO') }}</span>
                  </div>
                  <div class="installment-stat">
                    <span class="installment-stat-label">Pagado</span>
                    <span class="installment-stat-value paid">${{ trip.paidAmount.toLocaleString('es-CO') }}</span>
                  </div>
                  <div class="installment-stat">
                    <span class="installment-stat-label">Saldo</span>
                    <span class="installment-stat-value pending">${{ trip.remainingAmount.toLocaleString('es-CO') }}</span>
                  </div>
                  <div class="installment-stat">
                    <span class="installment-stat-label">Cuotas</span>
                    <span class="installment-stat-value">{{ trip.paidInstallments }}/{{ trip.totalInstallments }}</span>
                  </div>
                </div>

                <div class="project-progress">
                  <div class="progress-track">
                    <div class="progress-fill active" :style="{ width: trip.progress + '%' }"></div>
                  </div>
                  <span class="progress-label">{{ trip.progress }}%</span>
                </div>

                <div class="cuotas-row">
                  <span
                    v-for="n in trip.totalInstallments"
                    :key="n"
                    class="cuota-dot"
                    :class="{ paid: n <= trip.paidInstallments, next: n === trip.paidInstallments + 1 }"
                    :title="'Cuota ' + n"
                  ></span>
                </div>

                <div class="next-payment">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                  Proxima cuota: {{ trip.nextPayment }} · ${{ trip.installmentAmount.toLocaleString('es-CO') }}
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- DETALLE PROYECTO -->
        <section v-if="activeSection === 'proyecto-detalle' && selectedProject" class="section">
          <button class="back-btn" @click="activeSection = 'proyectos'">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><polyline points="15 18 9 12 15 6"/></svg>
            Volver a proyectos
          </button>

          <div class="detail-header">
            <h2>{{ selectedProject.description || `Proyecto ${selectedProject.code}` }}</h2>
            <span class="status-pill large" :class="getStatusClass(selectedProject.status || '')">{{ getStatusLabel(selectedProject.status || '') }}</span>
          </div>

          <div class="detail-grid">
            <div class="detail-card">
              <h4>Informacion del proyecto</h4>
              <div class="detail-rows">
                <div class="detail-row"><span>Norma</span><strong>{{ selectedProject.norm }}</strong></div>
                <div class="detail-row"><span>Responsable</span><strong>{{ selectedProject.responsible }}</strong></div>
                <div class="detail-row"><span>Tipo</span><strong>{{ selectedProject.projectType }}</strong></div>
                <div class="detail-row"><span>Codigo</span><strong>{{ selectedProject.code }}</strong></div>
                <div class="detail-row"><span>Inicio</span><strong>{{ formatDate(selectedProject.startDate) }}</strong></div>
                <div class="detail-row"><span>Fin</span><strong>{{ selectedProject.endDate ? formatDate(selectedProject.endDate) : 'En curso' }}</strong></div>
              </div>
            </div>

            <div class="detail-card">
              <h4>Progreso</h4>
              <div class="big-progress">
                <div class="big-progress-ring">
                  <svg viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#F0F0F0" stroke-width="8"/>
                    <circle cx="60" cy="60" r="52" fill="none" stroke="#16C2CA" stroke-width="8" stroke-linecap="round"
                      :stroke-dasharray="326.7"
                      :stroke-dashoffset="326.7 - (326.7 * calculateProgress(selectedProject) / 100)"
                      transform="rotate(-90 60 60)"/>
                  </svg>
                  <span class="big-progress-text">{{ calculateProgress(selectedProject) }}%</span>
                </div>
                <p class="big-progress-label">{{ getStatusLabel(selectedProject.status || '') }}</p>
              </div>
            </div>
          </div>

          <div v-if="selectedProject.description" class="detail-card full-width">
            <h4>Descripcion</h4>
            <p class="description-text">{{ selectedProject.description }}</p>
          </div>
        </section>

        <!-- CERTIFICADOS -->
        <section v-if="activeSection === 'certificados'" class="section">
          <div class="section-head">
            <h2>Mis Vuelos</h2>
            <p>Itinerarios y vuelos reservados</p>
          </div>

          <div v-if="mappedCertificates.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <circle cx="12" cy="8" r="7"/>
              <polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/>
            </svg>
            <p>No hay vuelos registrados aun</p>
          </div>

          <div v-else class="cert-grid">
            <div v-for="c in mappedCertificates" :key="c.id" class="cert-card-new">
              <div class="cert-card-top" :class="c.typeClass">
                <span class="cert-type-icon" v-html="c.icon"></span>
                <span class="cert-type-label">{{ c.type }}</span>
              </div>
              <div class="cert-card-body">
                <h4>{{ c.name }}</h4>
                <p>{{ c.service }}</p>
                <span class="cert-date-new">{{ c.date }}</span>
              </div>
            </div>
          </div>
        </section>

        <!-- COTIZACIONES -->
        <section v-if="activeSection === 'cotizaciones'" class="section">
          <div class="section-head">
            <h2>Mis Reservas</h2>
            <p>Reservas y presupuestos de tus viajes</p>
          </div>

          <div v-if="visibleCotizaciones.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
              <polyline points="14 2 14 8 20 8"/>
              <line x1="12" y1="18" x2="12" y2="12"/>
              <line x1="9" y1="15" x2="15" y2="15"/>
            </svg>
            <p>No hay reservas registradas</p>
          </div>

          <div v-else class="quotes-list">
            <div v-for="q in visibleCotizaciones" :key="q.id" class="quote-row">
              <div class="quote-status-bar" :class="getQuoteStatusClass(q.status)"></div>
              <div class="quote-body">
                <div class="quote-top">
                  <h3>{{ q.code }}</h3>
                  <span class="status-pill" :class="getQuoteStatusClass(q.status)">{{ getQuoteStatusLabel(q.status) }}</span>
                </div>
                <div class="quote-details">
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                    ${{ q.totalAmount?.toLocaleString('es-CO') || '0' }}
                  </span>
                  <span v-if="q.project" class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/></svg>
                    {{ q.project.description || q.project.code }}
                  </span>
                  <span class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/></svg>
                    {{ formatDate(q.createdAt) }}
                  </span>
                  <span v-if="q.validUntil" class="detail-tag">
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                    Validez: {{ formatDate(q.validUntil) }}
                  </span>
                </div>
                <div v-if="q.services && q.services.length > 0" class="quote-services">
                  <div v-for="(s, i) in q.services" :key="i" class="service-item">
                    <span class="service-name">{{ s.name }}</span>
                    <span class="service-qty">{{ s.quantity }}x</span>
                    <span class="service-price">${{ s.value?.toLocaleString('es-CO') || '0' }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- DOCUMENTOS -->
        <section v-if="activeSection === 'documentos'" class="section">
          <div class="section-head">
            <h2>Documentos</h2>
            <p>Archivos de tus viajes y reservas</p>
          </div>

          <div class="filter-pills">
            <button
              v-for="f in docFilters"
              :key="f.value"
              class="pill"
              :class="{ active: docFilter === f.value }"
              @click="docFilter = f.value"
            >{{ f.label }}</button>
          </div>

          <div v-if="filteredDocuments.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
            </svg>
            <p>No hay documentos para mostrar</p>
          </div>

          <div v-else class="docs-grid">
            <div v-for="d in filteredDocuments" :key="d.id" class="doc-card-new">
              <div class="doc-card-icon" :class="d.typeClass">
                <span v-html="d.icon"></span>
              </div>
              <div class="doc-card-info">
                <h4>{{ d.name }}</h4>
                <div class="doc-card-meta">
                  <span>{{ d.project }}</span>
                  <span class="doc-sep">|</span>
                  <span>{{ d.size }}</span>
                  <span class="doc-sep">|</span>
                  <span>{{ d.date }}</span>
                </div>
              </div>
              <span class="doc-card-badge" :class="d.typeClass">{{ d.type }}</span>
            </div>
          </div>
        </section>

        <section v-if="activeSection === 'recursos' && clientData?.showResources" class="section">
          <div class="section-head">
            <h2>Recursos</h2>
            <p>Proyectos realizados para tu empresa</p>
          </div>

          <div v-if="projects.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
              <circle cx="8.5" cy="8.5" r="1.5"/>
              <polyline points="21 15 16 10 5 21"/>
            </svg>
            <p>No hay recursos para mostrar</p>
          </div>

          <div v-else class="recursos-grid">
            <div v-for="p in projects" :key="p.id" class="recurso-card">
              <div class="recurso-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z"/>
                </svg>
              </div>
              <div class="recurso-info">
                <h4>{{ p.code || p.description }}</h4>
                <p>{{ p.serviceType || 'Proyecto' }}</p>
              </div>
              <span class="recurso-status" :class="getStatusClass(p.status)">{{ getStatusLabel(p.status) }}</span>
            </div>
          </div>
        </section>

        <!-- USUARIOS -->
        <section v-if="activeSection === 'usuarios'" class="section">
          <div class="section-head">
            <h2>Usuarios</h2>
            <p>Personas asociadas a tu cuenta</p>
          </div>

          <div v-if="clientUsers.length === 0" class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <p>No hay usuarios registrados</p>
          </div>

          <div v-else class="users-table-wrapper">
            <table class="users-table">
              <thead>
                <tr>
                  <th>Nombre</th>
                  <th>Ubicacion</th>
                  <th>Cedula</th>
                  <th>Celular</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="user in clientUsers" :key="user.id">
                  <td>
                    <div class="user-name-cell">
                      <div class="user-avatar-sm">{{ getUserInitials(user.name) }}</div>
                      <span>{{ user.name || 'Sin nombre' }}</span>
                    </div>
                  </td>
                  <td>{{ clientData?.ciudad || 'N/A' }}</td>
                  <td>{{ user.clientId || 'N/A' }}</td>
                  <td>{{ clientData?.telefono || 'N/A' }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </section>

        <!-- RECAUDOS -->
        <section v-if="activeSection === 'recaudos'" class="section">
          <div class="section-head">
            <h2>Recaudos</h2>
            <p>Historial de recaudos de tu cuenta</p>
          </div>

          <div v-if="recaudosLoading" class="state-container">
            <div class="loader"></div>
            <p>Cargando recaudos...</p>
          </div>

          <div v-else-if="recaudosError" class="state-container error">
            <div class="error-box">
              <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#DC2626" stroke-width="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="12"/>
                <line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <h3>Algo salio mal</h3>
              <p>{{ recaudosError }}</p>
              <button class="retry-btn" @click="fetchRecaudos(true)">Intentar de nuevo</button>
            </div>
          </div>

          <template v-else-if="recaudos.length > 0">
            <div class="recaudos-summary">
              <div class="stat-card gold recaudo-total-card">
                <div class="stat-icon">
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <line x1="12" y1="1" x2="12" y2="23"/>
                    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                  </svg>
                </div>
                <div class="stat-data">
                  <span class="stat-text">Total recaudado</span>
                  <span class="stat-number">{{ formatRecaudoValor(filteredRecaudosTotal) }}</span>
                  <span class="recaudo-total-sub">
                    {{ filteredRecaudos.length }} de {{ recaudos.length }} recaudos
                    <template v-if="hasRecaudoFilters"> · Histórico {{ formatRecaudoValor(recaudosTotal) }}</template>
                  </span>
                </div>
              </div>
            </div>

            <div class="recaudos-filters">
              <label class="recaudo-filter">
                <span>Mes</span>
                <input v-model="recaudoMes" type="month" class="recaudo-filter-input" @change="onRecaudoMesChange" />
              </label>
              <label class="recaudo-filter">
                <span>Desde</span>
                <input v-model="recaudoDesde" type="date" class="recaudo-filter-input" @change="recaudoMes = ''" />
              </label>
              <label class="recaudo-filter">
                <span>Hasta</span>
                <input v-model="recaudoHasta" type="date" class="recaudo-filter-input" @change="recaudoMes = ''" />
              </label>
              <button
                v-if="hasRecaudoFilters"
                class="recaudo-filter-clear"
                @click="clearRecaudoFilters"
              >
                Limpiar filtros
              </button>
            </div>

            <div v-if="filteredRecaudos.length === 0" class="empty-state">
              <p>No hay recaudos en el rango seleccionado</p>
              <button class="retry-btn" @click="clearRecaudoFilters">Limpiar filtros</button>
            </div>

            <div v-else class="users-table-wrapper">
              <table class="users-table">
                <thead>
                  <tr>
                    <th>Fecha</th>
                    <th>Hora</th>
                    <th>Valor</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="r in filteredRecaudos" :key="r.id">
                    <td>{{ formatRecaudoFecha(r.fecha) }}</td>
                    <td>{{ formatRecaudoHora(r.fecha) || 'N/A' }}</td>
                    <td>{{ formatRecaudoValor(r.valor) }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </template>

          <div v-else class="empty-state">
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#CCC" stroke-width="1.5">
              <rect x="2" y="5" width="20" height="14" rx="2"/>
              <line x1="2" y1="10" x2="22" y2="10"/>
              <line x1="6" y1="15" x2="10" y2="15"/>
            </svg>
            <p>Aun no hay recaudos registrados</p>
          </div>
        </section>

        <!-- MI PERFIL -->
        <section v-if="activeSection === 'perfil'" class="section">
          <div class="section-head">
            <h2>Mi Perfil</h2>
            <p>Informacion de tu cuenta</p>
          </div>

          <div class="profile-card">
            <div class="profile-header">
              <div class="profile-avatar">{{ clientInitials }}</div>
              <div class="profile-header-info">
                <h3>{{ displayName }}</h3>
              </div>
            </div>
          </div>

          <div class="profile-grid">
            <div class="profile-section">
              <h4>Datos del viajero</h4>
              <div class="profile-rows">
                <div class="profile-row">
                  <span class="profile-label">Nombre</span>
                  <span class="profile-value">{{ clientData?.razonSocial || mockHome.company }}</span>
                </div>
                <div class="profile-row">
                  <span class="profile-label">Cedula</span>
                  <span class="profile-value">{{ clientData?.nit || mockHome.nit }}</span>
                </div>
                <div class="profile-row">
                  <span class="profile-label">Ubicacion</span>
                  <span class="profile-value">{{ clientData?.direccion || mockHome.address }}</span>
                </div>
                <div class="profile-row">
                  <span class="profile-label">Telefono</span>
                  <span class="profile-value">{{ clientData?.telefono || mockHome.phone }}</span>
                </div>
                <div class="profile-row">
                  <span class="profile-label">Correo</span>
                  <span class="profile-value">{{ clientData?.correo || mockHome.email }}</span>
                </div>
                <div class="profile-row">
                  <span class="profile-label">Email</span>
                  <span class="profile-value">{{ currentUser?.email || mockHome.email }}</span>
                </div>
              </div>
            </div>
          </div>

          <div class="profile-actions">
            <button class="btn-logout" @click="handleLogout">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                <polyline points="16 17 21 12 16 7"/>
                <line x1="21" y1="12" x2="9" y2="12"/>
              </svg>
              Cerrar sesion
            </button>
          </div>
        </section>
      </template>
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { clientAuthService, portalService, userService, recaudoService } from '@/services/api'
import type { RecaudoRow } from '@/services/api'
import type { Cliente, Proyecto, DocumentoEntity, Cotizacion } from '@/types/crmTypes'
import type { User } from '@/services/api/userService'

defineOptions({ name: 'ClientPortalView' })

const router = useRouter()
const loading = ref(true)
const error = ref('')
const showMobileMenu = ref(false)

const clientData = ref<Cliente | null>(null)
const projects = ref<Proyecto[]>([])
const documents = ref<DocumentoEntity[]>([])
const cotizaciones = ref<Cotizacion[]>([])
const visibleCotizaciones = computed(() => {
  const list = cotizaciones.value.filter((q) => q.isVisible !== false)
  return list.length > 0 ? list : mockReservas
})
const selectedProject = ref<Proyecto | null>(null)
const clientUsers = ref<User[]>([])

const portalClientId = ref<number | null>(null)
const recaudos = ref<RecaudoRow[]>([])
const recaudosLoading = ref(false)
const recaudosError = ref('')
const recaudosLoaded = ref(false)

async function fetchRecaudos(force = false) {
  if (recaudosLoading.value || (recaudosLoaded.value && !force)) return

  const clientId = portalClientId.value
  if (!clientId) {
    recaudos.value = []
    recaudosError.value = 'No pudimos identificar tu cuenta. Inicia sesion nuevamente.'
    recaudosLoaded.value = true
    return
  }

  recaudosLoading.value = true
  recaudosError.value = ''
  try {
    const res = await recaudoService.getAll({ clientId, page: 1, limit: 9999 })
    recaudos.value = res.data.filter((r) => r.clientId === clientId)
    recaudosLoaded.value = true
  } catch (err: unknown) {
    recaudos.value = []
    recaudosError.value = err instanceof Error ? err.message : 'No se pudieron cargar los recaudos.'
  } finally {
    recaudosLoading.value = false
  }
}

function formatRecaudoValor(valor: number): string {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(Number(valor) || 0)
}

function formatRecaudoFecha(fecha?: string): string {
  if (!fecha) return 'N/A'
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return 'N/A'
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
}

function formatRecaudoHora(fecha?: string): string {
  if (!fecha) return ''
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

const recaudosTotal = computed(() => recaudos.value.reduce((sum, r) => sum + (Number(r.valor) || 0), 0))

const ultimoRecaudo = computed<RecaudoRow | null>(() => {
  let best: RecaudoRow | null = null
  let bestTime = Number.NEGATIVE_INFINITY
  for (const r of recaudos.value) {
    const time = new Date(r.fecha).getTime()
    if (Number.isNaN(time)) continue
    if (time > bestTime) {
      bestTime = time
      best = r
    }
  }
  return best ?? recaudos.value[0] ?? null
})

const recaudoMes = ref('')
const recaudoDesde = ref('')
const recaudoHasta = ref('')

const hasRecaudoFilters = computed(
  () => !!(recaudoMes.value || recaudoDesde.value || recaudoHasta.value),
)

function onRecaudoMesChange() {
  if (!recaudoMes.value) {
    recaudoDesde.value = ''
    recaudoHasta.value = ''
    return
  }
  const [y, m] = recaudoMes.value.split('-').map(Number)
  if (!y || !m) return
  const pad = (n: number) => String(n).padStart(2, '0')
  recaudoDesde.value = `${y}-${pad(m)}-01`
  recaudoHasta.value = `${y}-${pad(m)}-${pad(new Date(y, m, 0).getDate())}`
}

function clearRecaudoFilters() {
  recaudoMes.value = ''
  recaudoDesde.value = ''
  recaudoHasta.value = ''
}

const filteredRecaudos = computed(() => {
  const desde = recaudoDesde.value
  const hasta = recaudoHasta.value
  if (!desde && !hasta) return recaudos.value
  return recaudos.value.filter((r) => {
    const d = new Date(r.fecha)
    if (Number.isNaN(d.getTime())) return false
    const pad = (n: number) => String(n).padStart(2, '0')
    const fecha = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
    if (desde && fecha < desde) return false
    if (hasta && fecha > hasta) return false
    return true
  })
})

const filteredRecaudosTotal = computed(() =>
  filteredRecaudos.value.reduce((sum, r) => sum + (Number(r.valor) || 0), 0),
)

const clientInitials = computed(() => {
  const name = clientData.value?.razonSocial || ''
  const parts = name.split(' ')
  return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')
})

const displayName = computed(() => {
  const user = clientAuthService.getCurrentUser()
  return user?.name || clientData.value?.razonSocial || ''
})

const activeSection = ref('inicio')
const docFilter = ref('todos')

const simulatedTrips = [
  {
    id: 1,
    name: 'Cancun All Inclusive - 7 noches',
    destination: 'Cancun, Mexico',
    dates: '15 Oct 2026 - 22 Oct 2026',
    total: 8500000,
    totalInstallments: 6,
    paidInstallments: 3,
    installmentAmount: Math.round(8500000 / 6),
    nextPayment: '15 Oct 2026',
  },
  {
    id: 2,
    name: 'Europa - Italia y Francia',
    destination: 'Roma, Paris',
    dates: '01 Dic 2026 - 14 Dic 2026',
    total: 15000000,
    totalInstallments: 10,
    paidInstallments: 4,
    installmentAmount: Math.round(15000000 / 10),
    nextPayment: '01 Dic 2026',
  },
].map((trip) => {
  const paidAmount = trip.installmentAmount * trip.paidInstallments
  return {
    ...trip,
    paidAmount,
    remainingAmount: trip.total - paidAmount,
    progress: Math.round((trip.paidInstallments / trip.totalInstallments) * 100),
  }
})

const mockHome = {
  name: 'Carlos Andres',
  company: 'Corporacion Viajera S.A.S.',
  nit: '901.456.789-2',
  city: 'Bogota, Cundinamarca',
  address: 'Carrera 7 # 72-41, Piso 12',
  phone: '+57 310 456 7890',
  email: 'carlos@corporacionviajera.com',
  activeTrips: 2,
  bookings: 5,
  paidInstallments: 7,
  pendingInstallments: 9,
  balance: 15066674,
  paidTotal: 10750000,
  lastPayment: 1500000,
  lastPaymentDate: '15 Sep 2026',
  activity: [
    {
      title: 'Cancun All Inclusive - 7 noches',
      meta: 'Cuota 3/6 pagada - 15 Sep 2026',
      amount: '-$1.416.667',
      status: 'active',
    },
    {
      title: 'Europa - Italia y Francia',
      meta: 'Cuota 4/10 pagada - 01 Sep 2026',
      amount: '-$1.500.000',
      status: 'active',
    },
    {
      title: 'Cancun All Inclusive - 7 noches',
      meta: 'Cuota 2/6 pagada - 15 Ago 2026',
      amount: '-$1.416.667',
      status: 'completed',
    },
    {
      title: 'Reserva confirmada - Europa',
      meta: 'Itinerario aprobado - 20 Ago 2026',
      amount: '$15.000.000',
      status: 'scheduled',
    },
    {
      title: 'Cancun All Inclusive - 7 noches',
      meta: 'Cuota 1/6 pagada - 15 Jul 2026',
      amount: '-$1.416.667',
      status: 'completed',
    },
  ],
}

const CERT_ICON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="8" r="7"/><polyline points="8.21 13.89 7 23 12 20 17 23 15.79 13.88"/></svg>'
const REPORT_ICON =
  '<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>'

const mockReservas: Cotizacion[] = [
  {
    id: 9001,
    code: 'COT-1042',
    clientId: 1,
    clientName: 'Corporacion Viajera S.A.S.',
    projectId: 2,
    project: { id: 2, code: 'PRJ-002', description: 'Europa - Italia y Francia' },
    status: 'aprobada',
    totalAmount: 15000000,
    validUntil: '2026-11-30',
    createdAt: '2026-08-20',
    updatedAt: '2026-08-22',
    services: [
      { name: 'Vuelos Bogota - Roma', quantity: 2, billingType: 'ONETIME', value: 9200000 },
      { name: 'Hoteles 4 estrellas', quantity: 13, billingType: 'ONETIME', value: 5800000 },
    ],
  },
  {
    id: 9002,
    code: 'COT-1058',
    clientId: 1,
    clientName: 'Corporacion Viajera S.A.S.',
    projectId: 1,
    project: { id: 1, code: 'PRJ-001', description: 'Cancun All Inclusive - 7 noches' },
    status: 'enviada',
    totalAmount: 8500000,
    validUntil: '2026-10-15',
    createdAt: '2026-09-01',
    updatedAt: '2026-09-03',
    services: [
      { name: 'Paquete aereo directo', quantity: 2, billingType: 'ONETIME', value: 4600000 },
      { name: 'Traslado aeropuerto - hotel', quantity: 2, billingType: 'ONETIME', value: 900000 },
      { name: 'Seguro de viaje', quantity: 2, billingType: 'ONETIME', value: 300000 },
    ],
  },
  {
    id: 9003,
    code: 'COT-1063',
    clientId: 1,
    clientName: 'Corporacion Viajera S.A.S.',
    projectId: 3,
    project: { id: 3, code: 'PRJ-003', description: 'Tour Ciudad de Mexico' },
    status: 'pendiente',
    totalAmount: 3200000,
    validUntil: '2026-10-31',
    createdAt: '2026-09-18',
    updatedAt: '2026-09-18',
    services: [
      { name: 'Tour centro historico', quantity: 4, billingType: 'ONETIME', value: 1600000 },
      { name: 'Cena tipica', quantity: 4, billingType: 'ONETIME', value: 640000 },
    ],
  },
]

const mockVuelos = [
  {
    id: 9101,
    name: 'BOG - CUN 15 oct 2026',
    service: 'Cancun All Inclusive - 7 noches',
    type: 'Certificado',
    typeClass: 'certificate',
    date: '15 oct 2026',
    icon: CERT_ICON,
  },
  {
    id: 9102,
    name: 'CUN - BOG 22 oct 2026',
    service: 'Cancun All Inclusive - 7 noches',
    type: 'Certificado',
    typeClass: 'certificate',
    date: '22 oct 2026',
    icon: CERT_ICON,
  },
  {
    id: 9103,
    name: 'BOG - MIA - FCO 01 dic 2026',
    service: 'Europa - Italia y Francia',
    type: 'Informe',
    typeClass: 'report',
    date: '01 dic 2026',
    icon: REPORT_ICON,
  },
  {
    id: 9104,
    name: 'CDG - BOG 14 dic 2026',
    service: 'Europa - Italia y Francia',
    type: 'Informe',
    typeClass: 'report',
    date: '14 dic 2026',
    icon: REPORT_ICON,
  },
]

const navItems = computed(() => {
  const items = [
    { id: 'inicio', label: 'Inicio', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>', count: 0 },
    { id: 'recaudos', label: 'Recaudos', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/><line x1="6" y1="15" x2="10" y2="15"/></svg>', count: recaudos.value.length },
    { id: 'perfil', label: 'Mi Perfil', icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>', count: 0 },
  ]
  return items
})

function getStatusClass(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('activo') || s.includes('ejecucion') || s.includes('en curso') || s === 'en_curso') return 'active'
  if (s.includes('finalizado') || s.includes('completado') || s === 'completed') return 'completed'
  if (s.includes('programado') || s.includes('pendiente') || s.includes('nuevo')) return 'scheduled'
  return 'active'
}

function getStatusLabel(status: string): string {
  const s = status.toLowerCase()
  if (s.includes('activo') || s.includes('ejecucion') || s.includes('en curso') || s === 'en_curso') return 'En ejecucion'
  if (s.includes('finalizado') || s.includes('completado') || s === 'completed') return 'Finalizado'
  if (s.includes('programado') || s.includes('pendiente') || s.includes('nuevo')) return 'Programado'
  return status
}

function getQuoteStatusClass(status: string): string {
  const s = status.toLowerCase()
  if (s === 'aprobada') return 'active'
  if (s === 'enviada') return 'scheduled'
  if (s === 'rechazada' || s === 'vencida') return 'completed'
  return 'scheduled'
}

function getQuoteStatusLabel(status: string): string {
  const labels: Record<string, string> = {
    pendiente: 'Pendiente',
    enviada: 'Enviada',
    aprobada: 'Aprobada',
    rechazada: 'Rechazada',
    vencida: 'Vencida',
  }
  return labels[status] || status
}

function calculateProgress(project: Proyecto): number {
  if (project.status?.toLowerCase().includes('finalizado')) return 100
  if (project.status?.toLowerCase().includes('nuevo') || project.status?.toLowerCase().includes('programado')) return 0
  if (!project.startDate || !project.endDate) return 50
  const start = new Date(project.startDate).getTime()
  const end = new Date(project.endDate).getTime()
  const now = Date.now()
  if (end <= start) return 100
  const progress = Math.round(((now - start) / (end - start)) * 100)
  return Math.min(Math.max(progress, 0), 99)
}

function formatDate(dateStr: string): string {
  if (!dateStr) return 'N/A'
  return new Date(dateStr).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' })
}

const mappedCertificates = computed(() => {
  const items = documents.value
    .filter((d) => (d.isVisible !== false) && (d.type === 'certificado' || d.type === 'informe'))
    .map((d) => ({
      id: d.id,
      name: d.name,
      service: getProjectName(d.entityId),
      type: d.type === 'certificado' ? 'Certificado' : 'Informe',
      typeClass: d.type === 'certificado' ? 'certificate' : 'report',
      date: new Date(d.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
      icon: d.type === 'certificado' ? CERT_ICON : REPORT_ICON,
    }))
  return items.length > 0 ? items : mockVuelos
})

function getProjectName(projectId: number): string {
  const project = projects.value.find((p) => p.id === projectId)
  return project?.description || project?.code || 'Proyecto'
}

function getDocTypeLabel(type: string): string {
  const labels: Record<string, string> = {
    contrato: 'Contrato', cotizacion: 'Cotizacion', informe: 'Informe',
    certificado: 'Certificado', acta: 'Acta', presentacion: 'Presentacion',
    hoja_de_vida: 'Hoja de Vida', soportes_estudio: 'Soportes',
  }
  return labels[type] || type
}

function getDocTypeClass(type: string): string {
  const classes: Record<string, string> = {
    contrato: 'procedure', cotizacion: 'procedure', informe: 'report',
    certificado: 'certificate', acta: 'acta', presentacion: 'presentation',
    hoja_de_vida: 'manual', soportes_estudio: 'plan',
  }
  return classes[type] || 'report'
}

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return bytes + ' B'
  if (bytes < 1048576) return (bytes / 1024).toFixed(0) + ' KB'
  return (bytes / 1048576).toFixed(1) + ' MB'
}

const mappedDocuments = computed(() => {
  return documents.value
    .filter((d) => d.isVisible !== false)
    .map((d) => ({
    id: d.id,
    name: d.name,
    project: getProjectName(d.entityId),
    type: getDocTypeLabel(d.type),
    typeClass: getDocTypeClass(d.type),
    size: formatFileSize(d.size),
    date: new Date(d.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
    url: d.url,
    icon: '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>',
  }))
})

const docFilters = [
  { value: 'todos', label: 'Todos' },
  { value: 'procedure', label: 'Contratos' },
  { value: 'report', label: 'Informes' },
  { value: 'certificate', label: 'Certificados' },
  { value: 'acta', label: 'Actas' },
  { value: 'presentation', label: 'Presentaciones' },
]

const filteredDocuments = computed(() => {
  if (docFilter.value === 'todos') return mappedDocuments.value
  return mappedDocuments.value.filter((d) => d.typeClass === docFilter.value)
})

onMounted(async () => {
  try {
    loading.value = true
    const data = await portalService.getPortalData()
    clientData.value = data.client
    projects.value = data.projects
    documents.value = data.documents
    cotizaciones.value = data.cotizaciones
    portalClientId.value = data.clientId ?? data.client?.id ?? null
    error.value = ''

    // Fetch users for the client
    try {
      const allUsers = await userService.getAll()
      clientUsers.value = allUsers.filter(u => u.clientId === data.clientId || u.clientId === data.client?.id)
    } catch {
      clientUsers.value = []
    }

    fetchRecaudos(true)
  } catch (err: unknown) {
    console.error('Error loading portal data:', err)
    error.value = err instanceof Error ? err.message : 'Error al cargar los datos del portal'
  } finally {
    loading.value = false
  }
})

function handleLogout() {
  if (confirm('Desea cerrar sesion?')) {
    clientAuthService.logout()
    router.push('/')
  }
}

function goToHome() {
  showMobileMenu.value = false
  router.push('/')
}

function getUserInitials(name: string | undefined): string {
  if (!name) return '?'
  const parts = name.split(' ')
  return (parts[0]?.[0] || '') + (parts[parts.length - 1]?.[0] || '')
}

const currentUser = computed(() => clientAuthService.getCurrentUser())

async function reloadData() {
  loading.value = true
  error.value = ''
  try {
    const data = await portalService.getPortalData()
    clientData.value = data.client
    projects.value = data.projects
    documents.value = data.documents
    cotizaciones.value = data.cotizaciones
    portalClientId.value = data.clientId ?? data.client?.id ?? null
    error.value = ''

    try {
      const allUsers = await userService.getAll()
      clientUsers.value = allUsers.filter(u => u.clientId === data.clientId || u.clientId === data.client?.id)
    } catch {
      clientUsers.value = []
    }

    fetchRecaudos(true)
  } catch (err: unknown) {
    error.value = err instanceof Error ? err.message : 'Error al cargar los datos del portal'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.portal-app {
  display: flex;
  min-height: 100vh;
  background: #102857;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
  color: #1A1A1A;
}

/* ===== SIDEBAR ===== */
.sidebar {
  width: 240px;
  background: #0E3570;
  color: #FFF;
  display: flex;
  flex-direction: column;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  z-index: 200;
  padding: 20px 12px;
}

.sidebar-header {
  padding: 0 8px 20px;
  border-bottom: none;
  display: flex;
  align-items: center;
  gap: 10px;
  position: sticky;
  top: 0;
  background: transparent;
  z-index: 10;
  margin-bottom: 8px;
}

.sidebar-logo {
  height: 56px;
  width: 100%;
  object-fit: contain;
  object-position: left center;
  border-radius: 6px;
  background: transparent;
  padding: 0;
  filter: brightness(0) invert(1);
}

.sidebar-brand {
  font-size: 16px;
  font-weight: 800;
  color: #FFF;
  display: none;
}

.sidebar-nav {
  flex: 1;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 12px 16px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.65);
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
  width: 100%;
  font-family: inherit;
}

.nav-item:hover {
  background: rgba(255,255,255,0.08);
  color: #FFF;
}

.nav-item.active {
  background: #E8483F;
  color: #FFF;
  font-weight: 600;
}

.nav-icon {
  display: flex;
  align-items: center;
  flex-shrink: 0;
}

.nav-label {
  flex: 1;
}

.nav-badge {
  background: rgba(255,255,255,0.15);
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 11px;
  font-weight: 600;
}

.nav-item.active .nav-badge {
  background: rgba(255,255,255,0.25);
}

.sidebar-footer {
  padding: 16px 0 0;
  border-top: 1px solid rgba(255,255,255,0.1);
  margin-top: 8px;
}

.sidebar-user {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  padding: 0 4px;
}

.sidebar-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 13px;
  font-weight: 700;
  flex-shrink: 0;
}

.sidebar-user-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.sidebar-user-name {
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-user-company {
  font-size: 11px;
  opacity: 0.5;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.sidebar-logout {
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.55);
  border-radius: 8px;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.sidebar-logout:hover {
  color: #FFF;
  background: rgba(255,255,255,0.08);
}

/* ===== MOBILE HEADER ===== */
.mobile-header {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 56px;
  background: #0E3570;
  color: #FFF;
  align-items: center;
  justify-content: space-between;
  padding: 0 16px;
  z-index: 150;
}

.mobile-menu-btn,
.mobile-logout-btn {
  background: none;
  border: none;
  color: #FFF;
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
}

.mobile-menu-btn:hover,
.mobile-logout-btn:hover {
  background: rgba(255,255,255,0.1);
}

.mobile-title {
  height: 28px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.mobile-overlay {
  display: none;
  position: fixed;
  inset: 0;
  background: rgba(0,0,0,0.5);
  z-index: 250;
}

.mobile-sidebar {
  display: none;
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 280px;
  background: #0E3570;
  z-index: 300;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  flex-direction: column;
}

.mobile-sidebar.open {
  transform: translateX(0);
}

.mobile-sidebar-header {
  padding: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255,255,255,0.08);
}

.mobile-sidebar-brand {
  display: flex;
  align-items: center;
  gap: 6px;
}

.mobile-brand-btn,
.mobile-home-btn {
  display: flex;
  align-items: center;
  background: none;
  border: none;
  color: #FFF;
  padding: 6px;
  cursor: pointer;
  border-radius: 8px;
  transition: background 0.2s;
}

.mobile-brand-btn:hover,
.mobile-home-btn:hover {
  background: rgba(255,255,255,0.1);
}

.mobile-sidebar-logo {
  height: 28px;
  width: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.mobile-close-btn {
  background: none;
  border: none;
  color: #FFF;
  padding: 4px;
  cursor: pointer;
}

.mobile-nav {
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.mobile-nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 16px;
  border: none;
  background: transparent;
  color: rgba(255,255,255,0.65);
  font-size: 14px;
  font-weight: 500;
  border-radius: 10px;
  cursor: pointer;
  text-align: left;
  width: 100%;
  font-family: inherit;
}

.mobile-nav-item.active {
  background: #E8483F;
  color: #FFF;
}

/* ===== MAIN CONTENT ===== */
.main-content {
  flex: 1;
  margin-left: 240px;
  padding: 0 28px 28px;
  min-height: 100vh;
}

/* ===== TOP HEADER ===== */
.top-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 0 20px;
}

.top-header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.top-user-info {
  text-align: right;
}

.top-hola {
  font-size: 14px;
  font-weight: 600;
  color: #FFF;
}

.top-avatar {
  width: 40px;
  height: 40px;
  border-radius: 50%;
  background: rgba(255,255,255,0.15);
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 14px;
  font-weight: 700;
  flex-shrink: 0;
}

.top-bell {
  background: none;
  border: none;
  color: rgba(255,255,255,0.7);
  padding: 8px;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  position: relative;
}

.top-bell:hover {
  background: rgba(255,255,255,0.1);
  color: #FFF;
}

/* ===== LOADING / ERROR ===== */
.state-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 60vh;
  gap: 16px;
  color: rgba(255,255,255,0.6);
}

.loader {
  width: 40px;
  height: 40px;
  border: 3px solid rgba(255,255,255,0.15);
  border-top-color: #FFF;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.error-box {
  text-align: center;
  max-width: 400px;
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 40px;
}

.error-box h3 {
  font-size: 18px;
  font-weight: 700;
  margin: 16px 0 8px;
  color: #FFF;
}

.error-box p {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin: 0 0 20px;
}

.retry-btn {
  padding: 10px 24px;
  background: #FFF;
  color: #0E3570;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
}

/* ===== SECTIONS ===== */
.section {
  animation: fadeUp 0.3s ease;
}

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-head {
  margin-bottom: 20px;
}

.section-head h2 {
  font-size: 20px;
  font-weight: 800;
  margin: 0 0 4px;
  color: #FFF;
}

.section-head p {
  font-size: 13px;
  color: rgba(255,255,255,0.5);
  margin: 0;
}

/* ===== RECAUDOS: RESUMEN Y FILTROS ===== */
.recaudos-summary {
  display: flex;
  gap: 14px;
  margin-bottom: 18px;
  flex-wrap: wrap;
}

.recaudo-total-card {
  max-width: 380px;
  width: 100%;
}

.recaudo-total-card .stat-icon {
  background: rgba(245, 193, 7, 0.15);
  color: #FFC107;
}

.recaudo-total-sub {
  display: block;
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-top: 4px;
}

.recaudos-filters {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 12px;
  margin-bottom: 18px;
}

.recaudo-filter {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.recaudo-filter span {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.04em;
  color: rgba(255,255,255,0.5);
}

.recaudo-filter-input {
  padding: 9px 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08);
  color: #FFF;
  font-family: inherit;
  font-size: 13px;
  outline: none;
  color-scheme: dark;
  transition: border-color 0.2s;
}

.recaudo-filter-input:focus {
  border-color: rgba(255,255,255,0.4);
}

.recaudo-filter-clear {
  padding: 9px 14px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.15);
  background: transparent;
  color: rgba(255,255,255,0.75);
  font-family: inherit;
  font-size: 12.5px;
  cursor: pointer;
  transition: all 0.2s;
}

.recaudo-filter-clear:hover {
  background: rgba(255,255,255,0.08);
  color: #FFF;
}

/* ===== GREETING ===== */
.greeting-card {
  background: transparent;
  border-radius: 0;
  padding: 0 0 20px;
  color: #FFF;
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  margin-bottom: 0;
  position: relative;
  overflow: hidden;
}

.greeting-text h1 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 4px;
  color: #FFF;
}

.greeting-text p {
  font-size: 14px;
  color: rgba(255,255,255,0.55);
  margin: 0;
}

.greeting-text strong {
  color: #FFF;
}

.greeting-decoration {
  display: none;
}

/* ===== WELCOME INFO CARD ===== */
.welcome-info-card {
  background: rgba(255,255,255,0.1);
  border-radius: 16px;
  padding: 48px 40px;
  text-align: center;
  max-width: 500px;
  margin: 40px auto;
  border: 1px solid rgba(255,255,255,0.08);
}

.welcome-icon {
  margin-bottom: 20px;
}

.welcome-info-card h2 {
  font-size: 24px;
  font-weight: 800;
  margin: 0 0 8px;
  color: #FFF;
}

.welcome-subtitle {
  font-size: 14px;
  color: rgba(255,255,255,0.5);
  margin: 0 0 24px;
}

.welcome-divider {
  width: 60px;
  height: 3px;
  background: #16C2CA;
  border-radius: 2px;
  margin: 0 auto 24px;
}

.welcome-message {
  font-size: 14px;
  color: rgba(255,255,255,0.6);
  margin: 0 0 28px;
  line-height: 1.6;
}

.welcome-info-card .retry-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 28px;
  background: #16C2CA;
  color: #FFF;
  border: none;
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.welcome-info-card .retry-btn:hover {
  background: #13ABB2;
  transform: translateY(-1px);
}

/* ===== STATS ===== */
.stats-row {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 14px;
  margin-bottom: 20px;
}

.stats-row > .stat-card:only-child {
  grid-column: 1 / -1;
}

.stat-card {
  background: rgba(255,255,255,0.1);
  border-radius: 14px;
  padding: 20px;
  display: flex;
  align-items: center;
  gap: 14px;
  border: 1px solid rgba(255,255,255,0.06);
  backdrop-filter: blur(10px);
}

.stat-data {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.stat-icon {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.stat-card.blue .stat-icon { background: rgba(22,194,202,0.15); color: #16C2CA; }
.stat-card.gold .stat-icon { background: rgba(245,74,22,0.15); color: #F54A16; }
.stat-card.green .stat-icon { background: rgba(16,185,129,0.15); color: #10B981; }
.stat-card.orange .stat-icon { background: rgba(255,193,7,0.15); color: #FFC107; }

.stat-number {
  font-size: 24px;
  font-weight: 800;
  line-height: 1;
  display: block;
  color: #FFF;
}

.stat-text {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  margin-top: 2px;
}

.stat-date {
  display: block;
  font-size: 13px;
  font-weight: 700;
  color: rgba(255,255,255,0.9);
  margin-top: 3px;
}

.stat-card.gold {
  align-items: stretch;
}

.stat-card.gold .stat-icon {
  align-self: center;
}

.stat-card.gold .stat-data {
  flex: 1;
  justify-content: center;
  gap: 6px;
}

.stat-card.gold .stat-number {
  font-size: 22px;
  letter-spacing: -0.01em;
}

.stat-card.gold .stat-date {
  font-size: 14px;
  margin-top: 0;
}

.stat-card.gold .stat-text {
  margin-top: 0;
  font-size: 12.5px;
}

.stat-card.orange { cursor: pointer; transition: all 0.2s; }
.stat-card.orange:hover { background: rgba(255,255,255,0.15); transform: translateY(-1px); }

/* ===== INFO GRID ===== */
.info-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.info-card {
  background: #EFF4FB;
  border-radius: 14px;
  padding: 24px;
  border: none;
}

.info-card h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
  color: #1A1A1A;
}

.info-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.info-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.info-label {
  font-size: 13px;
  color: #888;
}

.info-value {
  font-size: 13px;
  font-weight: 600;
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1A1A1A;
}

/* ===== ACTIVITY ===== */
.activity-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.activity-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
}

.activity-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  margin-top: 5px;
  flex-shrink: 0;
}

.activity-dot.active { background: #16C2CA; }
.activity-dot.completed { background: #10B981; }
.activity-dot.scheduled { background: #F54A16; }

.activity-title {
  font-size: 13px;
  font-weight: 600;
  display: block;
  color: #1A1A1A;
}

.activity-meta {
  font-size: 12px;
  color: #888;
}

.empty-mini {
  text-align: center;
  padding: 24px;
  color: #AAA;
  font-size: 13px;
}

/* ===== PROJECTS LIST ===== */
.projects-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.project-row {
  background: #EFF4FB;
  border-radius: 14px;
  display: flex;
  align-items: stretch;
  border: none;
  cursor: pointer;
  transition: all 0.2s;
  overflow: hidden;
}

.project-row:hover {
  box-shadow: 0 4px 20px rgba(0,0,0,0.1);
  transform: translateY(-1px);
}

.project-status-bar {
  width: 4px;
  flex-shrink: 0;
}

.project-status-bar.active { background: #16C2CA; }
.project-status-bar.completed { background: #10B981; }
.project-status-bar.scheduled { background: #F54A16; }

.project-body {
  flex: 1;
  padding: 20px 24px;
}

.project-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.project-top h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  color: #1A1A1A;
}

.status-pill {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 12px;
  border-radius: 20px;
  white-space: nowrap;
}

.status-pill.active { background: rgba(22,194,202,0.1); color: #16C2CA; }
.status-pill.completed { background: rgba(16,185,129,0.1); color: #10B981; }
.status-pill.scheduled { background: rgba(245,74,22,0.1); color: #F54A16; }
.status-pill.large { font-size: 12px; padding: 6px 14px; }

.project-details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.detail-tag {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 12px;
  color: #888;
}

.project-progress {
  display: flex;
  align-items: center;
  gap: 12px;
}

.progress-track {
  flex: 1;
  height: 4px;
  background: #F0F0F0;
  border-radius: 2px;
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  border-radius: 2px;
  transition: width 0.5s ease;
}

.progress-fill.active { background: #16C2CA; }
.progress-fill.completed { background: #10B981; }
.progress-fill.scheduled { background: #F54A16; }

.progress-label {
  font-size: 12px;
  font-weight: 700;
  color: #888;
  min-width: 32px;
  text-align: right;
}

.project-arrow {
  display: flex;
  align-items: center;
  padding: 0 16px;
  color: #CCC;
}

/* ===== GREETING BADGE ===== */

.greeting-badge {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: rgba(22, 194, 202, 0.12);
  border: 1px solid rgba(22, 194, 202, 0.3);
  color: #16c2ca;
  font-size: 12px;
  font-weight: 600;
  border-radius: 20px;
  white-space: nowrap;
  flex-shrink: 0;
}

.activity-amount {
  margin-left: auto;
  font-size: 12px;
  font-weight: 700;
  color: #1a1a1a;
  white-space: nowrap;
  flex-shrink: 0;
}

/* ===== INSTALLMENT TRIPS ===== */

.installment-row {
  cursor: default;
}

.installment-row:hover {
  transform: none;
}

.installment-summary {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 12px;
  margin-bottom: 14px;
  padding: 12px 14px;
  background: #f8fafc;
  border-radius: 10px;
}

.installment-stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.installment-stat-label {
  font-size: 11px;
  font-weight: 600;
  color: #94a3b8;
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.installment-stat-value {
  font-size: 14px;
  font-weight: 700;
  color: #1a1a1a;
}

.installment-stat-value.paid {
  color: #10b981;
}

.installment-stat-value.pending {
  color: #f59e0b;
}

.cuotas-row {
  display: flex;
  gap: 6px;
  flex-wrap: wrap;
  margin-top: 12px;
}

.cuota-dot {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: #e5e7eb;
  border: 2px solid #e5e7eb;
  transition: all 0.2s;
}

.cuota-dot.paid {
  background: #16c2ca;
  border-color: #16c2ca;
}

.cuota-dot.next {
  background: #fff;
  border-color: #16c2ca;
  box-shadow: 0 0 0 3px rgba(22, 194, 202, 0.2);
}

.next-payment {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  margin-top: 12px;
  font-size: 12px;
  font-weight: 600;
  color: #16c2ca;
  background: rgba(22, 194, 202, 0.08);
  padding: 6px 12px;
  border-radius: 8px;
}

@media (max-width: 640px) {
  .installment-summary {
    grid-template-columns: repeat(2, 1fr);
  }
}

/* ===== BACK BTN ===== */
.back-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: rgba(255,255,255,0.6);
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  padding: 0;
  margin-bottom: 20px;
  font-family: inherit;
}

.back-btn:hover {
  color: #FFF;
}

/* ===== DETAIL ===== */
.detail-header {
  display: flex;
  align-items: center;
  gap: 16px;
  margin-bottom: 24px;
}

.detail-header h2 {
  font-size: 22px;
  font-weight: 800;
  margin: 0;
  color: #FFF;
}

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
  margin-bottom: 16px;
}

.detail-card {
  background: #EFF4FB;
  border-radius: 14px;
  padding: 24px;
  border: none;
}

.detail-card.full-width {
  grid-column: 1 / -1;
}

.detail-card h4 {
  font-size: 13px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px;
}

.detail-rows {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.detail-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.detail-row span {
  font-size: 13px;
  color: #888;
}

.detail-row strong {
  font-size: 13px;
  font-weight: 600;
  color: #1A1A1A;
}

.description-text {
  font-size: 14px;
  line-height: 1.6;
  color: #555;
  margin: 0;
}

.big-progress {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
}

.big-progress-ring {
  position: relative;
  width: 120px;
  height: 120px;
}

.big-progress-ring svg {
  width: 100%;
  height: 100%;
}

.big-progress-ring circle:last-child {
  transition: stroke-dashoffset 1s ease;
}

.big-progress-text {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 24px;
  font-weight: 800;
  color: #16C2CA;
}

.big-progress-label {
  font-size: 13px;
  color: #888;
  margin: 0;
}

/* ===== CERTIFICATES ===== */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 14px;
}

/* ===== QUOTES ===== */
.quotes-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.quote-row {
  background: #EFF4FB;
  border-radius: 14px;
  display: flex;
  align-items: stretch;
  border: none;
  overflow: hidden;
}

.quote-status-bar {
  width: 4px;
  flex-shrink: 0;
}

.quote-status-bar.active { background: #16C2CA; }
.quote-status-bar.scheduled { background: #F54A16; }
.quote-status-bar.completed { background: #10B981; }

.quote-body {
  flex: 1;
  padding: 20px 24px;
}

.quote-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.quote-top h3 {
  font-size: 15px;
  font-weight: 700;
  margin: 0;
  color: #1A1A1A;
}

.quote-details {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  margin-bottom: 12px;
}

.quote-services {
  border-top: 1px solid #F0F0F0;
  padding-top: 12px;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.service-item {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 13px;
}

.service-name {
  flex: 1;
  color: #555;
}

.service-qty {
  color: #888;
  min-width: 32px;
  text-align: center;
}

.service-price {
  font-weight: 600;
  min-width: 80px;
  text-align: right;
}

.cert-card-new {
  background: #EFF4FB;
  border-radius: 14px;
  overflow: hidden;
  border: none;
  transition: all 0.2s;
}

.cert-card-new:hover {
  box-shadow: 0 4px 16px rgba(0,0,0,0.1);
}

.cert-card-top {
  padding: 16px 20px 12px;
  display: flex;
  align-items: center;
  gap: 10px;
}

.cert-card-top.certificate { background: linear-gradient(135deg, #FFF7ED 0%, #FFEDD5 100%); }
.cert-card-top.report { background: linear-gradient(135deg, #ECFDF5 0%, #D1FAE5 100%); }

.cert-type-icon {
  display: flex;
  align-items: center;
}

.cert-card-top.certificate .cert-type-icon { color: #F54A16; }
.cert-card-top.report .cert-type-icon { color: #10B981; }

.cert-type-label {
  font-size: 11px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.cert-card-top.certificate .cert-type-label { color: #F54A16; }
.cert-card-top.report .cert-type-label { color: #10B981; }

.cert-card-body {
  padding: 16px 20px 20px;
}

.cert-card-body h4 {
  font-size: 14px;
  font-weight: 700;
  margin: 0 0 4px;
  color: #1A1A1A;
}

.cert-card-body p {
  font-size: 12px;
  color: #888;
  margin: 0 0 8px;
}

.cert-date-new {
  font-size: 11px;
  color: #AAA;
}

/* ===== FILTERS ===== */
.filter-pills {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  flex-wrap: wrap;
}

.pill {
  padding: 8px 16px;
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: 20px;
  background: transparent;
  font-size: 13px;
  font-weight: 500;
  color: rgba(255,255,255,0.6);
  cursor: pointer;
  transition: all 0.2s;
  font-family: inherit;
}

.pill:hover {
  border-color: rgba(255,255,255,0.3);
  color: #FFF;
}

.pill.active {
  background: #E8483F;
  color: #FFF;
  border-color: #E8483F;
}

/* ===== DOCS ===== */
.docs-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.doc-card-new {
  background: #EFF4FB;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: none;
  transition: all 0.2s;
}

.doc-card-new:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.doc-card-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.doc-card-icon.manual { background: #F3E8FF; color: #8B5CF6; }
.doc-card-icon.procedure { background: #EFF6FF; color: #3B82F6; }
.doc-card-icon.report { background: #ECFDF5; color: #10B981; }
.doc-card-icon.acta { background: #FFF4ED; color: #F54A16; }
.doc-card-icon.plan { background: #FEF2F2; color: #EF4444; }
.doc-card-icon.presentation { background: #FEF9C3; color: #CA8A04; }
.doc-card-icon.certificate { background: #FEF9C3; color: #CA8A04; }

.doc-card-info {
  flex: 1;
  min-width: 0;
}

.doc-card-info h4 {
  font-size: 13px;
  font-weight: 600;
  margin: 0 0 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1A1A1A;
}

.doc-card-meta {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #AAA;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.doc-sep {
  opacity: 0.3;
}

.doc-card-badge {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.doc-card-badge.manual { background: #F3E8FF; color: #7C3AED; }
.doc-card-badge.procedure { background: #EFF6FF; color: #2563EB; }
.doc-card-badge.report { background: #ECFDF5; color: #059669; }
.doc-card-badge.acta { background: #FFF4ED; color: #F54A16; }
.doc-card-badge.plan { background: #FEF2F2; color: #DC2626; }
.doc-card-badge.presentation { background: #FEF9C3; color: #CA8A04; }
.doc-card-badge.certificate { background: #FEF9C3; color: #CA8A04; }

/* ===== EMPTY ===== */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 60px 20px;
  text-align: center;
  gap: 12px;
}

.empty-state p {
  font-size: 14px;
  color: rgba(255,255,255,0.4);
  margin: 0;
}

/* ===== RESPONSIVE ===== */
@media (max-width: 1024px) {
  .stats-row { grid-template-columns: repeat(2, 1fr); }
  .stats-row > *:last-child { grid-column: 1 / -1; }
  .info-grid { grid-template-columns: 1fr; }
  .detail-grid { grid-template-columns: 1fr; }
}

.recursos-grid {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.recurso-card {
  background: #EFF4FB;
  border-radius: 12px;
  padding: 16px 20px;
  display: flex;
  align-items: center;
  gap: 16px;
  border: none;
  transition: all 0.2s;
}

.recurso-card:hover {
  box-shadow: 0 2px 12px rgba(0,0,0,0.08);
}

.recurso-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(22,194,202,0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  color: #16C2CA;
}

.recurso-info {
  flex: 1;
  min-width: 0;
}

.recurso-info h4 {
  margin: 0 0 2px;
  font-size: 14px;
  font-weight: 600;
  color: #1A1A1A;
}

.recurso-info p {
  margin: 0;
  font-size: 12px;
  color: #999;
}

.recurso-status {
  font-size: 11px;
  font-weight: 600;
  padding: 4px 10px;
  border-radius: 6px;
  white-space: nowrap;
  flex-shrink: 0;
}

.recurso-status.active { background: rgba(16,185,129,0.1); color: #059669; }
.recurso-status.completed { background: rgba(59,130,246,0.1); color: #2563EB; }
.recurso-status.scheduled { background: rgba(245,74,22,0.1); color: #F54A16; }

@media (max-width: 768px) {
  .sidebar { display: none; }
  .mobile-header { display: flex; }
  .mobile-overlay { display: block; }
  .mobile-sidebar { display: flex; }
  .main-content { margin-left: 0; padding: 72px 16px 24px; }
  .greeting-card { flex-direction: column; text-align: center; padding: 0 0 20px; }
  .greeting-decoration { display: none; }
  .welcome-info-card { padding: 32px 20px; margin: 24px auto; }
  .project-details { flex-direction: column; gap: 6px; }
  .cert-grid { grid-template-columns: 1fr; }
  .users-table-wrapper { overflow-x: auto; }
  .profile-grid { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: 1fr; }
}

/* ===== SALDO BANNER ===== */
.saldo-banner {
  display: flex;
  align-items: stretch;
  justify-content: flex-start;
  padding: 0;
  gap: 0;
  background: rgba(255,255,255,0.1);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 14px;
  overflow: hidden;
  backdrop-filter: blur(10px);
  color: #FFFFFF;
  margin-bottom: 20px;
}

.saldo-left {
  flex: 1.15;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 6px;
  padding: 38px 36px;
  background: transparent;
  border-right: 1px solid rgba(255,255,255,0.1);
}

.saldo-banner > .saldo-left:last-child {
  border-right: none;
}

.saldo-label {
  font-size: 13px;
  color: rgba(255,255,255,0.55);
  font-weight: 600;
}

.saldo-amount {
  font-size: 36px;
  font-weight: 800;
  letter-spacing: -0.02em;
  color: #FFFFFF;
}

.saldo-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.45);
}

.saldo-right {
  flex: 1;
  min-width: 0;
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  gap: 16px;
  padding: 38px 24px;
  background: transparent;
}

.saldo-detail {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  gap: 6px;
}

.saldo-detail-label {
  font-size: 12px;
  color: rgba(255,255,255,0.5);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.saldo-detail-value {
  font-size: 22px;
  font-weight: 800;
  color: #FFFFFF;
}

.saldo-detail-value.paid {
  color: #10B981;
}

.saldo-btn {
  padding: 10px 24px;
  background: #16C2CA;
  color: #FFF;
  border: none;
  border-radius: 8px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  font-family: inherit;
  transition: all 0.2s;
}

.saldo-btn:hover {
  background: #13ABB2;
}

/* ===== USERS TABLE ===== */
.users-table-wrapper {
  background: #EFF4FB;
  border-radius: 14px;
  border: none;
  overflow: hidden;
}

.users-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 14px;
}

.users-table thead {
  background: #F8F9FA;
  border-bottom: 1px solid #F0F0F0;
}

.users-table th {
  padding: 14px 20px;
  text-align: left;
  font-size: 12px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.users-table td {
  padding: 14px 20px;
  border-bottom: 1px solid #F0F0F0;
  color: #3F3F3F;
}

.users-table tbody tr:last-child td {
  border-bottom: none;
}

.users-table tbody tr:hover {
  background: #F8F9FA;
}

.user-name-cell {
  display: flex;
  align-items: center;
  gap: 10px;
  font-weight: 600;
}

.user-avatar-sm {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  background: #0E3570;
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 700;
  flex-shrink: 0;
}

/* ===== PROFILE ===== */
.profile-card {
  background: #EFF4FB;
  border-radius: 14px;
  padding: 24px;
  border: none;
  margin-bottom: 16px;
}

.profile-header {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: #0E3570;
  color: #FFF;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 20px;
  font-weight: 800;
  flex-shrink: 0;
}

.profile-header-info h3 {
  margin: 0 0 4px;
  font-size: 18px;
  font-weight: 800;
  color: #1A1A1A;
}

.profile-role {
  font-size: 13px;
  color: #888;
  font-weight: 500;
}

.profile-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 16px;
}

.profile-section {
  background: #EFF4FB;
  border-radius: 14px;
  padding: 24px;
  border: none;
}

.profile-section h4 {
  font-size: 13px;
  font-weight: 700;
  color: #888;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin: 0 0 16px;
  padding-bottom: 12px;
  border-bottom: 1px solid #F0F0F0;
}

.profile-rows {
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.profile-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.profile-label {
  font-size: 13px;
  color: #888;
}

.profile-value {
  font-size: 13px;
  font-weight: 600;
  text-align: right;
  max-width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: #1A1A1A;
}

.profile-actions {
  margin-top: 16px;
  display: flex;
  justify-content: flex-start;
}

.btn-logout {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 12px 24px;
  background: transparent;
  color: #E8483F;
  border: 1px solid rgba(232, 72, 63, 0.3);
  border-radius: 10px;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
  font-family: 'Montserrat', sans-serif;
}

.btn-logout:hover {
  background: rgba(232, 72, 63, 0.06);
  border-color: rgba(232, 72, 63, 0.5);
}

/* ===== TARJETAS OSCURAS ===== */
.portal-app {
  color: #E7ECF6;
}

.info-card,
.project-row,
.detail-card,
.quote-row,
.cert-card-new,
.doc-card-new,
.recurso-card,
.users-table-wrapper,
.profile-card,
.profile-section {
  background: rgba(255, 255, 255, 0.1);
  border: 1px solid rgba(255, 255, 255, 0.12);
}

.info-card h3,
.info-value,
.activity-title,
.activity-amount,
.project-top h3,
.installment-stat-value,
.installment-stat-value.paid,
.installment-stat-value.pending,
.detail-row strong,
.quote-top h3,
.cert-card-body h4,
.doc-card-info h4,
.recurso-info h4,
.profile-header-info h3,
.profile-value {
  color: #E7ECF6;
}

.info-label,
.activity-meta,
.detail-tag,
.progress-label,
.detail-card h4,
.detail-row span,
.big-progress-label,
.service-qty,
.cert-card-body p,
.profile-role,
.profile-section h4,
.profile-label {
  color: #98A4BF;
}

.description-text,
.service-name {
  color: #C7D0E0;
}

.empty-mini,
.cert-date-new,
.doc-card-meta,
.saldo-sub,
.project-arrow {
  color: #8496B5;
}

.recurso-info p {
  color: #98A4BF;
}

.info-card h3,
.quote-services,
.users-table thead,
.profile-section h4 {
  border-color: #26334F;
}

.users-table td {
  border-bottom: 1px solid #1E2A45;
  color: #E7ECF6;
}

.users-table th {
  color: #98A4BF;
}

.users-table thead {
  background: #0E162C;
}

.users-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.05);
}

.progress-track {
  background: #26334F;
}

.cuota-dot {
  background: #26334F;
  border-color: #26334F;
}

.cuota-dot.next {
  background: #FFFFFF;
}

.installment-summary {
  background: #0E162C;
}

.cert-card-top.certificate {
  background: linear-gradient(135deg, rgba(245, 74, 22, 0.22) 0%, rgba(245, 74, 22, 0.08) 100%);
}

.cert-card-top.report {
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.22) 0%, rgba(16, 185, 129, 0.08) 100%);
}

.cert-card-top.certificate .cert-type-icon,
.cert-card-top.certificate .cert-type-label {
  color: #FB923C;
}

.cert-card-top.report .cert-type-icon,
.cert-card-top.report .cert-type-label {
  color: #6EE7B7;
}

.doc-card-icon.manual,
.doc-card-badge.manual { background: rgba(139, 92, 246, 0.18); color: #C4B5FD; }
.doc-card-icon.procedure,
.doc-card-badge.procedure { background: rgba(59, 130, 246, 0.18); color: #93C5FD; }
.doc-card-icon.report,
.doc-card-badge.report { background: rgba(16, 185, 129, 0.16); color: #6EE7B7; }
.doc-card-icon.acta,
.doc-card-badge.acta { background: rgba(245, 74, 22, 0.18); color: #FB923C; }
.doc-card-icon.plan,
.doc-card-badge.plan { background: rgba(239, 68, 68, 0.16); color: #FCA5A5; }
.doc-card-icon.presentation,
.doc-card-badge.presentation,
.doc-card-icon.certificate,
.doc-card-badge.certificate { background: rgba(234, 179, 8, 0.16); color: #FDE047; }

.recurso-status.active { background: rgba(16, 185, 129, 0.16); color: #6EE7B7; }
.recurso-status.completed { background: rgba(59, 130, 246, 0.16); color: #93C5FD; }
.recurso-status.scheduled { background: rgba(245, 74, 22, 0.16); color: #FB923C; }

.status-pill.completed { background: rgba(16, 185, 129, 0.16); color: #6EE7B7; }
.status-pill.scheduled { background: rgba(245, 74, 22, 0.16); color: #FB923C; }
.status-pill.active { background: rgba(22, 194, 202, 0.16); color: #2DD4DE; }

/* ===== MOBILE (celular) ===== */
@media (max-width: 768px) {
  /* --- Inicio --- */
  .greeting-card {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 12px;
    padding-bottom: 18px;
  }
  .greeting-text h1 { font-size: 20px; }
  .greeting-text p { font-size: 13px; }
  .greeting-badge {
    white-space: normal;
    text-align: left;
    max-width: 100%;
    font-size: 11.5px;
    padding: 7px 14px;
  }

  .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
  .stats-row > * { min-width: 0; }
  .stats-row > *:last-child { grid-column: 1 / -1; }
  .stat-card { padding: 14px; gap: 10px; min-width: 0; }
  .stat-icon { width: 36px; height: 36px; border-radius: 10px; }
  .stat-icon svg { width: 18px; height: 18px; }
  .stat-number { font-size: 22px; }
  .stat-text { font-size: 11px; }

  .saldo-banner {
    flex-direction: column;
    align-items: stretch;
    gap: 0;
    padding: 0;
  }
  .saldo-left { padding: 24px 20px; }
  .saldo-amount { font-size: 28px; }
  .saldo-right { justify-content: space-around; gap: 12px; flex-wrap: nowrap; padding: 22px 14px; }
  .saldo-detail { align-items: center; }
  .saldo-btn { padding: 10px 20px; flex-shrink: 0; }

  .info-grid { grid-template-columns: 1fr; gap: 12px; }
  .info-card { padding: 18px 16px; }
  .info-card h3 { font-size: 14px; margin-bottom: 12px; padding-bottom: 10px; }
  .info-row { align-items: flex-start; gap: 10px; }
  .info-label { flex-shrink: 0; }
  .info-value {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    max-width: 100%;
    min-width: 0;
    word-break: break-word;
    text-align: right;
  }

  .activity-list { gap: 10px; }
  .activity-item { gap: 10px; }
  .activity-title { font-size: 12.5px; }
  .activity-meta { font-size: 11.5px; }
  .activity-amount { font-size: 11.5px; }

  /* --- Mi perfil --- */
  .profile-card { padding: 18px 16px; }
  .profile-header { gap: 12px; }
  .profile-avatar { width: 48px; height: 48px; font-size: 17px; }
  .profile-header-info h3 { font-size: 16px; }
  .profile-role { font-size: 12px; }
  .profile-grid { grid-template-columns: 1fr; gap: 12px; }
  .profile-section { padding: 18px 16px; }
  .profile-section h4 { margin-bottom: 14px; }
  .profile-rows { gap: 12px; }
  .profile-row { align-items: flex-start; gap: 10px; }
  .profile-label { flex-shrink: 0; }
  .profile-value {
    white-space: normal;
    overflow: visible;
    text-overflow: clip;
    max-width: 100%;
    min-width: 0;
    word-break: break-word;
    text-align: right;
  }
  .profile-actions { justify-content: stretch; }
  .btn-logout { width: 100%; justify-content: center; padding: 13px 24px; }

  /* --- Encabezados de sección --- */
  .section-head { margin-bottom: 16px; }
  .section-head h2 { font-size: 19px; }
}

@media (max-width: 400px) {
  .greeting-text h1 { font-size: 18px; }
  .stat-card { padding: 12px; gap: 8px; }
  .stat-icon { width: 32px; height: 32px; }
  .stat-number { font-size: 19px; }
  .stat-text { font-size: 10.5px; }
  .saldo-amount { font-size: 23px; }
  .info-card,
  .profile-card,
  .profile-section { padding: 16px 14px; }
  .info-value,
  .profile-value { font-size: 12.5px; }
}
</style>
