import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc } from '../lib/html.js';
import { auth } from '../lib/auth.js';
import { userNav } from '../lib/nav.js';

export async function render(root) {
  async function cargar() {
    const { data } = await supabase
      .from('favoritos')
      .select('*, destino:destinos(*, categoria:categorias(*))')
      .eq('user_id', auth.user.id)
      .order('created_at', { ascending: false });
    return data || [];
  }

  const pintar = async () => {
    const favoritos = await cargar();
    root.innerHTML = `
      <div class="min-h-screen bg-slate-50">
        ${userNav()}
        <main class="mx-auto max-w-7xl px-6 py-10">
          <h1 class="text-4xl font-black">Mis destinos favoritos</h1>
          <div class="mt-5 flex gap-3">
            <a href="#/usuario/panel" data-link class="rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white">Volver al panel</a>
            <a href="#/destinos" data-link class="rounded-full bg-[#0b6fb3] px-5 py-3 text-sm font-bold text-white">Explorar más</a>
          </div>
          ${
            favoritos.length
              ? `<section class="mt-8 grid gap-6 md:grid-cols-3">${favoritos
                  .map(
                    (f) => `
                <article class="overflow-hidden rounded-3xl bg-white shadow">
                  <img src="${esc(destinoImagen(f.destino?.imagen))}" class="h-48 w-full object-cover" alt="">
                  <div class="p-6">
                    <p class="text-sm font-bold text-[#168a1a]">${esc(f.destino?.categoria?.nombre || '')}</p>
                    <h2 class="mt-2 text-xl font-black">${esc(f.destino?.nombre || '')}</h2>
                    <div class="mt-5 flex gap-2">
                      <a href="#/destinos/${f.destino?.id}" data-link class="rounded-full bg-[#0b6fb3] px-4 py-2 text-sm font-bold text-white">Ver</a>
                      <button type="button" data-quitar="${f.destino?.id}" class="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">Quitar</button>
                    </div>
                  </div>
                </article>`,
                  )
                  .join('')}</section>`
              : `<p class="mt-8 text-gray-500">Todavía no tienes favoritos.</p>`
          }
        </main>
      </div>
    `;
    root.querySelectorAll('[data-quitar]').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await supabase.from('favoritos').delete().eq('user_id', auth.user.id).eq('destino_id', btn.dataset.quitar);
        await pintar();
      });
    });
  };

  await pintar();
}
