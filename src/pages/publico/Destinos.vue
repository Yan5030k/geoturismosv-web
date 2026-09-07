<script setup>
import { computed, onMounted, ref, watch } from 'vue';
import { RouterLink, useRoute, useRouter } from 'vue-router';
import PublicNavbar from '@/components/PublicNavbar.vue';
import { useDbTranslation } from '@/composables/useDbTranslation';
import { supabase } from '@/lib/supabase';
import { destinoImagen } from '@/lib/imagen';

const { tDb } = useDbTranslation();
const route = useRoute();
const router = useRouter();

const destinos = ref([]);
const categorias = ref([]);
const departamentos = ref([]);

const form = ref({
  search: route.query.search || '',
  categoria_id: route.query.categoria_id || '',
  departamento: route.query.departamento || '',
  municipio: route.query.municipio || '',
  costo_min: route.query.costo_min || '',
  costo_max: route.query.costo_max || '',
});

const currencies = [
  { code: 'USD', name: 'Dólar (USD)', symbol: '$' },
  { code: 'MXN', name: 'Peso Mexicano (MXN)', symbol: '$' },
  { code: 'CAD', name: 'Dólar Canadiense (CAD)', symbol: '$' },
  { code: 'GTQ', name: 'Quetzal Guatemalteco (GTQ)', symbol: 'Q' },
  { code: 'HNL', name: 'Lempira Hondureño (HNL)', symbol: 'L' },
  { code: 'NIO', name: 'Córdoba Nicaragüense (NIO)', symbol: 'C$' },
  { code: 'CRC', name: 'Colón Costarricense (CRC)', symbol: '₡' },
  { code: 'COP', name: 'Peso Colombiano (COP)', symbol: '$' },
  { code: 'ARS', name: 'Peso Argentino (ARS)', symbol: '$' },
  { code: 'BRL', name: 'Real Brasileño (BRL)', symbol: 'R$' },
  { code: 'CLP', name: 'Peso Chileno (CLP)', symbol: '$' },
  { code: 'PEN', name: 'Sol Peruano (PEN)', symbol: 'S/' },
  { code: 'UYU', name: 'Peso Uruguayo (UYU)', symbol: '$' },
  { code: 'EUR', name: 'Euro (EUR)', symbol: '€' },
  { code: 'GBP', name: 'Libra Esterlina (GBP)', symbol: '£' },
  { code: 'CHF', name: 'Franco Suizo (CHF)', symbol: 'Fr' },
  { code: 'SEK', name: 'Corona Sueca (SEK)', symbol: 'kr' },
];

const selectedCurrency = ref('USD');
const allRates = ref({});
let timeout = null;

const currentExchangeRate = computed(() => {
  if (selectedCurrency.value === 'USD') return 1;
  return allRates.value[selectedCurrency.value] || 1;
});

const getConvertedPrice = (price) => {
  if (!price || selectedCurrency.value === 'USD' || currentExchangeRate.value === 1) return null;
  const converted = (parseFloat(price) * currentExchangeRate.value).toLocaleString(undefined, {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
  const currencyObj = currencies.find((c) => c.code === selectedCurrency.value);
  return `≈ ${currencyObj ? currencyObj.symbol : ''}${converted} ${selectedCurrency.value}`;
};

async function cargar() {
  const { data: cats } = await supabase.from('categorias').select('*').eq('estado', true).order('nombre');
  categorias.value = cats || [];

  let query = supabase
    .from('destinos')
    .select('*, categoria:categorias(*)')
    .eq('estado', true)
    .order('created_at', { ascending: false });

  if (form.value.categoria_id) query = query.eq('categoria_id', form.value.categoria_id);
  if (form.value.departamento) query = query.eq('departamento', form.value.departamento);
  if (form.value.municipio) query = query.ilike('municipio', `%${form.value.municipio}%`);
  if (form.value.costo_min !== '' && form.value.costo_min != null) query = query.gte('costo_estimado', form.value.costo_min);
  if (form.value.costo_max !== '' && form.value.costo_max != null) query = query.lte('costo_estimado', form.value.costo_max);

  const { data } = await query;
  let rows = data || [];

  if (form.value.search) {
    const s = form.value.search.toLowerCase();
    rows = rows.filter((d) =>
      [d.nombre, d.ubicacion, d.descripcion, d.departamento, d.municipio]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(s)),
    );
  }

  destinos.value = rows;
  departamentos.value = [...new Set(rows.map((d) => d.departamento).filter(Boolean))].sort();

  if (!form.value.search && !form.value.categoria_id && !form.value.departamento && !form.value.municipio) {
    const { data: allDepto } = await supabase.from('destinos').select('departamento').eq('estado', true).not('departamento', 'is', null);
    departamentos.value = [...new Set((allDepto || []).map((d) => d.departamento).filter(Boolean))].sort();
  }
}

const limpiarFiltros = () => {
  form.value = { search: '', categoria_id: '', departamento: '', municipio: '', costo_min: '', costo_max: '' };
};

watch(
  form,
  (value) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      router.replace({ query: { ...value } });
      cargar();
    }, 300);
  },
  { deep: true },
);

onMounted(async () => {
  try {
    const response = await fetch('https://open.er-api.com/v6/latest/USD');
    const data = await response.json();
    if (data?.rates) allRates.value = data.rates;
  } catch (error) {
    console.error('Error fetching exchange rates:', error);
  }
  await cargar();
});
</script>

