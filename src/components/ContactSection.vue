<template>
  <section id="contacto" class="contact-section">
    <div class="contact-container">
      <div class="contact-main">
        <!-- Left Side -->
        <div class="contact-left">
          <div class="attention-badge">
            <span class="badge-dot"></span>
            <span>CONTÁCTANOS</span>
          </div>

          <h2 class="contact-title">
            ¿Tienes dudas o quieres un plan a tu medida?
          </h2>

          <h3 class="contact-highlight">
            <span class="highlight-text">Hablemos!!!</span>
          </h3>

          <p class="contact-desc">
            Olvidate de formularios largos o esperas por correo. Chatea
            directamente con uno de nuestros asesores de viaje y arma tu
            fondo de ahorro personalizado en minutos.
          </p>

          <ul class="benefits-list">
            <li>
              <span class="check-icon">✔</span>
              Respuesta personalizada.
            </li>

            <li>
              <span class="check-icon">✔</span>
              Asesoría 100% para planear tus aportes
            </li>
          </ul>

          <div class="cta-area">
            <a
              href="https://api.whatsapp.com/send?phone=573132783573&text=Hola,%20cordial%20saludo.%20Me%20interesa%20el%20Fondo%20Viajero.%20%C2%BFPodr%C3%ADan%20enviarme%20informaci%C3%B3n?"
              target="_blank"
              class="btn-whatsapp"
            >
              <i class="fab fa-whatsapp"></i>
              Chatear por WhatsApp
            </a>
            <div class="cta-info">
              <span class="agents-online">🟡 Asesores conectados</span>
              <span class="availability">Atención personalizada</span>
            </div>
          </div>
        </div>

        <!-- Right Side - Chat Mockup -->
        <div class="contact-right">
          <div class="chat-card">
            <!-- Chat Header -->
            <div class="chat-header">
              <div class="advisor-avatar">
                <img src="/images/Iso - Viaja Ya.png" alt="Viaja Ya" />
              </div>
              <div class="advisor-info">
                <span class="advisor-name">Asesor Viaja Ya</span>
                <span class="advisor-status">
                  <span class="status-dot"></span>
                  En línea para ayudarte
                </span>
              </div>
            </div>

            <!-- Chat Messages -->
            <div class="chat-body">
              <div class="chat-message">
                <div class="message-header">
                  <span class="team-name">Equipo Viaja Ya ✈️</span>
                </div>
                <div class="message-bubble">
                  ¡Hola! 👋 ¿En qué te podemos ayudar? Cuéntanos qué tienes en mente y te asesoramos con todo gusto.
                </div>
                <span class="message-time">10:42 a.m.</span>
              </div>

              <!-- Temas Frecuentes -->
              <div class="frequent-topics">
                <span class="topics-label">TEMAS FRECUENTES:</span>
                <a href="https://api.whatsapp.com/send?phone=573132783573&text=Hola,%20quiero%20informaci%C3%B3n%20sobre%20los%20planes%20de%20ahorro%20para%20viajes" target="_blank" class="topic-item">
                  <span class="topic-icon">🏖️</span>
                  Quiero información sobre planes de ahorro
                </a>
                <a href="https://api.whatsapp.com/send?phone=573132783573&text=Hola,%20%C2%BFc%C3%B3mo%20funcionan%20los%20aportes%20peri%C3%B3dicos%3F" target="_blank" class="topic-item">
                  <span class="topic-icon">💳</span>
                  ¿Cómo funcionan los aportes periódicos?
                </a>
                <a href="https://api.whatsapp.com/send?phone=573132783573&text=Hola,%20quiero%20conocer%20los%20destinos%20disponibles" target="_blank" class="topic-item">
                  <span class="topic-icon">✈️</span>
                  Quiero conocer destinos
                </a>
              </div>
            </div>

            <!-- Chat Footer -->
            <div class="chat-footer">
              <span class="footer-left">
                <span class="lightning">⚡</span>
                Te esperamos
              </span>
              <span class="footer-right">Un viaje un recuerdo inolvidable</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({
  name: 'ContactSection'
})
</script>

<style scoped>
.contact-section {
  position: relative;
  z-index: 10;
  padding: 150px 0;
  background: transparent;
}

.contact-section::before {
  display: block;
  width: min(92%, 1180px);
  height: 1px;
  margin: 0 auto;
  background: linear-gradient(90deg, transparent, #ec2525, transparent);
  content: '';
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
}

.contact-container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 clamp(16px, 4vw, 44px);
}

.contact-main {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 60px;
  align-items: center;
}

