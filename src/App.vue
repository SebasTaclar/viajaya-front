<template>
  <header v-if="showUtilityBar" class="site-header" :class="{ scrolled: isScrolled || isNosotros || isLoginPage }">
    <nav class="header-main">
      <RouterLink class="brand-container" to="/" @click="closeMobileMenu">
        <div class="brand-logo">
          <img src="/images/Logo.png" alt="Viaja Ya" class="brand-logo-img" />
        </div>
      </RouterLink>

      <div v-if="!isLoginPage" class="nav-menu desktop-only">
        <a href="/#destinos" class="nav-link" @click="closeMobileMenu">Destinos</a>
        <a href="/#destinos" class="nav-link" @click="closeMobileMenu">Experiencias</a>
        <a href="/#ahorra" class="nav-link" @click="closeMobileMenu">Nosotros</a>
        <a href="/#contacto" class="nav-link" @click="closeMobileMenu">Contacto</a>
      </div>

      <div class="nav-actions desktop-only">
        <RouterLink to="/login-clientes" class="auth-link auth-link--user">
          <i class="fas fa-user" aria-hidden="true"></i>
          Usuarios
        </RouterLink>
        <button v-if="isClientLoggedIn" type="button" class="btn-logout-sm" @click="logoutClient" title="Cerrar sesión clientes">
          <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
        </button>
        <RouterLink :to="isAdmin ? '/admin/products' : '/login'" class="auth-link auth-link--admin">
          <i class="fas fa-user-shield" aria-hidden="true"></i>
          {{ isAdmin ? 'Panel admin' : 'Ingreso admins' }}
        </RouterLink>
        <button v-if="isLoggedIn && isAdmin" type="button" class="btn-logout-sm" @click="logoutAdmin" title="Cerrar sesión admin">
          <i class="fas fa-sign-out-alt" aria-hidden="true"></i>
        </button>
      </div>

      <button v-if="!isLoginPage" class="hamburger-menu" @click="toggleMobileMenu" :class="{ active: isMobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>
    </nav>

    <div v-if="!isLoginPage" class="mobile-menu" :class="{ active: isMobileMenuOpen }">
      <div class="mobile-menu-content">
        <div class="mobile-nav-links">
          <a href="/#destinos" class="mobile-link" @click="closeMobileMenu">Destinos</a>
          <a href="/#destinos" class="mobile-link" @click="closeMobileMenu">Experiencias</a>
          <a href="/#ahorra" class="mobile-link" @click="closeMobileMenu">Nosotros</a>
          <a href="/#contacto" class="mobile-link" @click="closeMobileMenu">Contacto</a>
        </div>

        <div class="mobile-controls">
          <RouterLink v-if="isClientLoggedIn" to="/portal-clientes" class="mobile-btn btn-portal-mobile" @click="closeMobileMenu">
            <i class="fas fa-th-large" aria-hidden="true"></i>
            Mi Portal
          </RouterLink>
          <RouterLink v-else to="/login-clientes" class="mobile-btn btn-portal-mobile" @click="closeMobileMenu">
            <i class="fas fa-user" aria-hidden="true"></i>
            Usuarios
          </RouterLink>
          <button v-if="isClientLoggedIn" class="mobile-btn logout-btn" @click="handleMobileLogoutClient">
            Cerrar sesión clientes
          </button>
          <RouterLink class="mobile-btn btn-login-mobile" :to="isAdmin ? '/admin/products' : '/login'" @click="closeMobileMenu">
            <i class="fas fa-user-shield" aria-hidden="true"></i>
            {{ isAdmin ? 'Mi cuenta' : 'Ingreso admins' }}
          </RouterLink>
          <div v-if="isLoggedIn && isAdmin" class="mobile-user-greeting">
            <span>Hola, {{ username }}</span>
          </div>
          <RouterLink v-if="isLoggedIn && isAdmin" class="mobile-btn btn-login-mobile" to="/admin/products" @click="closeMobileMenu">
            <i class="fas fa-user-shield" aria-hidden="true"></i>
            Mi cuenta
          </RouterLink>
          <button v-if="isLoggedIn && isAdmin" class="mobile-btn logout-btn" @click="handleMobileLogoutAdmin">
            Cerrar sesión admin
          </button>
        </div>
      </div>
    </div>
  </header>

  <RouterView />
  <SocialFloating v-if="!hideGlobalSections" />
  <ContactSection v-if="!hideGlobalSections" />
  <AppFooter v-if="!hideGlobalSections" />

