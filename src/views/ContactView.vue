<template>
  <main class="contact-page">
    <div class="contact-page__bg" aria-hidden="true"></div>

    <div class="contact-page__container">
      <header class="contact-page__intro">
        <span class="contact-page__eyebrow">CONTÁCTANOS</span>
        <h1 class="contact-page__title">¡Hablémos!</h1>
        <p class="contact-page__subtitle">
          Escríbenos por el formulario o por nuestros canales y te respondemos lo antes posible.
        </p>
      </header>

      <div class="contact-page__grid">
        <!-- Formulario -->
        <form class="contact-form" novalidate @submit.prevent="submitForm">
          <h2 class="form-title">O escríbenos con el formulario</h2>

          <div class="form-grid">
            <div class="form-field">
              <label for="cf-nombre">Nombre</label>
              <input
                id="cf-nombre"
                v-model="form.nombre"
                type="text"
                name="nombre"
                autocomplete="name"
                placeholder="Tu nombre"
                required
              />
            </div>

            <div class="form-field">
              <label for="cf-telefono">Teléfono</label>
              <input
                id="cf-telefono"
                v-model="form.telefono"
                type="tel"
                name="telefono"
                autocomplete="tel"
                placeholder="Tu teléfono"
                required
              />
            </div>

            <div class="form-field form-field--full">
              <label for="cf-correo">Correo electrónico</label>
              <input
                id="cf-correo"
                v-model="form.correo"
                type="email"
                name="correo"
                autocomplete="email"
                placeholder="tucorreo@ejemplo.com"
                required
              />
            </div>

            <div class="form-field form-field--full">
              <label for="cf-mensaje">Mensaje</label>
              <textarea
                id="cf-mensaje"
                v-model="form.mensaje"
                name="mensaje"
                rows="5"
                placeholder="¿En qué podemos ayudarte?"
                required
              ></textarea>
            </div>
          </div>

          <p v-if="formError" class="form-msg form-msg--error">{{ formError }}</p>
          <p v-if="formSuccess" class="form-msg form-msg--success">{{ formSuccess }}</p>

          <button type="submit" class="btn-send">
            <i class="fas fa-paper-plane"></i>
            Enviar mensaje
          </button>
        </form>

        <!-- Canales de contacto -->
        <aside class="contact-info">
          <a
            href="https://api.whatsapp.com/send?phone=573193092312"
            target="_blank"
            rel="noopener"
            class="info-item"
          >
            <span class="info-icon"><i class="fab fa-whatsapp"></i></span>
            <span class="info-text">
              <strong>WhatsApp</strong>
              <span>+57 319 3092312</span>
            </span>
          </a>

          <a href="mailto:contacto@somosviajaya.com" class="info-item">
            <span class="info-icon"><i class="fas fa-envelope"></i></span>
            <span class="info-text">
              <strong>Mail</strong>
              <span>contacto@somosviajaya.com</span>
            </span>
          </a>

          <div class="info-item">
            <span class="info-icon"><i class="fas fa-map-marker-alt"></i></span>
            <span class="info-text">
              <strong>Ubicación</strong>
              <span>Corabastos, Bodega 32, Local 111</span>
            </span>
          </div>
        </aside>
      </div>
    </div>
  </main>
</template>

<script setup lang="ts">
import { reactive, ref } from 'vue'

defineOptions({
  name: 'ContactView',
})

const CONTACT_EMAIL = 'contacto@somosviajaya.com'

const form = reactive({
  nombre: '',
  telefono: '',
  correo: '',
  mensaje: '',
})

