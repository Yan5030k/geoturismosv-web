import { supabase } from '../lib/supabase.js';
import { esc } from '../lib/html.js';
import { adminNav } from '../lib/nav.js';

export async function render(root) {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  const usuarios = data || [];

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50">
      ${adminNav()}
      <main class="mx-auto max-w-7xl px-6 py-10">
        <h1 class="text-3xl font-bold">Usuarios</h1>
        <section class="mt-8 overflow-x-auto rounded-xl bg-white shadow">
          <table class="w-full text-left text-sm">
            <thead class="bg-[#0b6fb3] text-white">
              <tr><th class="px-6 py-4">Nombre</th><th class="px-6 py-4">Correo</th><th class="px-6 py-4">Rol</th><th class="px-6 py-4">Registro</th></tr>
            </thead>
            <tbody>
              ${usuarios
                .map(
                  (u) => `<tr class="border-b">
                    <td class="px-6 py-4">${esc(u.nombre)}</td>
                    <td class="px-6 py-4">${esc(u.email)}</td>
                    <td class="px-6 py-4"><span class="rounded-full px-3 py-1 text-sm font-semibold ${u.rol === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'}">${esc(u.rol)}</span></td>
                    <td class="px-6 py-4">${u.created_at ? new Date(u.created_at).toLocaleDateString() : ''}</td>
                  </tr>`,
                )
                .join('')}
            </tbody>
          </table>
        </section>
      </main>
    </div>
  `;
}
