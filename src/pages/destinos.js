import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc, tDb } from '../lib/html.js';
import { t } from '../lib/i18n.js';
import { publicNav } from '../lib/nav.js';
import { go } from '../lib/router.js';
import { DEPARTAMENTOS } from '../lib/departamentos.js';
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

  let query = supabase.from('destinos').select('*, categoria:categorias(*)').eq('estado', true).order('nombre');
  if (form.categoria_id) query = query.eq('categoria_id', form.categoria_id);
  if (form.municipio) query = query.ilike('municipio', `%${form.municipio}%`);
  if (form.costo_min !== '') query = query.gte('costo_estimado', form.costo_min);
  if (form.costo_max !== '') query = query.lte('costo_estimado', form.costo_max);

  const { data } = await query;
  let destinos = data || [];
  if (form.departamento) {
    const depto = form.departamento.toLowerCase();
    destinos = destinos.filter((d) =>
      [d.departamento, d.ubicacion]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(depto)),
    );
  }
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

  const departamentos = DEPARTAMENTOS;

  const rates = await cargarTasas();
  const moneda = monedaGuardada();

  const cards =
    destinos.length === 0
      ? `<div class="mt-12 text-center py-10 rounded-2xl bg-white dark:bg-gray-800 shadow"><p class="text-gray-500 dark:text-gray-300 text-lg">${esc(t('destinations.no_results'))}</p></div>`
      : `<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${destinos
          .map(
            (d) => `
        <article class="overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:-translate-y-1 hover:shadow-xl transition">
          <img src="${esc(destinoImagen(d.imagen))}" alt="${esc(tDb(d, 'nombre'))}" class="h-48 w-full object-cover">
          <div class="p-5">
            <p class="text-sm font-semibold text-[#168a1a]">${esc(tDb(d.categoria, 'nombre'))}</p>
            <h2 class="mt-1 text-xl font-bold text-gray-900 dark:text-white">${esc(tDb(d, 'nombre'))}</h2>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">${esc(tDb(d, 'ubicacion'))}</p>
            <div class="mt-3">${chipsEdad(d.rango_edad)}</div>
            <p class="mt-3 text-gray-700 dark:text-gray-300">${esc((tDb(d, 'descripcion') || '').slice(0, 120))}…</p>
            <p class="mt-3 text-sm font-bold text-[#0b6fb3] geo-precio" data-precio-usd="${esc(d.costo_estimado ?? 0)}">${esc(formatearPrecio(d.costo_estimado, moneda, rates))}</p>
            <a href="#/destinos/${d.id}" data-link class="mt-4 inline-block rounded-full bg-[#0b6fb3] px-4 py-2 font-semibold text-white hover:bg-[#168a1a]">${esc(t('home.view_details'))}</a>
          </div>
        </article>`,
          )
          .join('')}</div>`;

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-gray-900">
      ${publicNav()}
      <main class="mx-auto max-w-7xl px-6 py-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">${esc(t('destinations.title'))}</h1>
        <p class="mt-2 text-gray-600 dark:text-gray-300">${esc(t('destinations.desc1'))}</p>
        <form id="filtros" class="mt-6 geo-filters">
          <label class="geo-filter-search">${esc(t('destinations.search'))}
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
          <div class="geo-filter-actions flex items-end">
            <button type="button" id="limpiar" class="rounded-md bg-slate-100 dark:bg-gray-700 px-6 py-2.5 text-sm font-semibold text-gray-800 dark:text-white border dark:border-gray-600">${esc(t('destinations.clear_filters'))}</button>
          </div>
        </form>
        <p id="conversion" class="mt-3 text-sm text-[#0b6fb3] font-semibold"></p>
        ${cards}
      </main>
    </div>
  `;

  const formEl = root.querySelector('#filtros');
  const monedaEl = root.querySelector('#moneda');
  const conversion = root.querySelector('#conversion');
  let timeout;

  const pintarMoneda = (code) => {
    root.querySelectorAll('[data-precio-usd]').forEach((el) => {
      el.textContent = formatearPrecio(el.dataset.precioUsd, code, rates);
    });
    const min = formEl.querySelector('[name="costo_min"]').value;
    const max = formEl.querySelector('[name="costo_max"]').value;
    const bits = [];
    if (code !== 'USD') bits.push(`1 USD ≈ ${formatearPrecio(1, code, rates)}`);
    if (min !== '') bits.push(`mínimo ${formatearPrecio(min, code, rates)}`);
    if (max !== '') bits.push(`máximo ${formatearPrecio(max, code, rates)}`);
    conversion.textContent = bits.join(' · ');
  };

  const apply = () => {
    const dataForm = new FormData(formEl);
    const q = new URLSearchParams();
    for (const [k, v] of dataForm.entries()) {
      if (v) q.set(k, v);
    }
    go(q.toString() ? `/destinos?${q}` : '/destinos');
  };

  formEl.addEventListener('input', (e) => {
    if (e.target.id === 'moneda') return;
    if (e.target.name === 'costo_min' || e.target.name === 'costo_max') {
      pintarMoneda(monedaEl.value);
    }
    clearTimeout(timeout);
    timeout = setTimeout(apply, 350);
  });
  formEl.addEventListener('change', (e) => {
    if (e.target.id === 'moneda') {
      guardarMoneda(e.target.value);
      pintarMoneda(e.target.value);
      return;
    }
    apply();
  });
  root.querySelector('#limpiar').addEventListener('click', () => {
    guardarMoneda('USD');
    const actual = (location.hash.replace(/^#/, '') || '/destinos').split('?')[0] || '/destinos';
    if (actual === '/destinos' && !location.hash.includes('?')) {
      monedaEl.value = 'USD';
      formEl.reset();
      monedaEl.value = 'USD';
      pintarMoneda('USD');
      return;
    }
    go('/destinos');
  });

  pintarMoneda(moneda);
}
