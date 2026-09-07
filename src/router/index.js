import { createRouter, createWebHashHistory } from 'vue-router';
import { useAuth } from '@/composables/useAuth';

const routes = [
  { path: '/', name: 'inicio', component: () => import('@/pages/publico/Inicio.vue') },
  { path: '/destinos', name: 'destinos', component: () => import('@/pages/publico/Destinos.vue') },
  { path: '/destinos/:id', name: 'destino-detalle', component: () => import('@/pages/publico/DetalleDestino.vue') },
  { path: '/categorias', name: 'categorias', component: () => import('@/pages/publico/Categorias.vue') },
  { path: '/sobre-nosotros', name: 'sobre', component: () => import('@/pages/publico/SobreNosotros.vue') },
  { path: '/login', name: 'login', component: () => import('@/pages/auth/Login.vue'), meta: { guest: true } },
  { path: '/register', name: 'register', component: () => import('@/pages/auth/Register.vue'), meta: { guest: true } },
  { path: '/forgot-password', name: 'forgot-password', component: () => import('@/pages/auth/ForgotPassword.vue'), meta: { guest: true } },
  { path: '/reset-password', name: 'reset-password', component: () => import('@/pages/auth/ResetPassword.vue') },
  { path: '/usuario/panel', name: 'usuario-panel', component: () => import('@/pages/usuario/Panel.vue'), meta: { requiresAuth: true } },
  { path: '/favoritos', name: 'favoritos', component: () => import('@/pages/usuario/Favoritos.vue'), meta: { requiresAuth: true } },
  { path: '/profile', name: 'profile', component: () => import('@/pages/usuario/Perfil.vue'), meta: { requiresAuth: true } },
  { path: '/admin/dashboard', name: 'admin-dashboard', component: () => import('@/pages/admin/Dashboard.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/usuarios', name: 'admin-usuarios', component: () => import('@/pages/admin/Usuarios.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/categorias', name: 'admin-categorias', component: () => import('@/pages/admin/categorias/Index.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/categorias/create', name: 'admin-categorias-create', component: () => import('@/pages/admin/categorias/Create.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/categorias/:id/edit', name: 'admin-categorias-edit', component: () => import('@/pages/admin/categorias/Edit.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/destinos', name: 'admin-destinos', component: () => import('@/pages/admin/destinos/Index.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/destinos/create', name: 'admin-destinos-create', component: () => import('@/pages/admin/destinos/Create.vue'), meta: { requiresAdmin: true } },
  { path: '/admin/destinos/:id/edit', name: 'admin-destinos-edit', component: () => import('@/pages/admin/destinos/Edit.vue'), meta: { requiresAdmin: true } },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
  scrollBehavior() {
    return { top: 0 };
  },
});

router.beforeEach((to) => {
  const { isLoggedIn, isAdmin, profile } = useAuth();

  if (to.meta.requiresAdmin && !isAdmin.value) {
    return isLoggedIn.value ? { name: 'usuario-panel' } : { name: 'login' };
  }

  if (to.meta.requiresAuth && !isLoggedIn.value) {
    return { name: 'login' };
  }

  if (to.meta.guest && isLoggedIn.value) {
    return profile.value?.rol === 'admin'
      ? { name: 'admin-dashboard' }
      : { name: 'usuario-panel' };
  }

  return true;
});

export default router;
