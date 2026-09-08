import { supabase } from '../lib/supabase.js';
import { adminNav } from '../lib/nav.js';

export async function render(root) {
  const [{ count: u }, { count: c }, { count: d }, { count: a }] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact', head: true }),
    supabase.from('categorias').select('id', { count: 'exact', head: true }),
    supabase.from('destinos').select('id', { count: 'exact', head: true }),
    supabase.from('destinos').select('id', { count: 'exact', head: true }).eq('estado', true),
  ]);

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50">
      ${adminNav()}
      <main class="mx-auto max-w-7xl px-6 py-10">
        <h1 class="text-3xl font-bold">Dashboard</h1>
        <p class="mt-2 text-gray-600">Administra el mapa geoturístico de El Salvador.</p>
        <div class="mt-8 grid gap-6 md:grid-cols-4">
          <section class="rounded-xl bg-white p-6 shadow"><p class="text-sm font-semibold text-[#0b6fb3]">Usuarios</p><h2 class="mt-2 text-4xl font-bold">${u || 0}</h2></section>
          <section class="rounded-xl bg-white p-6 shadow"><p class="text-sm font-semibold text-[#168a1a]">Categorías</p><h2 class="mt-2 text-4xl font-bold">${c || 0}</h2></section>
          <section class="rounded-xl bg-white p-6 shadow"><p class="text-sm font-semibold text-[#f4a000]">Destinos</p><h2 class="mt-2 text-4xl font-bold">${d || 0}</h2></section>
          <section class="rounded-xl bg-white p-6 shadow"><p class="text-sm font-semibold text-emerald-700">Activos</p><h2 class="mt-2 text-4xl font-bold">${a || 0}</h2></section>
        </div>
        <div class="mt-10 grid gap-4 md:grid-cols-3">
          <a href="#/admin/categorias" data-link class="rounded-xl border border-blue-100 bg-blue-50 p-5 font-semibold text-[#0b6fb3]">Gestionar categorías</a>
          <a href="#/admin/destinos" data-link class="rounded-xl border border-green-100 bg-green-50 p-5 font-semibold text-[#168a1a]">Gestionar destinos</a>
          <a href="#/admin/usuarios" data-link class="rounded-xl border border-orange-100 bg-orange-50 p-5 font-semibold text-[#f4a000]">Ver usuarios</a>
        </div>
      </main>
    </div>
  `;
}