const formError = ref('')
const formSuccess = ref('')

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function submitForm() {
  formError.value = ''
  formSuccess.value = ''

  if (!form.nombre || !form.telefono || !form.correo || !form.mensaje) {
    formError.value = 'Por favor completa todos los campos.'
    return
  }

  if (!EMAIL_REGEX.test(form.correo)) {
    formError.value = 'Ingresa un correo electrónico válido.'
    return
  }

  const subject = `Mensaje desde la web - ${form.nombre}`
  const body = [
    `Nombre: ${form.nombre}`,
    `Teléfono: ${form.telefono}`,
    `Correo electrónico: ${form.correo}`,
    '',
    'Mensaje:',
    form.mensaje,
  ].join('\n')

  window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`

  formSuccess.value = `Se abrió tu aplicación de correo para enviar el mensaje a ${CONTACT_EMAIL}.`
}
</script>

<style scoped>
.contact-page {
  position: relative;
  isolation: isolate;
  min-height: 100vh;
  padding: 132px 0 96px;
  color: #ffffff;
  font-family: 'Be Vietnam Pro', sans-serif;
}

.contact-page__bg {
  position: absolute;
  inset: 0;
  z-index: -1;
  background:
    linear-gradient(120deg, rgba(7, 21, 34, 0.86) 0%, rgba(16, 40, 87, 0.7) 55%, rgba(7, 21, 34, 0.8) 100%),
    url('/images/avion_pista.jpg') center / cover no-repeat;
}

.contact-page__container {
  max-width: 1180px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

/* ── Intro ── */
.contact-page__intro {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 36px;
  max-width: 640px;
}

.contact-page__eyebrow {
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.14em;
  color: #f0c009;
}

.contact-page__title {
  margin: 0;
  font-size: clamp(34px, 5vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  font-family: 'VolkSans', sans-serif;
}

.contact-page__subtitle {
  margin: 0;
  font-size: 15px;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.78);
}

/* ── Grid ── */
.contact-page__grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 56px;
  align-items: start;
}

/* ── Formulario ── */
.contact-form {
  display: flex;
  flex-direction: column;
  gap: 18px;
  padding: clamp(20px, 3vw, 32px);
  background: rgba(255, 255, 255, 0.14);
  backdrop-filter: blur(18px) saturate(140%);
  -webkit-backdrop-filter: blur(18px) saturate(140%);
  border: 1px solid rgba(255, 255, 255, 0.25);
  border-radius: 20px;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.35);
}

.form-title {
  margin: 0;
  font-size: 20px;
  font-weight: 700;
  color: #ffffff;
  font-family: 'VolkSans', sans-serif;
}

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-field {
  display: flex;
  flex-direction: column;
  gap: 7px;
}

.form-field--full {
  grid-column: 1 / -1;
}

.form-field label {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.08em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.85);
}

.form-field input,
.form-field textarea {
  width: 100%;
  padding: 13px 15px;
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  background: rgba(255, 255, 255, 0.16);
  color: #ffffff;
  font-size: 15px;
  font-family: inherit;
  transition:
    border-color 0.2s ease,
    background 0.2s ease;
  resize: vertical;
}

.form-field input::placeholder,
.form-field textarea::placeholder {
  color: rgba(255, 255, 255, 0.6);
}

.form-field input:focus,
.form-field textarea:focus {
  outline: none;
  border-color: #f0c009;
  background: rgba(255, 255, 255, 0.22);
}

.form-msg {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
}

.form-msg--error {
  color: #fecaca;
}

.form-msg--success {
  color: #86efac;
}

.btn-send {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: 10px;
  align-self: flex-start;
  padding: 15px 30px;
  background: #f0c009;
  color: #071522;
  border: none;
  border-radius: 50px;
  font-size: 15px;
  font-weight: 700;
  font-family: inherit;
  cursor: pointer;
  transition: all 0.3s ease;
}

.btn-send:hover {
  background: #ffd83f;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(240, 192, 9, 0.4);
}

.btn-send i {
  font-size: 14px;
}

/* ── Canales de contacto ── */
.contact-info {
  display: flex;
  flex-direction: column;
  gap: 26px;
  align-self: center;
  padding-top: 8px;
}

.info-item {
  display: flex;
  align-items: center;
  gap: 16px;
  text-decoration: none;
}

.info-icon {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  background: rgba(10, 36, 96, 0.9);
  border: 1px solid rgba(96, 165, 250, 0.35);
  color: #60a5fa;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
  flex-shrink: 0;
}

.info-text {
  display: flex;
  flex-direction: column;
  gap: 3px;
  min-width: 0;
}

.info-text strong {
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 0.1em;
  text-transform: uppercase;
  color: rgba(255, 255, 255, 0.65);
}

.info-text span {
  font-size: 18px;
  font-weight: 700;
  color: #ffffff;
  overflow-wrap: anywhere;
}

a.info-item:hover .info-text span {
  color: #f0c009;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .contact-page__grid {
    grid-template-columns: 1fr;
    gap: 40px;
  }

  .contact-info {
    align-self: start;
  }
}

@media (max-width: 768px) {
  .contact-page {
    padding: 112px 0 72px;
  }

  .form-grid {
    grid-template-columns: 1fr;
  }

  .btn-send {
    width: 100%;
  }

  .info-text span {
    font-size: 16px;
  }
}
</style>
