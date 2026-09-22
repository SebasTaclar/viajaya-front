<template>
  <footer class="footer">
    <div class="footer__container">
      <!-- Top -->
      <div class="footer__top">
        <div class="footer__brand">
          <div class="footer__logo">
            <img
              src="/images/Logo.png"
              alt="Viaja Ya"
              class="footer__logo-img"
            />
          </div>
          <p class="footer__brand-desc">
            Hacemos realidad tu viaje a través del ahorro programado.
          </p>
        </div>

        <div class="footer__right">
          <div class="footer__socials-wrapper">
            <h4 class="footer__socials-title">Síguenos en nuestras redes sociales</h4>
            <div class="footer__socials">
              <a href="https://www.instagram.com/" target="_blank" class="footer__social" aria-label="Instagram">
                <i class="fab fa-instagram"></i>
              </a>
              <a href="https://api.whatsapp.com/send?phone=573132783573&text=Hola,%20cordial%20saludo.%20Me%20interesa%20el%20Fondo%20Viajero.%20%C2%BFPodr%C3%ADan%20enviarme%20informaci%C3%B3n?" target="_blank" class="footer__social footer__social--whatsapp" aria-label="WhatsApp">
                <i class="fab fa-whatsapp"></i>
              </a>
            </div>
          </div>

          <div class="footer__col">
            <h4 class="footer__col-title">Contacto</h4>
            <ul class="footer__list footer__list--contact">
              <li>
                <i class="fas fa-map-marker-alt"></i>
                <span>Colombia</span>
              </li>
              <li>
                <i class="fas fa-phone-alt"></i>
                <span>+57 313 278 3573</span>
              </li>
            </ul>
          </div>
        </div>
      </div>

      <!-- Divider -->
      <div class="footer__divider"></div>

      <!-- Bottom -->
      <div class="footer__bottom">
        <p class="footer__copy">
          &copy; {{ currentYear }} Viaja Ya. Todos los derechos reservados.
        </p>
        <div class="footer__bottom-links">
          <a href="/terms">Términos y condiciones</a>
          <a href="/terms">Política de privacidad</a>
        </div>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppFooter'
})

const currentYear = new Date().getFullYear()
</script>

<style scoped>
.footer {
  position: relative;
  width: 100%;
  background: #071522;
  font-family: 'Be Vietnam Pro', sans-serif;
  z-index: 2;
}

.footer__container {
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;
  padding: 40px clamp(24px, 5vw, 80px) 0;
}

/* ── Top ── */
.footer__top {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 48px;
  padding-bottom: 32px;
  align-items: start;
}

/* ── Brand ── */
.footer__brand {
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: 20px;
}

.footer__brand-desc {
  margin: 0;
  font-size: 14px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  line-height: 1.6;
  max-width: 280px;
}

.footer__right {
  display: flex;
  flex-direction: row;
  gap: 48px;
  align-items: flex-start;
}

.footer__logo-img {
  width: 120px;
  height: auto;
  object-fit: contain;
  filter: brightness(0) invert(1);
}

.footer__socials-wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__socials-title {
  margin: 0;
  font-size: 13px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.7);
}

.footer__socials {
  display: flex;
  gap: 12px;
}

.footer__social {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(255, 255, 255, 0.06);
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  font-size: 16px;
  transition: all 0.3s ease;
}

.footer__social:hover {
  background: var(--travel-yellow, #f0c009);
  color: #071522;
  transform: translateY(-2px);
}

.footer__social--whatsapp:hover {
  background: #25d366;
  color: #ffffff;
}

/* ── Col ── */
.footer__col-title {
  margin: 0 0 12px;
  font-size: 14px;
  font-weight: 700;
  color: #ffffff;
  letter-spacing: 0.5px;
}

.footer__list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.footer__list li a {
  font-size: 13px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.5);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer__list li a:hover {
  color: var(--travel-yellow, #f0c009);
}

.footer__list--contact li {
  display: flex;
  align-items: center;
  gap: 10px;
}

.footer__list--contact li i {
  color: var(--travel-yellow, #f0c009);
  font-size: 13px;
  width: 16px;
  text-align: center;
}

.footer__list--contact li span {
  font-size: 13px;
  color: rgba(255, 255, 255, 0.5);
}

/* ── Divider ── */
.footer__divider {
  width: 100%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(240, 192, 9, 0.25), transparent);
}

/* ── Bottom ── */
.footer__bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 24px 0;
}

.footer__copy {
  margin: 0;
  font-size: 12px;
  font-weight: 400;
  color: rgba(255, 255, 255, 0.3);
}

.footer__bottom-links {
  display: flex;
  gap: 24px;
}

.footer__bottom-links a {
  font-size: 12px;
  color: rgba(255, 255, 255, 0.3);
  text-decoration: none;
  transition: color 0.3s ease;
}

.footer__bottom-links a:hover {
  color: var(--travel-yellow, #f0c009);
}

/* ── Responsive ── */
@media (max-width: 992px) {
  .footer__top {
    grid-template-columns: 1fr;
    gap: 28px;
  }

  .footer__brand {
    flex-direction: column;
    align-items: center;
    text-align: center;
  }

  .footer__brand-desc {
    max-width: none;
  }

  .footer__right {
    flex-direction: column;
    align-items: center;
    text-align: center;
    gap: 24px;
  }

  .footer__socials-wrapper {
    align-items: center;
  }

  .footer__socials {
    justify-content: center;
  }

  .footer__list--contact {
    align-items: center;
  }
}

@media (max-width: 768px) {
  .footer__container {
    padding-top: 28px;
  }

  .footer__bottom {
    flex-direction: column;
    gap: 12px;
    text-align: center;
  }

  .footer__bottom-links {
    gap: 16px;
  }
}

@media (max-width: 480px) {
  .footer__container {
    padding: 20px 20px 0;
  }

  .footer__brand {
    gap: 16px;
  }

  .footer__logo-img {
    width: 100px;
  }

  .footer__brand-desc {
    font-size: 13px;
  }

  .footer__socials {
    gap: 10px;
  }

  .footer__social {
    width: 40px;
    height: 40px;
    font-size: 16px;
  }

  .footer__bottom-links {
    gap: 12px;
  }

  .footer__bottom-links a {
    font-size: 11px;
  }
}
</style>