</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router'
import SocialFloating from '@/components/SocialFloating.vue'
import AppFooter from '@/components/AppFooter.vue'
import ContactSection from '@/components/ContactSection.vue'
import { authService, clientAuthService } from '@/services/api'
import { computed, onMounted, onUnmounted, ref, watch } from 'vue'
import router from './router'

const username = ref('')
const isMobileMenuOpen = ref(false)
const isScrolled = ref(false)
const servicesOpen = ref(false)
const mobileServicesOpen = ref(false)
const isLoggedIn = ref(false)
const isAdmin = ref(false)
const isClientLoggedIn = ref(false)

const currentRoute = useRoute()
const showUtilityBar = computed(() => !currentRoute.path.startsWith('/admin') && !currentRoute.path.startsWith('/portal-clientes'))
const hideGlobalSections = computed(
  () =>
    !showUtilityBar.value ||
    currentRoute.path === '/login-clientes' ||
    currentRoute.path === '/login',
)
const isLoginPage = computed(() => currentRoute.path === '/login-clientes' || currentRoute.path === '/login')
const isNosotros = computed(() => currentRoute.path === '/nosotros')

const isCurrentRoute = (path: string): boolean => currentRoute.path === path

const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value
}

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false
  mobileServicesOpen.value = false
}

const handleServiceClick = () => {
  isMobileMenuOpen.value = false
  mobileServicesOpen.value = false
}

const checkAuthStatus = () => {
  isAdmin.value = authService.isAuthenticated() && authService.isAdmin()
  isClientLoggedIn.value = clientAuthService.isAuthenticated()
  isLoggedIn.value = isAdmin.value || isClientLoggedIn.value

  if (isAdmin.value) {
    const currentUser = authService.getCurrentUser()
    username.value = currentUser?.name || ''
  } else if (isClientLoggedIn.value) {
    const currentUser = clientAuthService.getCurrentUser()
    username.value = currentUser?.name || ''
  } else {
    username.value = ''
  }
}

const logout = () => {
  authService.logout()
  clientAuthService.logout()
  isLoggedIn.value = false
  isAdmin.value = false
  isClientLoggedIn.value = false
  username.value = ''
  router.replace({ name: 'home' })
}

const logoutAdmin = () => {
  authService.logout()
  isLoggedIn.value = false
  isAdmin.value = false
  username.value = ''
  router.replace({ name: 'home' })
}

const logoutClient = () => {
  clientAuthService.logout()
  isLoggedIn.value = false
  isClientLoggedIn.value = false
  username.value = ''
  router.replace({ name: 'home' })
}

const handleMobileLogout = () => {
  closeMobileMenu()
  logout()
}

const handleMobileLogoutAdmin = () => {
  closeMobileMenu()
  logoutAdmin()
}

const handleMobileLogoutClient = () => {
  closeMobileMenu()
  logoutClient()
}

onMounted(() => {
  checkAuthStatus()
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})

watch(currentRoute, () => {
  checkAuthStatus()
})

const handleScroll = () => {
  isScrolled.value = window.scrollY > 20
}

defineOptions({
  name: 'App'
})
</script>

<style scoped>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: transparent;
  color: #4A4A4A;
  font-family: 'Be Vietnam Pro', sans-serif;
  box-shadow: none;
  transition: background 0.35s ease, box-shadow 0.35s ease;
}

.site-header.scrolled {
  background: #adbcd3;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
  color: #1a2a4a;
}

.header-main {
  min-height: 80px;
  height: 80px;
  padding: 0 clamp(16px, 4vw, 60px);
  background: transparent;
  display: flex;
  align-items: center;
  gap: 32px;
  transition: background 0.35s ease;
}

