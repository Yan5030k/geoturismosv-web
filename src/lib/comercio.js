export const COMERCIO_FALLBACK = {
  'Playa El Cuco': [
    {
      nombre: 'Minutas Don Juan',
      descripcion: 'Minutas, frescos y elotes frente a la playa.',
      logo_url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 3.5,
      keywords: ['comida', 'familia'],
    },
    {
      nombre: 'Artesanías Las Olas',
      descripcion: 'Conchas, collares y hamacas de Chirilagua.',
      logo_url: 'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 12,
      keywords: ['artesanías'],
    },
  ],
  'Volcán Chaparrastique': [
    {
      nombre: 'Guías del Chaparrastique',
      descripcion: 'Ascenso con guías locales de San Miguel.',
      logo_url: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 18,
      keywords: ['guía', 'aventura'],
    },
  ],
};

export function estrellasHtml(n) {
  const v = Math.max(1, Math.min(5, Number(n) || 1));
  return `<span class="geo-stars" aria-label="${v} de 5">${'★'.repeat(v)}${'☆'.repeat(5 - v)}</span>`;
}
