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
          Cerrar sesión
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
        <!-- Saludo siempre visible en todas las pestañas -->
        <div class="greeting-card greeting-always">
          <div class="greeting-text">
            <h1>¡Hola, {{ displayName || 'Usuario' }}! 👋</h1>
            <p>Bienvenido a tu portal de viajes con <strong>Viaja Ya</strong></p>
          </div>
        </div>

        <!-- INICIO -->
        <section v-if="activeSection === 'inicio'" class="section inicio-section">
          <div class="section-head">
            <h2>Recarga / Resumen de Ahorros</h2>
            <p>Recarga tu cuenta, consulta tus ahorros y últimos recaudos</p>
          </div>

          <div class="stats-row">
            <div class="stat-card gold">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              </div>
              <div class="stat-data">
                <template v-if="ultimoRecaudo">
                  <span class="recaudo-inline-label">Fecha último recaudo</span>
                  <span class="recaudo-inline-value">{{ formatRecaudoFecha(ultimoRecaudo.fecha) }}</span>
                </template>
                <template v-else>
                  <span class="recaudo-inline-label">Fecha último recaudo</span>
                  <span class="recaudo-inline-value">—</span>
                </template>
              </div>
            </div>
            <div class="stat-card gold">
              <div class="stat-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                </svg>
              </div>
              <div class="stat-data">
                <template v-if="ultimoRecaudo">
                  <span class="recaudo-inline-label">Valor último recaudo</span>
                  <span class="recaudo-inline-value">{{ formatRecaudoValor(ultimoRecaudo.valor) }}</span>
                </template>
                <template v-else>
                  <span class="recaudo-inline-label">Valor último recaudo</span>
                  <span class="recaudo-inline-value">—</span>
                </template>
              </div>
            </div>
          </div>

          <div class="recarga-panel">
            <div class="recarga-panel-grid">
            <div class="recarga-side">
            <div class="recarga-value-area">
              <span class="recarga-value-label">Valor de tu recarga</span>
              <div class="recarga-value-line">
                <span
                  class="recarga-value-input"
                  :class="{ 'recarga-value-hidden': !recargaMontoVisible }"
                  aria-live="polite"
                >{{ recargaMonto ? formatRecaudoValor(recargaMonto) : '$ 0' }}</span>
                <button
                  class="recarga-visibility"
                  type="button"
                  :aria-label="recargaMontoVisible ? 'Ocultar valor' : 'Mostrar valor'"
                  @click="recargaMontoVisible = !recargaMontoVisible"
                >
                  <svg v-if="recargaMontoVisible" width="30" height="24" viewBox="0 0 30 24" fill="none" aria-hidden="true">
                    <path d="M2 12s3.8-7 13-7 13 7 13 7-3.8 7-13 7S2 12 2 12Z" stroke="currentColor" stroke-width="2" stroke-linejoin="round"/>
                    <circle cx="15" cy="12" r="3.5" stroke="currentColor" stroke-width="2"/>
                  </svg>
                  <svg v-else width="30" height="24" viewBox="0 0 30 24" fill="none" aria-hidden="true">
                    <path d="m3 3 24 18M12.5 5.3C13.3 5.1 14.1 5 15 5c9.2 0 13 7 13 7a22 22 0 0 1-4.1 4.7M8.2 8.2C4.3 10 2 12 2 12s3.8 7 13 7c1.7 0 3.2-.3 4.5-.8" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
                  </svg>
                </button>
                <span class="recarga-decimal">.00</span>
                <span class="recarga-arrow" aria-hidden="true">›</span>
              </div>
            </div>
            <div class="recarga-input-group">
              <label for="portal-recharge-amount">Valor de recarga</label>
              <div class="recarga-input-wrap">
                <span class="recarga-input-prefix">$</span>
                <input
                  id="portal-recharge-amount"
                  :value="recargaMontoInput"
                  type="text"
                  inputmode="numeric"
                  class="recarga-input"
                  placeholder="0"
                  @input="onRecargaMontoInput"
                />
              </div>
              <span class="recarga-input-hint">El valor se reflejará arriba automáticamente.</span>
            </div>
            <div class="recarga-actions">
              <button
                class="recarga-action-card"
                type="button"
                :disabled="recargaSaving || !recargaMonto"
                @click="realizarRecarga"
              >
                <svg width="48" height="48" viewBox="0 0 48 48" fill="none" aria-hidden="true">
                  <circle cx="24" cy="24" r="15" fill="#168ED3"/>
                  <circle cx="24" cy="24" r="9.5" fill="#F59E0B"/>
                  <path d="M29.1 18.8a7.1 7.1 0 0 0-10 1.6M18.9 29.2a7.1 7.1 0 0 0 10-1.6" stroke="#FFF4B8" stroke-width="2.2" stroke-linecap="round"/>
                  <path d="m19.2 17.5-.4 4.3 4.3-.4M28.8 30.5l.4-4.3-4.3.4" stroke="#FFF4B8" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"/>
                </svg>
                <span>{{ recargaSaving ? 'Procesando...' : 'Recargar' }}</span>
              </button>
            </div>
            </div>
            <div class="saldo-side">
              <span class="saldo-side-label">Saldo ahorrado</span>
              <span class="saldo-side-amount">{{ formatRecaudoValor(recaudosTotal) }}</span>
              <span class="saldo-side-sub">Total acumulado de tus recaudos</span>
              <svg class="saldo-side-chart" width="110" height="54" viewBox="0 0 110 54" fill="none" aria-hidden="true">
                <polyline points="4,44 25,31 45,35 66,17 89,23 106,7" stroke="#4ADE80" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"/>
              </svg>
            </div>
            </div>
            <p v-if="recargaError" class="recarga-feedback recarga-feedback-error" role="alert">{{ recargaError }}</p>
            <p v-if="recargaSuccess" class="recarga-feedback recarga-feedback-success" role="status">{{ recargaSuccess }}</p>
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
          <div class="section-head section-head-with-card">
            <div class="section-head-text">
              <h2>Recaudos</h2>
              <p>Historial de recaudos de tu cuenta</p>
            </div>
            <div v-if="!recaudosLoading && !recaudosError && recaudos.length > 0" class="recaudos-summary">
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
                    {{ recaudos.length }} Recaudos
                    <template v-if="hasRecaudoFilters"> · Histórico {{ formatRecaudoValor(recaudosTotal) }}</template>
                  </span>
                </div>
              </div>
            </div>
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
            <div class="recaudos-filters">
              <label class="recaudo-filter recaudo-filter-search">
                <span>Buscar</span>
                <div class="recaudo-search-box">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/>
                  </svg>
                  <input v-model="recaudoSearch" type="text" class="recaudo-filter-input" placeholder="Buscar por fecha, hora o valor..." />
                </div>
              </label>
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
              Cerrar sesión
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
import type { Cliente, DocumentoEntity } from '@/types/crmTypes'
import type { User } from '@/services/api/userService'

