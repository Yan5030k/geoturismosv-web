<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import AdminNavbar from '@/components/AdminNavbar.vue';
import { supabase } from '@/lib/supabase';

const route = useRoute();
const router = useRouter();
const processing = ref(false);
const errors = reactive({});
const form = reactive({ nombre: '', descripcion: '', estado: true });

onMounted(async () => {
  const { data } = await supabase.from('categorias').select('*').eq('id', route.params.id).single();
  if (data) Object.assign(form, { nombre: data.nombre, descripcion: data.descripcion, estado: data.estado });
});

const actualizar = async () => {
  processing.value = true;
  const { error } = await supabase.from('categorias').update({
    nombre: form.nombre,
    descripcion: form.descripcion,
    estado: form.estado,
  }).eq('id', route.params.id);
  processing.value = false;
  if (error) {
    errors.nombre = error.message;
    return;
  }
  router.push('/admin/categorias');
};
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AdminNavbar />
    <main class="mx-auto max-w-4xl px-6 py-10">
      <RouterLink to="/admin/categorias" class="font-semibold text-[#0b6fb3]">← Volver a categorías</RouterLink>
      <section class="mt-6 rounded-xl bg-white p-8 shadow">
        <h1 class="text-3xl font-bold">Editar categoría</h1>
        <p class="mt-2 text-gray-600">ID actual de la categoría: {{ route.params.id }}</p>
        <form @submit.prevent="actualizar" class="mt-8 space-y-6">
          <div>
            <label class="block font-semibold text-gray-700">Nombre de la categoría</label>
            <input v-model="form.nombre" type="text" class="mt-2 w-full rounded-lg border-gray-300">
            <p v-if="errors.nombre" class="mt-2 text-sm text-red-600">{{ errors.nombre }}</p>
          </div>
          <div>
            <label class="block font-semibold text-gray-700">Descripción</label>
            <textarea v-model="form.descripcion" rows="4" class="mt-2 w-full rounded-lg border-gray-300"></textarea>
          </div>
          <div>
            <label class="block font-semibold text-gray-700">Estado</label>
            <select v-model="form.estado" class="mt-2 w-full rounded-lg border-gray-300">
              <option :value="true">Activa</option>
              <option :value="false">Inactiva</option>
            </select>
          </div>
          <div class="flex gap-3">
            <button type="submit" :disabled="processing" class="rounded-full bg-[#168a1a] px-6 py-3 font-semibold text-white">Actualizar categoría</button>
            <RouterLink to="/admin/categorias" class="rounded-full border border-gray-300 px-6 py-3 font-semibold text-gray-700">Cancelar</RouterLink>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>
