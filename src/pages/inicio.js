import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { supabase } from '../lib/supabase.js';
import { asset, destinoImagen } from '../lib/imagen.js';
import { esc, tDb } from '../lib/html.js';
import { t } from '../lib/i18n.js';
import { publicNav } from '../lib/nav.js';
import { geoPin, popupDestino } from '../lib/mapa.js';

export async function render(root) {
  const [{ data: destacados }, { data: todos }] = await Promise.all([
    supabase.from('destinos').select('*, categoria:categorias(*)').eq('estado', true).order('created_at', { ascending: false }).limit(3),
    supabase.from('destinos').select('id, nombre, nombre_en, latitud, longitud, imagen, categoria:categorias(nombre, nombre_en)').eq('estado', true),
  ]);

  const cards = (destacados || [])
    .map(
      (d, i) => `
      <article class="geo-card" style="animation-delay:${i * 90}ms">
        <img src="${esc(destinoImagen(d.imagen))}" alt="${esc(tDb(d, 'nombre'))}">
        <div class="geo-card-body">
          <span class="geo-chip">${esc(tDb(d.categoria, 'nombre'))}</span>
          <h4 class="mt-3 text-2xl font-black text-white">${esc(tDb(d, 'nombre'))}</h4>
          <p class="mt-2 text-sm text-gray-400">${esc(tDb(d, 'ubicacion'))}</p>
          <a href="#/destinos/${d.id}" data-link class="geo-open">${esc(t('home.view_details'))}</a>
        </div>
      </article>`,
    )
    .join('');

  root.innerHTML = `
    <div class="min-h-screen bg-gray-100 dark:bg-gray-900">
      ${publicNav()}
      <main>
        <section class="relative bg-gray-900 py-24 lg:py-32 overflow-hidden">
          <div class="absolute inset-0">
            <img src="${asset('images/hero.png')}" alt="Paisaje El Salvador" class="h-full w-full object-cover opacity-40">
          </div>
          <div class="relative mx-auto max-w-7xl px-6 text-center lg:text-left">
            <h2 class="mb-4 text-5xl font-black tracking-tight text-white sm:text-6xl">
              ${esc(t('home.hero1'))}<br>
              <span class="text-[#3ecf4c]">${esc(t('home.hero2'))}</span>
            </h2>
            <p class="max-w-2xl text-lg text-gray-300">
              <strong class="text-white">${esc(t('home.subtitle_strong'))}</strong>
              ${esc(t('home.subtitle'))}
            </p>
            <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <a href="#/destinos" data-link class="rounded-full bg-[#168a1a] px-8 py-4 font-bold text-white shadow-lg hover:bg-green-700">${esc(t('home.explore'))}</a>
              <a href="#/entrar?tab=cuenta" data-link class="rounded-full border-2 border-white/80 bg-white/10 px-8 py-4 font-bold text-white hover:bg-white hover:text-gray-900">${esc(t('home.register'))}</a>
            </div>
          </div>
        </section>
        <section class="py-12 geo-territory">
          <div class="mx-auto max-w-7xl px-6">
            <h3 class="mb-6 text-2xl font-black text-white">${esc(t('home.featured'))}</h3>
            <div class="geo-masonry">${cards}</div>
          </div>
        </section>
        <section class="py-12 geo-territory">
          <div class="mx-auto max-w-7xl px-6">
            <h3 class="mb-2 text-2xl font-black text-center text-white">Explora El Salvador en el mapa</h3>
            <p class="text-center text-gray-400 mb-4 max-w-2xl mx-auto">Haz clic en un marcador para ver el destino. San Miguel es el territorio del pitch.</p>
            <p class="text-center mb-8"><a href="#/rutas" data-link class="geo-open">Ver rutas sugeridas del oriente</a></p>
            <div id="map" class="h-[600px] w-full rounded-2xl border border-white/10"></div>
          </div>
        </section>
      </main>
      <footer class="bg-gray-900 py-8 text-center text-gray-400">${esc(t('home.footer'))}</footer>
    </div>
  `;

  const map = L.map('map').setView([13.6929, -88.8181], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; OpenStreetMap',
  }).addTo(map);

  (todos || []).forEach((destino) => {
    const lat = parseFloat(destino.latitud);
    const lng = parseFloat(destino.longitud);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;
    const title = esc(tDb(destino, 'nombre'));
    L.marker([lat, lng], { icon: geoPin, title: tDb(destino, 'nombre') })
      .addTo(map)
      .bindPopup(
        popupDestino({
          id: destino.id,
          title,
          imageUrl: esc(destinoImagen(destino.imagen)),
        }),
        { closeButton: true, maxWidth: 260 },
      );
  });

  setTimeout(() => map.invalidateSize(), 80);

  return () => {
    map.remove();
  };
}
