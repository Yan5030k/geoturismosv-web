import { esc } from '../lib/html.js';
import { auth, deleteAccount, updatePassword, updateProfile } from '../lib/auth.js';
import { userNav } from '../lib/nav.js';
import { go } from '../lib/router.js';

export async function render(root) {
  root.innerHTML = `
    <div class="min-h-screen bg-slate-50">
      ${userNav()}
      <main class="mx-auto max-w-3xl px-6 py-10 space-y-6">
        <h1 class="text-3xl font-bold">Perfil</h1>
        <p id="msg" class="hidden text-green-700"></p>
        <p id="err" class="hidden text-red-600"></p>
        <section class="rounded-xl bg-white p-8 shadow space-y-4">
          <h2 class="text-xl font-bold">Información</h2>
          <form id="perfil" class="space-y-4">
            <input name="nombre" value="${esc(auth.profile?.nombre || '')}" class="w-full rounded-lg border-gray-300" placeholder="Nombre">
            <input name="email" type="email" value="${esc(auth.profile?.email || auth.user?.email || '')}" class="w-full rounded-lg border-gray-300">
            <button class="rounded-full bg-[#168a1a] px-5 py-2 font-semibold text-white">Guardar</button>
          </form>
        </section>
        <section class="rounded-xl bg-white p-8 shadow space-y-4">
          <h2 class="text-xl font-bold">Contraseña</h2>
          <form id="pass" class="space-y-4">
            <input name="password" type="password" class="w-full rounded-lg border-gray-300" placeholder="Nueva contraseña">
            <input name="password2" type="password" class="w-full rounded-lg border-gray-300" placeholder="Confirmar">
            <button class="rounded-full bg-[#0b6fb3] px-5 py-2 font-semibold text-white">Actualizar contraseña</button>
          </form>
        </section>
        <section class="rounded-xl bg-white p-8 shadow">
          <h2 class="text-xl font-bold text-red-700">Eliminar cuenta</h2>
          <button type="button" id="borrar" class="mt-4 rounded-full bg-red-600 px-5 py-2 font-semibold text-white">Eliminar cuenta</button>
        </section>
      </main>
    </div>
  `;

  const msg = root.querySelector('#msg');
  const err = root.querySelector('#err');
  const ok = (t) => {
    msg.textContent = t;
    msg.classList.remove('hidden');
    err.classList.add('hidden');
  };
  const fail = (t) => {
    err.textContent = t;
    err.classList.remove('hidden');
    msg.classList.add('hidden');
  };

  root.querySelector('#perfil').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    try {
      await updateProfile({ nombre: fd.get('nombre'), email: fd.get('email') });
      ok('Perfil actualizado.');
    } catch (ex) {
      fail(ex.message);
    }
  });

  root.querySelector('#pass').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    if (fd.get('password') !== fd.get('password2')) return fail('Las contraseñas no coinciden.');
    try {
      await updatePassword(fd.get('password'));
      e.target.reset();
      ok('Contraseña actualizada.');
    } catch (ex) {
      fail(ex.message);
    }
  });

  root.querySelector('#borrar').addEventListener('click', async () => {
    if (!confirm('¿Seguro que deseas eliminar tu cuenta?')) return;
    try {
      await deleteAccount();
      go('/');
    } catch (ex) {
      fail(ex.message);
    }
  });
}
