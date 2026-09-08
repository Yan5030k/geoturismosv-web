import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc } from '../lib/html.js';
import { publicNav } from '../lib/nav.js';
import { RUTAS_SAN_MIGUEL } from '../lib/rutas.js';

export async function render(root) {
  const nombres = [...new Set(RUTAS_SAN_MIGUEL.flatMap((r) => r.puntos.map((p) => p.nombre)))];
  const { data } = await supabase.from('destinos').select('id, nombre, imagen').in('nombre', nombres);
  const byName = Object.fromEntries((data || []).map((d) => [d.nombre, d]));

  root.innerHTML = `
    <div class="min-h-screen geo-territory">
      ${publicNav()}
      <main class="mx-auto max-w-4xl px-6 py-10">
        <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-[#3ecf4c]">San Miguel · sin Google Routing</p>
        <h1 class="mt-2 text-4xl font-black text-white">Rutas sugeridas</h1>
        <p class="mt-3 max-w-2xl text-gray-400">Líneas de tiempo del oriente. El orden es geográfico y humano, no un GPS de pago.</p>
        ${RUTAS_SAN_MIGUEL.map(
          (ruta) => `
          <section class="mt-12">
            <h2 class="text-2xl font-black text-white">${esc(ruta.titulo)}</h2>
            <p class="mt-1 text-[#7dffa0]">${esc(ruta.lema)}</p>
            <p class="mt-2 text-sm text-gray-400">${esc(ruta.duracion)} · ${esc(ruta.km)}</p>
            <div class="geo-timeline">
              ${ruta.puntos
                .map((p, i) => {
                  const dest = byName[p.nombre];
                  const href = dest ? `#/destinos/${dest.id}` : '#/destinos?departamento=San Miguel';
                  return `
                    <article class="geo-step" style="--dot:${p.color}; animation-delay:${i * 120}ms">
                      <p class="text-xs font-bold uppercase tracking-widest text-gray-400">Punto ${String.fromCharCode(65 + i)} · ${esc(p.hora)}</p>
                      <h3 class="mt-1 text-xl font-black text-white">${esc(p.nombre)}</h3>
                      <p class="mt-2 text-gray-300">${esc(p.nota)}</p>
                      <a href="${href}" data-link class="geo-open">Abrir en el mapa</a>
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
