<template>
  <section class="travel-savings" id="ahorra">
    <div class="travel-savings__container">
      <div class="travel-savings__left">
        <p class="travel-savings__eyebrow">
          TU FONDO VIAJERO &bull; VIAJA YA
        </p>

        <h1 class="travel-savings__title">
          Haz realidad<br />
          <em>tu próximo <br> viaje</em>
        </h1>

        <p class="travel-savings__subtitle">
          Ahorra a tu ritmo, programa tus aportes periódicos y viaja sin
          preocupaciones financieras.
        </p>

        <div class="travel-savings__cta-group">
          <a href="https://wa.me/573132783573?text=Hola,%20cordial%20saludo.%20Me%20interesa%20el%20Fondo%20Viajero.%20%C2%BFPodr%C3%ADan%20enviarme%20informaci%C3%B3n%20detallada?" target="_blank" class="travel-savings__btn-primary">
            Comenzar mi Fondo Viajero
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" />
              <polyline points="12 5 19 12 12 19" />
            </svg>
          </a>

        </div>


      </div>

      <div class="travel-savings__right">
        <div class="travel-savings__image-wrapper">
          <img
            src="/images/Logo - Fondo Viajero.png"
            alt="Fondo Viajero"
            class="travel-savings__image"
          />

          <div class="travel-savings__card travel-savings__card--top">
            <div class="travel-savings__card-icon travel-savings__card-icon--blue">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="3" />
                <circle cx="12" cy="12" r="3" />
                <line x1="12" y1="3" x2="12" y2="6" />
                <line x1="12" y1="18" x2="12" y2="21" />
                <line x1="3" y1="12" x2="6" y2="12" />
                <line x1="18" y1="12" x2="21" y2="12" />
              </svg>
            </div>
            <div class="travel-savings__card-text">
              <strong>Aportes Flexibles</strong>
              <span>Te acompañamos en tu aventura</span>
            </div>
          </div>

          <div class="travel-savings__card travel-savings__card--bottom">
            <div class="travel-savings__card-icon travel-savings__card-icon--orange">
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 16v-2l-8-5V3.5a1.5 1.5 0 0 0-3 0V9l-8 5v2l8-2.5V19l-2 1.5V22l3.5-1 3.5 1v-1.5L13 19v-5.5l8 2.5z" />
              </svg>
            </div>
            <div class="travel-savings__card-content">
              <span class="travel-savings__card-eyebrow">TU PASAPORTE DE AHORRO</span>
              <strong>Próximo Vuelo: ¡Listo!</strong>

            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'TravelSavings' })
</script>

<style scoped>
.travel-savings {
  --travel-yellow: #f0c009;
  --travel-blue: #203ec9;
  --travel-red: #ec2525;
  --travel-cyan: #62c2ca;
  background: transparent;
  color: #ffffff;
  overflow: hidden;
  position: relative;
}

.travel-savings::before {
  position: absolute;
  top: 0;
  left: 50%;
  transform: translateX(-50%);
  width: min(80%, 1000px);
  height: 2px;
  background: linear-gradient(90deg, transparent, rgba(240, 192, 9, 0.5), transparent);
  content: '';
}

.travel-savings__container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1280px;
  margin: 0 auto;
  padding: 200px clamp(24px, 5vw, 80px) 150px;
  gap: 60px;
}

/* ── Left Column ── */
.travel-savings__left {
  flex: 1;
  max-width: 580px;
}

.travel-savings__eyebrow {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 0 0 14px;
  color: var(--travel-cyan);
  font-size: 11px;
  font-weight: 800;
  letter-spacing: 2px;
  text-transform: uppercase;
  white-space: nowrap;
}

.travel-savings__eyebrow::before {
  width: 28px;
  height: 2px;
  flex: 0 0 28px;
  background: var(--travel-cyan);
  content: '';
}

.travel-savings__title {
  font-family: 'VolkSans', sans-serif;
  font-size: clamp(35px, 5.5vw, 65px);
  font-weight: 500;
  line-height: 1.0;
  letter-spacing: -0.01em;
  margin: 0 0 24px;
  color: #ffffff;
  text-transform: uppercase;
  white-space: nowrap;
}

.travel-savings__title em {
  color: var(--travel-yellow);
  font-style: normal;
}

.travel-savings__subtitle {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 15px;
  line-height: 1.7;
  color: #c0c4d0;
  margin: 0 0 36px;
  max-width: 560px;
}

.travel-savings__cta-group {
  display: flex;
  align-items: center;
  gap: 20px;
  margin-bottom: 56px;
  flex-wrap: wrap;
}

.travel-savings__btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 16px 32px;
  background: #203ec9;
  color: #f6f6f8;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 15px;
  font-weight: 700;
  text-decoration: none;
  border-radius: 7px;
  transition: transform 200ms ease, box-shadow 200ms ease;
  box-shadow: 0 4px 20px rgba(240, 192, 9, 0.3);
}

.travel-savings__btn-primary:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 32px rgba(240, 192, 9, 0.4);
}

.travel-savings__btn-secondary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 16px 24px;
  background: transparent;
  color: #ffffff;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 15px;
  font-weight: 600;
  text-decoration: none;
  border-radius: 7px;
  border: 2px solid var(--travel-red);
  transition: background 200ms ease, border-color 200ms ease;
}

.travel-savings__btn-secondary:hover {
  background: var(--travel-red);
  border-color: var(--travel-red);
}

/* ── Stats ── */
.travel-savings__stats {
  display: flex;
  gap: 48px;
}

