<template>
  <article class="package-card" :class="`package-card--${index}`">
    <div class="package-card__image-wrap">
      <img v-if="pkg.imageHover" :src="pkg.imageHover" :alt="pkg.alt" class="package-card__img-hover" loading="lazy" />
      <img :src="pkg.image" :alt="pkg.alt" loading="lazy" />
      <span class="package-card__tag">{{ pkg.tag }}</span>
      <div class="package-card__overlay">
        <p class="package-card__region">{{ pkg.region }}</p>
        <h3>{{ pkg.name }}</h3>
      </div>
    </div>

  </article>
</template>

<script setup lang="ts">
defineOptions({ name: 'TravelPackageCard' })

defineProps<{
  pkg: {
    name: string
    region: string
    tag: string
    price: string
    alt: string
    image: string
    imageHover?: string
    benefits: Array<{ label: string; icon: string }>
  }
  index: number
}>()
</script>

<style scoped>
@keyframes cardScatterIn {
  0% {
    opacity: 0;
    transform: translateY(60px) rotate(var(--scatter-rotate)) scale(0.85);
    filter: blur(4px);
  }
  60% {
    opacity: 1;
    filter: blur(0);
  }
  100% {
    opacity: 1;
    transform: translateY(0) rotate(var(--scatter-rotate)) scale(1);
    filter: blur(0);
  }
}

@keyframes cardFloat {
  0%, 100% {
    transform: translateY(0) rotate(var(--scatter-rotate));
  }
  50% {
    transform: translateY(var(--float-y)) rotate(var(--scatter-rotate));
  }
}

.package-card {
  --scatter-rotate: -4deg;
  --float-y: -6px;
  overflow: hidden;
  border-radius: 0;
  background: transparent;
  box-shadow: 0 18px 28px rgba(8, 18, 42, 0.28);
  transform: rotate(var(--scatter-rotate));
  animation:
    cardScatterIn 0.8s cubic-bezier(0.34, 1.56, 0.64, 1) backwards,
    cardFloat 4s ease-in-out infinite;
  transition: transform 220ms ease, box-shadow 220ms ease;
}

/* Posiciones regadas para cada tarjeta */
.package-card--0 {
  --scatter-rotate: -6deg;
  --float-y: -8px;
  animation-delay: 0ms, 2000ms;
}

.package-card--1 {
  --scatter-rotate: 4deg;
  --float-y: 10px;
  animation-delay: 120ms, 2400ms;
}

.package-card--2 {
  --scatter-rotate: -3deg;
  --float-y: -10px;
  animation-delay: 240ms, 2100ms;
}

.package-card--3 {
  --scatter-rotate: 7deg;
  --float-y: 6px;
  animation-delay: 360ms, 2600ms;
}

.package-card:hover {
  z-index: 2;
  box-shadow: 0 24px 38px rgba(8, 18, 42, 0.38);
  transform: translateY(-8px) rotate(0deg) scale(1.03);
}

.package-card__image-wrap {
  position: relative;
  z-index: 1;
  overflow: hidden;
  background: #d9dce8;
  aspect-ratio: 0.72;
}

.package-card__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 500ms ease, opacity 400ms ease;
}

.package-card__img-hover {
  position: absolute;
  inset: 0;
  opacity: 0;
}

.package-card:hover .package-card__img-hover {
  opacity: 1;
}

.package-card:hover .package-card__image-wrap img:not(.package-card__img-hover) {
  opacity: 0;
}

.package-card:hover .package-card__image-wrap img {
  transform: scale(1.05);
}

.package-card__image-wrap::after {
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(5, 15, 45, 0.02) 38%, rgba(5, 15, 45, 0.86) 100%);
  content: '';
}

.package-card__tag {
  position: absolute;
  top: 14px;
  left: 14px;
  z-index: 1;
  padding: 7px 10px;
  background: #f0c009;
  color: #13205a;
  font-size: 10px;
  font-weight: 800;
  letter-spacing: 0.5px;
  text-transform: uppercase;
}

.package-card__overlay {
  position: absolute;
  right: 18px;
  bottom: 18px;
  left: 18px;
  z-index: 1;
}

.package-card__region {
  margin-bottom: 8px;
  color: #62c2ca;
  font-size: 9px;
}

.package-card__overlay h3 {
  margin: 0;
  color: #fff;
  font-family: 'Bebas Neue', 'Arial Narrow', sans-serif;
  font-size: clamp(24px, 3vw, 40px);
  font-weight: 400;
  line-height: 0.9;
  text-transform: uppercase;
}

.package-card__body {
  position: relative;
  padding: 20px;
  background: #fff;
}

.package-card__benefits {
  display: flex;
  justify-content: space-between;
  gap: 8px;
  padding: 14px 0;
  border-top: 1px solid #e6e8f0;
  border-bottom: 1px solid #e6e8f0;
}

.package-card__benefits span {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  color: #536087;
  font-size: 14px;
}

.package-card__benefits small {
  font-size: 9px;
  white-space: nowrap;
}

.package-card__button {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
  margin-top: 18px;
  padding: 12px 14px;
  background: #203ec9;
  color: #fff;
  font-size: 11px;
  font-weight: 800;
  text-decoration: none;
  text-transform: uppercase;
  transition: background 180ms ease;
}

.package-card__button:hover {
  background: #162e9e;
}

.package-card__button i {
  transition: transform 180ms ease;
}

.package-card__button:hover i {
  transform: translateX(3px);
}

@media (max-width: 800px) {
  .package-card {
    --scatter-rotate: 0deg;
    --float-y: 0;
    transform: none;
    animation: none;
    border-radius: 12px;
    overflow: hidden;
  }

  .package-card:hover {
    transform: translateY(-4px);
  }

  .package-card__image-wrap {
    aspect-ratio: 4/3;
  }

  .package-card__tag {
    top: 10px;
    left: 10px;
    padding: 5px 8px;
    font-size: 9px;
  }

  .package-card__overlay {
    right: 14px;
    bottom: 14px;
    left: 14px;
  }

  .package-card__overlay h3 {
    font-size: clamp(20px, 5vw, 32px);
  }

  .package-card__region {
    font-size: 8px;
    margin-bottom: 6px;
  }

  .package-card__body {
    padding: 16px;
  }
}

@media (max-width: 520px) {
  .package-card__image-wrap {
    aspect-ratio: 3/2;
  }

  .package-card__overlay h3 {
    font-size: clamp(18px, 6vw, 28px);
  }

  .package-card__tag {
    font-size: 8px;
    padding: 4px 7px;
  }
}
</style>
