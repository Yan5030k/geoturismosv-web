import { asset } from '../lib/imagen.js';
import { esc } from '../lib/html.js';
import { login, register } from '../lib/auth.js';
import { afterLoginPath, go } from '../lib/router.js';

export async function render(root, route) {
  const tab = route.query.tab === 'cuenta' || route.path === '/register' ? 'cuenta' : 'entrar';

  root.innerHTML = `
    <div class="min-h-screen grid lg:grid-cols-2">
      <section class="relative hidden lg:block">
        <img src="${asset('images/hero.png')}" alt="" class="absolute inset-0 h-full w-full object-cover">
        <div class="absolute inset-0 bg-[#0b3d5c]/70"></div>
        <div class="relative z-10 flex h-full flex-col justify-end p-12 text-white">
          <p class="text-sm font-bold uppercase tracking-widest text-[#f4a000]">GeoTurismoSV</p>
          <h1 class="mt-3 text-4xl font-black leading-tight">El mapa de El Salvador, y quien lo habita.</h1>
          <p class="mt-4 max-w-md text-white/85">Entrá para guardar destinos. El territorio se explora gratis; tu cuenta es para llevarte el viaje.</p>
        </div>
      </section>
      <section class="flex items-center justify-center p-6 sm:p-10 bg-slate-50">
        <div class="w-full max-w-md">
          <a href="#/" data-link class="inline-flex items-center gap-3 mb-8">
            <img src="${asset('img/logo-geoturismosv.png')}" alt="GeoTurismoSV" class="h-14">
          </a>
          <div class="flex rounded-full bg-white p-1 shadow-sm ring-1 ring-gray-200 mb-8">
            <button type="button" data-tab="entrar" class="tab flex-1 rounded-full px-4 py-2 text-sm font-bold ${tab === 'entrar' ? 'bg-[#0b6fb3] text-white' : 'text-gray-600'}">Entrar</button>
            <button type="button" data-tab="cuenta" class="tab flex-1 rounded-full px-4 py-2 text-sm font-bold ${tab === 'cuenta' ? 'bg-[#168a1a] text-white' : 'text-gray-600'}">Crear cuenta</button>
          </div>
          <p id="auth-error" class="mb-4 hidden rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700"></p>
          <form id="form-entrar" class="${tab === 'entrar' ? '' : 'hidden'} space-y-4">
            <label class="block text-sm font-semibold text-gray-700">Correo
              <input name="email" type="email" required autocomplete="username" class="mt-1 w-full rounded-xl border-gray-300">
            </label>
            <label class="block text-sm font-semibold text-gray-700">Contraseña
              <input name="password" type="password" required autocomplete="current-password" class="mt-1 w-full rounded-xl border-gray-300">
            </label>
            <button type="submit" class="w-full rounded-full bg-[#0b6fb3] py-3 font-bold text-white hover:bg-blue-700">Entrar al mapa</button>
            <a href="#/forgot-password" data-link class="block text-center text-sm text-gray-500 underline">Olvidé mi contraseña</a>
          </form>
          <form id="form-cuenta" class="${tab === 'cuenta' ? '' : 'hidden'} space-y-4">
            <label class="block text-sm font-semibold text-gray-700">Nombre
              <input name="nombre" type="text" required autocomplete="name" class="mt-1 w-full rounded-xl border-gray-300">
            </label>
            <label class="block text-sm font-semibold text-gray-700">Correo
              <input name="email" type="email" required autocomplete="username" class="mt-1 w-full rounded-xl border-gray-300">
            </label>
            <label class="block text-sm font-semibold text-gray-700">Contraseña
              <input name="password" type="password" required minlength="6" autocomplete="new-password" class="mt-1 w-full rounded-xl border-gray-300">
            </label>
            <label class="block text-sm font-semibold text-gray-700">Confirmar contraseña
              <input name="password2" type="password" required autocomplete="new-password" class="mt-1 w-full rounded-xl border-gray-300">
            </label>
            <button type="submit" class="w-full rounded-full bg-[#168a1a] py-3 font-bold text-white hover:bg-green-700">Crear cuenta</button>
          </form>
          <p class="mt-8 text-center text-sm text-gray-500"><a href="#/destinos" data-link class="text-[#0b6fb3] font-semibold">Seguir explorando sin cuenta →</a></p>
        </div>
      </section>
    </div>
  `;

  const err = root.querySelector('#auth-error');
  const showError = (msg) => {
    err.textContent = msg;
    err.classList.remove('hidden');
  };

  root.querySelectorAll('[data-tab]').forEach((btn) => {
    btn.addEventListener('click', () => go(btn.dataset.tab === 'cuenta' ? '/entrar?tab=cuenta' : '/entrar'));
  });

  root.querySelector('#form-entrar').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await login(fd.get('email'), fd.get('password'));
      go(afterLoginPath());
    } catch (ex) {
      showError(ex.message || 'No se pudo iniciar sesión.');
    }
  });

  root.querySelector('#form-cuenta').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (fd.get('password') !== fd.get('password2')) {
      showError('Las contraseñas no coinciden.');
      return;
    }
    try {
      await register({ nombre: fd.get('nombre'), email: fd.get('email'), password: fd.get('password') });
      go('/destinos');
    } catch (ex) {
      showError(ex.message || 'No se pudo crear la cuenta.');
    }
  });
}