defineOptions({ name: 'ClientPortalView' })

const router = useRouter()
const loading = ref(true)
const error = ref('')
const showMobileMenu = ref(false)

const clientData = ref<Cliente | null>(null)
const documents = ref<DocumentoEntity[]>([])
const clientUsers = ref<User[]>([])

const portalClientId = ref<number | null>(null)
const recaudos = ref<RecaudoRow[]>([])
const recaudosLoading = ref(false)
const recaudosError = ref('')
const recaudosLoaded = ref(false)
const recargaMontoInput = ref('0')
const recargaMontoVisible = ref(true)
const recargaSaving = ref(false)
const recargaError = ref('')
const recargaSuccess = ref('')

async function fetchRecaudos(force = false) {
  if (recaudosLoading.value || (recaudosLoaded.value && !force)) return

  const clientId = portalClientId.value
  if (!clientId) {
    recaudos.value = []
    recaudosError.value = 'No pudimos identificar tu cuenta. Inicia sesión nuevamente.'
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
  return date
    .toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' })
    .replace(/\bde\b\s*/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function formatRecaudoHora(fecha?: string): string {
  if (!fecha) return ''
  const date = new Date(fecha)
  if (Number.isNaN(date.getTime())) return ''
  return date.toLocaleTimeString('es-CO', { hour: '2-digit', minute: '2-digit' })
}

const recaudosTotal = computed(() => recaudos.value.reduce((sum, r) => sum + (Number(r.valor) || 0), 0))
const recargaMonto = computed(() => Number.parseInt(recargaMontoInput.value.replace(/[^\d]/g, ''), 10) || 0)

function onRecargaMontoInput(event: Event) {
  const input = event.target as HTMLInputElement
  const digits = input.value.replace(/[^\d]/g, '')
  recargaMontoInput.value = digits ? Number.parseInt(digits, 10).toLocaleString('es-CO') : '0'
  recargaError.value = ''
  recargaSuccess.value = ''
}

async function realizarRecarga() {
  if (recargaSaving.value || !recargaMonto.value) return
  if (!portalClientId.value) {
    recargaError.value = 'No pudimos identificar tu cuenta. Inicia sesión nuevamente.'
    return
  }

  recargaSaving.value = true
  recargaError.value = ''
  recargaSuccess.value = ''
  try {
    await recaudoService.create({
      clientId: portalClientId.value,
      fecha: new Date().toISOString(),
      valor: recargaMonto.value,
    })
    await fetchRecaudos(true)
    recargaSuccess.value = `Recarga de ${formatRecaudoValor(recargaMonto.value)} registrada correctamente.`
  } catch (err: unknown) {
    recargaError.value = err instanceof Error ? err.message : 'No se pudo realizar la recarga.'
  } finally {
    recargaSaving.value = false
  }
}

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

const recaudoSearch = ref('')
const recaudoMes = ref('')
const recaudoDesde = ref('')
const recaudoHasta = ref('')

const hasRecaudoFilters = computed(
  () => !!(recaudoSearch.value.trim() || recaudoMes.value || recaudoDesde.value || recaudoHasta.value),
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
  recaudoSearch.value = ''
  recaudoMes.value = ''
  recaudoDesde.value = ''
  recaudoHasta.value = ''
}

const filteredRecaudos = computed(() => {
  const desde = recaudoDesde.value
  const hasta = recaudoHasta.value
  const term = recaudoSearch.value.trim().toLowerCase()
  return recaudos.value.filter((r) => {
    if (desde || hasta) {
      const d = new Date(r.fecha)
      if (Number.isNaN(d.getTime())) return false
      const pad = (n: number) => String(n).padStart(2, '0')
      const fecha = `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`
      if (desde && fecha < desde) return false
      if (hasta && fecha > hasta) return false
    }
    if (term) {
      const fecha = formatRecaudoFecha(r.fecha).toLowerCase()
      const hora = (formatRecaudoHora(r.fecha) || '').toLowerCase()
      const valor = formatRecaudoValor(r.valor).toLowerCase()
      if (!fecha.includes(term) && !hora.includes(term) && !valor.includes(term)) return false
    }
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
      service: 'Viaje',
      type: d.type === 'certificado' ? 'Certificado' : 'Informe',
      typeClass: d.type === 'certificado' ? 'certificate' : 'report',
      date: new Date(d.createdAt).toLocaleDateString('es-CO', { day: 'numeric', month: 'short', year: 'numeric' }),
      icon: d.type === 'certificado' ? CERT_ICON : REPORT_ICON,
    }))
  return items.length > 0 ? items : mockVuelos
})

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
    project: 'Viaje',
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
    documents.value = data.documents
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
  if (confirm('¿Desea cerrar sesión?')) {
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
    documents.value = data.documents
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
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  position: sticky;
  top: 0;
  background: transparent;
  z-index: 10;
  margin-bottom: 8px;
  padding: 0 8px 14px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.15);
}

.sidebar-logo {
  height: 56px;
  width: 100%;
  object-fit: contain;
  object-position: center;
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
  padding: 16px 28px 28px;
  min-height: 100vh;
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
.inicio-section {
  display: flex;
  flex-direction: column;
}
.inicio-section .recarga-panel { order: 1; }
.inicio-section .stats-row { order: 2; }

@keyframes fadeUp {
  from { opacity: 0; transform: translateY(12px); }
  to { opacity: 1; transform: translateY(0); }
}

.section-head {
  margin-bottom: 20px;
}

.section-head-with-card {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  flex-wrap: wrap;
}

.section-head-text {
  min-width: 0;
}

.section-head h2 {
  font-size: 25px;
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
  margin-bottom: 0;
  flex-wrap: wrap;
}

.recaudo-total-card {
  width: auto;
  min-width: 220px;
  padding: 12px 16px;
  gap: 10px;
  border-radius: 12px;
}

.recaudo-total-card .stat-icon {
  width: 34px;
  height: 34px;
  border-radius: 10px;
}

.recaudo-total-card .stat-icon svg {
  width: 18px;
  height: 18px;
}

.recaudo-total-card .stat-text {
  font-size: 12px;
}

.recaudo-total-card .stat-number {
  font-size: 18px;
}

.recaudo-total-card .recaudo-total-sub {
  font-size: 11px;
  margin-top: 1px;
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

.recaudo-filter-search {
  flex: 1;
  min-width: 200px;
}

.recaudo-search-box {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 0 12px;
  border-radius: 10px;
  border: 1px solid rgba(255,255,255,0.15);
  background: rgba(255,255,255,0.08);
  transition: border-color 0.2s;
}

.recaudo-search-box:focus-within {
  border-color: rgba(255,255,255,0.4);
}

.recaudo-search-box svg {
  flex-shrink: 0;
  color: rgba(255,255,255,0.45);
}

.recaudo-search-box .recaudo-filter-input {
  border: none;
  background: transparent;
  padding: 9px 0;
  width: 100%;
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

.greeting-always {
  align-items: center;
  gap: 14px;
  padding: 14px 0 18px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  margin-bottom: 20px;
}

.greeting-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(255, 255, 255, 0.08);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #FFF;
  flex-shrink: 0;
}

.greeting-always .greeting-text h1 {
  font-size: 20px;
}

.greeting-always .greeting-text p {
  font-size: 13px;
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
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 14px;
  margin-bottom: 20px;
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
  background: linear-gradient(135deg, rgba(30, 48, 84, 0.75) 0%, rgba(36, 58, 100, 0.65) 100%);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.stat-card.gold .stat-icon {
  align-self: center;
}

.stat-card.gold .stat-data {
  flex: 1;
  justify-content: center;
  gap: 5px;
  flex-direction: column;
}

.recaudo-inline {
  display: flex;
  align-items: baseline;
  gap: 6px;
}

.recaudo-inline-label {
  font-size: 13.5px;
  font-weight: 600;
  color: rgba(255,255,255,0.55);
}

.recaudo-inline-value {
  font-size: 20px;
  font-weight: 800;
  color: #FFF;
}

.stat-card.gold .stat-number {
  font-size: 20px;
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
  .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); }
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
  .users-table { font-size: 12.5px; }
  .users-table th,
  .users-table td { padding: 10px 8px; white-space: nowrap; }
  .users-table th { font-size: 10.5px; letter-spacing: 0.03em; }
  .profile-grid { grid-template-columns: 1fr; }
  .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
}

/* ===== SALDO BANNER ===== */
.saldo-banner {
  display: flex;
  align-items: stretch;
  justify-content: space-between;
  padding: 0;
  gap: 0;
  background: linear-gradient(135deg, rgba(30, 48, 84, 0.75) 0%, rgba(36, 58, 100, 0.65) 100%);
  border: 1px solid rgba(255,255,255,0.1);
  border-radius: 16px;
  overflow: hidden;
  color: #FFFFFF;
  margin-bottom: 20px;
  box-shadow: 0 6px 18px rgba(0, 0, 0, 0.18);
}

.saldo-left {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: 4px;
  padding: 28px 32px;
  background: transparent;
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
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.35);
}

.saldo-sub {
  font-size: 12px;
  color: rgba(255,255,255,0.4);
}

.saldo-chart {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0 28px;
  flex-shrink: 0;
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

/* ===== RECARGA DIGITAL ===== */
.recarga-panel {
  position: relative;
  overflow: hidden;
  margin-bottom: 20px;
  padding: 34px 28px 30px;
  border-radius: 24px 24px 70px 24px;
  color: #FFFFFF;
  background: linear-gradient(135deg, #09054F 0%, #10106D 55%, #17108A 100%);
  box-shadow: 0 10px 24px rgba(8, 8, 76, 0.24);
}
.recarga-panel-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(260px, 0.9fr);
  align-items: center;
  gap: 34px;
}
.recarga-side {
  min-width: 0;
  padding-right: 34px;
  border-right: 1px solid rgba(159, 232, 243, 0.2);
}
.saldo-side {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-height: 190px;
  text-align: center;
}
.saldo-side-label {
  color: #9FE8F3;
  font-size: 19px;
  font-weight: 500;
}
.saldo-side-amount {
  margin-top: 8px;
  color: #FFFFFF;
  font-size: clamp(2rem, 4vw, 3rem);
  font-weight: 800;
  letter-spacing: -0.035em;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}
.saldo-side-sub {
  margin-top: 7px;
  color: rgba(255, 255, 255, 0.62);
  font-size: 0.78rem;
}
.saldo-side-chart { margin-top: 16px; }

.recarga-value-area {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 5px;
}

.recarga-value-label {
  color: #9FE8F3;
  font-size: 19px;
  font-weight: 500;
}

.recarga-value-line {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  min-width: 0;
  gap: 4px;
}

.recarga-value-input {
  display: block;
  width: min(390px, 72vw);
  min-width: 0;
  color: #FFFFFF;
  font-size: clamp(2.4rem, 6vw, 4rem);
  font-weight: 800;
  letter-spacing: -0.04em;
  line-height: 1;
  text-align: right;
  text-shadow: 0 3px 8px rgba(0, 0, 0, 0.3);
}

.recarga-value-input.recarga-value-hidden {
  color: transparent;
  text-shadow: none;
  user-select: none;
}
.recarga-input-group {
  display: flex;
  flex-direction: column;
  width: min(320px, 100%);
  margin: 24px auto 0;
  gap: 7px;
}
.recarga-input-group label {
  color: rgba(255, 255, 255, 0.78);
  font-size: 0.76rem;
  font-weight: 700;
}
.recarga-input-wrap { position: relative; }
.recarga-input {
  width: 100%;
  min-height: 44px;
  padding: 0 14px 0 34px;
  border: 1px solid rgba(159, 232, 243, 0.38);
  border-radius: 10px;
  outline: none;
  color: #FFFFFF;
  background: rgba(255, 255, 255, 0.1);
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  box-sizing: border-box;
}
.recarga-input::placeholder { color: rgba(255, 255, 255, 0.45); }
.recarga-input:focus {
  border-color: #9FE8F3;
  box-shadow: 0 0 0 3px rgba(159, 232, 243, 0.15);
}
.recarga-input-prefix {
  position: absolute;
  top: 50%;
  left: 13px;
  color: #9FE8F3;
  font-weight: 700;
  pointer-events: none;
  transform: translateY(-50%);
}
.recarga-input-hint {
  color: rgba(255, 255, 255, 0.58);
  font-size: 0.68rem;
  line-height: 1.3;
}
.recarga-visibility {
  display: flex;
  flex-shrink: 0;
  align-items: center;
  justify-content: center;
  padding: 5px;
  border: 0;
  color: #9FE8F3;
  background: transparent;
  cursor: pointer;
}
.recarga-visibility:hover { color: #FFFFFF; }
.recarga-decimal {
  align-self: flex-start;
  margin-top: 3px;
  color: #FFFFFF;
  font-size: 1.15rem;
  font-weight: 700;
}
.recarga-arrow {
  margin-left: 12px;
  color: #B5F1F8;
  font-size: 3.2rem;
  font-weight: 300;
  line-height: 0.8;
}
.recarga-actions {
  display: flex;
  justify-content: center;
  margin-top: 22px;
}
.recarga-action-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 5px;
  width: 130px;
  height: 126px;
  padding: 12px 10px;
  border: 0;
  border-radius: 22px;
  color: #F7F7FF;
  background: #403D7C;
  font: inherit;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  transition: transform 0.2s ease, background 0.2s ease, box-shadow 0.2s ease;
}
.recarga-action-card:hover:not(:disabled) {
  background: #4B478E;
  box-shadow: 0 9px 18px rgba(0, 0, 0, 0.2);
  transform: translateY(-2px);
}
.recarga-action-card:disabled { cursor: not-allowed; opacity: 0.55; }
.recarga-feedback {
  margin: 16px auto 0;
  max-width: 440px;
  font-size: 0.85rem;
  text-align: center;
}
.recarga-feedback-error { color: #FFC4C4; }
.recarga-feedback-success { color: #9FF1C9; }

@media (max-width: 760px) {
  .recarga-panel-grid { grid-template-columns: 1fr; gap: 24px; }
  .recarga-side {
    padding-right: 0;
    padding-bottom: 24px;
    border-right: 0;
    border-bottom: 1px solid rgba(159, 232, 243, 0.2);
  }
  .saldo-side { min-height: 150px; }
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

  .stats-row { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 8px; }
  .stats-row > * { min-width: 0; }
  .stat-card { padding: 12px 10px; gap: 8px; min-width: 0; flex-direction: column; align-items: flex-start; }
  .stat-icon { width: 32px; height: 32px; border-radius: 9px; }
  .stat-icon svg { width: 16px; height: 16px; }
  .stat-number { font-size: 18px; }
  .stat-text { font-size: 11px; }
  .recaudo-inline-label { font-size: 12px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 100%; }
  .recaudo-inline-value { font-size: 15px; white-space: nowrap; }

  .saldo-banner {
    flex-direction: row;
    align-items: center;
    gap: 0;
    padding: 0;
  }
  .saldo-left { padding: 22px 18px; }
  .saldo-amount { font-size: 26px; }
  .saldo-chart { padding: 0 14px; }
  .saldo-chart svg { width: 44px; height: 32px; }
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
  .section-head-with-card { flex-direction: column; align-items: stretch; }
  .recaudo-total-card {
    min-width: 0;
    width: 100%;
    flex-direction: row;
    align-items: center;
    padding: 14px 16px;
    gap: 12px;
  }
  .recaudo-total-card .stat-icon { align-self: center; flex-shrink: 0; }
  .recaudos-filters { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; align-items: end; }
  .recaudo-filter-search { grid-column: 1 / -1; min-width: 0; }
  .recaudo-filter { min-width: 0; width: 100%; }
  .recaudo-filter-input { width: 100%; min-width: 0; }
  .recaudo-filter-clear { grid-column: 1 / -1; width: 100%; }
}

@media (max-width: 400px) {
  .greeting-text h1 { font-size: 18px; }
  .stats-row { gap: 6px; }
  .stat-card { padding: 10px 8px; gap: 6px; }
  .stat-icon { width: 28px; height: 28px; border-radius: 8px; }
  .stat-icon svg { width: 14px; height: 14px; }
  .stat-number { font-size: 17px; }
  .stat-text { font-size: 10.5px; }
  .recaudo-inline-label { font-size: 12px; }
  .recaudo-inline-value { font-size: 15px; }
  .saldo-amount { font-size: 23px; }
  .info-card,
  .profile-card,
  .profile-section { padding: 16px 14px; }
  .info-value,
  .profile-value { font-size: 12.5px; }
}
</style>
