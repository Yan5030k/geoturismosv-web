<script setup>
import { onMounted, onUnmounted, ref } from 'vue';
import { RouterLink, useRoute } from 'vue-router';
import PublicNavbar from '@/components/PublicNavbar.vue';
import { useDbTranslation } from '@/composables/useDbTranslation';
import { useI18n } from 'vue-i18n';
import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/lib/supabase';
import { destinoImagen } from '@/lib/imagen';

const { tDb } = useDbTranslation();
const { locale } = useI18n();
const { isLoggedIn, user } = useAuth();
const route = useRoute();

const destino = ref(null);
const esFavorito = ref(false);
const clima = ref(null);
const cargandoClima = ref(true);
const noEncontrado = ref(false);
const estaReproduciendo = ref(false);
let synth = null;
let utterance = null;

const obtenerIconoClima = (codigo) => {
  if (codigo === 0) return '☀️ Despejado';
  if (codigo >= 1 && codigo <= 3) return '⛅ Parcialmente nublado';
  if (codigo >= 45 && codigo <= 48) return '🌫️ Niebla';
  if (codigo >= 51 && codigo <= 67) return '🌧️ Lluvia';
  if (codigo >= 71 && codigo <= 77) return '❄️ Nieve';
  if (codigo >= 80 && codigo <= 82) return '🌦️ Chubascos';
  if (codigo >= 95) return '⛈️ Tormenta';
  return '🌥️ Nublado';
};

async function cargarFavorito() {
  if (!user.value || !destino.value) {
    esFavorito.value = false;
    return;
  }
  const { data } = await supabase
    .from('favoritos')
    .select('id')
    .eq('user_id', user.value.id)
    .eq('destino_id', destino.value.id)
    .maybeSingle();
  esFavorito.value = Boolean(data);
}

const guardarFavorito = async () => {
  await supabase.from('favoritos').insert({ user_id: user.value.id, destino_id: destino.value.id });
  esFavorito.value = true;
};

const eliminarFavorito = async () => {
  await supabase.from('favoritos').delete().eq('user_id', user.value.id).eq('destino_id', destino.value.id);
  esFavorito.value = false;
};

const alternarReproduccion = () => {
  if (!synth || !destino.value) return;
  if (estaReproduciendo.value) {
    synth.cancel();
    estaReproduciendo.value = false;
    return;
  }

  let texto = tDb(destino.value, 'descripcion');
  if (!texto) return;

  const depto = destino.value.departamento;
  const muni = destino.value.municipio;
  if (depto || muni) {
    if (locale.value === 'en') {
      if (depto && muni) texto += ` It is located in the department of ${depto}, municipality of ${muni}.`;
      else if (depto) texto += ` It is located in the department of ${depto}.`;
      else texto += ` It is located in the municipality of ${muni}.`;
    } else if (depto && muni) texto += ` Se encuentra ubicado en el departamento de ${depto}, municipio de ${muni}.`;
    else if (depto) texto += ` Se encuentra ubicado en el departamento de ${depto}.`;
    else texto += ` Se encuentra ubicado en el municipio de ${muni}.`;
  }

  utterance = new SpeechSynthesisUtterance(texto);
  utterance.lang = locale.value === 'en' ? 'en-US' : 'es-ES';
  utterance.rate = 0.95;
  const voices = synth.getVoices();
  const preferredVoice = voices.find((v) => v.lang.startsWith(locale.value));
  if (preferredVoice) utterance.voice = preferredVoice;
  utterance.onend = () => { estaReproduciendo.value = false; };
  utterance.onerror = () => { estaReproduciendo.value = false; };
  estaReproduciendo.value = true;
  synth.speak(utterance);
};

