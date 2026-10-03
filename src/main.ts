import './assets/main.css'
import '@fortawesome/fontawesome-free/css/all.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { i18n } from './i18n'

const app = createApp(App)

app.use(router)
app.use(i18n)

// Evita pintar las secciones globales (ContactSection/footer) antes de resolver la ruta inicial
router.isReady().then(() => app.mount('#app'))
