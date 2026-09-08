import { supabase } from '../lib/supabase.js';
import { esc, tDb } from '../lib/html.js';
import { t } from '../lib/i18n.js';
import { publicNav } from '../lib/nav.js';

export async function render(root) {
  const { data } = await supabase.from('categorias').select('*, destinos:destinos(count)').eq('estado', true);
  const categorias = (data || []).map((c) => ({
    ...c,
    destinos_count: Array.isArray(c.destinos) ? c.destinos[0]?.count ?? 0 : 0,
  }));

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50 pb-20">
      ${publicNav()}
      <div class="bg-white py-16 sm:py-24 border-b border-gray-100 text-center px-6">
        <h2 class="text-sm font-bold text-[#0b6fb3] uppercase tracking-widest">${esc(t('categories.explore'))}</h2>
        <h1 class="mt-2 text-4xl font-extrabold text-gray-900">${esc(t('categories.title1'))} <span class="text-[#168a1a]">${esc(t('categories.title2'))}</span></h1>
        <p class="mt-6 text-lg text-gray-600 max-w-3xl mx-auto">${esc(t('categories.desc'))}</p>
      </div>
      <main class="mx-auto max-w-7xl px-6 py-12">
        <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          ${categorias
            .map(
              (c) => `
            <a href="#/destinos?categoria_id=${c.id}" data-link class="group flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 hover:-translate-y-2 hover:shadow-xl">
              <div class="p-8">
                <h2 class="text-xl font-bold text-gray-900 group-hover:text-[#0b6fb3]">${esc(tDb(c, 'nombre'))}</h2>
                <p class="mt-4 text-gray-600">${esc(tDb(c, 'descripcion'))}</p>
              </div>
              <div class="border-t border-gray-100 bg-gray-50 px-8 py-4 flex items-center justify-between">
                <span class="text-xs font-semibold text-[#168a1a]">${c.destinos_count} ${esc(t('categories.destinations'))}</span>
                <span class="text-sm font-medium text-[#0b6fb3]">${esc(t('categories.explore_btn'))} →</span>
              </div>
            </a>`,
            )
            .join('')}
        </div>
      </main>
    </div>
  `;
}
