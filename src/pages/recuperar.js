import { resetPassword, updatePassword } from '../lib/auth.js';
import { asset } from '../lib/imagen.js';
import { go, parseRoute } from '../lib/router.js';

export async function render(root) {
  const isReset = parseRoute().path === '/reset-password';

  root.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-slate-50 p-6">
      <div class="w-full max-w-md rounded-2xl bg-white p-8 shadow">
        <a href="#/" data-link><img src="${asset('img/logo-geoturismosv.png')}" alt="" class="h-12 mb-6"></a>
        <h1 class="text-2xl font-black">${isReset ? 'Nueva contraseña' : 'Recuperar acceso'}</h1>
        <p id="msg" class="mt-3 text-sm text-gray-600"></p>
        <form id="form" class="mt-6 space-y-4">
          ${
            isReset
              ? `<input name="password" type="password" required minlength="6" placeholder="Nueva contraseña" class="w-full rounded-xl border-gray-300">`
              : `<input name="email" type="email" required placeholder="Tu correo" class="w-full rounded-xl border-gray-300">`
          }
          <button class="w-full rounded-full bg-[#0b6fb3] py-3 font-bold text-white">${isReset ? 'Guardar' : 'Enviar enlace'}</button>
        </form>
        <a href="#/entrar" data-link class="mt-6 inline-block text-sm text-[#0b6fb3]">Volver a entrar</a>
      </div>
    </div>
  `;

  const msg = root.querySelector('#msg');
  root.querySelector('#form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      if (isReset) {
        await updatePassword(fd.get('password'));
        msg.textContent = 'Contraseña actualizada. Ya puedes entrar.';
        setTimeout(() => go('/entrar'), 1200);
      } else {
        await resetPassword(fd.get('email'));
        msg.textContent = 'Si el correo existe, te enviamos un enlace.';
      }
    } catch (ex) {
      msg.textContent = ex.message;
    }
  });
}
