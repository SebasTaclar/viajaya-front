import { createRouter, createWebHistory } from 'vue-router'
import { authService, clientAuthService } from '@/services/api'
import Home from '@/views/Home.vue'

declare module 'vue-router' {
  interface RouteMeta {
    requiresAuth?: boolean
    requiresGuest?: boolean
    requiredRole?: string
    requiredRoles?: string[]
  }
}

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  scrollBehavior(to) {
    if (to.hash) {
      return new Promise(resolve => {
        requestAnimationFrame(() => {
          const el = document.querySelector(to.hash)
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'start' })
            resolve(false)
            return
          }
          resolve({ left: 0, top: 0 })
        })
      })
    }
    return { left: 0, top: 0 }
  },
  routes: [
    {
      path: '/',
      name: 'home',
      component: Home,
    },
    {
      path: '/login',
      name: 'login',
      component: () => import('../views/Login.vue'),
      meta: {
        requiresGuest: true,
      },
    },

    {
      path: '/login-clientes',
      name: 'client-login',
      component: () => import('../views/ClientLogin.vue'),
      meta: {
        requiresGuest: true,
      },
    },

    {
      path: '/portal-clientes',
      name: 'client-portal',
      component: () => import('../views/ClientPortal.vue'),
      meta: {
        requiresAuth: true,
        requiredRole: 'user',
      },
    },

    {
      path: '/contacto',
      name: 'contacto',
      component: () => import('../views/ContactView.vue'),
    },

    {
      path: '/clientes-recursos',
      name: 'clientes-recursos',
      component: () => import('../views/ClientesRecursos.vue'),
    },

    {
      path: '/admin/products',
      name: 'admin-products',
      component: () => import('../views/AdminDashboardNew.vue'),
      meta: {
        requiresAuth: true,
        requiredRoles: ['admin', 'superadmin'],
      },
    },

    {
      path: '/admin/crm',
      component: () => import('../views/crm/CRMMain.vue'),
      meta: {
        requiresAuth: true,
        requiredRoles: ['admin', 'superadmin'],
      },
      children: [
        {
          path: '',
          name: 'crm-dashboard',
          component: () => import('../views/crm/CRMDashboard.vue'),
        },
      ],
    },

    {
      path: '/terms-and-conditions',
      name: 'TermsAndConditions',
      component: () => import('../views/TermsAndConditions.vue'),
    },
    {
      path: '/:pathMatch(.*)*',
      name: 'not-found',
      redirect: '/',
    },
  ],
})

router.beforeEach((to, from, next) => {
  const isClientRoute = to.path === '/portal-clientes'
  const isLoginClientRoute = to.path === '/login-clientes'

  if (isClientRoute) {
    if (!clientAuthService.isAuthenticated()) {
      next('/login-clientes')
      return
    }
    next()
    return
  }

  if (isLoginClientRoute) {
    if (clientAuthService.isAuthenticated()) {
      next('/portal-clientes')
      return
    }
    next()
    return
  }

  const isAuthenticated = authService.isAuthenticated()
  const userRole = authService.getUserRole()

  if (to.path === '/login' && isAuthenticated && (userRole === 'admin' || userRole === 'superadmin')) {
    next('/admin/products')
    return
  }

  if (to.meta.requiresAuth) {
    if (!isAuthenticated) {
      next('/login')
      return
    }

    if (to.meta.requiredRole && userRole !== to.meta.requiredRole) {
      next('/')
      return
    }

    if (to.meta.requiredRoles && (!userRole || !to.meta.requiredRoles.includes(userRole))) {
      next('/')
      return
    }
  }

  if (to.meta.requiresGuest && isAuthenticated) {
    if (userRole === 'admin' || userRole === 'superadmin') {
      next('/admin/products')
    } else {
      next('/')
    }
    return
  }

  next()
})

export default router