.site-header.scrolled .header-main {
  background-color: rgb(22, 194, 202);
}

.brand-container {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  text-decoration: none;
}

.brand-logo {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-logo-img {
  height: 84px;
  object-fit: contain;
}

.brand-text {
  display: flex;
  flex-direction: column;
  line-height: 1.1;
}

.brand-divider {
  display: block;
  width: 2px;
  height: 40px;
  background: #C89B2D;
  border-radius: 1px;
}

.brand-text-main {
  font-size: 18px;
  font-weight: 800;
  color: #4A4A4A;
  letter-spacing: 1px;
  transition: color 0.35s ease;
}

.site-header.scrolled .brand-text-main {
  color: #1a2a4a;
}

.brand-text-sub {
  font-size: 11px;
  font-weight: 600;
  color: #9A9A9A;
  letter-spacing: 2px;
  transition: color 0.35s ease;
}

.site-header.scrolled .brand-text-sub {
  color: #3a4a6a;
}

/* Navigation Menu */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 8px;
  flex: 1;
}

.nav-link {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  color: #4A4A4A;
  text-decoration: none;
  font-size: 15px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.25s ease;
  cursor: pointer;
  white-space: nowrap;
}

.site-header.scrolled .nav-link {
  color: #1a2a4a;
}

.site-header.scrolled .nav-link:hover,
.site-header.scrolled .nav-link.active {
  color: #203ec9;
}

.nav-link:hover,
.nav-link.active {
  color: #C89B2D;
}

.nav-link i {
  font-size: 10px;
  transition: transform 0.25s ease;
}

/* Dropdown */
.nav-dropdown {
  position: relative;
}

.nav-dropdown-menu {
  position: absolute;
  top: 100%;
  left: 0;
  min-width: 260px;
  background: #FFFFFF;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.12);
  border: 1px solid #F0F0F0;
  padding: 8px;
  z-index: 100;
  opacity: 0;
  visibility: hidden;
  transform: translateY(8px);
  transition: all 0.2s ease;
}

.nav-dropdown-menu.active {
  opacity: 1;
  visibility: visible;
  transform: translateY(0);
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #4A4A4A;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.dropdown-item i {
  font-size: 14px;
  color: #C89B2D;
  width: 20px;
  text-align: center;
}

.dropdown-item:hover {
  background: rgba(200, 155, 45, 0.08);
  color: #C89B2D;
}

.dropdown-arrow {
  font-size: 10px;
  margin-left: 4px;
  transition: transform 0.2s ease;
}

.nav-dropdown:hover .dropdown-arrow {
  transform: rotate(180deg);
}

/* Mobile Dropdown */
.mobile-dropdown {
  width: 100%;
}

.mobile-dropdown-toggle {
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.mobile-dropdown-toggle i {
  font-size: 12px;
  transition: transform 0.2s ease;
}

.mobile-dropdown-menu {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
  padding-left: 16px;
}

.mobile-dropdown-menu.active {
  max-height: 500px;
}

.mobile-dropdown-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 10px 14px;
  color: #4A4A4A;
  text-decoration: none;
  font-size: 13px;
  font-weight: 500;
  border-radius: 8px;
  transition: all 0.2s ease;
}

.mobile-dropdown-item i {
  font-size: 14px;
  color: #C89B2D;
  width: 20px;
  text-align: center;
}

.mobile-dropdown-item:hover {
  background: rgba(200, 155, 45, 0.08);
  color: #C89B2D;
}

/* CTA Buttons */
.nav-actions {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-left: auto;
}

.btn-portal {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #4A4A4A;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  transition: all 0.25s ease;
  white-space: nowrap;
}

.btn-portal:hover {
  background: #3A3A3A;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(74, 74, 74, 0.3);
}

.btn-login {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 10px 20px;
  background: #C89B2D;
  color: #FFFFFF;
  text-decoration: none;
  font-size: 14px;
  font-weight: 600;
  border-radius: 8px;
  border: none;
  transition: all 0.25s ease;
  white-space: nowrap;
  cursor: pointer;
}

