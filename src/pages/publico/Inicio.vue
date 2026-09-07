<script setup>
import { onMounted, ref, nextTick } from 'vue';
import { RouterLink } from 'vue-router';
import PublicNavbar from '@/components/PublicNavbar.vue';
import { useDbTranslation } from '@/composables/useDbTranslation';
import { supabase } from '@/lib/supabase';
import { asset, destinoImagen } from '@/lib/imagen';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

const { tDb } = useDbTranslation();
const destinos = ref([]);
const todosLosDestinos = ref([]);
const map = ref(null);

onMounted(async () => {
  const { data: destacados } = await supabase
    .from('destinos')
    .select('*, categoria:categorias(*)')
    .eq('estado', true)
    .order('created_at', { ascending: false })
    .limit(3);

  destinos.value = destacados || [];

  const { data: todos } = await supabase
    .from('destinos')
    .select('id, nombre, nombre_en, latitud, longitud, imagen, categoria_id, categoria:categorias(id, nombre, nombre_en)')
    .eq('estado', true);

  todosLosDestinos.value = todos || [];

  await nextTick();

  map.value = L.map('map').setView([13.6929, -88.8181], 8);
  L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
  }).addTo(map.value);

  todosLosDestinos.value.forEach((destino) => {
    if (!destino.latitud || !destino.longitud) return;
    const lat = parseFloat(destino.latitud);
    const lng = parseFloat(destino.longitud);
    if (Number.isNaN(lat) || Number.isNaN(lng)) return;

    const marker = L.marker([lat, lng]).addTo(map.value);
    const imageUrl = destinoImagen(destino.imagen);
    const title = tDb(destino, 'nombre');
    marker.bindPopup(`
      <div class="text-center p-2 min-w-[200px]">
        <img src="${imageUrl}" alt="${title}" class="w-full h-32 object-cover rounded-lg mb-2">
        <h4 class="font-bold text-gray-900 text-lg mb-2">${title}</h4>
        <a href="#/destinos/${destino.id}" class="inline-block bg-[#168a1a] text-white px-4 py-2 rounded-full text-sm font-semibold hover:bg-green-700 transition-colors" style="text-decoration:none;">
          Ver Detalles
        </a>
      </div>
    `);
  });
});
</script>

<template>
  <div class="min-h-screen bg-gray-100 dark:bg-gray-900 transition-colors duration-300">
    <PublicNavbar />

    <main>
      <section class="relative bg-gray-900 py-24 lg:py-32 overflow-hidden">
        <div class="absolute inset-0">
          <img :src="asset('images/hero.png')" alt="Paisaje El Salvador" class="h-full w-full object-cover opacity-40">
        </div>
        <div class="relative mx-auto max-w-7xl px-6 text-center lg:text-left">
          <h2 class="mb-4 text-5xl font-black tracking-tight text-white sm:text-6xl lg:text-7xl">
            {{ $t('home.hero1') }} <br class="hidden lg:block"/>
            <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#168a1a] to-green-400">
              {{ $t('home.hero2') }}
            </span>
          </h2>
          <p class="mx-auto lg:mx-0 max-w-2xl text-lg text-gray-300 sm:text-xl leading-relaxed">
            <strong class="font-semibold text-white">{{ $t('home.subtitle_strong') }}</strong>
            {{ $t('home.subtitle') }}
          </p>
          <div class="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
            <RouterLink to="/destinos" class="rounded-full bg-gradient-to-r from-[#168a1a] to-green-500 px-8 py-4 font-bold text-white shadow-lg transition-transform duration-300 hover:scale-105 hover:shadow-green-500/30">
              {{ $t('home.explore') }}
            </RouterLink>
            <RouterLink to="/register" class="rounded-full border-2 border-white/80 bg-white/10 px-8 py-4 font-bold text-white backdrop-blur-sm transition-all duration-300 hover:bg-white hover:text-gray-900">
              {{ $t('home.register') }}
            </RouterLink>
          </div>
        </div>
      </section>

      <section class="py-12">
        <div class="mx-auto max-w-7xl px-6">
          <h3 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white">{{ $t('home.featured') }}</h3>
          <div class="grid gap-6 md:grid-cols-3">
            <article
              v-for="destino in destinos"
              :key="destino.id"
              class="group overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-md transition-all duration-300 hover:-translate-y-2 hover:shadow-xl dark:shadow-gray-900/50"
            >
              <div class="overflow-hidden">
                <img :src="destinoImagen(destino.imagen)" :alt="destino.nombre" class="h-56 w-full object-cover transition-transform duration-500 group-hover:scale-110">
              </div>
              <div class="p-6">
                <span class="inline-block rounded-full bg-green-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-[#168a1a]">
                  {{ tDb(destino.categoria, 'nombre') }}
                </span>
                <h4 class="mt-3 text-2xl font-bold text-gray-900 dark:text-white group-hover:text-[#0b6fb3] dark:group-hover:text-[#3da0e6] transition-colors">
                  {{ tDb(destino, 'nombre') }}
                </h4>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                  {{ tDb(destino, 'ubicacion') }}
                </p>
                <RouterLink :to="`/destinos/${destino.id}`" class="mt-5 inline-flex items-center font-semibold text-[#0b6fb3] dark:text-[#3da0e6] hover:underline">
                  {{ $t('home.view_details') }}
                </RouterLink>
              </div>
            </article>
          </div>
        </div>
      </section>

      <section class="py-12 bg-gray-50 dark:bg-gray-800 transition-colors duration-300">
        <div class="mx-auto max-w-7xl px-6">
          <h3 class="mb-6 text-2xl font-bold text-gray-900 dark:text-white text-center">Explora El Salvador en el Mapa</h3>
          <p class="text-center text-gray-600 dark:text-gray-300 mb-8 max-w-2xl mx-auto">
            Descubre todos nuestros increíbles destinos turísticos ubicados a lo largo y ancho del país. Haz clic en un marcador para ver más detalles.
          </p>
          <div id="map" class="h-[600px] w-full rounded-2xl shadow-2xl z-0 relative border-4 border-white dark:border-gray-700"></div>
        </div>
      </section>
    </main>

    <footer class="bg-gray-900 dark:bg-black py-8 text-center text-gray-400">
      <div class="mx-auto max-w-7xl px-6">
        <p>{{ $t('home.footer') }}</p>
      </div>
    </footer>
  </div>
</template>
