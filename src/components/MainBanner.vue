<template>
  <section ref="heroSection" class="travel-hero" id="reservas">
    <div class="travel-hero__container">
      <div class="travel-hero__content">
        <p class="travel-hero__kicker">
          <span class="travel-hero__kicker-line" aria-hidden="true"></span>
          EXPERIENCIAS DE VIAJE
        </p>

        <h1 class="travel-hero__title">
          TU PRÓXIMO<br />
          <em class="travel-hero__title-accent">DESTINO</em>
        </h1>

        <p class="travel-hero__description">
          Descubre destinos únicos con la mejor experiencia de viaje.<br />
          Cada viaje es una historia que contar.
        </p>

        <div class="travel-hero__location">
          <strong>COLOMBIA</strong>
          <span>Tu aventura comienza aquí.</span>
        </div>

        <a href="#contacto" class="travel-hero__btn travel-hero__btn--primary">
          Reservar ahora
          <i class="fas fa-arrow-right" aria-hidden="true"></i>
        </a>
      </div>

      <div class="travel-hero__steps" aria-live="polite">
        <!-- <article
          v-for="(step, index) in steps"
          :key="step.title"
          class="travel-hero__step"
          :class="{ 'is-active': currentStep === index }"
        > -->
          <!-- <span class="travel-hero__step-index">0{{ index + 1 }}</span>
          <div>
            <p class="travel-hero__step-eyebrow">{{ step.eyebrow }}</p>
            <h2>{{ step.title }}</h2>
            <p>{{ step.description }}</p>
          </div>
        </article> -->
      </div>

      <div class="travel-hero__progress" aria-label="Etapas del viaje">
        <span
          v-for="(_, index) in steps"
          :key="index"
          class="travel-hero__progress-dot"
          :class="{ 'is-active': currentStep === index }"
        ></span>
      </div>
    </div>

    <div class="travel-hero__scroll" aria-hidden="true">
      <span>SCROLL</span>
      <i></i>
    </div>

    <div class="travel-hero__image-credit" aria-hidden="true">
      <span></span>
    </div>

    <div class="travel-hero__background" aria-hidden="true">
      <video
        ref="backgroundVideo"
        class="travel-hero__image"
        autoplay
        muted
        loop
        playsinline
        preload="auto"
        poster="/images/avion_pista.jpg"
        aria-hidden="true"
        @loadedmetadata="updateScrollTarget"
      >
        <source
          src="https://res.cloudinary.com/dlwzazojt/video/upload/v1789596160/Airplane_taking_off_and_landing_20260916165015_ovf9b9.mp4"
          type="video/mp4"
        />
      </video>
      <div class="travel-hero__image-overlay"></div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'

defineOptions({
  name: 'MainBanner'
})

const backgroundVideo = ref<HTMLVideoElement | null>(null)
const heroSection = ref<HTMLElement | null>(null)
const currentStep = ref(0)
let animationFrame = 0
let scrubFrame = 0
let targetTime = 0

const steps = [
  {
    eyebrow: '01 / DESCUBRE',
    title: 'Encuentra el lugar que te llama',
    description: 'Playas, ciudades y paisajes de Colombia para comenzar una historia que se sienta tuya.'
  },
  {
    eyebrow: '02 / PLANEA',
    title: 'Diseña el viaje a tu manera',
    description: 'Combina transporte, alojamiento, alimentación y experiencias sin perder de vista tu presupuesto.'
  },
  {
    eyebrow: '03 / VIVE',
    title: 'Reserva y empieza a disfrutar',
    description: 'Te acompañamos antes y durante el viaje para que cada momento cuente desde el despegue.'
  }
]

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max)

const updateScrollTarget = () => {
  const video = backgroundVideo.value
  const section = heroSection.value
  if (!video || !section || !Number.isFinite(video.duration) || video.duration <= 0) return

  const pageScrollDistance = Math.max(document.documentElement.scrollHeight - window.innerHeight, 1)
  const progress = clamp(window.scrollY / pageScrollDistance, 0, 1)
  const heroScrollDistance = Math.max(section.offsetHeight - window.innerHeight, 1)
  const heroProgress = clamp(-section.getBoundingClientRect().top / heroScrollDistance, 0, 1)
  currentStep.value = Math.min(steps.length - 1, Math.floor(heroProgress * steps.length))

  targetTime = progress * video.duration
  startSmoothScrub()
}

