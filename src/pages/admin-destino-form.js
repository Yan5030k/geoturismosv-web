import { supabase } from '../lib/supabase.js';
import { esc } from '../lib/html.js';
import { adminNav } from '../lib/nav.js';
import { go } from '../lib/router.js';
import { DEPARTAMENTOS, DIAS_ATENCION, emptyDestinoForm, uploadDestinoImagen, destinoPayload } from '../lib/destinosAdmin.js';

export async function render(root, route) {
  const id = route.destEditId;
  const { data: cats } = await supabase.from('categorias').select('*').eq('estado', true);
  let form = emptyDestinoForm();
  if (id) {
    const { data } = await supabase.from('destinos').select('*').eq('id', id).single();
    if (data) form = { ...form, ...data, imagenFile: null };
  }

  const opt = (list, current) =>
    list.map((v) => `<option value="${esc(v)}" ${String(current) === String(v) ? 'selected' : ''}>${esc(v)}</option>`).join('');

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50">
      ${adminNav()}
      <main class="mx-auto max-w-5xl px-6 py-10">
        <a href="#/admin/destinos" data-link class="font-semibold text-[#0b6fb3]">← Volver</a>
        <form id="form" class="mt-6 rounded-xl bg-white p-8 shadow grid gap-6 md:grid-cols-2">
          <h1 class="md:col-span-2 text-3xl font-bold">${id ? 'Editar destino' : 'Nuevo destino'}</h1>
          <p id="err" class="md:col-span-2 hidden text-red-600"></p>
          <label class="font-semibold">Categoría
            <select name="categoria_id" required class="mt-2 w-full rounded-lg border-gray-300">
              <option value="">Seleccione</option>
              ${(cats || []).map((c) => `<option value="${c.id}" ${String(form.categoria_id) === String(c.id) ? 'selected' : ''}>${esc(c.nombre)}</option>`).join('')}
            </select>
          </label>
          <label class="font-semibold">Nombre<input name="nombre" required value="${esc(form.nombre)}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Ubicación<input name="ubicacion" required value="${esc(form.ubicacion)}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Departamento<select name="departamento" required class="mt-2 w-full rounded-lg border-gray-300"><option value="">Seleccione</option>${opt(DEPARTAMENTOS, form.departamento)}</select></label>
          <label class="font-semibold">Municipio<input name="municipio" value="${esc(form.municipio || '')}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Latitud<input name="latitud" type="number" step="0.0000001" value="${esc(form.latitud ?? '')}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Longitud<input name="longitud" type="number" step="0.0000001" value="${esc(form.longitud ?? '')}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Dirección<input name="direccion" value="${esc(form.direccion || '')}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Contacto<input name="contacto" value="${esc(form.contacto || '')}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Teléfono<input name="telefono" value="${esc(form.telefono || '')}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Sitio web<input name="sitio_web" type="url" value="${esc(form.sitio_web || '')}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Imagen<input name="imagen" type="file" accept="image/*" class="mt-2 w-full"></label>
          <label class="font-semibold">Costo<input name="costo_estimado" type="number" step="0.01" min="0" required value="${esc(form.costo_estimado ?? 0)}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Días<select name="dias_atencion" required class="mt-2 w-full rounded-lg border-gray-300">${opt(DIAS_ATENCION, form.dias_atencion)}</select></label>
          <label class="font-semibold">Apertura<input name="hora_apertura" type="time" required value="${esc((form.hora_apertura || '').toString().slice(0, 5))}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Cierre<input name="hora_cierre" type="time" required value="${esc((form.hora_cierre || '').toString().slice(0, 5))}" class="mt-2 w-full rounded-lg border-gray-300"></label>
          <label class="font-semibold">Estado<select name="estado" class="mt-2 w-full rounded-lg border-gray-300"><option value="true" ${form.estado ? 'selected' : ''}>Activo</option><option value="false" ${form.estado ? '' : 'selected'}>Inactivo</option></select></label>
          <label class="md:col-span-2 font-semibold">Descripción<textarea name="descripcion" required class="mt-2 w-full rounded-lg border-gray-300" rows="4">${esc(form.descripcion || '')}</textarea></label>
          <label class="md:col-span-2 font-semibold">Recomendaciones<textarea name="recomendaciones" class="mt-2 w-full rounded-lg border-gray-300" rows="3">${esc(form.recomendaciones || '')}</textarea></label>
          <button class="md:col-span-2 rounded-full bg-[#168a1a] px-5 py-3 font-semibold text-white">Guardar</button>
        </form>
      </main>
    </div>
  `;

  root.querySelector('#form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const fd = new FormData(e.target);
    const err = root.querySelector('#err');
    try {
      const values = Object.fromEntries(fd.entries());
      values.estado = values.estado === 'true';
      values.imagenFile = fd.get('imagen')?.size ? fd.get('imagen') : null;
      let imagen = form.imagen || null;
      if (values.imagenFile) imagen = await uploadDestinoImagen(values.imagenFile);
      const payload = destinoPayload(values, imagen);
      const { error } = id
        ? await supabase.from('destinos').update(payload).eq('id', id)
        : await supabase.from('destinos').insert(payload);
      if (error) throw error;
      go('/admin/destinos');
    } catch (ex) {
      err.textContent = ex.message;
      err.classList.remove('hidden');
    }
  });
}