<template>
  <div class="min-h-screen bg-slate-50">
    <PublicNavbar />
    <main class="mx-auto max-w-7xl px-6 py-10">
      <h1 class="text-3xl font-bold text-gray-900">{{ $t('destinations.title') }}</h1>
      <p class="mt-2 text-gray-600">{{ $t('destinations.desc1') }}</p>
      <p class="mt-2 text-gray-600">{{ $t('destinations.desc2') }}</p>

      <div class="mt-6 rounded-xl bg-white p-5 shadow">
        <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('destinations.search') }}</label>
            <input v-model="form.search" type="text" :placeholder="$t('destinations.search_ph')" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#168a1a] focus:ring focus:ring-[#168a1a] focus:ring-opacity-50">
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('destinations.category') }}</label>
            <select v-model="form.categoria_id" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#168a1a] focus:ring focus:ring-[#168a1a] focus:ring-opacity-50">
              <option value="">{{ $t('destinations.all_categories') }}</option>
              <option v-for="cat in categorias" :key="cat.id" :value="String(cat.id)">{{ tDb(cat, 'nombre') }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('destinations.department') }}</label>
            <select v-model="form.departamento" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#168a1a] focus:ring focus:ring-[#168a1a] focus:ring-opacity-50">
              <option value="">{{ $t('destinations.all_departments') }}</option>
              <option v-for="departamento in departamentos" :key="departamento" :value="departamento">{{ departamento }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">{{ $t('destinations.municipality') }}</label>
            <input v-model="form.municipio" type="text" :placeholder="$t('destinations.municipality_ph')" class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#168a1a] focus:ring focus:ring-[#168a1a] focus:ring-opacity-50">
          </div>
        </div>

        <div class="mt-6 border-t border-gray-100 pt-5">
          <h3 class="text-sm font-bold text-gray-800 uppercase tracking-wide mb-4">{{ $t('destinations.price_range') }}</h3>
          <div class="grid gap-4 md:grid-cols-2 lg:grid-cols-4 items-start">
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">{{ $t('destinations.min_cost') }}</label>
              <input v-model="form.costo_min" type="number" min="0" step="0.01" :placeholder="$t('destinations.cost_ph_5')" class="block w-full rounded-md border-gray-300 focus:border-[#168a1a] focus:ring focus:ring-[#168a1a] focus:ring-opacity-50">
              <div v-if="getConvertedPrice(form.costo_min)" class="mt-2 flex items-center text-sm text-white font-bold bg-[#0b6fb3] px-3 py-1.5 rounded-md w-fit shadow-md">
                {{ getConvertedPrice(form.costo_min) }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-gray-500 mb-1">{{ $t('destinations.max_cost') }}</label>
              <input v-model="form.costo_max" type="number" min="0" step="0.01" :placeholder="$t('destinations.cost_ph_25')" class="block w-full rounded-md border-gray-300 focus:border-[#168a1a] focus:ring focus:ring-[#168a1a] focus:ring-opacity-50">
              <div v-if="getConvertedPrice(form.costo_max)" class="mt-2 flex items-center text-sm text-white font-bold bg-[#0b6fb3] px-3 py-1.5 rounded-md w-fit shadow-md">
                {{ getConvertedPrice(form.costo_max) }}
              </div>
            </div>
            <div>
              <label class="block text-xs font-medium text-[#0b6fb3] mb-1">{{ $t('destinations.show_currency') }}</label>
              <select v-model="selectedCurrency" class="block w-full rounded-md border-blue-200 bg-blue-50/50 focus:border-[#0b6fb3] sm:text-sm text-gray-800 font-medium">
                <option v-for="c in currencies" :key="c.code" :value="c.code">{{ c.code }} - {{ c.name.split(' (')[0] }}</option>
              </select>
            </div>
            <div class="flex h-full items-start pt-[22px]">
              <button type="button" @click="limpiarFiltros" class="w-full rounded-md bg-slate-100 px-6 py-2 text-sm font-semibold text-gray-700 hover:bg-slate-200 border border-slate-200">
                {{ $t('destinations.clear_filters') }}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="destinos.length === 0" class="mt-12 text-center py-10 bg-white rounded-xl shadow">
        <p class="text-gray-500 text-lg">{{ $t('destinations.no_results') }}</p>
        <button @click="limpiarFiltros" class="mt-4 text-[#0b6fb3] hover:underline font-medium">{{ $t('destinations.clear_filters') }}</button>
      </div>

      <div class="mt-8 grid gap-6 md:grid-cols-3">
        <article v-for="destino in destinos" :key="destino.id" class="overflow-hidden rounded-xl bg-white shadow transition hover:-translate-y-1 hover:shadow-lg">
          <img :src="destinoImagen(destino.imagen)" :alt="destino.nombre" class="h-48 w-full object-cover">
          <div class="p-5">
            <p class="text-sm font-semibold text-[#168a1a]">{{ tDb(destino.categoria, 'nombre') }}</p>
            <h2 class="mt-1 text-xl font-bold text-gray-900">{{ tDb(destino, 'nombre') }}</h2>
            <p class="mt-2 text-sm text-gray-600">{{ tDb(destino, 'ubicacion') }}</p>
            <p class="mt-3 text-gray-700">{{ (tDb(destino, 'descripcion') || '').substring(0, 120) }}...</p>
            <RouterLink :to="`/destinos/${destino.id}`" class="mt-4 inline-block rounded-full bg-[#0b6fb3] px-4 py-2 font-semibold text-white shadow transition hover:bg-[#168a1a]">
              {{ $t('home.view_details') }}
            </RouterLink>
          </div>
        </article>
      </div>
    </main>
  </div>
</template>