const runSmoothScrub = () => {
  const video = backgroundVideo.value
  if (!video || !Number.isFinite(video.duration) || video.duration <= 0) {
    scrubFrame = 0
    return
  }

  const difference = targetTime - video.currentTime
  if (Math.abs(difference) < 0.01) {
    video.currentTime = targetTime
    scrubFrame = 0
    return
  }

  if (!video.seeking && video.readyState >= HTMLMediaElement.HAVE_METADATA) {
    video.currentTime += difference * 0.18
  }

  scrubFrame = window.requestAnimationFrame(runSmoothScrub)
}

const startSmoothScrub = () => {
  if (!scrubFrame) {
    scrubFrame = window.requestAnimationFrame(runSmoothScrub)
  }
}

const handleScroll = () => {
  if (animationFrame) return

  animationFrame = window.requestAnimationFrame(() => {
    animationFrame = 0
    updateScrollTarget()
  })
}

onMounted(() => {
  heroSection.value = document.querySelector<HTMLElement>('.travel-hero')
  backgroundVideo.value?.pause()
  window.addEventListener('scroll', handleScroll, { passive: true })
  window.addEventListener('resize', handleScroll)
  updateScrollTarget()
})

onBeforeUnmount(() => {
  window.removeEventListener('scroll', handleScroll)
  window.removeEventListener('resize', handleScroll)
  if (animationFrame) window.cancelAnimationFrame(animationFrame)
  if (scrubFrame) window.cancelAnimationFrame(scrubFrame)
})
</script>

<style scoped>
/* ========================================
   Viaja Ya Premium Hero Banner
   Ultra realistic, Fortune 500 quality
   ======================================== */

