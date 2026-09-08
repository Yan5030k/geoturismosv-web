import { asset } from './imagen.js';
import { auth, isAdmin, isLoggedIn, logout } from './auth.js';
import { getLocale, esc, toggleTheme } from './html.js';
import { t } from './i18n.js';

function link(href, label) {
  return `<a href="#${href}" data-link class="rounded-md px-3 py-2 text-sm font-semibold text-[#0b6fb3] hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-gray-800">${esc(label)}</a>`;
}

function pathNow() {
  return (location.hash.replace(/^#/, '') || '/').split('?')[0] || '/';
}

function navItem(href, label) {
  const current = pathNow();
  const active = href === '/' ? current === '/' : current === href || current.startsWith(`${href}/`);
  return `<a href="#${href}" data-link class="whitespace-nowrap px-3 py-3 text-sm font-semibold border-b-2 ${
    active
      ? 'border-[#168a1a] text-[#168a1a]'
      : 'border-transparent text-gray-600 hover:text-[#0b6fb3] dark:text-gray-300 dark:hover:text-white'
  }">${esc(label)}</a>`;
}

function brand() {
  return `<a href="#/" data-link class="flex items-center"><img src="${asset('img/logo-geoturismosv.png')}" alt="Logo GeoTurismoSV" class="h-14 w-auto dark:bg-white/90 dark:px-3 dark:py-1 dark:rounded-xl"></a>`;
}

export function publicNav() {
  const locale = getLocale().toUpperCase();
  const authBtns = isLoggedIn()
    ? `
      <a href="#${isAdmin() ? '/admin/dashboard' : '/usuario/panel'}" data-link class="rounded-md bg-[#168a1a] px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">${esc(t('nav.panel'))}</a>
      ${isAdmin() ? '' : `<a href="#/favoritos" data-link class="rounded-md bg-[#0b6fb3] px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">${esc(t('nav.favorites'))}</a>`}
      <button type="button" data-logout class="rounded-md bg-red-600 px-4 py-2 text-sm font-semibold text-white hover:bg-red-700">${esc(t('nav.logout'))}</button>
    `
    : `
      <a href="#/entrar" data-link class="rounded-md border border-[#f4a000] px-4 py-2 text-sm font-semibold text-[#f4a000] hover:bg-[#f4a000] hover:text-white">${esc(t('nav.login'))}</a>
      <a href="#/entrar?tab=cuenta" data-link class="rounded-md bg-[#168a1a] px-4 py-2 text-sm font-semibold text-white hover:bg-green-700">${esc(t('nav.register'))}</a>
    `;

  return `
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <nav class="mx-auto max-w-7xl px-6">
        <div class="flex items-center justify-between gap-4 py-3">
          ${brand()}
          <div class="flex items-center gap-2 shrink-0">
            <button type="button" data-locale class="rounded-md px-2 py-1 text-sm font-bold text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800">${locale}</button>
            <button type="button" data-theme class="rounded-md p-2 text-gray-500 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-800" title="Tema claro u oscuro">${isDarkIcon()}</button>
            ${authBtns}
          </div>
        </div>
        <div class="flex items-center gap-1 overflow-x-auto border-t border-gray-100 dark:border-gray-800">
          ${navItem('/', t('nav.home'))}
          ${navItem('/destinos', t('nav.destinations'))}
          ${navItem('/rutas', t('nav.routes'))}
          ${navItem('/emprendimientos', t('nav.ventures'))}
          ${navItem('/comunidad', t('nav.community'))}
          ${navItem('/categorias', t('nav.categories'))}
          ${navItem('/sobre-nosotros', t('nav.about'))}
        </div>
      </nav>
      <div class="h-1 w-full bg-gradient-to-r from-[#0b6fb3] via-[#1690c8] to-[#168a1a]"></div>
    </header>
  `;
}

function isDarkIcon() {
  const dark = document.documentElement.classList.contains('dark');
  if (dark) {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
}

export function adminNav() {
  return `
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-3 flex-wrap">
        <a href="#/admin/dashboard" data-link><img src="${asset('img/logo-geoturismosv.png')}" alt="Logo" class="h-14 w-auto dark:bg-white/90 dark:px-2 dark:rounded-xl"></a>
        <div class="flex items-center gap-3 flex-wrap">
          ${link('/admin/dashboard', 'Dashboard')}
          ${link('/admin/categorias', 'Categorías')}
          ${link('/admin/destinos', 'Destinos')}
          ${link('/admin/usuarios', 'Usuarios')}
          <a href="#/" data-link class="rounded-full border border-gray-300 px-4 py-2 font-medium text-gray-700 dark:text-gray-200">Ver web</a>
          <button type="button" data-logout class="rounded-full bg-red-600 px-5 py-2 font-semibold text-white">Cerrar sesión</button>
        </div>
      </nav>
      <div class="h-1 w-full bg-gradient-to-r from-[#0b6fb3] via-[#1690c8] to-[#168a1a]"></div>
    </header>
  `;
}

export function userNav() {
  const nombre = esc(auth.profile?.nombre || 'Viajero');
  return `
    <header class="sticky top-0 z-50 bg-white dark:bg-gray-900 shadow-sm">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-3 flex-wrap">
        ${brand()}
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-sm text-gray-500 dark:text-gray-400 hidden sm:inline">${nombre}</span>
          ${link('/usuario/panel', 'Panel')}
          ${link('/favoritos', 'Favoritos')}
          ${link('/comunidad', t('nav.community'))}
          ${link('/rutas', t('nav.routes'))}
          ${link('/profile', 'Perfil')}
          ${link('/destinos', 'Destinos')}
          <button type="button" data-logout class="rounded-full bg-red-600 px-5 py-2 font-semibold text-white">Cerrar sesión</button>
        </div>
      </nav>
      <div class="h-1 w-full bg-gradient-to-r from-[#0b6fb3] via-[#1690c8] to-[#168a1a]"></div>
    </header>
  `;
}

export async function handleChromeClick(event) {
  if (event.target.closest('[data-logout]')) {
    event.preventDefault();
    await logout();
    location.hash = '/';
    return;
  }
  if (event.target.closest('[data-locale]')) {
    event.preventDefault();
    const next = getLocale() === 'es' ? 'en' : 'es';
    localStorage.setItem('locale', next);
    window.dispatchEvent(new Event('hashchange'));
    return;
  }
  if (event.target.closest('[data-theme]')) {
    event.preventDefault();
    toggleTheme();
    window.dispatchEvent(new Event('hashchange'));
  }
}
