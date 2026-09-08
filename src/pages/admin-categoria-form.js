import { supabase } from '../lib/supabase.js';
import { esc } from '../lib/html.js';
import { adminNav } from '../lib/nav.js';
import { go } from '../lib/router.js';

export async function render(root, route) {
  const id = route.catId;
  let cat = { nombre: '', descripcion: '', estado: true };
  if (id) {
    const { data } = await supabase.from('categorias').select('*').eq('id', id).single();
    if (data) cat = data;
  }

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50">
      ${adminNav()}
      <main class="mx-auto max-w-3xl px-6 py-10">
        <a href="#/admin/categorias" data-link class="font-semibold text-[#0b6fb3]">← Volver</a>
        <form id="form" class="mt-6 rounded-xl bg-white p-8 shadow space-y-4">
          <h1 class="text-2xl font-bold">${id ? 'Editar categoría' : 'Nueva categoría'}</h1>
          <p id="err" class="hidden text-red-600"></p>
          <input name="nombre" required value="${esc(cat.nombre)}" class="w-full rounded-lg border-gray-300" placeholder="Nombre">
          <textarea name="descripcion" class="w-full rounded-lg border-gray-300" placeholder="Descripción">${esc(cat.descripcion || '')}</textarea>
          <select name="estado" class="w-full rounded-lg border-gray-300">
            <option value="true" ${cat.estado ? 'selected' : ''}>Activa</option>
            <option value="false" ${cat.estado ? '' : 'selected'}>Inactiva</option>
          </select>
          <button class="rounded-full bg-[#168a1a] px-5 py-3 font-semibold text-white">Guardar</button>
        </form>
      </main>
    </div>
  `;

  root.querySelector('#form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const payload = {
      nombre: fd.get('nombre'),
      descripcion: fd.get('descripcion'),
      estado: fd.get('estado') === 'true',
    };
    const { error } = id
      ? await supabase.from('categorias').update(payload).eq('id', id)
      : await supabase.from('categorias').insert(payload);
    if (error) {
      const err = root.querySelector('#err');
      err.textContent = error.message;
      err.classList.remove('hidden');
      return;
    }
    go('/admin/categorias');
  });
}