@keyframes heroFadeIn {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes heroSlideLeft {
  from {
    opacity: 0;
    transform: translateX(-40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes heroSlideRight {
  from {
    opacity: 0;
    transform: translateX(40px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes heroFloat {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

@keyframes heroPulse {
  0%, 100% {
    opacity: 0.4;
  }
  50% {
    opacity: 0.7;
  }
}

@keyframes heroCountUp {
  from {
    opacity: 0;
    transform: translateY(15px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

/* ---- Hero Wrapper ---- */
.viajaya-hero {
  position: relative;
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background: #FAFAFA;
  overflow: hidden;
  font-family: 'Montserrat', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
}

/* ---- Geometric Decorative Elements ---- */
.viajaya-hero__geo {
  position: absolute;
  pointer-events: none;
  z-index: 0;
}

.viajaya-hero__geo--1 {
  top: 10%;
  left: -5%;
  width: 400px;
  height: 400px;
  border: 1px solid rgba(200, 155, 45, 0.08);
  border-radius: 50%;
  animation: heroPulse 6s ease-in-out infinite;
}

.viajaya-hero__geo--2 {
  bottom: 20%;
  right: -3%;
  width: 250px;
  height: 250px;
  border: 1px solid rgba(200, 155, 45, 0.06);
  transform: rotate(45deg);
  animation: heroPulse 8s ease-in-out infinite 1s;
}

.viajaya-hero__geo--3 {
  top: 60%;
  left: 45%;
  width: 120px;
  height: 120px;
  border: 1px solid rgba(200, 155, 45, 0.05);
  border-radius: 50%;
  animation: heroPulse 7s ease-in-out infinite 0.5s;
}

/* ---- Main Container ---- */
.viajaya-hero__container {
  position: relative;
  z-index: 2;
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0;
  max-width: 1400px;
  width: 100%;
  margin: 0 auto;
  padding: 0;
  flex: 1;
  align-items: stretch;
}

/* ---- Left Content ---- */
.viajaya-hero__content {
  display: flex;
  flex-direction: column;
  gap: 28px;
  padding: 130px clamp(24px, 5vw, 80px);
  animation: heroSlideLeft 0.8s ease both;
}

/* Logo */
.viajaya-hero__logo {
  display: flex;
  align-items: center;
  margin-bottom: 8px;
}

.viajaya-hero__logo-img {
  height: 64px;
  width: auto;
  object-fit: contain;
}

/* Kicker */
.viajaya-hero__kicker {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 2.5px;
  color: #C89B2D;
  text-transform: uppercase;
  margin: 0;
}

.viajaya-hero__kicker-line {
  display: inline-block;
  width: 40px;
  height: 2px;
  background: #C89B2D;
  border-radius: 1px;
}

/* Title */
.viajaya-hero__title {
  margin: 0;
  font-size: clamp(42px, 5vw, 66px);
  font-weight: 800;
  line-height: 1.05;
  color: #1A1A1A;
  letter-spacing: -1.5px;
}

.viajaya-hero__title-gold {
  color: #C89B2D;
  display: inline-block;
}

/* Description */
.viajaya-hero__description {
  margin: 0;
  font-size: 16px;
  font-weight: 400;
  line-height: 1.7;
  color: #757575;
  max-width: 480px;
}

/* Quote */
.viajaya-hero__quote {
  margin: 0;
  padding: 16px 0 16px 20px;
  border-left: 3px solid #C89B2D;
  font-size: 13px;
  font-weight: 500;
  font-style: italic;
  line-height: 1.7;
  color: #9A9A9A;
  max-width: 480px;
}

.viajaya-hero__quote-author {
  display: block;
  margin-top: 8px;
  font-size: 12px;
  font-weight: 700;
  font-style: normal;
  color: #C89B2D;
  letter-spacing: 0.5px;
}

/* ---- Certification Cards ---- */
.viajaya-hero__certifications {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.viajaya-hero__cert-card {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px 18px;
  background: #FFFFFF;
  border-radius: 12px;
  border: 1px solid #ECECEC;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.03);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.viajaya-hero__cert-card:hover {
  border-color: rgba(200, 155, 45, 0.3);
  box-shadow: 0 4px 16px rgba(200, 155, 45, 0.08);
  transform: translateY(-2px);
}

.viajaya-hero__cert-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(200, 155, 45, 0.08);
  flex-shrink: 0;
}

.viajaya-hero__cert-icon i {
  color: #C89B2D;
  font-size: 16px;
}

.viajaya-hero__cert-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.viajaya-hero__cert-iso {
  font-size: 12px;
  font-weight: 700;
  color: #4A4A4A;
  letter-spacing: 0.3px;
}

.viajaya-hero__cert-desc {
  font-size: 11px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.3;
}

/* ---- CTA Buttons ---- */
.viajaya-hero__actions {
  display: flex;
  gap: 14px;
  margin-top: 4px;
}

.viajaya-hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  padding: 15px 28px;
  border-radius: 10px;
  font-family: 'Montserrat', sans-serif;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  text-decoration: none;
  border: none;
  letter-spacing: 0.2px;
}

.viajaya-hero__btn--primary {
  background: #C89B2D;
  color: #FFFFFF;
  box-shadow: 0 4px 16px rgba(200, 155, 45, 0.3);
}

.viajaya-hero__btn--primary:hover {
  background: #B8891F;
  transform: translateY(-2px);
  box-shadow: 0 8px 28px rgba(200, 155, 45, 0.35);
}

.viajaya-hero__btn--secondary {
  background: transparent;
  color: #4A4A4A;
  border: 2px solid #4A4A4A;
}

.viajaya-hero__btn--secondary:hover {
  background: #4A4A4A;
  color: #FFFFFF;
  transform: translateY(-2px);
  box-shadow: 0 8px 24px rgba(74, 74, 74, 0.2);
}

/* ---- Right Visual ---- */
.viajaya-hero__visual {
  position: relative;
  display: flex;
  align-items: stretch;
  justify-content: flex-end;
  animation: heroSlideRight 0.8s ease both 0.2s;
}

.viajaya-hero__image-wrapper {
  position: relative;
  width: 100%;
  max-width: 560px;
  border-radius: 0;
  overflow: hidden;
  box-shadow: none;
}

.viajaya-hero__image {
  width: 100%;
  height: 100%;
  min-height: 100%;
  object-fit: cover;
  display: block;
}

.viajaya-hero__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(
    to right,
    #FAFAFA 0%,
    rgba(250, 250, 250, 0.85) 15%,
    rgba(250, 250, 250, 0.4) 35%,
    rgba(250, 250, 250, 0) 55%
  );
}

/* ---- Floating Card ---- */
.viajaya-hero__float-card {
  position: absolute;
  bottom: 40px;
  left: -30px;
  display: flex;
  align-items: flex-start;
  gap: 14px;
  padding: 22px 26px;
  background: #FFFFFF;
  border-radius: 16px;
  box-shadow:
    0 12px 40px rgba(0, 0, 0, 0.1),
    0 4px 12px rgba(0, 0, 0, 0.04);
  max-width: 320px;
  animation: heroFloat 5s ease-in-out infinite;
  z-index: 3;
}

.viajaya-hero__float-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 44px;
  height: 44px;
  border-radius: 12px;
  background: rgba(200, 155, 45, 0.1);
  flex-shrink: 0;
}

.viajaya-hero__float-icon i {
  color: #C89B2D;
  font-size: 18px;
}

.viajaya-hero__float-content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.viajaya-hero__float-content strong {
  font-size: 14px;
  font-weight: 700;
  color: #1A1A1A;
  letter-spacing: 0.2px;
}

.viajaya-hero__float-content span {
  font-size: 13px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.5;
}

/* ---- Bottom Value Propositions ---- */
.viajaya-hero__values-bar {
  position: relative;
  z-index: 3;
  width: 100%;
  background: #1A1A1A;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  margin-top: auto;
}

.viajaya-hero__values-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  max-width: 1400px;
  margin: 0 auto;
  padding: 0 clamp(24px, 5vw, 80px);
}

.viajaya-hero__value {
  display: flex;
  align-items: center;
  gap: 16px;
  padding: 28px 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.08);
  animation: heroCountUp 0.6s ease both;
}

.viajaya-hero__value:last-child {
  border-right: none;
}

.viajaya-hero__value:nth-child(1) { animation-delay: 0.1s; }
.viajaya-hero__value:nth-child(2) { animation-delay: 0.2s; }
.viajaya-hero__value:nth-child(3) { animation-delay: 0.3s; }
.viajaya-hero__value:nth-child(4) { animation-delay: 0.4s; }

.viajaya-hero__value-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: 12px;
  background: rgba(200, 155, 45, 0.15);
  flex-shrink: 0;
}

.viajaya-hero__value-icon i {
  color: #C89B2D;
  font-size: 20px;
}

.viajaya-hero__value-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.viajaya-hero__value-title {
  font-size: 16px;
  font-weight: 700;
  color: #FFFFFF;
  letter-spacing: -0.3px;
  line-height: 1.2;
}

.viajaya-hero__value-desc {
  font-size: 13px;
  font-weight: 400;
  color: #9A9A9A;
  line-height: 1.4;
}

/* ========================================
   RESPONSIVE DESIGN
   ======================================== */

/* Tablet */
@media (max-width: 1200px) {
  .viajaya-hero__container {
    gap: 0;
  }

  .viajaya-hero__title {
    font-size: clamp(38px, 4.5vw, 54px);
  }

  .viajaya-hero__float-card {
    left: -20px;
    bottom: 30px;
  }
}

/* Mobile Landscape / Small Tablet */
@media (max-width: 992px) {
  .viajaya-hero__container {
    grid-template-columns: 1fr;
    gap: 0;
  }

  .viajaya-hero__content {
    order: 1;
    text-align: center;
    align-items: center;
    padding: 40px clamp(24px, 5vw, 80px);
  }

  .viajaya-hero__kicker {
    justify-content: center;
  }

  .viajaya-hero__description {
    text-align: center;
  }

  .viajaya-hero__actions {
    justify-content: center;
    flex-wrap: wrap;
  }

  .viajaya-hero__visual {
    order: 0;
    width: 100%;
  }

  .viajaya-hero__image-wrapper {
    max-width: 100%;
    margin: 0 auto;
  }

  .viajaya-hero__image {
    height: 360px;
  }

  .viajaya-hero__float-card {
    left: 50%;
    transform: translateX(-50%);
    bottom: 20px;
    max-width: 300px;
  }

  .viajaya-hero__image-overlay {
    background: linear-gradient(
      to bottom,
      #FAFAFA 0%,
      rgba(250, 250, 250, 0.7) 15%,
      rgba(250, 250, 250, 0) 40%
    );
  }

  .viajaya-hero__values-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .viajaya-hero__value {
    border-right: none;
    border-bottom: 1px solid #ECECEC;
  }

  .viajaya-hero__value:nth-child(odd) {
    border-right: 1px solid #ECECEC;
  }
}

/* Mobile Portrait */
@media (max-width: 768px) {
  .viajaya-hero {
    min-height: auto;
  }

  .viajaya-hero__container {
    gap: 0;
  }

  .viajaya-hero__content {
    padding: 36px 20px 24px;
  }

  .viajaya-hero__title {
    font-size: clamp(30px, 7vw, 42px);
    letter-spacing: -1px;
  }

  .viajaya-hero__description {
    font-size: 15px;
  }

  .viajaya-hero__certifications {
    grid-template-columns: 1fr;
  }

  .viajaya-hero__actions {
    flex-direction: column;
    width: 100%;
  }

  .viajaya-hero__btn {
    width: 100%;
    justify-content: center;
  }

  .viajaya-hero__image {
    height: 300px;
  }

  .viajaya-hero__float-card {
    position: relative;
    left: 0;
    transform: none;
    bottom: auto;
    margin-top: -40px;
    margin-left: 20px;
    margin-right: 20px;
    max-width: none;
    animation: none;
  }

  .viajaya-hero__image-overlay {
    background: linear-gradient(
      to bottom,
      #FAFAFA 0%,
      rgba(250, 250, 250, 0.6) 20%,
      rgba(250, 250, 250, 0) 45%
    );
  }

  .viajaya-hero__values-container {
    grid-template-columns: 1fr;
  }

  .viajaya-hero__value {
    border-right: none;
    border-bottom: 1px solid #ECECEC;
    padding: 20px 24px;
  }

  .viajaya-hero__value:last-child {
    border-bottom: none;
  }

  .viajaya-hero__geo {
    display: none;
  }
}

/* Small Mobile */
@media (max-width: 480px) {
  .viajaya-hero__container {
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 28px;
  }

  .viajaya-hero__logo-img {
    height: 48px;
  }

  .viajaya-hero__title {
    font-size: clamp(26px, 8vw, 36px);
  }

  .viajaya-hero__cert-card {
    padding: 14px 16px;
  }

  .viajaya-hero__cert-icon {
    width: 36px;
    height: 36px;
  }

  .viajaya-hero__cert-icon i {
    font-size: 14px;
  }

  .viajaya-hero__value-title {
    font-size: 14px;
  }

  .viajaya-hero__value-desc {
    font-size: 12px;
  }
}

/* Viaja Ya presentation layer */
.travel-hero {
  --travel-yellow: #f0c009;
  --travel-blue: #203ec9;
  --travel-red: #ec2525;
  position: relative;
  display: flex;
  flex-direction: column;
  min-height: calc(100vh - 84px);
  overflow: hidden;
  background: #fffaf0;
  color: #10215f;
  font-family: 'Be Vietnam Pro', sans-serif;
}

.travel-hero::before {
  position: absolute;
  top: -180px;
  right: -100px;
  width: 420px;
  height: 420px;
  border-radius: 50%;
  background: var(--travel-yellow);
  content: '';
  opacity: 0.18;
}

.travel-hero__container {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: minmax(0, 0.92fr) minmax(420px, 1.08fr);
  width: min(1440px, 100%);
  min-height: 620px;
  margin: 0 auto;
}

.travel-hero__content {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: center;
  gap: 22px;
  padding: 56px clamp(28px, 6vw, 96px);
}

.travel-hero__logo {
  width: 142px;
  height: auto;
  object-fit: contain;
}

.travel-hero__kicker {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 4px 0 0;
  color: var(--travel-red);
  font-size: 12px;
  font-weight: 700;
  letter-spacing: 1.8px;
}

.travel-hero__kicker-line {
  width: 34px;
  height: 3px;
  background: var(--travel-red);
}

.travel-hero__title {
  max-width: 620px;
  margin: 0;
  color: var(--travel-blue);
  font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
  font-size: clamp(48px, 6vw, 88px);
  font-weight: 700;
  line-height: 0.98;
  letter-spacing: 0;
}

.travel-hero__title-accent {
  color: var(--travel-red);
}

.travel-hero__description {
  max-width: 520px;
  margin: 0;
  color: #45517a;
  font-size: 14px;
  line-height: 1.65;
}

.travel-hero__actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 8px;
}

.travel-hero__btn {
  display: inline-flex;
  align-items: center;
  gap: 10px;
  min-height: 50px;
  padding: 13px 22px;
  border-radius: 7px;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  transition: transform 180ms ease, box-shadow 180ms ease, background 180ms ease;
}

.travel-hero__btn:hover {
  transform: translateY(-2px);
}

.travel-hero__btn--primary {
  background: var(--travel-blue);
  color: #fff;
  box-shadow: 0 10px 22px rgba(32, 62, 201, 0.24);
}

.travel-hero__btn--primary:hover {
  background: #162e9e;
}

.travel-hero__btn--secondary {
  border: 2px solid var(--travel-red);
  color: var(--travel-red);
}

.travel-hero__btn--secondary:hover {
  background: var(--travel-red);
  color: #fff;
}

.travel-hero__visual {
  position: relative;
  min-height: 620px;
}

.travel-hero__image-wrapper {
  position: absolute;
  inset: 24px 24px 24px 0;
  overflow: hidden;
  border-radius: 26px 0 0 26px;
  box-shadow: 0 22px 48px rgba(32, 62, 201, 0.18);
}

.travel-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.travel-hero__image-overlay {
  position: absolute;
  inset: 0;
  background: linear-gradient(135deg, rgba(32, 62, 201, 0.18), transparent 48%, rgba(236, 37, 37, 0.12));
}

.travel-hero__values-bar {
  position: relative;
  z-index: 2;
  background: var(--travel-blue);
}

.travel-hero__values-container {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  width: min(1440px, 100%);
  margin: 0 auto;
}

.travel-hero__value {
  display: flex;
  align-items: center;
  gap: 14px;
  min-height: 104px;
  padding: 18px 24px;
  border-right: 1px solid rgba(255, 255, 255, 0.2);
}

.travel-hero__value:last-child {
  border-right: 0;
}

.travel-hero__value-icon {
  display: grid;
  width: 44px;
  height: 44px;
  flex: 0 0 44px;
  place-items: center;
  border-radius: 50%;
  background: var(--travel-yellow);
  color: var(--travel-blue);
  font-size: 18px;
}

.travel-hero__value-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.travel-hero__value-title {
  color: #fff;
  font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
  font-size: 18px;
  font-weight: 600;
}

.travel-hero__value-desc {
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  line-height: 1.35;
}

@media (max-width: 992px) {
  .travel-hero__container {
    grid-template-columns: 1fr;
  }

  .travel-hero__visual {
    order: -1;
    min-height: 340px;
  }

  .travel-hero__image-wrapper {
    inset: 0;
    border-radius: 0;
  }

  .travel-hero__content {
    align-items: center;
    padding: 36px 24px 44px;
    text-align: center;
  }

  .travel-hero__kicker,
  .travel-hero__actions {
    justify-content: center;
  }

  .travel-hero__values-container {
    grid-template-columns: repeat(2, 1fr);
  }

  .travel-hero__value:nth-child(2) {
    border-right: 0;
  }
}

@media (max-width: 560px) {
  .travel-hero__visual {
    min-height: 330px;
  }

  .travel-hero__title {
    font-size: clamp(44px, 14vw, 68px);
  }

  .travel-hero__description {
    font-size: 15px;
  }

  .travel-hero__actions,
  .travel-hero__btn {
    width: 100%;
  }

  .travel-hero__btn {
    justify-content: center;
  }

  .travel-hero__values-container {
    grid-template-columns: 1fr;
  }

  .travel-hero__value,
  .travel-hero__value:nth-child(2) {
    border-right: 0;
    border-bottom: 1px solid rgba(255, 255, 255, 0.2);
  }

  .travel-hero__value:last-child {
    border-bottom: 0;
  }
}

/* Hero full-bleed basado en la referencia de Viaja Ya */
.travel-hero {
  min-height: 300svh;
  height: auto;
  background: #071522;
  color: #fff;
}

.travel-hero::before {
  display: none;
}

.travel-hero__background {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: -1;
  pointer-events: none;
}

.travel-hero__image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center center;
}

.travel-hero__source {
  position: absolute;
  width: 1px;
  height: 1px;
  opacity: 0;
  pointer-events: none;
}

.travel-hero__image-overlay {
  position: absolute;
  inset: 0;
  background:
    linear-gradient(90deg, rgba(3, 12, 22, 0.78) 0%, rgba(3, 12, 22, 0.34) 48%, rgba(3, 12, 22, 0.18) 100%),
    linear-gradient(0deg, rgba(2, 8, 16, 0.78) 0%, transparent 38%, rgba(2, 8, 16, 0.18) 100%);
}

.travel-hero__container {
  position: sticky;
  top: 0;
  display: block;
  width: 100%;
  min-height: 100svh;
  height: 100svh;
  margin: 0;
}

.travel-hero__content {
  position: relative;
  z-index: 2;
  display: block;
  width: 100%;
  height: 100%;
  padding: clamp(90px, 16vh, 150px) clamp(24px, 4.1vw, 56px) 52px;
}

.travel-hero__steps {
  position: absolute;
  right: clamp(24px, 6vw, 96px);
  bottom: clamp(86px, 14vh, 150px);
  z-index: 4;
  width: min(360px, 34vw);
}

.travel-hero__step {
  display: none;
  grid-template-columns: 42px 1fr;
  gap: 16px;
  padding: 18px 20px;
  border-left: 2px solid #f0c009;
  background: rgba(3, 12, 22, 0.68);
  backdrop-filter: blur(8px);
}

.travel-hero__step.is-active {
  display: grid;
}

.travel-hero__step-index {
  color: #f0c009;
  font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
  font-size: 30px;
  line-height: 1;
}

.travel-hero__step-eyebrow {
  margin: 0 0 5px;
  color: #f0c009;
  font-size: 10px;
  font-weight: 700;
  letter-spacing: 1.6px;
}

.travel-hero__step h2 {
  margin: 0 0 7px;
  color: #fff;
  font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
  font-size: 28px;
  font-weight: 400;
  line-height: 1;
}

.travel-hero__step div > p:last-child {
  margin: 0;
  color: rgba(255, 255, 255, 0.78);
  font-size: 12px;
  line-height: 1.5;
}

.travel-hero__kicker {
  position: absolute;
  top: clamp(148px, 18vh, 194px);
  left: clamp(24px, 4.1vw, 56px);
  margin: 0;
  color: #f0c009;
  font-family: 'Be Vietnam Pro', sans-serif;
  font-size: 11px;
  font-weight: 700;
  letter-spacing: 2px;
}

.travel-hero__kicker-line {
  width: 28px;
  height: 2px;
  background: #f0c009;
}

.travel-hero__title {
  position: absolute;
  top: clamp(198px, 29vh, 252px);
  left: clamp(24px, 4.1vw, 56px);
  max-width: 560px;
  color: #fff;
  font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
  font-size: clamp(54px, 9vw, 120px);
  font-weight: 400;
  line-height: 0.95;
  letter-spacing: 0.02em;
  text-shadow: 0 4px 40px rgba(0, 0, 0, 0.3);
  text-transform: uppercase;
}

.travel-hero__title-accent {
  font-style: normal;
  color: #f0c009;
}

.travel-hero__description {
  position: absolute;
  top: clamp(432px, 71vh, 182px);
  left: clamp(24px, 4.1vw, 56px);
  max-width: 470px;
  color: rgba(255, 255, 255, 0.76);
  font-size: 14px;
  line-height: 1.7;
}

.travel-hero__kicker,
.travel-hero__title,
.travel-hero__description {
  transform: translateY(-18px);
}

.travel-hero__location {
  position: absolute;
  top: clamp(550px, 58vh, 860px);
  left: clamp(24px, 4.1vw, 56px);
  display: flex;
  flex-direction: column;
  gap: 2px;
  color: rgba(255, 255, 255, 0.68);
  font-size: 12px;
}

.travel-hero__location strong {
  color: #f0c009;
  font-size: 11px;
  letter-spacing: 0.5px;
}

.travel-hero__btn--primary {
  position: absolute;
  right: clamp(884px, 3.6vw, 48px);
  top: clamp(540px, 58vh, 860px);
  min-height: 46px;
  padding: 12px 22px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  border-radius: 0;
  background: rgba(11, 20, 31, 0.3);
  box-shadow: none;
  color: #fff;
  font-size: 11px;
  letter-spacing: 0.2px;
  text-transform: uppercase;
}

.travel-hero__btn--primary:hover {
  background: #f0c009;
  border-color: #f0c009;
  color: #071522;
}

.travel-hero__scroll {
  position: absolute;
  top: clamp(540px, 58vh, 960px);
  left: 50%;
  z-index: 3;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 7px;
  color: rgba(255, 255, 255, 0.38);
  font-size: 9px;
  font-weight: 700;
  letter-spacing: 2px;
  transform: translateX(-50%);
}

.travel-hero__scroll i {
  display: block;
  width: 1px;
  height: 30px;
  background: rgba(255, 255, 255, 0.45);
}

.travel-hero__image-credit,
.travel-hero__values-bar,
.travel-hero__logo,
.travel-hero__actions {
  display: none;
}

@media (max-width: 700px) {
  .travel-hero {
    min-height: 180svh;
    height: auto;
  }

  .travel-hero__image {
    object-position: 58% center;
  }

  .travel-hero__image-overlay {
    background:
      linear-gradient(90deg, rgba(3, 12, 22, 0.76), rgba(3, 12, 22, 0.22)),
      linear-gradient(0deg, rgba(2, 8, 16, 0.84), transparent 48%);
  }

  .travel-hero__title {
    top: 25vh;
    font-size: clamp(52px, 14vw, 76px);
  }

  .travel-hero__description {
    top: 60vh;
    right: 24px;
    font-size: 13px;
  }

  .travel-hero__scroll {
    display: none;
  }

  .travel-hero__btn--primary {
    right: 24px;
    top: 46vh;
  }

  .travel-hero__location {
    top: 46vh;
  }

  .travel-hero__steps {
    right: 20px;
    bottom: 88px;
    left: 20px;
    width: auto;
  }

  .travel-hero__step {
    padding: 14px 16px;
  }
}

/* Secuencia local controlada por el scroll */
.travel-hero {
  min-height: 100svh;
  height: 100svh;
  overflow: visible;
}

.travel-hero__container {
  position: relative;
  z-index: 2;
  height: 100svh;
  min-height: 100svh;
}

.travel-hero__background {
  position: fixed;
  top: 0;
  right: 0;
  left: 0;
  z-index: 0;
  height: 100svh;
  min-height: 100svh;
  margin-top: 0;
  overflow: hidden;
  pointer-events: none;
}

.travel-hero__background .travel-hero__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.travel-hero__background .travel-hero__image--next {
  position: absolute;
  inset: 0;
  opacity: 0;
  transition: opacity 80ms linear;
}

.travel-hero__background .travel-hero__image {
  display: block;
  width: 100%;
  height: 100%;
  object-fit: cover;
  object-position: center;
}

.travel-hero__background video {
  background: #071522;
}

@media (max-width: 700px) {
  .travel-hero,
  .travel-hero__container {
    min-height: 100svh;
    height: 100svh;
  }

  .travel-hero__content {
    display: flex;
    flex-direction: column;
    justify-content: flex-end;
    padding: 0 20px 60px;
    height: auto;
    position: absolute;
    top: auto;
    bottom: 0;
    left: 0;
    right: 0;
    z-index: 3;
  }

  .travel-hero__kicker {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    margin-bottom: 8px;
  }

  .travel-hero__title {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    font-size: clamp(40px, 12vw, 64px);
    max-width: 100%;
  }

  .travel-hero__description {
    position: relative;
    top: auto;
    left: auto;
    right: auto;
    transform: none;
    font-size: 14px;
    max-width: 100%;
    margin-bottom: 12px;
  }

  .travel-hero__location {
    position: relative;
    top: auto;
    left: auto;
    transform: none;
    margin-bottom: 16px;
  }

  .travel-hero__btn--primary {
    position: relative;
    top: auto;
    right: auto;
    align-self: flex-start;
    border-radius: 7px;
    font-size: 13px;
    padding: 12px 24px;
  }

  .travel-hero__background {
    margin-top: 0;
  }
}
</style>