onMounted(async () => {
  if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
    synth = window.speechSynthesis;
    synth.getVoices();
  }

  const { data, error } = await supabase
    .from('destinos')
    .select('*, categoria:categorias(*)')
    .eq('id', route.params.id)
    .eq('estado', true)
    .maybeSingle();

  if (error || !data) {
    noEncontrado.value = true;
    cargandoClima.value = false;
    return;
  }

  destino.value = data;
  await cargarFavorito();

  try {
    let lat = data.latitud;
    let lon = data.longitud;
    if (!lat || !lon) {
      const query = encodeURIComponent(`${data.nombre}, El Salvador`);
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=es&format=json`);
      const geoData = await geoRes.json();
      if (geoData.results?.length) {
        lat = geoData.results[0].latitude;
        lon = geoData.results[0].longitude;
      } else {
        lat = 13.6929;
        lon = -89.2182;
      }
    }
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const weatherData = await weatherRes.json();
    if (weatherData.current_weather) clima.value = weatherData.current_weather;
  } catch (e) {
    console.error('Error al obtener el clima:', e);
  } finally {
    cargandoClima.value = false;
  }
});

onUnmounted(() => {
  if (synth && estaReproduciendo.value) synth.cancel();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <PublicNavbar />
    <main class="mx-auto max-w-5xl px-6 py-10">
      <RouterLink to="/destinos" class="font-semibold text-[#0b6fb3] hover:text-[#168a1a]">{{ $t('detail.back') }}</RouterLink>

      <div v-if="noEncontrado" class="mt-8 rounded-xl bg-white p-8 shadow">Destino no encontrado.</div>

      <article v-else-if="destino" class="mt-6 overflow-hidden rounded-xl bg-white shadow-lg">
        <div class="relative">
          <img :src="destinoImagen(destino.imagen)" :alt="destino.nombre" class="h-96 w-full object-cover">
          <div class="absolute bottom-6 right-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 p-5 shadow-2xl">
            <div v-if="cargandoClima" class="flex items-center gap-3 text-white/90 text-sm font-medium">{{ $t('detail.weather_loading') }}</div>
            <div v-else-if="clima" class="flex items-center gap-4">
              <div class="text-5xl drop-shadow-lg">{{ obtenerIconoClima(clima.weathercode).split(' ')[0] }}</div>
              <div>
                <p class="text-4xl font-black text-white drop-shadow-md tracking-tight">{{ clima.temperature }}°C</p>
                <p class="text-sm font-medium text-white/90 capitalize drop-shadow-sm">{{ obtenerIconoClima(clima.weathercode).split(' ').slice(1).join(' ') }}</p>
              </div>
            </div>
          </div>
        </div>

        <div class="p-8">
          <p class="font-semibold text-[#168a1a]">{{ tDb(destino.categoria, 'nombre') }}</p>
          <h1 class="mt-2 text-4xl font-bold text-gray-900">{{ tDb(destino, 'nombre') }}</h1>
          <p class="mt-2 text-gray-600">{{ tDb(destino, 'ubicacion') }}</p>

          <div class="mt-6 grid gap-4 md:grid-cols-3">
            <div class="rounded-xl bg-blue-50 p-4">
              <strong class="text-[#0b6fb3]">{{ $t('detail.cost') }}</strong>
              <p class="mt-1 text-gray-700">${{ destino.costo_estimado }}</p>
            </div>
            <div class="rounded-xl bg-green-50 p-4">
              <strong class="text-[#168a1a]">{{ $t('detail.hours') }}</strong>
              <p class="mt-1 text-gray-700">{{ tDb(destino, 'dias_atencion') || tDb(destino, 'horario') || $t('detail.hours_unspecified') }}</p>
              <p class="text-gray-700">
                <span v-if="destino.hora_apertura && destino.hora_cierre">{{ destino.hora_apertura }} - {{ destino.hora_cierre }}</span>
                <span v-else>{{ $t('detail.time_unspecified') }}</span>
              </p>
            </div>
            <div class="rounded-xl bg-orange-50 p-4">
              <strong class="text-[#f4a000]">{{ $t('detail.status') }}</strong>
              <p class="mt-1 text-gray-700">{{ destino.estado ? $t('detail.available') : $t('detail.unavailable') }}</p>
            </div>
          </div>

          <section class="mt-8">
            <div class="flex items-center justify-between">
              <h2 class="text-2xl font-bold text-gray-900">{{ $t('detail.description') }}</h2>
              <button @click="alternarReproduccion" class="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold shadow-sm" :class="estaReproduciendo ? 'bg-red-100 text-red-700' : 'bg-[#e7f3eb] text-[#168a1a]'">
                {{ estaReproduciendo ? $t('detail.stop_listening') : $t('detail.listen') }}
              </button>
            </div>
            <p class="mt-4 leading-relaxed text-gray-700 whitespace-pre-wrap">{{ tDb(destino, 'descripcion') }}</p>
          </section>

          <section class="mt-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ $t('detail.location') }}</h2>
            <div class="mt-3 grid gap-4 md:grid-cols-2">
              <div class="rounded-xl bg-blue-50 p-4">
                <strong class="text-[#0b6fb3]">{{ $t('detail.department') }}</strong>
                <p class="mt-1 text-gray-700">{{ destino.departamento ?? $t('detail.unspecified') }}</p>
              </div>
              <div class="rounded-xl bg-green-50 p-4">
                <strong class="text-[#168a1a]">{{ $t('detail.municipality') }}</strong>
                <p class="mt-1 text-gray-700">{{ destino.municipio ?? $t('detail.unspecified') }}</p>
              </div>
            </div>
            <div class="mt-4 rounded-xl bg-slate-100 p-4">
              <strong class="text-gray-900">{{ $t('detail.address') }}</strong>
              <p class="mt-1 leading-relaxed text-gray-700">{{ tDb(destino, 'direccion') || $t('detail.address_unspecified') }}</p>
            </div>
            <div v-if="destino.latitud && destino.longitud" class="mt-6">
              <a :href="`https://www.google.com/maps/dir/?api=1&destination=${destino.latitud},${destino.longitud}`" target="_blank" rel="noopener noreferrer" class="inline-flex items-center gap-2 rounded-xl bg-[#4285F4] px-6 py-3 font-semibold text-white shadow-md hover:bg-[#3367D6]">
                {{ $t('detail.google_maps') }}
              </a>
            </div>
          </section>

          <section class="mt-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ $t('detail.contact_info') }}</h2>
            <div class="mt-3 grid gap-4 md:grid-cols-3">
              <div class="rounded-xl bg-blue-50 p-4">
                <strong class="text-[#0b6fb3]">{{ $t('detail.contact') }}</strong>
                <p class="mt-1 text-gray-700">{{ tDb(destino, 'contacto') || $t('detail.unspecified') }}</p>
              </div>
              <div class="rounded-xl bg-green-50 p-4">
                <strong class="text-[#168a1a]">{{ $t('detail.phone') }}</strong>
                <p class="mt-1 text-gray-700">{{ destino.telefono ?? $t('detail.unspecified') }}</p>
              </div>
              <div class="rounded-xl bg-orange-50 p-4">
                <strong class="text-[#f4a000]">{{ $t('detail.website') }}</strong>
                <a v-if="destino.sitio_web" :href="destino.sitio_web" target="_blank" rel="noopener noreferrer" class="mt-1 inline-block text-[#0b6fb3] hover:underline">{{ $t('detail.visit_website') }}</a>
                <p v-else class="mt-1 text-gray-700">{{ $t('detail.unspecified') }}</p>
              </div>
            </div>
          </section>

          <section class="mt-6">
            <h2 class="text-2xl font-bold text-gray-900">{{ $t('detail.recommendations') }}</h2>
            <p class="mt-2 leading-relaxed text-gray-700 whitespace-pre-wrap">{{ tDb(destino, 'recomendaciones') }}</p>
          </section>

          <div v-if="isLoggedIn" class="mt-8 rounded-xl bg-slate-100 p-5">
            <h2 class="text-xl font-bold text-gray-900">{{ $t('detail.interested') }}</h2>
            <p class="mt-1 text-gray-600">{{ $t('detail.interested_desc') }}</p>
            <button v-if="!esFavorito" @click="guardarFavorito" class="mt-4 rounded-full bg-[#168a1a] px-5 py-3 font-semibold text-white shadow hover:bg-green-700">{{ $t('detail.save_favorite') }}</button>
            <button v-else @click="eliminarFavorito" class="mt-4 rounded-full bg-red-600 px-5 py-3 font-semibold text-white shadow hover:bg-red-700">{{ $t('detail.remove_favorite') }}</button>
          </div>
          <div v-else class="mt-8 rounded-xl border border-yellow-200 bg-yellow-50 p-5 text-yellow-800">
            <h2 class="font-bold">{{ $t('detail.login_favorite') }}</h2>
            <p class="mt-1">{{ $t('detail.login_desc') }}</p>
            <RouterLink to="/login" class="mt-4 inline-block rounded-full bg-[#f4a000] px-5 py-2 font-semibold text-white shadow hover:bg-orange-500">{{ $t('detail.login_btn') }}</RouterLink>
          </div>
        </div>
      </article>
    </main>
  </div>
</template>
