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
      nombre: 'Ropa de playa Doña Marta',
      descripcion: 'Trajes de baño, pareos y gorras frente al malecón.',
      logo_url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 8,
      keywords: ['ropa', 'playa'],
    },
    {
      nombre: 'Piñatas Don Chepe',
      descripcion: 'Piñatas, paletas y globos para cumpleaños en la playa.',
      logo_url: 'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 6,
      keywords: ['piñatas', 'niños'],
    },
  ],
  'Playa El Tunco': [
    {
      nombre: 'Ropa La Ola de Tamanique',
      descripcion: 'Bikinis, camisetas de surf y sombreros tejidos a la orilla.',
      logo_url: 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 10,
      keywords: ['ropa', 'playa'],
    },
    {
      nombre: 'Piñatas y dulces El Puntito',
      descripcion: 'Piñatas, algodón de azúcar y paletas para niños después del surf.',
      logo_url: 'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 4.5,
      keywords: ['piñatas', 'niños'],
    },
    {
      nombre: 'Pupusas El Tunco',
      descripcion: 'Pupusas revueltas y horchata a un callejón del río.',
      logo_url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 3,
      keywords: ['comida', 'pupusas'],
    },
  ],
  Guatajiagua: [
    {
      nombre: 'Alfarería de barro negro Las Comaleras',
      descripcion: 'Comales, ollas y jarros teñidos con nacascolo. Venta directa desde el taller.',
      logo_url: 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 8,
      keywords: ['barro negro', 'artesanía'],
    },
    {
      nombre: 'Taller de barro El Nacascolo',
      descripcion: 'Demostración del torno y del teñido. El visitante moldea su propia pieza.',
      logo_url: 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 5,
      keywords: ['barro negro', 'taller', 'familia'],
    },
    {
      nombre: 'Comedor La Comalera',
      descripcion: 'Pupusas y tortillas cocidas en comal de barro de Guatajiagua.',
      logo_url: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=400&q=80',
      costo_estimado: 3,
      keywords: ['comida', 'pupusas'],
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
