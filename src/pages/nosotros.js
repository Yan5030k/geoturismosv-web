import { asset } from '../lib/imagen.js';
import { esc } from '../lib/html.js';
import { t } from '../lib/i18n.js';
import { publicNav } from '../lib/nav.js';
import { EQUIPO, iniciales } from '../data/equipo.js';

const acentos = ['#0b6fb3', '#168a1a', '#f4a000', '#0b3d5c'];

export async function render(root) {
  root.innerHTML = `
    <div class="min-h-screen bg-gray-50">
      ${publicNav()}
      <section class="relative bg-gray-900 py-20 sm:py-28 overflow-hidden">
        <img src="${asset('images/playa_hero.png')}" alt="" class="absolute inset-0 h-full w-full object-cover opacity-30">
        <div class="relative mx-auto max-w-5xl px-6 text-center">
          <h1 class="text-4xl font-black text-white sm:text-5xl">${esc(t('about.title'))}</h1>
          <p class="mt-4 text-lg text-gray-200">${esc(t('about.subtitle'))}</p>
        </div>
      </section>
      <main class="relative z-10 mx-auto max-w-4xl px-6 pb-16 -mt-12">
        <section class="overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div class="h-2 bg-gradient-to-r from-[#0b6fb3] via-[#1690c8] to-[#168a1a]"></div>
          <div class="p-8 sm:p-12 space-y-6 text-lg leading-relaxed text-gray-700">
            <p><strong>GeoTurismoSV</strong> ${esc(t('about.p1'))}</p>
            <p>${esc(t('about.p2'))}</p>
            <p>${esc(t('about.p3'))}</p>
          </div>
        </section>
        <section class="mt-10 overflow-hidden rounded-2xl bg-white shadow-2xl ring-1 ring-black/5">
          <div class="h-2 bg-gradient-to-r from-[#168a1a] via-[#f4a000] to-[#0b6fb3]"></div>
          <div class="p-8 sm:p-12">
            <h2 class="text-2xl font-black text-gray-900">${esc(t('about.team'))}</h2>
            <p class="mt-1 text-gray-500">${esc(t('about.team_sub'))}</p>
            <ul class="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              ${EQUIPO.map(
                (nombre, i) => `
                <li class="flex items-center gap-3 rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <span class="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold text-white" style="background:${acentos[i % acentos.length]}">${esc(iniciales(nombre))}</span>
                  <span class="text-sm font-semibold leading-snug text-gray-800">${esc(nombre)}</span>
                </li>`,
              ).join('')}
            </ul>
          </div>
        </section>
      </main>
    </div>
  `;
}
