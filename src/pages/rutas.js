import { supabase } from '../lib/supabase.js';
import { esc } from '../lib/html.js';
import { publicNav } from '../lib/nav.js';
import { RUTAS } from '../lib/rutas.js';

export async function render(root) {
  const nombres = [...new Set(RUTAS.flatMap((r) => r.puntos.map((p) => p.nombre)))];
  const { data } = await supabase.from('destinos').select('id, nombre, imagen').in('nombre', nombres);
  const byName = Object.fromEntries((data || []).map((d) => [d.nombre, d]));

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-gray-900">
      ${publicNav()}
      <main class="mx-auto max-w-4xl px-6 py-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">Rutas sugeridas</h1>
        <p class="mt-3 max-w-2xl text-gray-600 dark:text-gray-300">Líneas de tiempo por territorio. El orden es geográfico, no un GPS de pago.</p>
        ${RUTAS.map(
          (ruta) => `
          <section class="mt-12">
            <p class="text-xs font-bold uppercase tracking-widest text-[#168a1a]">${esc(ruta.region)}</p>
            <h2 class="mt-1 text-2xl font-bold text-gray-900 dark:text-white">${esc(ruta.titulo)}</h2>
            <p class="mt-1 text-[#0b6fb3] dark:text-blue-300">${esc(ruta.lema)}</p>
            <p class="mt-2 text-sm text-gray-500">${esc(ruta.duracion)} · ${esc(ruta.km)}</p>
            <div class="geo-timeline">
              ${ruta.puntos
                .map((p, i) => {
                  const dest = byName[p.nombre];
                  const href = dest ? `#/destinos/${dest.id}` : '#/destinos';
                  return `
                    <article class="geo-step" style="--dot:${p.color}">
                      <p class="text-xs font-bold uppercase tracking-widest text-gray-500">Punto ${String.fromCharCode(65 + i)} · ${esc(p.hora)}</p>
                      <h3 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">${esc(p.nombre)}</h3>
                      <p class="mt-2 text-gray-600 dark:text-gray-300">${esc(p.nota)}</p>
                      <a href="${href}" data-link class="mt-3 inline-block font-semibold text-[#0b6fb3] hover:underline">Abrir ficha</a>
                    </article>`;
                })
                .join('')}
            </div>
          </section>`,
        ).join('')}
      </main>
    </div>
  `;
}
