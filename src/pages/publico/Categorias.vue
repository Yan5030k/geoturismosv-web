<script setup>
import { onMounted, ref } from 'vue';
import { RouterLink } from 'vue-router';
import PublicNavbar from '@/components/PublicNavbar.vue';
import { useDbTranslation } from '@/composables/useDbTranslation';
import { supabase } from '@/lib/supabase';

const { tDb } = useDbTranslation();
const categorias = ref([]);

onMounted(async () => {
  const { data } = await supabase.from('categorias').select('*, destinos:destinos(count)').eq('estado', true);
  categorias.value = (data || []).map((c) => ({
    ...c,
    destinos_count: Array.isArray(c.destinos) ? c.destinos[0]?.count ?? 0 : 0,
  }));
});
</script>

<template>
  <div class="min-h-screen bg-slate-50 pb-20">
    <PublicNavbar />
    <div class="relative overflow-hidden bg-white py-16 sm:py-24 border-b border-gray-100">
      <div class="relative z-10 mx-auto max-w-7xl px-6 text-center">
        <h2 class="text-sm font-bold leading-7 text-[#0b6fb3] uppercase tracking-widest">{{ $t('categories.explore') }}</h2>
        <h1 class="mt-2 text-4xl font-extrabold tracking-tight text-gray-900 sm:text-5xl">
          {{ $t('categories.title1') }} <span class="text-transparent bg-clip-text bg-gradient-to-r from-[#0b6fb3] to-[#168a1a]">{{ $t('categories.title2') }}</span>
        </h1>
        <p class="mt-6 text-lg leading-8 text-gray-600">{{ $t('categories.desc') }}</p>
      </div>
    </div>

    <main class="mx-auto max-w-7xl px-6 py-12 -mt-10 relative z-20">
      <div class="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        <RouterLink
          v-for="categoria in categorias"
          :key="categoria.id"
          :to="{ path: '/destinos', query: { categoria_id: categoria.id } }"
          class="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-gray-200 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl"
        >
          <div class="relative p-8 flex-1 flex flex-col">
            <h2 class="text-xl font-bold tracking-tight text-gray-900 group-hover:text-[#0b6fb3]">{{ tDb(categoria, 'nombre') }}</h2>
            <p class="mt-4 text-base leading-relaxed text-gray-600 flex-1">{{ tDb(categoria, 'descripcion') }}</p>
          </div>
          <div class="relative border-t border-gray-100 bg-gray-50/50 px-8 py-4 flex items-center justify-between">
            <span class="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#168a1a] shadow-sm ring-1 ring-gray-200">
              {{ categoria.destinos_count }} {{ $t('categories.destinations') }}
            </span>
            <span class="text-sm font-medium text-[#0b6fb3]">{{ $t('categories.explore_btn') }} →</span>
          </div>
        </RouterLink>
      </div>

      <div v-if="categorias.length === 0" class="text-center py-20 rounded-2xl bg-white border border-dashed border-gray-300 mt-8">
        <h3 class="mt-2 text-sm font-medium text-gray-900">{{ $t('categories.no_categories') }}</h3>
        <p class="mt-1 text-sm text-gray-500">{{ $t('categories.no_categories_desc') }}</p>
      </div>
    </main>
  </div>
</template>
