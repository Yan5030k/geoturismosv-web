import { supabase } from '@/lib/supabase';
import { DEPARTAMENTOS, DIAS_ATENCION } from '@/lib/departamentos';

export { DEPARTAMENTOS, DIAS_ATENCION };

export const emptyDestinoForm = () => ({
  categoria_id: '',
  nombre: '',
  descripcion: '',
  ubicacion: '',
  departamento: '',
  municipio: '',
  latitud: '',
  longitud: '',
  direccion: '',
  contacto: '',
  telefono: '',
  sitio_web: '',
  imagenFile: null,
  costo_estimado: 0,
  dias_atencion: 'Todos los días',
  hora_apertura: '',
  hora_cierre: '',
  recomendaciones: '',
  estado: true,
});

export async function uploadDestinoImagen(file) {
  const ext = file.name.split('.').pop();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await supabase.storage.from('destinos').upload(path, file);
  if (error) throw error;
  const { data } = supabase.storage.from('destinos').getPublicUrl(path);
  return data.publicUrl;
}

export function destinoPayload(form, imagen) {
  return {
    categoria_id: Number(form.categoria_id),
    nombre: form.nombre,
    descripcion: form.descripcion,
    ubicacion: form.ubicacion,
    departamento: form.departamento || null,
    municipio: form.municipio || null,
    latitud: form.latitud === '' ? null : Number(form.latitud),
    longitud: form.longitud === '' ? null : Number(form.longitud),
    direccion: form.direccion || null,
    contacto: form.contacto || null,
    telefono: form.telefono || null,
    sitio_web: form.sitio_web || null,
    imagen,
    costo_estimado: Number(form.costo_estimado) || 0,
    dias_atencion: form.dias_atencion,
    hora_apertura: form.hora_apertura || null,
    hora_cierre: form.hora_cierre || null,
    recomendaciones: form.recomendaciones || null,
    estado: Boolean(form.estado),
  };
}
