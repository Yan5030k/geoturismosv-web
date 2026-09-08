import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc } from '../lib/html.js';
import { adminNav } from '../lib/nav.js';

export async function render(root) {
  const pintar = async () => {
    const { data } = await supabase.from('destinos').select('*, categoria:categorias(*)').order('created_at', { ascending: false });
    const destinos = data || [];
    root.innerHTML = `
      <div class="min-h-screen bg-slate-50">
        ${adminNav()}
        <main class="mx-auto max-w-7xl px-6 py-10">
          <div class="mb-8 flex justify-between gap-4 flex-wrap">
            <h1 class="text-3xl font-bold">Destinos</h1>
            <a href="#/admin/destinos/create" data-link class="rounded-full bg-[#168a1a] px-5 py-3 font-semibold text-white">Nuevo destino</a>
          </div>
          <section class="grid gap-6 md:grid-cols-3">
            ${destinos
              .map(
                (d) => `
              <article class="overflow-hidden rounded-xl bg-white shadow">
                <img src="${esc(destinoImagen(d.imagen))}" class="h-48 w-full object-cover" alt="">
                <div class="p-5">
                  <p class="text-sm font-semibold text-[#168a1a]">${esc(d.categoria?.nombre || '')}</p>
                  <h2 class="mt-1 text-xl font-bold">${esc(d.nombre)}</h2>
                  <p class="mt-2 text-sm text-gray-600">${esc(d.ubicacion)}</p>
                  <p class="mt-2 text-sm">${d.estado ? 'Activo' : 'Inactivo'} · $${esc(d.costo_estimado)}</p>
                  <div class="mt-4 flex gap-2">
                    <a href="#/admin/destinos/${d.id}/edit" data-link class="rounded-full bg-[#f4a000] px-4 py-2 text-sm font-semibold text-white">Editar</a>
                    <button type="button" data-del="${d.id}" class="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Eliminar</button>
                  </div>
                </div>
              </article>`,
              )
              .join('')}
          </section>
        </main>
      </div>
    `;
    root.querySelectorAll('[data-del]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        if (!confirm('¿Eliminar este destino?')) return;
        await supabase.from('destinos').delete().eq('id', btn.dataset.del);
        await pintar();
      });
    });
  };
  await pintar();
}
