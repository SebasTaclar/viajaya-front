<template>
  <main class="login-page">
    <div class="login-container">
      <div class="login-card">
        <div class="login-icon">
          <i class="fas fa-users"></i>
        </div>

        <h1 class="login-title">Portal de Usuarios</h1>
        <p class="login-subtitle">Acceda a su cuenta con su cedula y codigo de verificacion</p>

        <div class="step-indicator">
          <div class="step-dot" :class="{ active: step === 1, completed: step === 2 }">
            <span v-if="step === 2"><i class="fas fa-check"></i></span>
            <span v-else>1</span>
          </div>
          <div class="step-line" :class="{ active: step === 2 }"></div>
          <div class="step-dot" :class="{ active: step === 2 }">
            <span>2</span>
          </div>
        </div>

        <form @submit.prevent="step === 1 ? handleSendCode() : handleVerifyCode()" class="login-form">
          <div v-if="loginError" class="login-error">
            <i class="fas fa-exclamation-circle"></i>
            {{ loginError }}
          </div>

          <!-- Paso 1: Cédula -->
          <template v-if="step === 1">
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
                  class="form-input"
                />
              </div>
            </div>

            <button type="submit" :disabled="loading || !cedula.trim()" class="btn-login">
              <span v-if="loading">
                <i class="fas fa-spinner fa-spin"></i> Enviando codigo...
              </span>
              <span v-else>
                Enviar codigo SMS <i class="fas fa-paper-plane"></i>
              </span>
            </button>
          </template>

          <!-- Paso 2: Código SMS -->
          <template v-else>
            <div class="code-sent-info">
              <i class="fas fa-check-circle"></i>
              <span>Codigo enviado al celular registrado</span>
            </div>

            <div class="input-group">
              <label for="code">Codigo de verificacion</label>
              <div class="input-wrapper">
                <i class="fas fa-shield-alt"></i>
                <input
                  type="text"
                  id="code"
                  v-model="smsCode"
                  placeholder="ingresa el codigo"
                  maxlength="6"
                  pattern="[0-9]{6}"
                  inputmode="numeric"
                  required
                  class="form-input code-input"
                />
              </div>
            </div>

            <div class="timer-row">
              <span v-if="timeRemaining > 0" class="timer">
                <i class="fas fa-clock"></i> {{ formatTime(timeRemaining) }}
              </span>
              <button
                v-else
                type="button"
                class="resend-btn"
                @click="handleResendCode"
                :disabled="resendLoading"
              >
                <span v-if="resendLoading"><i class="fas fa-spinner fa-spin"></i> Enviando...</span>
                <span v-else><i class="fas fa-redo"></i> Reenviar codigo</span>
              </button>
            </div>

            <button type="submit" :disabled="loading || smsCode.length !== 6" class="btn-login">
              <span v-if="loading">
                <i class="fas fa-spinner fa-spin"></i> Verificando...
              </span>
              <span v-else>
                Ingresar <i class="fas fa-arrow-right"></i>
              </span>
            </button>

            <button type="button" class="back-btn" @click="goBack">
              <i class="fas fa-arrow-left"></i> Volver
            </button>
          </template>
        </form>

      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { ref, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { clientAuthService } from '@/services/api'

defineOptions({
  name: 'ClientLoginView'
})

const cedula = ref('')
const smsCode = ref('')
const step = ref<1 | 2>(1)
const loading = ref(false)
const resendLoading = ref(false)
const router = useRouter()
const loginError = ref('')
const timeRemaining = ref(0)
let timerInterval: ReturnType<typeof setInterval> | null = null

function formatTime(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function startTimer() {
  timeRemaining.value = 5 * 60
  timerInterval = setInterval(() => {
    if (timeRemaining.value > 0) {
      timeRemaining.value--
    } else {
      if (timerInterval) clearInterval(timerInterval)
    }
  }, 1000)
}

function goBack() {
  step.value = 1
  smsCode.value = ''
  loginError.value = ''
  if (timerInterval) clearInterval(timerInterval)
  timeRemaining.value = 0
}

const handleSendCode = async () => {
  if (!cedula.value.trim()) return
  loading.value = true
  loginError.value = ''

  try {
    const response = await clientAuthService.sendSmsCode(cedula.value.trim())
    if (response.success) {
      step.value = 2
      startTimer()
    } else {
      loginError.value = response.message || 'Error al enviar el codigo'
    }
  } catch (error: unknown) {
    console.error('Send code error:', error)
    loginError.value = error instanceof Error ? error.message : 'Error al enviar el codigo. Intente nuevamente.'
  } finally {
    loading.value = false
  }
}

const handleVerifyCode = async () => {
  if (smsCode.value.length !== 6) return
  loading.value = true
  loginError.value = ''

  try {
    const response = await clientAuthService.verifySmsCode(cedula.value.trim(), smsCode.value)

    if (response.success) {
      const userInfo = clientAuthService.getCurrentUser()
      if (userInfo?.role === 'admin') {
        loginError.value = 'Esta cuenta es de administrador. Use el acceso de administrador.'
        clientAuthService.logout()
        return
      }
      if (timerInterval) clearInterval(timerInterval)
      router.push('/portal-clientes')
    } else {
      loginError.value = response.message || 'Codigo invalido'
    }
  } catch (error: unknown) {
    console.error('Verify code error:', error)
    const errorMessage = error instanceof Error ? error.message : 'Error en el servidor. Intente nuevamente.'
    loginError.value = errorMessage
  } finally {
    loading.value = false
  }
}

const handleResendCode = async () => {
  resendLoading.value = true
  loginError.value = ''

  try {
    const response = await clientAuthService.sendSmsCode(cedula.value.trim())
    if (response.success) {
      startTimer()
      loginError.value = ''
    } else {
      loginError.value = response.message || 'Error al reenviar el codigo'
    }
  } catch (error: unknown) {
    loginError.value = error instanceof Error ? error.message : 'Error al reenviar el codigo.'
  } finally {
    resendLoading.value = false
  }
}

onUnmounted(() => {
  if (timerInterval) clearInterval(timerInterval)
})
</script>

<style scoped>
.login-page {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #1A1A1A;
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
  background: linear-gradient(90deg, #16C2CA 0%, #13ABB2 100%);
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

.step-indicator {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0;
  margin-bottom: 28px;
}

.step-dot {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #E8E8E8;
  color: #AAAAAA;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  transition: all 0.3s ease;
  flex-shrink: 0;
}

.step-dot.active {
  background: #16C2CA;
  color: #FFFFFF;
  box-shadow: 0 2px 8px rgba(22, 194, 202, 0.3);
}

.step-dot.completed {
  background: #059669;
  color: #FFFFFF;
}

.step-line {
  width: 60px;
  height: 2px;
  background: #E8E8E8;
  transition: all 0.3s ease;
}

.step-line.active {
  background: #059669;
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

.input-wrapper i:first-child {
  position: absolute;
  left: 16px;
  color: #AAAAAA;
  font-size: 15px;
  transition: color 0.2s;
}

.input-wrapper:focus-within i:first-child {
  color: #16C2CA;
}

.form-input {
  width: 100%;
  padding: 14px 16px 14px 46px;
  background: #F9FAFB;
  border: 1.5px solid #E5E7EB;
  border-radius: 12px;
  font-size: 14px;
  color: #1A1A1A;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.form-input::placeholder {
  color: #9CA3AF;
}

.form-input:focus {
  outline: none;
  border-color: #16C2CA;
  background: #FFFFFF;
  box-shadow: 0 0 0 3px rgba(22, 194, 202, 0.12);
}

.code-input {
  font-size: 14px;
  letter-spacing: 2px;
  text-align: center;
  font-weight: 600;
  padding: 14px;
}

.code-input::placeholder {
  font-size: 12px;
  letter-spacing: 0;
  font-weight: 500;
}

.code-sent-info {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 14px 16px;
  background: rgba(16, 185, 129, 0.06);
  border: 1px solid rgba(16, 185, 129, 0.18);
  border-radius: 12px;
  font-size: 13px;
  font-weight: 500;
  color: #059669;
}

.code-sent-info i {
  font-size: 16px;
  flex-shrink: 0;
}

.timer-row {
  display: flex;
  justify-content: center;
}

.timer {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: 14px;
  color: #757575;
  font-weight: 600;
  background: #F9FAFB;
  padding: 8px 16px;
  border-radius: 20px;
  border: 1px solid #E5E7EB;
}

.timer i {
  color: #16C2CA;
}

.resend-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: none;
  border: none;
  color: #16C2CA;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  padding: 8px 16px;
  border-radius: 20px;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.2s;
}

.resend-btn:hover:not(:disabled) {
  background: rgba(22, 194, 202, 0.08);
}

.resend-btn:disabled {
  color: #AAAAAA;
  cursor: not-allowed;
}

.btn-login {
  width: 100%;
  padding: 16px;
  background: #16C2CA;
  color: #FFFFFF;
  border: none;
  border-radius: 12px;
  font-size: 15px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
  font-family: 'Montserrat', sans-serif;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  margin-top: 8px;
}

.btn-login:hover:not(:disabled) {
  background: #13ABB2;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(22, 194, 202, 0.35);
}

.btn-login:disabled {
  background: #D1D5DB;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.back-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  background: none;
  border: 1.5px solid #E5E7EB;
  color: #757575;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  padding: 10px 20px;
  border-radius: 10px;
  font-family: 'Montserrat', sans-serif;
  transition: all 0.2s;
  width: 100%;
}

.back-btn:hover {
  border-color: #16C2CA;
  color: #16C2CA;
  background: rgba(22, 194, 202, 0.04);
}

@media (max-width: 480px) {
  .login-page {
    padding: 100px 16px 40px;
  }

  .login-card {
    padding: 36px 24px;
    border-radius: 16px;
  }

  .login-title {
    font-size: 22px;
  }

  .login-icon {
    width: 68px;
    height: 68px;
  }

  .login-icon i {
    font-size: 26px;
  }
}
</style>
