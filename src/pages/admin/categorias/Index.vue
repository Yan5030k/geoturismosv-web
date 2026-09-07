<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import AdminNavbar from '@/components/AdminNavbar.vue';
import { supabase } from '@/lib/supabase';

const categorias = ref([]);

async function cargar() {
  const { data } = await supabase.from('categorias').select('*').order('created_at', { ascending: false });
  categorias.value = data || [];
}

const eliminarCategoria = async (id) => {
  if (!confirm('¿Seguro que deseas eliminar esta categoría?')) return;
  await supabase.from('categorias').delete().eq('id', id);
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
          <h1 class="text-3xl font-bold text-gray-900">Gestión de categorías</h1>
          <p class="mt-2 text-gray-600">Administra las categorías utilizadas para clasificar los destinos turísticos.</p>
        </div>
        <RouterLink to="/admin/categorias/create" class="rounded-full bg-[#168a1a] px-5 py-3 font-semibold text-white shadow hover:bg-green-700">Nueva categoría</RouterLink>
      </div>
      <section class="overflow-hidden rounded-xl bg-white shadow">
        <table class="w-full text-left">
          <thead class="bg-[#0b6fb3] text-white">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nombre</th>
              <th class="px-6 py-4">Descripción</th>
              <th class="px-6 py-4">Estado</th>
              <th class="px-6 py-4">Acciones</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="categoria in categorias" :key="categoria.id" class="border-b hover:bg-blue-50">
              <td class="px-6 py-4">{{ categoria.id }}</td>
              <td class="px-6 py-4 font-semibold">{{ categoria.nombre }}</td>
              <td class="px-6 py-4 text-gray-600">{{ categoria.descripcion }}</td>
              <td class="px-6 py-4">
                <span class="rounded-full px-3 py-1 text-sm font-semibold" :class="categoria.estado ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'">{{ categoria.estado ? 'Activa' : 'Inactiva' }}</span>
              </td>
              <td class="px-6 py-4">
                <div class="flex gap-2">
                  <RouterLink :to="`/admin/categorias/${categoria.id}/edit`" class="rounded-full bg-[#f4a000] px-4 py-2 text-sm font-semibold text-white">Editar</RouterLink>
                  <button @click="eliminarCategoria(categoria.id)" class="rounded-full bg-red-600 px-4 py-2 text-sm font-semibold text-white">Eliminar</button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>
