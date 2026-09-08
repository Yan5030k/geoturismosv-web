import { asset } from './imagen.js';
import { auth, isAdmin, isLoggedIn, logout } from './auth.js';
import { getLocale, esc, toggleTheme } from './html.js';
import { t } from './i18n.js';

function link(href, label, extra = '') {
  return `<a href="#${href}" data-link class="rounded-full border border-[#0b6fb3] bg-blue-50 dark:bg-blue-900/20 px-4 py-2 font-medium text-[#0b6fb3] dark:text-blue-400 transition hover:bg-[#0b6fb3] hover:text-white ${extra}">${esc(label)}</a>`;
}

export function publicNav() {
  const locale = getLocale().toUpperCase();
  const authBtns = isLoggedIn()
    ? `
      <a href="#${isAdmin() ? '/admin/dashboard' : '/usuario/panel'}" data-link class="rounded-full bg-[#168a1a] px-5 py-2 font-semibold text-white shadow hover:bg-green-700">${esc(t('nav.panel'))}</a>
      ${isAdmin() ? '' : `<a href="#/favoritos" data-link class="rounded-full bg-[#0b6fb3] px-5 py-2 font-semibold text-white shadow hover:bg-blue-700">${esc(t('nav.favorites'))}</a>`}
      <button type="button" data-logout class="rounded-full bg-red-600 px-5 py-2 font-semibold text-white shadow hover:bg-red-700">${esc(t('nav.logout'))}</button>
    `
    : `
      <a href="#/entrar" data-link class="rounded-full border border-[#f4a000] text-[#f4a000] px-5 py-2 font-semibold shadow-sm hover:bg-[#f4a000] hover:text-white">${esc(t('nav.login'))}</a>
      <a href="#/entrar?tab=cuenta" data-link class="rounded-full bg-[#168a1a] px-5 py-2 font-semibold text-white shadow hover:bg-green-700">${esc(t('nav.register'))}</a>
    `;

  return `
    <header class="bg-white dark:bg-gray-900 shadow-sm">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-4 flex-wrap">
        <a href="#/" data-link class="flex items-center">
          <img src="${asset('img/logo-geoturismosv.png')}" alt="Logo GeoTurismoSV" class="h-16 w-auto dark:bg-white/90 dark:px-3 dark:py-1 dark:rounded-xl">
        </a>
        <div class="flex items-center gap-3 flex-wrap justify-end">
          <button type="button" data-locale class="font-bold px-2 py-1 rounded-md text-gray-500 hover:bg-gray-100 dark:text-gray-400">${locale}</button>
          <button type="button" data-theme class="p-2 rounded-full text-gray-500 hover:bg-gray-100 dark:text-gray-400" title="Tema">${isDarkIcon()}</button>
          ${link('/', t('nav.home'))}
          ${link('/destinos', t('nav.destinations'))}
          ${link('/categorias', t('nav.categories'))}
          ${link('/sobre-nosotros', t('nav.about'))}
          ${authBtns}
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
    <header class="bg-white shadow-sm">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-3 flex-wrap">
        <a href="#/admin/dashboard" data-link><img src="${asset('img/logo-geoturismosv.png')}" alt="Logo" class="h-14 w-auto"></a>
        <div class="flex items-center gap-3 flex-wrap">
          ${link('/admin/dashboard', 'Dashboard')}
          ${link('/admin/categorias', 'Categorías')}
          ${link('/admin/destinos', 'Destinos')}
          ${link('/admin/usuarios', 'Usuarios')}
          <a href="#/" data-link class="rounded-full border border-gray-300 px-4 py-2 font-medium text-gray-700">Ver web</a>
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
    <header class="bg-white shadow-sm">
      <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 gap-3 flex-wrap">
        <a href="#/" data-link><img src="${asset('img/logo-geoturismosv.png')}" alt="Logo" class="h-14 w-auto"></a>
        <div class="flex items-center gap-3 flex-wrap">
          <span class="text-sm text-gray-500 hidden sm:inline">${nombre}</span>
          ${link('/usuario/panel', 'Panel')}
          ${link('/favoritos', 'Favoritos')}
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
