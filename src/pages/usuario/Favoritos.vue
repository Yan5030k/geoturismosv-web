<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import UserNavbar from '@/components/UserNavbar.vue';
import { useAuth } from '@/composables/useAuth';
import { supabase } from '@/lib/supabase';
import { destinoImagen } from '@/lib/imagen';

const { user } = useAuth();
const favoritos = ref([]);

async function cargar() {
  const { data } = await supabase
    .from('favoritos')
    .select('*, destino:destinos(*, categoria:categorias(*))')
    .eq('user_id', user.value.id)
    .order('created_at', { ascending: false });
  favoritos.value = data || [];
}

const eliminarFavorito = async (destinoId) => {
  await supabase.from('favoritos').delete().eq('user_id', user.value.id).eq('destino_id', destinoId);
  await cargar();
};

onMounted(cargar);
</script>

<template>
  <div class="min-h-screen bg-gradient-to-br from-slate-50 via-white to-emerald-50">
    <UserNavbar />
    <main class="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <section class="rounded-3xl bg-white p-8 shadow-xl">
        <h1 class="text-4xl font-black text-gray-900">Mis destinos favoritos</h1>
        <p class="mt-4 text-lg text-gray-600">Aquí puedes revisar los destinos turísticos que guardaste.</p>
        <div class="mt-5 flex gap-3">
          <RouterLink to="/usuario/panel" class="rounded-full bg-gray-900 px-5 py-3 text-sm font-bold text-white">Volver al panel</RouterLink>
          <RouterLink to="/destinos" class="rounded-full bg-[#0b6fb3] px-5 py-3 text-sm font-bold text-white">Explorar más</RouterLink>
        </div>
      </section>

      <section v-if="favoritos.length > 0" class="mt-8 grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="favorito in favoritos" :key="favorito.id" class="overflow-hidden rounded-3xl bg-white shadow-lg">
          <img :src="destinoImagen(favorito.destino?.imagen)" :alt="favorito.destino?.nombre" class="h-56 w-full object-cover">
          <div class="p-6">
            <p class="text-sm font-bold text-[#168a1a]">{{ favorito.destino?.categoria?.nombre ?? 'Sin categoría' }}</p>
            <h2 class="mt-2 text-2xl font-black text-gray-900">{{ favorito.destino?.nombre }}</h2>
            <p class="mt-4 line-clamp-3 text-gray-600">{{ favorito.destino?.descripcion }}</p>
            <div class="mt-6 flex gap-3">
              <RouterLink :to="`/destinos/${favorito.destino?.id}`" class="rounded-full bg-[#0b6fb3] px-4 py-2 text-sm font-bold text-white">Ver destino</RouterLink>
              <button @click="eliminarFavorito(favorito.destino.id)" class="rounded-full bg-red-600 px-4 py-2 text-sm font-bold text-white">Quitar</button>
            </div>
          </div>
        </article>
      </section>

      <section v-else class="mt-8 rounded-3xl bg-white p-10 text-center shadow-lg">
        <h2 class="text-3xl font-black text-gray-900">Todavía no tienes favoritos</h2>
        <RouterLink to="/destinos" class="mt-6 inline-flex rounded-full bg-[#168a1a] px-6 py-3 font-bold text-white">Explorar destinos</RouterLink>
      </section>
    </main>
  </div>
</template>