.btn-login:hover {
  background: #B8891F;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(200, 155, 45, 0.3);
}

.btn-login i {
  font-size: 13px;
}

.btn-logout-sm {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  background: #c09d29;
  color: #f8f7f7;
  border: 1px solid #ddd;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.25s ease;
  font-size: 14px;
}

.btn-logout-sm:hover {
  background: #DC2626;
  color: #FFF;
  border-color: #DC2626;
}

/* Mobile Controls */

.hamburger-menu {
  margin-left: 10px;
  display: none;
  flex-direction: column;
  width: 28px;
  height: 28px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  justify-content: space-around;
  align-items: center;
  z-index: 1001;
}

.hamburger-menu span {
  display: block;
  height: 2px;
  width: 100%;
  background-color: #4A4A4A;
  border-radius: 2px;
  transition: all 0.3s ease;
}

.site-header.scrolled .hamburger-menu span {
  background-color: #1a2a4a;
}

.hamburger-menu.active span:nth-child(1) {
  transform: rotate(45deg) translate(7px, 7px);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: rotate(-45deg) translate(6px, -5px);
}

/* Mobile Menu */
.mobile-menu {
  display: none;
  position: fixed;
  top: 80px;
  left: 0;
  width: 100%;
  height: calc(100vh - 80px);
  background: #adbcd3;
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 9998;
  overflow-y: auto;
}

.mobile-menu.active {
  transform: translateX(0);
}

.mobile-menu-content {
  padding: 24px 20px;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-link {
  color: #1a2a4a;
  text-decoration: none;
  padding: 14px 16px;
  font-size: 15px;
  font-weight: 500;
  border-radius: 10px;
  transition: all 0.25s ease;
  text-align: left;
  background: transparent;
  border: 1px solid rgba(26, 42, 74, 0.15);
  font-family: 'Be Vietnam Pro', sans-serif;
}

.mobile-link.active,
.mobile-link:hover {
  color: #203ec9;
  border-color: rgba(32, 62, 201, 0.3);
  background: rgba(32, 62, 201, 0.08);
}

.mobile-controls {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding-top: 16px;
  border-top: 1px solid rgba(26, 42, 74, 0.15);
}

.mobile-btn {
  padding: 14px 16px;
  border-radius: 20px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  text-align: center;
  transition: all 0.25s ease;
  border: none;
  cursor: pointer;
  width: 100%;
  font-family: 'Montserrat', sans-serif;
}

.btn-portal-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: #4A4A4A;
  color: #FFFFFF;
  border: none;
}

.btn-portal-mobile:hover {
  background: #3A3A3A;
}

