<template>
  <main class="login-page">
    <div class="login-container">
      <div class="login-card">
        <img src="/images/Logo.png" alt="Viaja Ya" class="login-logo" />
        <div class="login-icon">
          <i class="fas fa-user-shield"></i>
        </div>

        <h1 class="login-title">Acceso Administrativo</h1>
        <p class="login-subtitle">Panel de gestion Viaja Ya</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="errorMessage" class="error-message">
            <i class="fas fa-exclamation-circle"></i>
            <span>{{ errorMessage }}</span>
          </div>

          <div class="input-group">
            <label for="email">Correo electronico</label>
            <div class="input-wrapper">
              <i class="fas fa-envelope"></i>
              <input
                type="email"
                id="email"
                v-model="email"
                placeholder="admin@somosviajaya.com"
                autocomplete="username"
                required
                class="form-input"
              />
            </div>
          </div>

          <div class="input-group">
            <label for="password">Contrasena</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="Ingrese su contrasena"
                required
                class="form-input"
              />
              <button type="button" class="toggle-password" @click="showPassword = !showPassword">
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <div class="login-options">
            <label class="remember-me">
              <input type="checkbox" v-model="rememberMe" />
              <span>Recordarme</span>
            </label>
          </div>

          <button type="submit" :disabled="loading" class="btn-login">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i> Accediendo...
            </span>
            <span v-else>
              Ingresar al panel <i class="fas fa-arrow-right"></i>
            </span>
          </button>
        </form>

        <div class="login-footer">
          <p class="login-hint">
            Admin: <strong>admin@somosviajaya.com</strong> / <strong>ViajaYa2026</strong><br />
            Super Admin: <strong>superadmin@somosviajaya.com</strong> / <strong>ViajaYaAdmin2026</strong>
          </p>
          <p><a href="/"><i class="fas fa-arrow-left"></i> Volver al sitio</a></p>
        </div>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { authService, type LoginCredentials } from '@/services/api'

defineOptions({
  name: 'LoginView'
})

const email = ref('')
const password = ref('')
const showPassword = ref(false)
const rememberMe = ref(false)
const loading = ref(false)
const errorMessage = ref('')
const router = useRouter()

const handleLogin = async () => {
  errorMessage.value = ''
  loading.value = true

  try {
    const credentials: LoginCredentials = {
      email: email.value,
      password: password.value
    }

    const response = await authService.login(credentials)

    if (response.success) {
      const userInfo = authService.getCurrentUser()
      if (userInfo?.role === 'user') {
        errorMessage.value = 'Esta cuenta es de cliente. Use el Portal de Clientes para acceder.'
        authService.logout()
        return
      }
      if (userInfo?.role === 'admin' || userInfo?.role === 'superadmin') {
        router.push('/admin/products')
      } else {
        router.push('/')
      }
    } else {
      errorMessage.value = response.message || 'Credenciales inválidas. Verifique su email y contraseña.'
    }
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Sesión expirada') {
      return
    }
    errorMessage.value = 'Credenciales inválidas. Verifique su email y contraseña.'
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #FAFAF8;
  padding: 120px 24px 60px;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-container {
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: #FFFFFF;
  border-radius: 20px;
  padding: 48px 40px;
  border: 1px solid #F0F0F0;
  box-shadow: 0 12px 48px rgba(0, 0, 0, 0.06);
  text-align: center;
  position: relative;
  overflow: hidden;
}

.login-card::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  height: 4px;
  background: linear-gradient(90deg, #16C2CA 0%, #13ABB2 100%);
}

.login-logo {
  height: 56px;
  object-fit: contain;
  margin-bottom: 16px;
}

.login-icon {
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: rgba(22, 194, 202, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 20px;
  border: 2px solid rgba(22, 194, 202, 0.2);
}

.login-icon i {
  font-size: 24px;
  color: #16C2CA;
}

.login-title {
  margin: 0 0 8px;
  font-size: 24px;
  font-weight: 800;
  color: #1A1A1A;
}

.login-subtitle {
  margin: 0 0 32px;
  font-size: 14px;
  color: #888888;
}

.login-form {
  display: flex;
  flex-direction: column;
  gap: 20px;
  text-align: left;
}

.error-message {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: rgba(239, 68, 68, 0.08);
  border: 1px solid rgba(239, 68, 68, 0.2);
  border-radius: 10px;
  color: #dc2626;
  font-size: 13px;
  font-weight: 500;
}

.error-message i {
  font-size: 14px;
  flex-shrink: 0;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #3F3F3F;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i:first-child {
  position: absolute;
  left: 16px;
  color: #AAAAAA;
  font-size: 14px;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 44px;
  background: #FAFAF8;
  border: 1px solid #E8E8E8;
  border-radius: 10px;
  font-size: 14px;
  color: #2F2F2F;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.3s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #BBBBBB;
}

.form-input:focus {
  outline: none;
  border-color: #16C2CA;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(22, 194, 202, 0.12);
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #AAAAAA;
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
}

.toggle-password:hover {
  color: #16C2CA;
}

.login-options {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.remember-me {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 13px;
  color: #6B6B6B;
  cursor: pointer;
}

.remember-me input {
  accent-color: #16C2CA;
}

.forgot-password {
  font-size: 13px;
  color: #16C2CA;
  text-decoration: none;
  font-weight: 600;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background: #16C2CA;
  color: #FFFFFF;
  border: none;
  border-radius: 10px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  margin-top: 8px;
}

.btn-login:hover:not(:disabled) {
  background: #13ABB2;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(22, 194, 202, 0.3);
}

.btn-login:disabled {
  background: #CCCCCC;
  cursor: not-allowed;
}

.login-footer {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #F0F0F0;
}

.login-footer p {
  margin: 0;
  font-size: 14px;
  color: #888888;
}

.login-hint {
  margin-bottom: 10px !important;
  font-size: 12px !important;
  color: #AAAAAA !important;
}

.login-hint strong {
  color: #6B6B6B;
  font-weight: 600;
}

.login-footer a {
  color: #16C2CA;
  text-decoration: none;
  font-weight: 600;
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.login-footer a:hover {
  text-decoration: underline;
}

@media (max-width: 480px) {
  .login-page {
    padding: 100px 16px 40px;
  }

  .login-card {
    padding: 36px 24px;
  }

  .login-title {
    font-size: 22px;
  }
}
</style>
