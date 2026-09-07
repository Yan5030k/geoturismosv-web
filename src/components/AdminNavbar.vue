<script setup>
import { RouterLink, useRouter } from 'vue-router';
import { useAuth } from '@/composables/useAuth';
import { asset } from '@/lib/imagen';

const router = useRouter();
const { logout } = useAuth();

const cerrarSesion = async () => {
  await logout();
  router.push('/');
};
</script>

<template>
  <header class="bg-white shadow-sm">
    <nav class="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
      <RouterLink to="/admin/dashboard" class="flex items-center">
        <img :src="asset('img/logo-geoturismosv.png')" alt="Logo GeoTurismoSV" class="h-14 w-auto">
      </RouterLink>

      <div class="flex items-center gap-3 flex-wrap justify-end">
        <RouterLink to="/admin/dashboard" class="rounded-full border border-[#0b6fb3] bg-blue-50 px-4 py-2 font-medium text-[#0b6fb3] transition hover:bg-[#0b6fb3] hover:text-white">Dashboard</RouterLink>
        <RouterLink to="/admin/categorias" class="rounded-full border border-[#0b6fb3] bg-blue-50 px-4 py-2 font-medium text-[#0b6fb3] transition hover:bg-[#0b6fb3] hover:text-white">Categorías</RouterLink>
        <RouterLink to="/admin/destinos" class="rounded-full border border-[#0b6fb3] bg-blue-50 px-4 py-2 font-medium text-[#0b6fb3] transition hover:bg-[#0b6fb3] hover:text-white">Destinos</RouterLink>
        <RouterLink to="/admin/usuarios" class="rounded-full border border-[#0b6fb3] bg-blue-50 px-4 py-2 font-medium text-[#0b6fb3] transition hover:bg-[#0b6fb3] hover:text-white">Usuarios</RouterLink>
        <button @click="cerrarSesion" class="rounded-full bg-red-600 px-5 py-2 font-semibold text-white shadow transition hover:bg-red-700">Cerrar sesión</button>
      </div>
    </nav>
    <div class="h-1 w-full bg-gradient-to-r from-[#0b6fb3] via-[#1690c8] to-[#168a1a]"></div>
  </header>
</template>
