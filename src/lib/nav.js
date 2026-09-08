import { asset } from './imagen.js';
import { auth, isAdmin, isLoggedIn, logout } from './auth.js';
import { getLocale, esc, toggleTheme } from './html.js';
import { t } from './i18n.js';

function navLink(href, label) {
  return `<a href="#${href}" data-link class="geo-nav-link">${esc(label)}</a>`;
}

function brand() {
  return `<a href="#/" data-link class="flex items-center pl-1"><img src="${asset('img/logo-geoturismosv.png')}" alt="Logo GeoTurismoSV" class="h-12 w-auto rounded-xl bg-white/90 px-2 py-1"></a>`;
}

function tools() {
  const locale = getLocale().toUpperCase();
  return `
    <button type="button" data-locale class="geo-nav-link">${locale}</button>
    <button type="button" data-theme class="geo-nav-link" title="Tema">${isDarkIcon()}</button>
  `;
}

export function publicNav() {
  const authBtns = isLoggedIn()
    ? `
      <a href="#${isAdmin() ? '/admin/dashboard' : '/usuario/panel'}" data-link class="geo-nav-cta is-green">${esc(t('nav.panel'))}</a>
      ${isAdmin() ? '' : `<a href="#/favoritos" data-link class="geo-nav-cta is-blue">${esc(t('nav.favorites'))}</a>`}
      <button type="button" data-logout class="geo-nav-cta is-red">${esc(t('nav.logout'))}</button>
    `
    : `
      <a href="#/entrar" data-link class="geo-nav-cta is-gold">${esc(t('nav.login'))}</a>
      <a href="#/entrar?tab=cuenta" data-link class="geo-nav-cta is-green">${esc(t('nav.register'))}</a>
    `;

  return `
    <header class="geo-nav-wrap">
      <nav class="geo-nav">
        ${brand()}
        <div class="geo-nav-links">
          ${tools()}
          ${navLink('/', t('nav.home'))}
          ${navLink('/destinos', t('nav.destinations'))}
          ${navLink('/rutas', t('nav.routes'))}
          ${navLink('/comunidad', t('nav.community'))}
          ${navLink('/categorias', t('nav.categories'))}
          ${navLink('/sobre-nosotros', t('nav.about'))}
          ${authBtns}
        </div>
      </nav>
    </header>
  `;
}

function isDarkIcon() {
  const dark = document.documentElement.classList.contains('dark');
  if (dark) {
    return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" /></svg>`;
  }
  return `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" /></svg>`;
}

export function adminNav() {
  return `
    <header class="geo-nav-wrap">
      <nav class="geo-nav">
        <a href="#/admin/dashboard" data-link><img src="${asset('img/logo-geoturismosv.png')}" alt="Logo" class="h-11 w-auto rounded-xl bg-white/90 px-2 py-1"></a>
        <div class="geo-nav-links">
          ${navLink('/admin/dashboard', 'Dashboard')}
          ${navLink('/admin/categorias', 'Categorías')}
          ${navLink('/admin/destinos', 'Destinos')}
          ${navLink('/admin/usuarios', 'Usuarios')}
          <a href="#/" data-link class="geo-nav-link">Ver web</a>
          <button type="button" data-logout class="geo-nav-cta is-red">Cerrar sesión</button>
        </div>
      </nav>
    </header>
  `;
}

export function userNav() {
  const nombre = esc(auth.profile?.nombre || 'Viajero');
  return `
    <header class="geo-nav-wrap">
      <nav class="geo-nav">
        ${brand()}
        <div class="geo-nav-links">
          <span class="geo-nav-link hidden sm:inline">${nombre}</span>
          ${navLink('/usuario/panel', 'Panel')}
          ${navLink('/favoritos', 'Favoritos')}
          ${navLink('/comunidad', t('nav.community'))}
          ${navLink('/rutas', t('nav.routes'))}
          ${navLink('/profile', 'Perfil')}
          ${navLink('/destinos', 'Destinos')}
          <button type="button" data-logout class="geo-nav-cta is-red">Cerrar sesión</button>
        </div>
      </nav>
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
