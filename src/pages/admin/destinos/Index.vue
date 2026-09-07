<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import AdminNavbar from '@/components/AdminNavbar.vue';
import { supabase } from '@/lib/supabase';
import { destinoImagen } from '@/lib/imagen';

const destinos = ref([]);

async function cargar() {
  const { data } = await supabase.from('destinos').select('*, categoria:categorias(*)').order('created_at', { ascending: false });
  destinos.value = data || [];
}

const eliminarDestino = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar este destino turístico?')) return;
  await supabase.from('destinos').delete().eq('id', id);
  await cargar();
};

onMounted(cargar);
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AdminNavbar />
    <main class="mx-auto max-w-7xl px-6 py-10">
      <div class="mb-8 flex items-center justify-between">
        <div>
          <h1 class="text-3xl font-bold text-gray-900">Gestión de destinos turísticos</h1>
          <p class="mt-2 text-gray-600">Administra los lugares turísticos registrados en GeoTurismoSV.</p>
        </div>
        <RouterLink to="/admin/destinos/create" class="rounded-full bg-[#168a1a] px-5 py-3 font-semibold text-white shadow hover:bg-green-700">Nuevo destino</RouterLink>
      </div>
      <section class="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        <article v-for="destino in destinos" :key="destino.id" class="overflow-hidden rounded-xl bg-white shadow">
          <img :src="destinoImagen(destino.imagen)" :alt="destino.nombre" class="h-48 w-full object-cover">
          <div class="p-5">
            <p class="text-sm font-semibold text-[#168a1a]">{{ destino.categoria?.nombre }}</p>
            <h2 class="mt-1 text-xl font-bold">{{ destino.nombre }}</h2>
            <p class="mt-2 text-sm text-gray-600">{{ destino.ubicacion }}</p>
            <p class="mt-2 text-sm text-gray-600">Atención: {{ destino.dias_atencion }}</p>
            <p class="text-sm text-gray-600">{{ destino.hora_apertura }} - {{ destino.hora_cierre }}</p>
            <p class="mt-2 text-sm text-gray-600">Teléfono: {{ destino.telefono ?? 'No especificado' }}</p>
            <p class="mt-3 line-clamp-3 text-gray-700">{{ destino.descripcion }}</p>
            <div class="mt-4 flex items-center justify-between">
              <span class="rounded-full px-3 py-1 text-sm font-semibold" :class="destino.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">{{ destino.estado ? 'Activo' : 'Inactivo' }}</span>
              <span class="font-semibold text-[#0b6fb3]">${{ destino.costo_estimado }}</span>
            </div>
            <div class="mt-5 flex gap-2">
              <RouterLink :to="`/admin/destinos/${destino.id}/edit`" class="rounded-full bg-[#f4a000] px-4 py-2 text-sm font-semibold text-white">Editar</RouterLink>
              <button @click="eliminarDestino(destino.id)" class="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Eliminar</button>
            </div>
          </div>
        </article>
      </section>
    </main>
  </div>
</template>
