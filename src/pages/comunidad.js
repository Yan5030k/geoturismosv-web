import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc } from '../lib/html.js';
import { publicNav } from '../lib/nav.js';
import { estrellasHtml } from '../lib/comercio.js';
import { auth } from '../lib/auth.js';

export async function render(root) {
  const { data } = await supabase
    .from('comunidad_resenas')
    .select('*, destino:destinos(id, nombre, imagen, departamento), perfil:profiles(nombre)')
    .order('created_at', { ascending: false });

  const posts = data || [];

  root.innerHTML = `
    <div class="min-h-screen geo-territory">
      ${publicNav()}
      <main class="mx-auto max-w-3xl px-6 py-10">
        <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-[#3ecf4c]">Comunidad</p>
        <h1 class="mt-2 text-4xl font-black text-white">Lo que otros ya recorrieron</h1>
        <p class="mt-3 text-gray-400">Inspírate en las visitas reales. No es un feed de anuncios: es bitácora del territorio.</p>
        <div class="mt-10 geo-feed">
          ${
            posts.length
              ? posts
                  .map(
                    (p, i) => `
            <article class="geo-post" style="animation-delay:${i * 60}ms">
              <img src="${esc(destinoImagen(p.destino?.imagen))}" alt="">
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-[#7dffa0]">${esc(p.destino?.departamento || '')}</p>
                <h2 class="mt-1 text-xl font-black text-white">${esc(p.destino?.nombre || 'Destino')}</h2>
                <p class="mt-1 text-sm text-gray-400">${esc(p.perfil?.nombre || (auth.user?.id === p.user_id ? auth.profile?.nombre : 'Viajero'))}</p>
                <div class="mt-2">${estrellasHtml(p.estrellas)}</div>
                <p class="mt-3 text-gray-200">${esc(p.comentario)}</p>
                <a href="#/destinos/${p.destino_id}" data-link class="geo-open">Ver destino</a>
              </div>
            </article>`,
                  )
                  .join('')
              : `<p class="text-gray-400">Aún no hay reseñas. Entra y deja la primera en un destino de San Miguel.</p>`
          }
        </div>
      </main>
    </div>
  `;
}
