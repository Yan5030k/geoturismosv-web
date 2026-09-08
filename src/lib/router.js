import { isAdmin, isLoggedIn } from './auth.js';

let cleanup = null;

export function parseRoute() {
  const raw = (location.hash.replace(/^#/, '') || '/').split('?');
  const path = raw[0].startsWith('/') ? raw[0] : `/${raw[0]}`;
  const query = Object.fromEntries(new URLSearchParams(raw[1] || ''));
  const dest = path.match(/^\/destinos\/([^/]+)$/);
  const catEdit = path.match(/^\/admin\/categorias\/([^/]+)\/edit$/);
  const destEdit = path.match(/^\/admin\/destinos\/([^/]+)\/edit$/);
  return { path, query, destId: dest?.[1], catId: catEdit?.[1], destEditId: destEdit?.[1] };
}

export function go(path) {
  const next = path.startsWith('#') ? path.slice(1) : path;
  location.hash = next.startsWith('/') ? next : `/${next}`;
}

export function afterLoginPath() {
  return isAdmin() ? '/admin/dashboard' : '/destinos';
}

function guard(route) {
  const admin = route.path.startsWith('/admin');
  const privateUser = ['/usuario/panel', '/favoritos', '/profile'].includes(route.path);
  const guest = ['/entrar', '/login', '/register', '/forgot-password'].includes(route.path);

  if (admin && !isAdmin()) return isLoggedIn() ? '/destinos' : '/entrar';
  if (privateUser && !isLoggedIn()) return '/entrar';
  if (guest && isLoggedIn()) return afterLoginPath();
  return null;
}

export async function startRouter(root) {
  async function render() {
    if (typeof cleanup === 'function') {
      cleanup();
      cleanup = null;
    }

    const route = parseRoute();
    const redirect = guard(route);
    if (redirect) {
      go(redirect);
      return;
    }

    const page = await loadPage(route);
    cleanup = (await page.render(root, route)) || null;
    window.scrollTo(0, 0);
  }

  window.addEventListener('hashchange', render);
  if (!location.hash) location.hash = '/';
  else await render();
}

async function loadPage(route) {
  if (route.path === '/') return import('../pages/inicio.js');
  if (route.path === '/destinos') return import('../pages/destinos.js');
  if (route.destId) return import('../pages/detalle.js');
  if (route.path === '/rutas') return import('../pages/rutas.js');
  if (route.path === '/emprendimientos') return import('../pages/emprendimientos.js');
  if (route.path === '/comunidad') return import('../pages/comunidad.js');
  if (route.path === '/categorias') return import('../pages/categorias.js');
  if (route.path === '/sobre-nosotros') return import('../pages/nosotros.js');
  if (['/entrar', '/login', '/register'].includes(route.path)) return import('../pages/entrar.js');
  if (route.path === '/forgot-password') return import('../pages/recuperar.js');
  if (route.path === '/reset-password') return import('../pages/recuperar.js');
  if (route.path === '/usuario/panel') return import('../pages/panel.js');
  if (route.path === '/favoritos') return import('../pages/favoritos.js');
  if (route.path === '/profile') return import('../pages/perfil.js');
  if (route.path === '/admin/dashboard') return import('../pages/admin-dashboard.js');
  if (route.path === '/admin/usuarios') return import('../pages/admin-usuarios.js');
  if (route.path === '/admin/categorias') return import('../pages/admin-categorias.js');
  if (route.path === '/admin/categorias/create' || route.catId) return import('../pages/admin-categoria-form.js');
  if (route.path === '/admin/destinos') return import('../pages/admin-destinos.js');
  if (route.path === '/admin/destinos/create' || route.destEditId) return import('../pages/admin-destino-form.js');
  return import('../pages/inicio.js');
}
