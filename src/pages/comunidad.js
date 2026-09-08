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
    <div class="min-h-screen bg-slate-50 dark:bg-gray-900">
      ${publicNav()}
      <main class="mx-auto max-w-3xl px-6 py-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Comunidad</h1>
        <p class="mt-3 text-gray-600 dark:text-gray-300">Lo que otros ya recorrieron. Bitácora del territorio, no un muro de anuncios.</p>
        <div class="mt-10 geo-feed">
          ${
            posts.length
              ? posts
                  .map(
                    (p) => `
            <article class="geo-post">
              <img src="${esc(destinoImagen(p.destino?.imagen))}" alt="">
              <div>
                <p class="text-xs font-bold uppercase tracking-widest text-[#168a1a]">${esc(p.destino?.departamento || '')}</p>
                <h2 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">${esc(p.destino?.nombre || 'Destino')}</h2>
                <p class="mt-1 text-sm text-gray-500">${esc(p.perfil?.nombre || (auth.user?.id === p.user_id ? auth.profile?.nombre : 'Viajero'))}</p>
                <div class="mt-2">${estrellasHtml(p.estrellas)}</div>
                <p class="mt-3 text-gray-700 dark:text-gray-300">${esc(p.comentario)}</p>
                <a href="#/destinos/${p.destino_id}" data-link class="mt-3 inline-block font-semibold text-[#0b6fb3] hover:underline">Ver destino</a>
              </div>
            </article>`,
                  )
                  .join('')
              : `<p class="text-gray-500">Aún no hay reseñas. Entra y deja la primera.</p>`
          }
        </div>
      </main>
    </div>
  `;
}
