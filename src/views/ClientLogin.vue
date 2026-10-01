<template>
  <main class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-icon">
          <i class="fas fa-users"></i>
        </div>

        <h1 class="login-title">Portal de Usuarios</h1>
        <p class="login-subtitle">Accede a tu cuenta con tu cédula y contraseña</p>

        <form @submit.prevent="handleLogin" class="login-form">
          <div v-if="loginError" class="login-error">
            <i class="fas fa-exclamation-circle"></i>
            {{ loginError }}
          </div>

          <div class="input-group">
            <label for="cedula">Cédula o NIT</label>
            <div class="input-wrapper">
              <i class="fas fa-id-card"></i>
              <input
                type="text"
                id="cedula"
                v-model="cedula"
                placeholder="Ingrese su cédula o NIT"
                required
                autocomplete="username"
                class="form-input"
              />
            </div>
          </div>

          <div class="input-group">
            <label for="password">Contraseña</label>
            <div class="input-wrapper">
              <i class="fas fa-lock"></i>
              <input
                :type="showPassword ? 'text' : 'password'"
                id="password"
                v-model="password"
                placeholder="Ingrese su contraseña"
                required
                autocomplete="current-password"
                class="form-input"
              />
              <button
                type="button"
                class="toggle-password"
                @click="showPassword = !showPassword"
                :aria-label="showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'"
              >
                <i :class="showPassword ? 'fas fa-eye-slash' : 'fas fa-eye'"></i>
              </button>
            </div>
          </div>

          <button type="submit" :disabled="loading || !cedula.trim() || !password" class="btn-login">
            <span v-if="loading">
              <i class="fas fa-spinner fa-spin"></i> Ingresando...
            </span>
            <span v-else>
              Ingresar <i class="fas fa-arrow-right"></i>
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
import { clientAuthService } from '@/services/api'

defineOptions({
  name: 'ClientLoginView'
})

const cedula = ref('')
const password = ref('')
const showPassword = ref(false)
const loading = ref(false)
const router = useRouter()
const loginError = ref('')

const handleLogin = async () => {
  if (!cedula.value.trim() || !password.value) return
  loading.value = true
  loginError.value = ''

  try {
    const response = await clientAuthService.loginWithPassword(cedula.value.trim(), password.value)

    if (response.success) {
      const userInfo = clientAuthService.getCurrentUser()
      if (userInfo?.role === 'admin') {
        loginError.value = 'Esta cuenta es de administrador. Use el acceso de administrador.'
        clientAuthService.logout()
        return
      }
      router.push('/portal-clientes')
    } else {
      loginError.value = response.message || 'Cédula o contraseña incorrectos'
    }
  } catch (error: unknown) {
    console.error('Login error:', error)
    loginError.value = error instanceof Error ? error.message : 'Error en el servidor. Intente nuevamente.'
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
  background: #1A1A1A;
  padding: 120px 24px 60px;
  font-family: 'Be Vietnam Pro', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

.login-page::before {
  content: '';
  position: absolute;
  inset: 0;
  background: url('/images/avion_pista.jpg') center center / cover no-repeat;
  opacity: 0.5;
}

.login-page::after {
  content: '';
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(3, 12, 22, 0.78) 0%, rgba(3, 12, 22, 0.34) 48%, rgba(3, 12, 22, 0.18) 100%),
    linear-gradient(0deg, rgba(2, 8, 16, 0.78) 0%, transparent 38%, rgba(2, 8, 16, 0.18) 100%);
}

.login-container {
  position: relative;
  z-index: 1;
  width: 100%;
  max-width: 440px;
}

.login-card {
  background: #FFFFFF;
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
  color: #F54A16;
}

.login-title {
  margin: 0 0 8px;
  font-size: 26px;
  font-weight: 800;
  color: #1A1A1A;
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

.login-error {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: rgba(220, 38, 38, 0.06);
  border: 1px solid rgba(220, 38, 38, 0.18);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #DC2626;
  animation: shake 0.3s ease;
}

@keyframes shake {
  0%, 100% { transform: translateX(0); }
  25% { transform: translateX(-4px); }
  75% { transform: translateX(4px); }
}

.login-error i {
  font-size: 16px;
  flex-shrink: 0;
}

.input-group label {
  display: block;
  margin-bottom: 8px;
  font-size: 13px;
  font-weight: 600;
  color: #4A4A4A;
}

.input-wrapper {
  position: relative;
  display: flex;
  align-items: center;
}

.input-wrapper > i:first-child {
  position: absolute;
  left: 16px;
  color: #AAAAAA;
  font-size: 15px;
  transition: color 0.2s;
  pointer-events: none;
}

.input-wrapper:focus-within > i:first-child {
  color: #203EC9;
}

.form-input {
  width: 100%;
  padding: 14px 46px 14px 46px;
  background: #F9FAFB;
  border: 1.5px solid #E5E7EB;
  border-radius: 12px;
  font-size: 14px;
  color: #1A1A1A;
  font-family: 'Be Vietnam Pro', sans-serif;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #9CA3AF;
}

.form-input:focus {
  outline: none;
  border-color: #203EC9;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(32, 62, 201, 0.12);
}

.toggle-password {
  position: absolute;
  right: 14px;
  background: none;
  border: none;
  color: #AAAAAA;
  font-size: 15px;
  cursor: pointer;
  padding: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: color 0.2s;
}

.toggle-password:hover {
  color: #203EC9;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background: #203EC9;
  color: #FFFFFF;
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
  background: #D1D5DB;
  color: #FFFFFF;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

@media (max-width: 480px) {
  .login-page {
    min-height: 100vh;
    min-height: 100dvh;
    align-items: center;
    padding: 96px 16px 32px;
    padding-top: max(96px, calc(env(safe-area-inset-top) + 72px));
    padding-bottom: max(32px, env(safe-area-inset-bottom));
  }

  .login-container {
    max-width: 100%;
  }

  .login-card {
    padding: 32px 20px;
    border-radius: 16px;
    box-shadow: 0 12px 32px rgba(0, 0, 0, 0.22);
  }

  .login-icon {
    width: 64px;
    height: 64px;
    margin-bottom: 18px;
  }

  .login-icon i {
    font-size: 24px;
  }

  .login-title {
    font-size: 21px;
    margin-bottom: 6px;
  }

  .login-subtitle {
    font-size: 13px;
    margin-bottom: 20px;
  }

  .login-form {
    gap: 16px;
  }

  .input-group label {
    font-size: 12px;
    margin-bottom: 6px;
  }

  .form-input {
    padding: 15px 46px;
    font-size: 16px;
  }

  .login-error {
    padding: 12px 14px;
    font-size: 12.5px;
  }

  .btn-login {
    padding: 15px;
    font-size: 15px;
    margin-top: 4px;
  }
}

@media (max-width: 360px) {
  .login-page {
    padding: 88px 12px 24px;
    padding-top: max(88px, calc(env(safe-area-inset-top) + 72px));
  }

  .login-card {
    padding: 26px 16px;
  }

  .login-icon {
    width: 56px;
    height: 56px;
    margin-bottom: 14px;
  }

  .login-icon i {
    font-size: 22px;
  }

  .login-title {
    font-size: 19px;
  }

  .login-subtitle {
    font-size: 12.5px;
  }

  .form-input {
    padding: 14px 44px;
  }

  .input-wrapper > i:first-child {
    left: 14px;
  }
}
</style>