.btn-login-mobile {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  background: var(--travel-yellow, #f0c009);
  color: #071522;
  border: none;
}

.btn-login-mobile:hover {
  background: #B8891F;
}

.logout-btn {
  background: transparent;
  color: #1a2a4a;
  border: 1px solid rgba(26, 42, 74, 0.3);
}

.logout-btn:hover {
  border-color: rgba(32, 62, 201, 0.5);
  color: #203ec9;
}

.mobile-user-greeting {
  color: #1a2a4a;
  text-align: center;
  padding: 14px 16px;
  font-weight: 600;
  font-size: 15px;
  background: transparent;
  border-radius: 10px;
  font-family: 'Montserrat', sans-serif;
}

/* Responsive */
@media (max-width: 768px) {
  .header-main {
    height: 72px;
    padding: 12px 16px;
  }

  .desktop-only {
    display: none;
  }

  .hamburger-menu {
    display: flex;
    margin-left: auto;
  }

  .mobile-menu {
    display: block;
    top: 72px;
    height: calc(100vh - 72px);
  }
}

@media (max-width: 480px) {
  .brand-logo-img {
    height: 52px;
  }

  .brand-text-main {
    font-size: 15px;
  }

  .brand-text-sub {
    font-size: 9px;
    letter-spacing: 1.5px;
  }

  .mobile-menu {
    top: 72px;
    height: calc(100vh - 72px);
  }
}

/* Header principal de Viaja Ya sobre el hero */
.site-header:not(.scrolled) {
  color: #ffffff;
}

.site-header:not(.scrolled) .brand-logo-img {
  filter: brightness(0) invert(1);
}

.site-header:not(.scrolled) .nav-link {
  color: rgba(255, 255, 255, 0.82);
  border-radius: 0;
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.site-header:not(.scrolled) .nav-link:hover,
.site-header:not(.scrolled) .nav-link.active {
  color: #f0c009;
}

.site-header.scrolled .nav-link {
  font-size: 13px;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.auth-link {
  display: inline-flex;
  align-items: center;
  gap: 7px;
  min-height: 34px;
  padding: 8px 13px;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 3px;
  color: #ffffff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-decoration: none;
  text-transform: uppercase;
  transition: background 180ms ease, border-color 180ms ease, color 180ms ease;
}

.auth-link:hover {
  border-color: #f0c009;
  background: rgba(240, 192, 9, 0.16);
  color: #ffffff;
}

.auth-link--admin {
  border-color: #f0c009;
  background: #f0c009;
  color: #10215f;
}

.auth-link--admin:hover {
  background: #ffd83f;
  color: #10215f;
}

.site-header.scrolled .auth-link--user {
  border-color: #f0c009;
  background: #f0c009;
  color: #071522;
  border-radius: 20px;
  padding: 8px 16px;
}

.site-header.scrolled .auth-link--admin {
  border-color: #203ec9;
  background: #203ec9;
  color: #ffffff;
  border-radius: 20px;
  padding: 8px 16px;
}

.site-header.scrolled .auth-link--admin:hover {
  background: #162e9e;
}

.site-header.scrolled .brand-logo-img {
  filter: none;
}

@media (max-width: 768px) {
  .site-header:not(.scrolled) .hamburger-menu span {
    background-color: #ffffff;
  }
}

/* Header principal de Viaja Ya */
.site-header:not(.scrolled) {
  background: transparent;
  color: #fff;
}

.site-header:not(.scrolled) .header-main {
  min-height: 72px;
  height: 72px;
  padding: 0 3.75vw;
  gap: 28px;
}

.site-header:not(.scrolled) .brand-logo-img {
  width: 96px;
  height: auto;
  filter: brightness(0) invert(1);
}

.site-header:not(.scrolled) .nav-menu {
  justify-content: flex-end;
  gap: 8px;
}

.site-header:not(.scrolled) .nav-link {
  padding: 8px 14px;
  color: rgba(255, 255, 255, 0.82);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.06em;
}

.site-header:not(.scrolled) .nav-link:hover,
.site-header:not(.scrolled) .nav-link.active {
  color: #f0c009;
}

.site-header:not(.scrolled) .nav-actions {
  gap: 8px;
}

.site-header:not(.scrolled) .auth-link {
  min-height: 32px;
  padding: 7px 11px;
  border: 1px solid rgba(255, 255, 255, 0.48);
  border-radius: 15px;
  color: #fff;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.04em;
  text-transform: uppercase;
}

.site-header:not(.scrolled) .auth-link--admin {
  border-color: #f0c009;
  background: #f0c009;
  color: #071522;
}

.site-header:not(.scrolled) .auth-link--user:hover {
  border-color: #f0c009;
  background: rgba(240, 192, 9, 0.16);
  color: #fff;
}

.site-header:not(.scrolled) .auth-link--admin:hover {
  background: #ffd83f;
  color: #071522;
}

.site-header.scrolled .header-main {
  min-height: 72px;
  height: 72px;
}

.site-header.scrolled .brand-logo-img {
  width: 110px;
  height: auto;
}

@media (max-width: 900px) {
  .site-header:not(.scrolled) .header-main {
    padding: 0 24px;
  }

  .site-header:not(.scrolled) .nav-link {
    padding-inline: 8px;
    font-size: 10px;
  }

  .site-header:not(.scrolled) .auth-link {
    padding-inline: 8px;
    font-size: 9px;
  }
}

@media (max-width: 768px) {
  .site-header:not(.scrolled) .brand-logo-img,
  .site-header.scrolled .brand-logo-img {
    width: 88px;
  }
}
</style>
