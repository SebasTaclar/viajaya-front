<template>
  <main class="login-page">
    <div class="login-container">
      <div class="login-card">
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
  position: relative;
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #102857;
  padding: 120px 24px 60px;
  font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: #ffffff;
  border-radius: 20px;
  padding: 48px 40px;
  border: none;
  box-shadow: 0 16px 48px rgba(0, 0, 0, 0.2);
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
}

.login-logo {
  height: 56px;
  object-fit: contain;
  margin-bottom: 16px;
}

.login-icon {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: linear-gradient(135deg, rgba(245, 74, 22, 0.12) 0%, rgba(245, 74, 22, 0.06) 100%);
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 24px;
  border: 2px solid rgba(245, 74, 22, 0.2);
}

.login-icon i {
  font-size: 30px;
  color: #f54a16;
}

.login-title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 800;
  color: #1a1a1a;
  letter-spacing: -0.02em;
}

.login-subtitle {
  margin: 0 0 24px;
  font-size: 14px;
  color: #757575;
  line-height: 1.5;
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
  padding: 14px 16px;
  background: rgba(220, 38, 38, 0.06);
  border: 1px solid rgba(220, 38, 38, 0.18);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #dc2626;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%,
  100% {
    transform: translateX(0);
  }
  25% {
    transform: translateX(-4px);
  }
  75% {
    transform: translateX(4px);
  }
}

.error-message i {
  font-size: 16px;
  flex-shrink: 0;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #4a4a4a;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper i:first-child {
  position: absolute;
  left: 16px;
  color: #aaaaaa;
  font-size: 15px;
  transition: color 0.2s;
}

.input-wrapper:focus-within i:first-child {
  color: #203ec9;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 46px;
  background: #f9fafb;
  border: 1.5px solid #e5e7eb;
  border-radius: 12px;
  font-size: 14px;
  color: #1a1a1a;
  font-family: 'Be Vietnam Pro', sans-serif;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #9ca3af;
}

.form-input:focus {
  outline: none;
  border-color: #203ec9;
  background: #ffffff;
  box-shadow: 0 0 0 3px rgba(32, 62, 201, 0.12);
}

.toggle-password {
  position: absolute;
  right: 12px;
  background: none;
  border: none;
  color: #aaaaaa;
  cursor: pointer;
  padding: 4px;
  font-size: 14px;
}

.toggle-password:hover {
  color: #203ec9;
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
  color: #6b6b6b;
  cursor: pointer;
}

.remember-me input {
  accent-color: #203ec9;
}

.forgot-password {
  font-size: 13px;
  color: #203ec9;
  text-decoration: none;
  font-weight: 600;
}

.forgot-password:hover {
  text-decoration: underline;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background: #203ec9;
  color: #ffffff;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Be Vietnam Pro', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
}

.btn-login:hover:not(:disabled) {
  background: rgba(32, 62, 201, 0.85);
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(32, 62, 201, 0.35);
}

.btn-login:disabled {
  background: #d1d5db;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.login-footer {
  margin-top: 28px;
  padding-top: 24px;
  border-top: 1px solid #e5e7eb;
}

.login-footer p {
  margin: 0;
  font-size: 14px;
  color: #757575;
}

.login-hint {
  margin-bottom: 10px !important;
  font-size: 12px !important;
  color: #9ca3af !important;
}

.login-hint strong {
  color: #6b6b6b;
  font-weight: 600;
}

.login-footer a {
  color: #203ec9;
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