/* ── Left Side ── */
.contact-left {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.attention-badge {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  background: rgba(59, 130, 246, 0.15);
  border: 1px solid rgba(59, 130, 246, 0.3);
  color: #60a5fa;
  padding: 8px 18px;
  border-radius: 50px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 0.5px;
  width: fit-content;
}

.badge-dot {
  width: 8px;
  height: 8px;
  background: #3b82f6;
  border-radius: 50%;
  animation: pulse 1.5s infinite;
}

@keyframes pulse {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.contact-title {
  margin: 0;
  font-size: clamp(32px, 4vw, 44px);
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-style: italic;
}

.contact-highlight {
  margin: 0;
  display: flex;
  flex-direction: column;
  font-size: clamp(36px, 4.5vw, 52px);
  font-weight: 800;
  line-height: 1.1;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-style: italic;
}

.highlight-text {
  color: #86efac;
}

.highlight-yellow {
  color: #f0c009;
  text-decoration: underline;
  text-decoration-style: wavy;
  text-underline-offset: 8px;
}

.contact-desc {
  margin: 0;
  font-size: 15px;
  color: rgba(255, 255, 255, 0.7);
  line-height: 1.7;
  max-width: 480px;
}

.benefits-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 14px;
}

.benefits-list li {
  display: flex;
  align-items: center;
  gap: 12px;
  font-size: 14px;
  color: rgba(255, 255, 255, 0.85);
  font-weight: 500;
}

.check-icon {
  width: 24px;
  height: 24px;
  background: #f0c009;
  color: #071522;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  font-weight: 700;
  flex-shrink: 0;
}

.cta-area {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.btn-whatsapp {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: #22c55e;
  color: #ffffff;
  border-radius: 50px;
  font-size: 16px;
  font-weight: 700;
  text-decoration: none;
  transition: all 0.3s ease;
}

.btn-whatsapp:hover {
  background: #16a34a;
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(34, 197, 94, 0.4);
}

.btn-whatsapp i {
  font-size: 20px;
}

.cta-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.agents-online {
  font-size: 13px;
  font-weight: 700;
  color: #f0c009;
}

.availability {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

/* ── Right Side - Chat ── */
.contact-right {
  display: flex;
  justify-content: center;
}

.chat-card {
  width: 100%;
  max-width: 420px;
  background: #ffffff;
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
}

.chat-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 20px;
  background: #f8f9fa;
  border-bottom: 1px solid #e9ecef;
}

.advisor-avatar {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  background: transparent;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.advisor-avatar img {
  width: 50px;
  height: 50px;
  object-fit: contain;
}

.advisor-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.advisor-name {
  font-size: 15px;
  font-weight: 700;
  color: #1a1a1a;
}

.advisor-status {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: #22c55e;
  font-weight: 500;
}

.status-dot {
  width: 8px;
  height: 8px;
  background: #22c55e;
  border-radius: 50%;
}

.chat-body {
  padding: 20px;
  background: #e5ddd5;
  background-image: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.03'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
}

.chat-message {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.message-header {
  margin-bottom: 4px;
}

.team-name {
  font-size: 13px;
  font-weight: 700;
  color: #128c7e;
}

.message-bubble {
  background: #ffffff;
  padding: 14px 18px;
  border-radius: 0 12px 12px 12px;
  font-size: 14px;
  color: #303030;
  line-height: 1.6;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
}

.message-time {
  font-size: 11px;
  color: rgba(0, 0, 0, 0.4);
  text-align: right;
}

.frequent-topics {
  margin-top: 20px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.topics-label {
  font-size: 11px;
  font-weight: 700;
  color: rgba(0, 0, 0, 0.5);
  letter-spacing: 0.5px;
}

.topic-item {
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 12px 16px;
  background: #ffffff;
  border-radius: 10px;
  font-size: 13px;
  color: #303030;
  text-decoration: none;
  border: 1px solid #e9ecef;
  transition: all 0.2s ease;
}

.topic-item:hover {
  background: #f0f0f0;
  border-color: #d0d0d0;
}

.topic-icon {
  font-size: 16px;
}

.chat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 14px 20px;
  background: #f8f9fa;
  border-top: 1px solid #e9ecef;
}

.footer-left {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 12px;
  color: rgba(0, 0, 0, 0.5);
}

.lightning {
  font-size: 14px;
}

.footer-right {
  font-size: 12px;
  font-weight: 700;
  color: #128c7e;
}

/* ── Responsive ── */
@media (max-width: 1024px) {
  .contact-main {
    grid-template-columns: 1fr;
    gap: 48px;
  }

  .contact-right {
    justify-content: center;
  }
}

@media (max-width: 768px) {
  .contact-section {
    padding: 48px 0;
  }

  .contact-title {
    font-size: clamp(26px, 6vw, 36px);
  }

  .contact-highlight {
    font-size: clamp(30px, 8vw, 44px);
  }

  .contact-desc {
    font-size: 14px;
  }

  .cta-area {
    flex-direction: column;
    align-items: stretch;
  }

  .btn-whatsapp {
    justify-content: center;
    padding: 14px 24px;
    font-size: 15px;
  }

  .cta-info {
    align-items: center;
    text-align: center;
  }

  .chat-card {
    max-width: 100%;
  }

  .chat-header {
    padding: 14px 16px;
  }

  .advisor-avatar {
    width: 48px;
    height: 48px;
  }

  .advisor-avatar img {
    width: 42px;
    height: 42px;
  }

  .advisor-name {
    font-size: 14px;
  }

  .chat-body {
    padding: 16px;
  }

  .message-bubble {
    font-size: 13px;
    padding: 12px 14px;
  }

  .topic-item {
    padding: 10px 12px;
    font-size: 12px;
  }

  .chat-footer {
    padding: 12px 16px;
  }

  .footer-left,
  .footer-right {
    font-size: 11px;
  }
}

@media (max-width: 480px) {
  .contact-section {
    padding: 40px 0;
  }

  .attention-badge {
    font-size: 11px;
    padding: 6px 14px;
  }

  .contact-title {
    font-size: clamp(22px, 7vw, 30px);
  }

  .contact-highlight {
    font-size: clamp(26px, 9vw, 38px);
  }

  .benefits-list li {
    font-size: 13px;
  }

  .btn-whatsapp {
    padding: 12px 20px;
    font-size: 14px;
  }
}
</style>
