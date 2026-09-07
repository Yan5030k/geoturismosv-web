<script setup>
import { onMounted, ref } from 'vue';
import AdminNavbar from '@/components/AdminNavbar.vue';
import { supabase } from '@/lib/supabase';

const usuarios = ref([]);

onMounted(async () => {
  const { data } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
  usuarios.value = data || [];
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AdminNavbar />
    <main class="mx-auto max-w-7xl px-6 py-10">
      <h1 class="text-3xl font-bold text-gray-900">Usuarios registrados</h1>
      <p class="mt-2 text-gray-600">Listado de usuarios creados en la plataforma.</p>
      <section class="mt-8 overflow-hidden rounded-xl bg-white shadow">
        <table class="w-full text-left">
          <thead class="bg-[#0b6fb3] text-white">
            <tr>
              <th class="px-6 py-4">ID</th>
              <th class="px-6 py-4">Nombre</th>
              <th class="px-6 py-4">Correo</th>
              <th class="px-6 py-4">Rol</th>
              <th class="px-6 py-4">Fecha registro</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="usuario in usuarios" :key="usuario.id" class="border-b hover:bg-blue-50">
              <td class="px-6 py-4 text-xs">{{ usuario.id }}</td>
              <td class="px-6 py-4">{{ usuario.nombre }}</td>
              <td class="px-6 py-4">{{ usuario.email }}</td>
              <td class="px-6 py-4">
                <span class="rounded-full px-3 py-1 text-sm font-semibold" :class="usuario.rol === 'admin' ? 'bg-orange-100 text-orange-700' : 'bg-green-100 text-green-700'">{{ usuario.rol }}</span>
              </td>
              <td class="px-6 py-4">{{ new Date(usuario.created_at).toLocaleDateString() }}</td>
            </tr>
          </tbody>
        </table>
      </section>
    </main>
  </div>
</template>
