import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc } from '../lib/html.js';
import { auth } from '../lib/auth.js';
import { userNav } from '../lib/nav.js';

export async function render(root) {
  const [{ count: destCount }, favRes] = await Promise.all([
    supabase.from('destinos').select('id', { count: 'exact', head: true }).eq('estado', true),
    supabase.from('favoritos').select('*, destino:destinos(*, categoria:categorias(*))', { count: 'exact' }).eq('user_id', auth.user.id).order('created_at', { ascending: false }),
  ]);

  const favoritos = favRes.data || [];
  const recientes = favoritos.slice(0, 3);

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50">
      ${userNav()}
      <main class="mx-auto max-w-7xl px-6 py-10">
        <section class="rounded-3xl bg-white p-8 shadow-xl ring-1 ring-slate-100">
          <p class="text-sm font-bold uppercase text-[#168a1a]">Tu mapa</p>
          <h1 class="mt-3 text-4xl font-black">Hola, ${esc(auth.profile?.nombre || 'viajero')}</h1>
          <p class="mt-4 max-w-2xl text-gray-600">Explora el territorio y guarda los destinos que quieres visitar.</p>
          <div class="mt-8 flex flex-wrap gap-3">
            <a href="#/destinos" data-link class="rounded-full bg-[#0b6fb3] px-6 py-3 font-bold text-white">Explorar destinos</a>
            <a href="#/favoritos" data-link class="rounded-full bg-[#168a1a] px-6 py-3 font-bold text-white">Mis favoritos</a>
          </div>
        </section>
        <section class="mt-8 grid gap-6 md:grid-cols-2">
          <article class="rounded-3xl bg-white p-7 shadow"><p class="text-sm font-bold text-[#0b6fb3]">Destinos</p><h2 class="mt-3 text-5xl font-black">${destCount || 0}</h2></article>
          <article class="rounded-3xl bg-white p-7 shadow"><p class="text-sm font-bold text-[#168a1a]">Favoritos</p><h2 class="mt-3 text-5xl font-black">${favRes.count || 0}</h2></article>
        </section>
        <section class="mt-10 rounded-3xl bg-white p-8 shadow">
          <h2 class="text-2xl font-black">Favoritos recientes</h2>
          ${
            recientes.length
              ? `<div class="mt-6 grid gap-6 md:grid-cols-3">${recientes
                  .map(
                    (f) => `
                <article class="overflow-hidden rounded-2xl bg-slate-50">
                  <img src="${esc(destinoImagen(f.destino?.imagen))}" class="h-40 w-full object-cover" alt="">
                  <div class="p-4">
                    <p class="text-sm font-bold text-[#168a1a]">${esc(f.destino?.categoria?.nombre || '')}</p>
                    <h3 class="font-black">${esc(f.destino?.nombre || '')}</h3>
                    <a href="#/destinos/${f.destino?.id}" data-link class="mt-3 inline-block text-sm font-bold text-[#0b6fb3]">Ver destino</a>
                  </div>
                </article>`,
                  )
                  .join('')}</div>`
              : `<p class="mt-4 text-gray-500">Todavía no has guardado destinos. <a href="#/destinos" data-link class="text-[#0b6fb3] font-semibold">Explorar</a></p>`
          }
        </section>
      </main>
    </div>
  `;
}
