<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import AdminNavbar from '@/components/AdminNavbar.vue';
import { supabase } from '@/lib/supabase';

const totalUsuarios = ref(0);
const totalCategorias = ref(0);
const totalDestinos = ref(0);
const destinosActivos = ref(0);

onMounted(async () => {
  const [{ count: u }, { count: c }, { count: d }, { count: a }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('categorias').select('id', { count: 'exact', head: true }),
    supabase.from('destinos').select('id', { count: 'exact', head: true }),
    supabase.from('destinos').select('id', { count: 'exact', head: true }).eq('estado', true),
  ]);
  totalUsuarios.value = u || 0;
  totalCategorias.value = c || 0;
  totalDestinos.value = d || 0;
  destinosActivos.value = a || 0;
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AdminNavbar />
    <main class="mx-auto max-w-7xl px-6 py-10">
      <h1 class="text-3xl font-bold text-gray-900">Dashboard administrativo</h1>
      <p class="mt-2 text-gray-600">Panel principal para administrar la información turística de GeoTurismoSV.</p>
      <div class="mt-8 grid gap-6 md:grid-cols-4">
        <section class="rounded-xl bg-white p-6 shadow"><p class="text-sm font-semibold text-[#0b6fb3]">Usuarios</p><h2 class="mt-2 text-4xl font-bold">{{ totalUsuarios }}</h2></section>
        <section class="rounded-xl bg-white p-6 shadow"><p class="text-sm font-semibold text-[#168a1a]">Categorías</p><h2 class="mt-2 text-4xl font-bold">{{ totalCategorias }}</h2></section>
        <section class="rounded-xl bg-white p-6 shadow"><p class="text-sm font-semibold text-[#f4a000]">Destinos</p><h2 class="mt-2 text-4xl font-bold">{{ totalDestinos }}</h2></section>
        <section class="rounded-xl bg-white p-6 shadow"><p class="text-sm font-semibold text-emerald-700">Destinos activos</p><h2 class="mt-2 text-4xl font-bold">{{ destinosActivos }}</h2></section>
      </div>
      <section class="mt-10 rounded-xl bg-white p-8 shadow">
        <h2 class="text-2xl font-bold">Gestión del sistema</h2>
        <div class="mt-6 grid gap-4 md:grid-cols-3">
          <RouterLink to="/admin/categorias" class="rounded-xl border border-blue-100 bg-blue-50 p-5 text-[#0b6fb3]">Gestionar categorías</RouterLink>
          <RouterLink to="/admin/destinos" class="rounded-xl border border-green-100 bg-green-50 p-5 text-[#168a1a]">Gestionar destinos</RouterLink>
          <RouterLink to="/admin/usuarios" class="rounded-xl border border-orange-100 bg-orange-50 p-5 text-[#f4a000]">Ver usuarios</RouterLink>
        </div>
      </section>
    </main>
  </div>
</template>
