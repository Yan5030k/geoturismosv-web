import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc, tDb } from '../lib/html.js';
import { t } from '../lib/i18n.js';
import { publicNav } from '../lib/nav.js';
import { go } from '../lib/router.js';

const currencies = [
  { code: 'USD', name: 'Dólar', symbol: '$' },
  { code: 'GTQ', name: 'Quetzal', symbol: 'Q' },
  { code: 'HNL', name: 'Lempira', symbol: 'L' },
  { code: 'NIO', name: 'Córdoba', symbol: 'C$' },
  { code: 'MXN', name: 'Peso mexicano', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
];

export async function render(root, route) {
  const form = {
    search: route.query.search || '',
    categoria_id: route.query.categoria_id || '',
    departamento: route.query.departamento || '',
    municipio: route.query.municipio || '',
    costo_min: route.query.costo_min || '',
    costo_max: route.query.costo_max || '',
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

  const { data: allDepto } = await supabase.from('destinos').select('departamento').eq('estado', true).not('departamento', 'is', null);
  const departamentos = [...new Set((allDepto || []).map((d) => d.departamento).filter(Boolean))].sort();

  let rates = {};
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const json = await res.json();
    rates = json?.rates || {};
  } catch {
    rates = {};
  }

  const cards =
    destinos.length === 0
      ? `<div class="mt-12 text-center py-10 bg-white rounded-xl shadow"><p class="text-gray-500 text-lg">${esc(t('destinations.no_results'))}</p></div>`
      : `<div class="mt-8 grid gap-6 md:grid-cols-3">${destinos
          .map(
            (d) => `
        <article class="overflow-hidden rounded-xl bg-white shadow hover:-translate-y-1 hover:shadow-lg">
          <img src="${esc(destinoImagen(d.imagen))}" alt="${esc(tDb(d, 'nombre'))}" class="h-48 w-full object-cover">
          <div class="p-5">
            <p class="text-sm font-semibold text-[#168a1a]">${esc(tDb(d.categoria, 'nombre'))}</p>
            <h2 class="mt-1 text-xl font-bold text-gray-900">${esc(tDb(d, 'nombre'))}</h2>
            <p class="mt-2 text-sm text-gray-600">${esc(tDb(d, 'ubicacion'))}</p>
            <p class="mt-3 text-gray-700">${esc((tDb(d, 'descripcion') || '').slice(0, 120))}...</p>
            <a href="#/destinos/${d.id}" data-link class="mt-4 inline-block rounded-full bg-[#0b6fb3] px-4 py-2 font-semibold text-white hover:bg-[#168a1a]">${esc(t('home.view_details'))}</a>
          </div>
        </article>`,
          )
          .join('')}</div>`;

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50">
      ${publicNav()}
      <main class="mx-auto max-w-7xl px-6 py-10">
        <h1 class="text-3xl font-bold text-gray-900">${esc(t('destinations.title'))}</h1>
        <p class="mt-2 text-gray-600">${esc(t('destinations.desc1'))}</p>
        <form id="filtros" class="mt-6 rounded-xl bg-white p-5 shadow grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <label class="block text-sm font-medium">${esc(t('destinations.search'))}
            <input name="search" value="${esc(form.search)}" class="mt-1 block w-full rounded-md border-gray-300">
          </label>
          <label class="block text-sm font-medium">${esc(t('destinations.category'))}
            <select name="categoria_id" class="mt-1 block w-full rounded-md border-gray-300">
              <option value="">${esc(t('destinations.all_categories'))}</option>
              ${categorias.map((c) => `<option value="${c.id}" ${String(form.categoria_id) === String(c.id) ? 'selected' : ''}>${esc(tDb(c, 'nombre'))}</option>`).join('')}
            </select>
          </label>
          <label class="block text-sm font-medium">${esc(t('destinations.department'))}
            <select name="departamento" class="mt-1 block w-full rounded-md border-gray-300">
              <option value="">${esc(t('destinations.all_departments'))}</option>
              ${departamentos.map((d) => `<option value="${esc(d)}" ${form.departamento === d ? 'selected' : ''}>${esc(d)}</option>`).join('')}
            </select>
          </label>
          <label class="block text-sm font-medium">${esc(t('destinations.municipality'))}
            <input name="municipio" value="${esc(form.municipio)}" class="mt-1 block w-full rounded-md border-gray-300">
          </label>
          <label class="text-xs font-medium text-gray-500">${esc(t('destinations.min_cost'))}
            <input name="costo_min" type="number" min="0" step="0.01" value="${esc(form.costo_min)}" class="mt-1 block w-full rounded-md border-gray-300">
          </label>
          <label class="text-xs font-medium text-gray-500">${esc(t('destinations.max_cost'))}
            <input name="costo_max" type="number" min="0" step="0.01" value="${esc(form.costo_max)}" class="mt-1 block w-full rounded-md border-gray-300">
          </label>
          <label class="text-xs font-medium text-[#0b6fb3]">${esc(t('destinations.show_currency'))}
            <select id="moneda" class="mt-1 block w-full rounded-md border-blue-200 bg-blue-50/50">
              ${currencies.map((c) => `<option value="${c.code}">${c.code} — ${esc(c.name)}</option>`).join('')}
            </select>
          </label>
          <button type="button" id="limpiar" class="mt-6 rounded-md bg-slate-100 px-6 py-2 text-sm font-semibold border">${esc(t('destinations.clear_filters'))}</button>
        </form>
        <p id="conversion" class="mt-3 text-sm text-[#0b6fb3] font-semibold"></p>
        ${cards}
      </main>
    </div>
  `;

  const formEl = root.querySelector('#filtros');
  let timeout;
  const apply = () => {
    const data = new FormData(formEl);
    const q = new URLSearchParams();
    for (const [k, v] of data.entries()) {
      if (v) q.set(k, v);
    }
    go(q.toString() ? `/destinos?${q}` : '/destinos');
  };
  formEl.addEventListener('input', () => {
    clearTimeout(timeout);
    timeout = setTimeout(apply, 350);
  });
  formEl.addEventListener('change', apply);
  root.querySelector('#limpiar').addEventListener('click', () => go('/destinos'));

  const moneda = root.querySelector('#moneda');
  const conversion = root.querySelector('#conversion');
  const updateConv = () => {
    const code = moneda.value;
    const min = formEl.costo_min.value;
    if (!min || code === 'USD' || !rates[code]) {
      conversion.textContent = '';
      return;
    }
    const cur = currencies.find((c) => c.code === code);
    conversion.textContent = `≈ ${cur.symbol}${(Number(min) * rates[code]).toFixed(2)} ${code}`;
  };
  moneda.addEventListener('change', updateConv);
}
