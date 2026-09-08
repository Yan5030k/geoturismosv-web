-- Additive: comercio local extra (playas, capital, lagos). Safe to re-run.
-- ON CONFLICT updates the same (destino, nombre). Does not DROP tables.

INSERT INTO public.emprendimientos (
  user_id, destino_id, nombre, descripcion, logo_url, fotos, costo_estimado, keywords, redes_sociales
)
SELECT
  (SELECT id FROM public.profiles WHERE email = 'usuario@geoturismosv.com' LIMIT 1),
  d.id,
  v.nombre,
  v.descripcion,
  v.logo_url,
  v.fotos,
  v.costo_estimado,
  v.keywords,
  v.redes_sociales
FROM (
  VALUES
    (
      'Playa El Cuco',
      'Ropa de playa Doña Marta',
      'Doña Marta corta y vende trajes de baño, pareos y gorras frente al malecón. Tallas de niñez a adulto.',
      'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80']::text[],
      8.00,
      ARRAY['ropa', 'playa', 'familia', 'artesanía']::text[],
      '{"whatsapp":"https://wa.me/50370001001"}'::jsonb
    ),
    (
      'Playa El Cuco',
      'Piñatas Don Chepe',
      'Don Chepe arma piñatas, paletas y globos para cumpleaños en la playa. Encargo el mismo día si hay papel.',
      'https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1530103862676-de8c9debad1d?auto=format&fit=crop&w=800&q=80']::text[],
      6.00,
      ARRAY['piñatas', 'niños', 'familia', 'fiesta']::text[],
      '{"facebook":"https://facebook.com/"}'::jsonb
    ),
    (
      'Playa El Tunco',
      'Ropa La Ola de Tamanique',
      'Señora Irma vende bikinis, camisetas de surf y sombreros tejidos a la orilla del Tunco.',
      'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&w=800&q=80']::text[],
      10.00,
      ARRAY['ropa', 'playa', 'surf']::text[],
      '{"instagram":"https://instagram.com/"}'::jsonb
    ),
    (
      'Playa El Tunco',
      'Piñatas y dulces El Puntito',
      'Don Óscar llena piñatas, vende algodón de azúcar y paletas. Punto para niños después del surf.',
      'https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1464349153735-7db50ed83c84?auto=format&fit=crop&w=800&q=80']::text[],
      4.50,
      ARRAY['piñatas', 'niños', 'dulces', 'familia']::text[],
      '{"whatsapp":"https://wa.me/50370001002"}'::jsonb
    ),
    (
      'Playa El Tunco',
      'Pupusas El Tunco',
      'Pupusas revueltas y horchata a un callejón del río. Cocina de Tamanique, no de restaurante de revista.',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80']::text[],
      3.00,
      ARRAY['comida', 'pupusas', 'familia']::text[],
      '{"facebook":"https://facebook.com/"}'::jsonb
    ),
    (
      'Golfo de Fonseca',
      'Pescado fresco Doña Lita',
      'Doña Lita vende pescado del día y cócteles en la orilla del golfo. Precio de mercado, no de hotel.',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80']::text[],
      9.00,
      ARRAY['comida', 'mariscos', 'familia']::text[],
      '{"whatsapp":"https://wa.me/50370001003"}'::jsonb
    ),
    (
      'Golfo de Fonseca',
      'Hamacas La Unión',
      'Hamacas y sombreros tejidos por familias de La Unión. Encargo y venta al paso del muelle.',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80']::text[],
      15.00,
      ARRAY['artesanías', 'hamacas', 'comunidad']::text[],
      '{"instagram":"https://instagram.com/"}'::jsonb
    ),
    (
      'Volcán El Boquerón',
      'Café del cráter',
      'Café de altura y pan dulce en el parque. Mesa corta antes o después del sendero al cráter.',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80']::text[],
      4.00,
      ARRAY['comida', 'café', 'familia']::text[],
      '{"instagram":"https://instagram.com/"}'::jsonb
    ),
    (
      'Volcán El Boquerón',
      'Guías del Boquerón',
      'Caminata corta al mirador con guía local. Ritmo para familias y adulto mayor.',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80']::text[],
      12.00,
      ARRAY['guía', 'volcán', 'familia', 'adulto mayor']::text[],
      '{"whatsapp":"https://wa.me/50370001004"}'::jsonb
    ),
    (
      'Lago de Ilopango',
      'Lanchas Ilopango',
      'Paseo en lancha por la caldera. Sale cuando hay grupo; preguntar en el embarcadero.',
      'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=800&q=80']::text[],
      20.00,
      ARRAY['lancha', 'lago', 'familia']::text[],
      '{"whatsapp":"https://wa.me/50370001005"}'::jsonb
    ),
    (
      'Lago de Ilopango',
      'Pupusas de la orilla',
      'Pupusas y pescado frito con vista al lago. Cocina de casa, no de centro comercial.',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80']::text[],
      3.50,
      ARRAY['comida', 'pupusas', 'familia']::text[],
      '{"facebook":"https://facebook.com/"}'::jsonb
    ),
    (
      'Lago de Coatepeque',
      'Lanchas Coatepeque',
      'Recorrido por el agua azul. El lago se entiende desde la lancha, no desde el parqueo.',
      'https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1439066615861-d1af74d74000?auto=format&fit=crop&w=800&q=80']::text[],
      25.00,
      ARRAY['lancha', 'lago', 'familia']::text[],
      '{"whatsapp":"https://wa.me/50370001006"}'::jsonb
    ),
    (
      'Suchitoto',
      'Taller de indigo',
      'Añil, tela y recuerdos del pueblo. Compra directa a quien tiñe en Suchitoto.',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80']::text[],
      12.00,
      ARRAY['artesanías', 'cultura', 'añil']::text[],
      '{"instagram":"https://instagram.com/"}'::jsonb
    ),
    (
      'Joya de Cerén',
      'Guías de la Pompeya de América',
      'Recorrido del sitio con guía local. El pueblo enterrado se lee mejor con quien lo cuenta.',
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=80',
      ARRAY['https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80']::text[],
      5.00,
      ARRAY['guía', 'cultura', 'familia', 'adulto mayor']::text[],
      '{"whatsapp":"https://wa.me/50370001007"}'::jsonb
    )
) AS v(destino_nombre, nombre, descripcion, logo_url, fotos, costo_estimado, keywords, redes_sociales)
JOIN public.destinos d ON d.nombre = v.destino_nombre
ON CONFLICT (destino_id, nombre) DO UPDATE
SET
  descripcion = EXCLUDED.descripcion,
  logo_url = EXCLUDED.logo_url,
  fotos = EXCLUDED.fotos,
  costo_estimado = EXCLUDED.costo_estimado,
  keywords = EXCLUDED.keywords,
  redes_sociales = EXCLUDED.redes_sociales;
