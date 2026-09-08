import { supabase } from '../lib/supabase.js';
import { esc } from '../lib/html.js';
import { adminNav } from '../lib/nav.js';

export async function render(root) {
  const pintar = async () => {
    const { data } = await supabase.from('categorias').select('*').order('created_at', { ascending: false });
    const categorias = data || [];
    root.innerHTML = `
      <div class="min-h-screen bg-slate-50">
        ${adminNav()}
        <main class="mx-auto max-w-7xl px-6 py-10">
          <div class="mb-8 flex items-center justify-between gap-4 flex-wrap">
            <h1 class="text-3xl font-bold">Categorías</h1>
            <a href="#/admin/categorias/create" data-link class="rounded-full bg-[#168a1a] px-5 py-3 font-semibold text-white">Nueva categoría</a>
          </div>
          <section class="overflow-x-auto rounded-xl bg-white shadow">
            <table class="w-full text-left text-sm">
              <thead class="bg-[#0b6fb3] text-white"><tr><th class="px-6 py-4">Nombre</th><th class="px-6 py-4">Descripción</th><th class="px-6 py-4">Estado</th><th class="px-6 py-4">Acciones</th></tr></thead>
              <tbody>
                ${categorias
                  .map(
                    (c) => `<tr class="border-b">
                      <td class="px-6 py-4 font-semibold">${esc(c.nombre)}</td>
                      <td class="px-6 py-4 text-gray-600">${esc(c.descripcion)}</td>
                      <td class="px-6 py-4">${c.estado ? 'Activa' : 'Inactiva'}</td>
                      <td class="px-6 py-4 flex gap-2">
                        <a href="#/admin/categorias/${c.id}/edit" data-link class="rounded-full bg-[#f4a000] px-4 py-2 text-white font-semibold">Editar</a>
                        <button type="button" data-del="${c.id}" class="rounded-full bg-red-600 px-4 py-2 text-white font-semibold">Eliminar</button>
                      </td>
                    </tr>`,
                  )
                  .join('')}
              </tbody>
            </table>
          </section>
        </main>
      </div>
    `;
    root.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('¿Eliminar esta categoría?')) return;
        await supabase.from('categorias').delete().eq('id', btn.dataset.del);
        await pintar();
      });
    });
  };
  await pintar();
}
