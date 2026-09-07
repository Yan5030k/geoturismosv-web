<script setup>
import { onMounted, reactive, ref } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import AdminNavbar from '@/components/AdminNavbar.vue';
import { supabase } from '@/lib/supabase';
import { destinoImagen } from '@/lib/imagen';
import { DEPARTAMENTOS, DIAS_ATENCION, emptyDestinoForm, uploadDestinoImagen, destinoPayload } from '@/lib/destinosAdmin';

const route = useRoute();
const router = useRouter();
const categorias = ref([]);
const processing = ref(false);
const errorMessage = ref('');
const imagenActual = ref('');
const form = reactive(emptyDestinoForm());

onMounted(async () => {
  const [{ data: cats }, { data: destino }] = await Promise.all([
    supabase.from('categorias').select('*').eq('estado', true),
    supabase.from('destinos').select('*').eq('id', route.params.id).single(),
  ]);
  categorias.value = cats || [];
  if (destino) {
    Object.assign(form, {
      categoria_id: destino.categoria_id,
      nombre: destino.nombre ?? '',
      descripcion: destino.descripcion ?? '',
      ubicacion: destino.ubicacion ?? '',
      departamento: destino.departamento ?? '',
      municipio: destino.municipio ?? '',
      latitud: destino.latitud ?? '',
      longitud: destino.longitud ?? '',
      direccion: destino.direccion ?? '',
      contacto: destino.contacto ?? '',
      telefono: destino.telefono ?? '',
      sitio_web: destino.sitio_web ?? '',
      costo_estimado: destino.costo_estimado ?? 0,
      dias_atencion: destino.dias_atencion ?? '',
      hora_apertura: destino.hora_apertura ? String(destino.hora_apertura).slice(0, 5) : '',
      hora_cierre: destino.hora_cierre ? String(destino.hora_cierre).slice(0, 5) : '',
      recomendaciones: destino.recomendaciones ?? '',
      estado: Boolean(destino.estado),
    });
    imagenActual.value = destino.imagen || '';
  }
});

const actualizar = async () => {
  processing.value = true;
  errorMessage.value = '';
  try {
    let imagen = imagenActual.value || null;
    if (form.imagenFile) imagen = await uploadDestinoImagen(form.imagenFile);
    const { error } = await supabase.from('destinos').update(destinoPayload(form, imagen)).eq('id', route.params.id);
    if (error) throw error;
    router.push('/admin/destinos');
  } catch (e) {
    errorMessage.value = e.message;
  } finally {
    processing.value = false;
  }
};
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <AdminNavbar />
    <main class="mx-auto max-w-5xl px-6 py-10">
      <RouterLink to="/admin/destinos" class="font-semibold text-[#0b6fb3]">← Volver a destinos</RouterLink>
      <section class="mt-6 rounded-xl bg-white p-8 shadow">
        <h1 class="text-3xl font-bold">Editar destino turístico</h1>
        <p v-if="errorMessage" class="mt-4 text-red-600">{{ errorMessage }}</p>
        <form @submit.prevent="actualizar" class="mt-8 grid gap-6 md:grid-cols-2">
          <div>
            <label class="block font-semibold">Categoría</label>
            <select v-model="form.categoria_id" required class="mt-2 w-full rounded-lg border-gray-300">
              <option v-for="c in categorias" :key="c.id" :value="c.id">{{ c.nombre }}</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold">Nombre del destino</label>
            <input v-model="form.nombre" required class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Ubicación</label>
            <input v-model="form.ubicacion" required class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Departamento</label>
            <select v-model="form.departamento" required class="mt-2 w-full rounded-lg border-gray-300">
              <option v-for="d in DEPARTAMENTOS" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold">Municipio o distrito</label>
            <input v-model="form.municipio" class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Latitud</label>
            <input v-model="form.latitud" type="number" step="0.0000001" class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Longitud</label>
            <input v-model="form.longitud" type="number" step="0.0000001" class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Dirección o referencia</label>
            <input v-model="form.direccion" class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Contacto</label>
            <input v-model="form.contacto" class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Teléfono</label>
            <input v-model="form.telefono" class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Sitio web</label>
            <input v-model="form.sitio_web" type="url" class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Imagen actual</label>
            <img v-if="imagenActual" :src="destinoImagen(imagenActual)" class="mt-2 h-40 w-full rounded-lg object-cover">
          </div>
          <div>
            <label class="block font-semibold">Nueva imagen</label>
            <input type="file" accept="image/*" class="mt-2 w-full" @change="form.imagenFile = $event.target.files[0]">
          </div>
          <div>
            <label class="block font-semibold">Costo estimado</label>
            <input v-model="form.costo_estimado" type="number" step="0.01" min="0" required class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Días de atención</label>
            <select v-model="form.dias_atencion" required class="mt-2 w-full rounded-lg border-gray-300">
              <option v-for="d in DIAS_ATENCION" :key="d" :value="d">{{ d }}</option>
            </select>
          </div>
          <div>
            <label class="block font-semibold">Hora de apertura</label>
            <input v-model="form.hora_apertura" type="time" required class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Hora de cierre</label>
            <input v-model="form.hora_cierre" type="time" required class="mt-2 w-full rounded-lg border-gray-300">
          </div>
          <div>
            <label class="block font-semibold">Estado</label>
            <select v-model="form.estado" class="mt-2 w-full rounded-lg border-gray-300">
              <option :value="true">Activo</option>
              <option :value="false">Inactivo</option>
            </select>
          </div>
          <div class="md:col-span-2">
            <label class="block font-semibold">Descripción</label>
            <textarea v-model="form.descripcion" rows="4" required class="mt-2 w-full rounded-lg border-gray-300"></textarea>
          </div>
          <div class="md:col-span-2">
            <label class="block font-semibold">Recomendaciones</label>
            <textarea v-model="form.recomendaciones" rows="3" class="mt-2 w-full rounded-lg border-gray-300"></textarea>
          </div>
          <div class="flex gap-3 md:col-span-2">
            <button type="submit" :disabled="processing" class="rounded-full bg-[#168a1a] px-6 py-3 font-semibold text-white">Actualizar destino</button>
            <RouterLink to="/admin/destinos" class="rounded-full border border-gray-300 px-6 py-3 font-semibold">Cancelar</RouterLink>
          </div>
        </form>
      </section>
    </main>
  </div>
</template>