.travel-savings__stat {
  display: flex;
  flex-direction: column;
}

.travel-savings__stat-value {
  font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
  font-size: clamp(28px, 3vw, 38px);
  font-weight: 400;
  color: #ffffff;
  line-height: 1;
}

.travel-savings__stat-value--cyan {
  color: var(--travel-cyan);
}

.travel-savings__stat-value--yellow {
  color: var(--travel-yellow);
}

.travel-savings__stat-label {
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
  margin-top: 6px;
}

/* ── Right Column ── */
.travel-savings__right {
  flex: 1;
  max-width: 520px;
  display: flex;
  justify-content: center;
}

.travel-savings__image-wrapper {
  position: relative;
  width: 100%;
  max-width: 460px;
}

.travel-savings__image {
  width: 100%;
  height: auto;
  border-radius: 24px;
  object-fit: contain;
  background: rgba(255, 255, 255, 0.04);
  padding: 24px;
}

/* ── Floating Cards ── */
.travel-savings__card {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 14px 18px;
  background: rgba(3, 12, 22, 0.88);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 14px;
  backdrop-filter: blur(12px);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.35);
  white-space: nowrap;
}

.travel-savings__card--top {
  top: -50px;
  right: -20px;
  animation: float-card-top 4s ease-in-out infinite;
}

.travel-savings__card--bottom {
  bottom: 20px;
  left: -30px;
  white-space: normal;
  min-width: 260px;
  animation: float-card-bottom 5s ease-in-out infinite;
}

@keyframes float-card-top {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(6px, -8px); }
}

@keyframes float-card-bottom {
  0%, 100% { transform: translate(0, 0); }
  50% { transform: translate(-6px, 8px); }
}

.travel-savings__card-icon {
  width: 40px;
  height: 40px;
  min-width: 40px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.travel-savings__card-icon--blue {
  background: linear-gradient(135deg, var(--travel-blue), #162e9e);
}

.travel-savings__card-icon--orange {
  background: linear-gradient(135deg, var(--travel-yellow), #d4a808);
}

.travel-savings__card-text {
  display: flex;
  flex-direction: column;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 13px;
}

.travel-savings__card-text strong {
  color: #ffffff;
  font-weight: 700;
}

.travel-savings__card-text span {
  color: rgba(255, 255, 255, 0.55);
  font-size: 12px;
  margin-top: 2px;
}

.travel-savings__card-content {
  display: flex;
  flex-direction: column;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 13px;
}

.travel-savings__card-eyebrow {
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1px;
  text-transform: uppercase;
  color: var(--travel-yellow);
  margin-bottom: 4px;
}

.travel-savings__card-content strong {
  color: #ffffff;
  font-weight: 700;
}

.travel-savings__card-footer {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-top: 8px;
  font-size: 12px;
  color: rgba(255, 255, 255, 0.5);
}

.travel-savings__card-badge {
  padding: 3px 10px;
  background: rgba(240, 192, 9, 0.15);
  color: var(--travel-yellow);
  border-radius: 999px;
  font-size: 11px;
  font-weight: 700;
}

/* ── Responsive ── */
@media (max-width: 960px) {
  .travel-savings__container {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
    padding: 80px clamp(20px, 5vw, 40px) 80px;
    gap: 28px;
  }

  .travel-savings__left {
    max-width: 100%;
    text-align: left;
  }

  .travel-savings__title {
    white-space: normal;
    font-size: clamp(30px, 8vw, 52px);
    text-align: left;
  }

  .travel-savings__subtitle {
    max-width: 100%;
    font-size: 14px;
    text-align: left;
  }

  .travel-savings__cta-group {
    justify-content: flex-start;
  }

  .travel-savings__stats {
    justify-content: flex-start;
  }

  .travel-savings__right {
    max-width: 400px;
    align-self: center;
    justify-content: center;
    width: 100%;
  }

  .travel-savings__card--top {
    right: 0;
  }

  .travel-savings__card--bottom {
    left: 0;
  }
}

@media (max-width: 600px) {
  .travel-savings__container {
    padding: 48px 20px;
  }

  .travel-savings__eyebrow {
    font-size: 10px;
    justify-content: flex-start;
    white-space: normal;
  }

  .travel-savings__title {
    font-size: clamp(28px, 9vw, 44px);
    text-align: left;
  }

  .travel-savings__subtitle {
    font-size: 13px;
    margin-bottom: 28px;
    text-align: left;
  }

  .travel-savings__cta-group {
    flex-direction: column;
    align-items: stretch;
    width: 100%;
  }

  .travel-savings__btn-primary,
  .travel-savings__btn-secondary {
    justify-content: center;
    width: 100%;
    padding: 14px 24px;
    font-size: 14px;
  }

  .travel-savings__stats {
    flex-direction: column;
    gap: 20px;
    align-items: flex-start;
  }

  .travel-savings__image-wrapper {
    max-width: 260px;
    display: flex;
    flex-direction: column;
    align-items: center;
    margin: 0 auto;
  }

  .travel-savings__image {
    order: 2;
  }

  .travel-savings__card--top {
    position: relative;
    top: auto;
    right: auto;
    order: 1;
    margin-bottom: -30px;
    z-index: 2;
    width: 90%;
    align-self: center;
    box-sizing: border-box;
    white-space: normal;
  }

  .travel-savings__card--bottom {
    position: relative;
    bottom: auto;
    left: auto;
    order: 3;
    margin-top: -30px;
    z-index: 2;
    width: 90%;
    align-self: center;
    box-sizing: border-box;
    white-space: normal;
  }
}
</style>
