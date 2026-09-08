import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc, tDb } from '../lib/html.js';
import { t } from '../lib/i18n.js';
import { publicNav } from '../lib/nav.js';
import { go } from '../lib/router.js';
import { cargarTasas, formatearPrecio, guardarMoneda, monedaGuardada, opcionesMoneda } from '../lib/monedas.js';

const RANGOS = ['Niñez', 'Adolescencia', 'Adultez', 'Adulto Mayor'];

function chipsEdad(rangos) {
  return (rangos || []).map((r) => `<span class="geo-chip">${esc(r)}</span>`).join('');
}

export async function render(root, route) {
  const form = {
    search: route.query.search || '',
    categoria_id: route.query.categoria_id || '',
    departamento: route.query.departamento || '',
    municipio: route.query.municipio || '',
    costo_min: route.query.costo_min || '',
    costo_max: route.query.costo_max || '',
    rango: route.query.rango || '',
  };

  const { data: cats } = await supabase.from('categorias').select('*').eq('estado', true).order('nombre');
  const categorias = cats || [];

  let query = supabase.from('destinos').select('*, categoria:categorias(*)').eq('estado', true).order('created_at', { ascending: false });
  if (form.categoria_id) query = query.eq('categoria_id', form.categoria_id);
  if (form.departamento) query = query.eq('departamento', form.departamento);
  if (form.municipio) query = query.ilike('municipio', `%${form.municipio}%`);
  if (form.costo_min !== '') query = query.gte('costo_estimado', form.costo_min);
  if (form.costo_max !== '') query = query.lte('costo_estimado', form.costo_max);

  const { data } = await query;
  let destinos = data || [];
  if (form.search) {
    const s = form.search.toLowerCase();
    destinos = destinos.filter((d) =>
      [d.nombre, d.ubicacion, d.descripcion, d.departamento, d.municipio]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }
  if (form.rango) {
    destinos = destinos.filter((d) => (d.rango_edad || []).includes(form.rango));
  }

  destinos.sort((a, b) => {
    const as = a.departamento === 'San Miguel' ? 0 : 1;
    const bs = b.departamento === 'San Miguel' ? 0 : 1;
    return as - bs;
  });

  const { data: allDepto } = await supabase.from('destinos').select('departamento').eq('estado', true).not('departamento', 'is', null);
  const departamentos = [...new Set((allDepto || []).map((d) => d.departamento).filter(Boolean))].sort();

  const rates = await cargarTasas();
  const moneda = monedaGuardada();

  const cards =
    destinos.length === 0
      ? `<div class="mt-12 text-center py-10 rounded-3xl bg-white/5"><p class="text-gray-300 text-lg">${esc(t('destinations.no_results'))}</p></div>`
      : `<div class="mt-10 geo-masonry">${destinos
          .map(
            (d, i) => `
        <article class="geo-card" style="animation-delay:${i * 70}ms">
          <img src="${esc(destinoImagen(d.imagen))}" alt="${esc(tDb(d, 'nombre'))}">
          <div class="geo-card-body">
            <p class="text-sm font-semibold text-[#7dffa0]">${esc(tDb(d.categoria, 'nombre'))}</p>
            <h2 class="mt-1 text-2xl font-black text-white">${esc(tDb(d, 'nombre'))}</h2>
            <p class="mt-2 text-sm text-gray-400">${esc(tDb(d, 'ubicacion'))}</p>
            <div class="mt-3">${chipsEdad(d.rango_edad)}</div>
            <p class="mt-3 text-gray-200">${esc((tDb(d, 'descripcion') || '').slice(0, 140))}…</p>
            <p class="mt-3 text-sm font-bold text-[#f4a000]">${esc(formatearPrecio(d.costo_estimado, moneda, rates))}</p>
            <a href="#/destinos/${d.id}" data-link class="geo-open">${esc(t('home.view_details'))}</a>
          </div>
        </article>`,
          )
          .join('')}</div>`;

  root.innerHTML = `
    <div class="min-h-screen geo-territory">
      ${publicNav()}
      <main class="mx-auto max-w-7xl px-6 py-10">
        <p class="text-xs font-extrabold uppercase tracking-[0.2em] text-[#3ecf4c]">Territorio · San Miguel primero</p>
        <h1 class="mt-2 text-4xl font-black text-white">${esc(t('destinations.title'))}</h1>
        <p class="mt-2 text-gray-400 max-w-2xl">${esc(t('destinations.desc1'))} El mapa no es una grilla de alquileres: es el oriente leído por edad, clima y comunidad.</p>
        <form id="filtros" class="mt-8 geo-filters">
          <label>${esc(t('destinations.search'))}
            <input name="search" value="${esc(form.search)}">
          </label>
          <label>${esc(t('destinations.category'))}
            <select name="categoria_id">
              <option value="">${esc(t('destinations.all_categories'))}</option>
              ${categorias.map((c) => `<option value="${c.id}" ${String(form.categoria_id) === String(c.id) ? 'selected' : ''}>${esc(tDb(c, 'nombre'))}</option>`).join('')}
            </select>
          </label>
          <label>${esc(t('destinations.department'))}
            <select name="departamento">
              <option value="">${esc(t('destinations.all_departments'))}</option>
              ${departamentos.map((d) => `<option value="${esc(d)}" ${form.departamento === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
            </select>
          </label>
          <label>${esc(t('destinations.municipality'))}
            <input name="municipio" value="${esc(form.municipio)}">
          </label>
          <label>Rango de edad
            <select name="rango">
              <option value="">Todas las edades</option>
              ${RANGOS.map((r) => `<option value="${esc(r)}" ${form.rango === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}
            </select>
          </label>
          <label>${esc(t('destinations.min_cost'))}
            <input name="costo_min" type="number" min="0" step="0.01" value="${esc(form.costo_min)}">
          </label>
          <label>${esc(t('destinations.max_cost'))}
            <input name="costo_max" type="number" min="0" step="0.01" value="${esc(form.costo_max)}">
          </label>
          <label>${esc(t('destinations.show_currency'))}
            <select id="moneda">${opcionesMoneda(moneda)}</select>
          </label>
          <button type="button" id="limpiar" class="mt-6 rounded-2xl bg-white/10 px-6 py-2 text-sm font-semibold text-white">Limpiar</button>
        </form>
        <p id="conversion" class="mt-4 text-sm text-[#7dffa0] font-semibold"></p>
        ${cards}
      </main>
    </div>
  `;

  const formEl = root.querySelector('#filtros');
  let timeout;
  const apply = () => {
    const dataForm = new FormData(formEl);
    const q = new URLSearchParams();
    for (const [k, v] of dataForm.entries()) {
      if (v) q.set(k, v);
    }
    go(q.toString() ? `/destinos?${q}` : '/destinos');
  };
  formEl.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(apply, 350);
  });
  formEl.addEventListener('change', (e) => {
    if (e.target.id === 'moneda') {
      guardarMoneda(e.target.value);
      apply();
      return;
    }
    apply();
  });
  root.querySelector('#limpiar').addEventListener('click', () => go('/destinos'));

  const conversion = root.querySelector('#conversion');
  const code = root.querySelector('#moneda').value;
  if (form.costo_min && code !== 'USD') {
    conversion.textContent = `Costo mínimo ≈ ${formatearPrecio(form.costo_min, code, rates)}`;
  }
}
