<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import UserNavbar from '@/components/UserNavbar.vue';
import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/lib/supabase';
import { destinoImagen } from '@/lib/imagen';

const { user } = useAuth();
const favoritosRecientes = ref([]);
const totalFavoritos = ref(0);
const totalDestinos = ref(0);

onMounted(async () => {
  const { count: destCount } = await supabase.from('destinos').select('id', { count: 'exact', head: true }).eq('estado', true);
  totalDestinos.value = destCount || 0;

  const { data, count } = await supabase
    .from('favoritos')
    .select('*, destino:destinos(*, categoria:categorias(*))', { count: 'exact' })
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false });

  totalFavoritos.value = count || 0;
  favoritosRecientes.value = (data || []).slice(0, 3);
});
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
    <UserNavbar />
    <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="overflow-hidden rounded-3xl bg-white shadow-xl ring-1 ring-slate-100">
        <div class="grid gap-0 lg:grid-cols-[1.4fr_0.8fr]">
          <div class="p-8 lg:p-10">
            <p class="text-sm font-bold uppercase tracking-wide text-[#168a1a]">Panel del usuario</p>
            <h1 class="mt-3 text-4xl font-black tracking-tight text-gray-900 sm:text-5xl">Bienvenido a tu panel turístico</h1>
            <p class="mt-5 max-w-3xl text-lg leading-8 text-gray-600">
              Desde aquí puedes explorar destinos turísticos de El Salvador, consultar tus lugares favoritos y descubrir nuevas opciones para visitar.
            </p>
            <div class="mt-8 flex flex-wrap gap-3">
              <RouterLink to="/destinos" class="rounded-full bg-[#0b6fb3] px-6 py-3 font-bold text-white shadow-md hover:bg-blue-700">Explorar destinos</RouterLink>
              <RouterLink to="/favoritos" class="rounded-full bg-[#168a1a] px-6 py-3 font-bold text-white shadow-md hover:bg-green-700">Ver mis favoritos</RouterLink>
            </div>
          </div>
          <div class="bg-gradient-to-br from-[#168a1a] to-[#0b6fb3] p-8 text-white lg:p-10">
            <p class="text-sm font-bold uppercase tracking-wide text-white/80">GeoTurismoSV</p>
            <h2 class="mt-3 text-3xl font-black">Donde cada lugar cuenta una historia</h2>
            <p class="mt-4 leading-7 text-white/90">Guarda tus destinos favoritos y consulta información útil para organizar tus visitas.</p>
          </div>
        </div>
      </section>

      <section class="mt-8 grid gap-6 md:grid-cols-2">
        <article class="rounded-3xl bg-white p-7 shadow-lg ring-1 ring-slate-100">
          <p class="text-sm font-bold uppercase tracking-wide text-[#0b6fb3]">Destinos disponibles</p>
          <h2 class="mt-3 text-5xl font-black text-gray-900">{{ totalDestinos }}</h2>
        </article>
        <article class="rounded-3xl bg-white p-7 shadow-lg ring-1 ring-slate-100">
          <p class="text-sm font-bold uppercase tracking-wide text-[#168a1a]">Tus favoritos</p>
          <h2 class="mt-3 text-5xl font-black text-gray-900">{{ totalFavoritos }}</h2>
        </article>
      </section>

      <section class="mt-10 rounded-3xl bg-white p-6 shadow-lg ring-1 ring-slate-100 sm:p-8">
        <div class="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 class="text-3xl font-black text-gray-900">Favoritos recientes</h2>
            <p class="mt-2 text-gray-600">Últimos destinos que guardaste en tu cuenta.</p>
          </div>
          <RouterLink to="/favoritos" class="inline-flex rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white">Ver todos →</RouterLink>
        </div>

        <div v-if="favoritosRecientes.length === 0" class="mt-7 rounded-2xl bg-yellow-50 p-7 text-yellow-800">
          <h3 class="text-xl font-black">Todavía no has guardado destinos favoritos.</h3>
          <RouterLink to="/destinos" class="mt-5 inline-flex rounded-full bg-[#f4a000] px-5 py-3 font-bold text-white">Explorar destinos</RouterLink>
        </div>

        <div v-else class="mt-7 grid gap-6 md:grid-cols-3">
          <article v-for="favorito in favoritosRecientes" :key="favorito.id" class="overflow-hidden rounded-3xl bg-slate-50 shadow-sm">
            <img :src="destinoImagen(favorito.destino?.imagen)" :alt="favorito.destino?.nombre" class="h-48 w-full object-cover">
            <div class="p-5">
              <p class="text-sm font-bold text-[#168a1a]">{{ favorito.destino?.categoria?.nombre ?? 'Sin categoría' }}</p>
              <h3 class="mt-2 text-xl font-black text-gray-900">{{ favorito.destino?.nombre }}</h3>
              <RouterLink :to="`/destinos/${favorito.destino?.id}`" class="mt-5 inline-flex rounded-full bg-[#0b6fb3] px-4 py-2 text-sm font-bold text-white">Ver destino</RouterLink>
            </div>
          </article>
        </div>
      </section>
    </main>
  </div>
</template>
