import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc } from '../lib/html.js';
import { t } from '../lib/i18n.js';
import { publicNav } from '../lib/nav.js';
import { go } from '../lib/router.js';
import { cargarTasas, formatearPrecio, guardarMoneda, monedaGuardada, opcionesMoneda } from '../lib/monedas.js';

const REDES = {
  facebook: 'Facebook',
  instagram: 'Instagram',
  whatsapp: 'WhatsApp',
  tiktok: 'TikTok',
  sitio: 'Sitio web',
};

function apoyarHtml(redes) {
  const entradas = Object.entries(redes || {}).filter(([, url]) => url);
  if (!entradas.length) return '';
  return `<div class="mt-3 flex flex-wrap gap-2">${entradas
    .map(
      ([red, url]) =>
        `<a href="${esc(url)}" target="_blank" rel="noopener" class="rounded-full bg-[#e7f3eb] px-3 py-1 text-xs font-bold text-[#168a1a] dark:bg-green-900/40 dark:text-green-300">${esc(REDES[red] || red)}</a>`,
    )
    .join('')}</div>`;
}

export async function render(root, route) {
  const form = {
    search: route.query.search || '',
    departamento: route.query.departamento || '',
    rubro: route.query.rubro || '',
  };

  const [{ data }, rates] = await Promise.all([
    supabase
      .from('emprendimientos')
      .select('*, destino:destinos(id, nombre, imagen, departamento, municipio)')
      .order('nombre'),
    cargarTasas(),
  ]);

  let comercios = data || [];
  const departamentos = [...new Set(comercios.map((c) => c.destino?.departamento).filter(Boolean))].sort();
  const rubros = [...new Set(comercios.flatMap((c) => c.keywords || []))].sort();

  if (form.departamento) {
    comercios = comercios.filter((c) => c.destino?.departamento === form.departamento);
  }
  if (form.rubro) {
    comercios = comercios.filter((c) => (c.keywords || []).includes(form.rubro));
  }
  if (form.search) {
    const s = form.search.toLowerCase();
    comercios = comercios.filter((c) =>
      [c.nombre, c.descripcion, c.destino?.nombre, c.destino?.municipio, ...(c.keywords || [])]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }

  const moneda = monedaGuardada();

  const cards = comercios.length
    ? `<div class="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">${comercios
        .map(
          (c) => `
        <article class="flex flex-col overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md hover:-translate-y-1 hover:shadow-xl transition">
          <img src="${esc(c.logo_url || destinoImagen(c.destino?.imagen))}" alt="${esc(c.nombre)}" class="h-44 w-full object-cover">
          <div class="flex flex-1 flex-col p-5">
            <p class="text-xs font-bold uppercase tracking-widest text-[#168a1a]">${esc(c.destino?.departamento || 'El Salvador')}</p>
            <h2 class="mt-1 text-lg font-bold text-gray-900 dark:text-white">${esc(c.nombre)}</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">${esc(c.destino?.municipio || c.destino?.nombre || '')}</p>
            <p class="mt-3 flex-1 text-sm text-gray-700 dark:text-gray-300">${esc(c.descripcion)}</p>
            <div class="mt-3">${(c.keywords || []).map((k) => `<span class="geo-chip">${esc(k)}</span>`).join('')}</div>
            <p class="mt-3 text-sm font-bold text-[#0b6fb3] geo-precio" data-precio-usd="${esc(c.costo_estimado ?? 0)}">${esc(formatearPrecio(c.costo_estimado, moneda, rates))}</p>
            ${apoyarHtml(c.redes_sociales)}
            ${
              c.destino?.id
                ? `<a href="#/destinos/${c.destino.id}" data-link class="mt-4 inline-block font-semibold text-[#0b6fb3] hover:underline">${esc(t('ventures.see_place'))} ${esc(c.destino.nombre)}</a>`
                : ''
            }
          </div>
        </article>`,
        )
        .join('')}</div>`
    : `<div class="mt-12 rounded-2xl bg-white dark:bg-gray-800 py-10 text-center shadow"><p class="text-lg text-gray-500 dark:text-gray-300">${esc(t('ventures.no_results'))}</p></div>`;

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-gray-900">
      ${publicNav()}
      <main class="mx-auto max-w-7xl px-6 py-10">
        <h1 class="text-3xl font-bold text-gray-900 dark:text-white">${esc(t('ventures.title'))}</h1>
        <p class="mt-2 max-w-3xl text-gray-600 dark:text-gray-300">${esc(t('ventures.desc'))}</p>
        <p class="mt-3 text-sm font-semibold text-[#168a1a]">${comercios.length} ${esc(t('ventures.count'))}</p>
        <form id="filtros" class="mt-6 geo-filters">
          <label class="geo-filter-search">${esc(t('ventures.search'))}
            <input name="search" value="${esc(form.search)}">
          </label>
          <label>${esc(t('destinations.department'))}
            <select name="departamento">
              <option value="">${esc(t('destinations.all_departments'))}</option>
              ${departamentos.map((d) => `<option value="${esc(d)}" ${form.departamento === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
            </select>
          </label>
          <label>${esc(t('ventures.trade'))}
            <select name="rubro">
              <option value="">${esc(t('ventures.all_trades'))}</option>
              ${rubros.map((r) => `<option value="${esc(r)}" ${form.rubro === r ? 'selected' : ''}>${esc(r)}</option>`).join('')}
            </select>
          </label>
          <label>${esc(t('destinations.show_currency'))}
            <select id="moneda">${opcionesMoneda(moneda)}</select>
          </label>
          <div class="geo-filter-actions flex items-end">
            <button type="button" id="limpiar" class="rounded-md bg-slate-100 dark:bg-gray-700 px-6 py-2.5 text-sm font-semibold text-gray-800 dark:text-white border dark:border-gray-600">${esc(t('destinations.clear_filters'))}</button>
          </div>
        </form>
        <p id="conversion" class="mt-3 text-sm font-semibold text-[#0b6fb3]"></p>
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
    conversion.textContent = code === 'USD' ? '' : `1 USD ≈ ${formatearPrecio(1, code, rates)}`;
  };

  const apply = () => {
    const q = new URLSearchParams();
    for (const [k, v] of new FormData(formEl).entries()) {
      if (v) q.set(k, v);
    }
    go(q.toString() ? `/emprendimientos?${q}` : '/emprendimientos');
  };

  formEl.addEventListener('input', (e) => {
    if (e.target.id === 'moneda') return;
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
    if (!location.hash.includes('?')) {
      formEl.reset();
      monedaEl.value = 'USD';
      pintarMoneda('USD');
      return;
    }
    go('/emprendimientos');
  });

  pintarMoneda(moneda);
}
