-- =============================================================================
-- GeoTurismoSV · Remaster Fase 2 (San Miguel)
-- ADITIVO: no borra tablas, usuarios ni destinos existentes.
-- Pegar TODO este archivo en Supabase → SQL Editor → Run.
-- Se puede volver a ejecutar: usa IF NOT EXISTS / ON CONFLICT.
-- =============================================================================

-- -----------------------------------------------------------------------------
-- 1) profiles.rol: admin | viajero | emprendedor
--    Los perfiles actuales con rol 'usuario' pasan a 'viajero'.
-- -----------------------------------------------------------------------------

ALTER TABLE public.profiles
  DROP CONSTRAINT IF EXISTS profiles_rol_check;

UPDATE public.profiles
SET rol = 'viajero'
WHERE rol = 'usuario';

ALTER TABLE public.profiles
  ALTER COLUMN rol SET DEFAULT 'viajero';

ALTER TABLE public.profiles
  ADD CONSTRAINT profiles_rol_check
  CHECK (rol IN ('admin', 'viajero', 'emprendedor'));

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, nombre, email, rol)
  VALUES (
    NEW.id,
    COALESCE(
      NEW.raw_user_meta_data->>'nombre',
      NEW.raw_user_meta_data->>'name',
      split_part(NEW.email, '@', 1)
    ),
    NEW.email,
    'viajero'
  )
  ON CONFLICT (id) DO UPDATE
    SET email = EXCLUDED.email,
        nombre = COALESCE(public.profiles.nombre, EXCLUDED.nombre);

  RETURN NEW;
END;
$$;

CREATE OR REPLACE FUNCTION public.is_emprendedor()
RETURNS boolean
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.profiles
    WHERE id = auth.uid()
      AND rol IN ('emprendedor', 'admin')
  );
$$;

-- -----------------------------------------------------------------------------
-- 2) destinos.rango_edad  (Niñez, Adolescencia, Adultez, Adulto Mayor)
-- -----------------------------------------------------------------------------

ALTER TABLE public.destinos
  ADD COLUMN IF NOT EXISTS rango_edad text[] NOT NULL DEFAULT ARRAY['Adultez']::text[];

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'destinos_rango_edad_check'
  ) THEN
    ALTER TABLE public.destinos
      ADD CONSTRAINT destinos_rango_edad_check
      CHECK (rango_edad <@ ARRAY['Niñez', 'Adolescencia', 'Adultez', 'Adulto Mayor']::text[]);
  END IF;
END $$;

CREATE INDEX IF NOT EXISTS destinos_rango_edad_idx
  ON public.destinos USING GIN (rango_edad);

-- Destino extra para la ruta "Volcán al Mar" (no pisa los existentes).
INSERT INTO public.destinos (
  nombre, nombre_en, categoria_id,
  descripcion, descripcion_en,
  ubicacion, ubicacion_en, departamento, municipio,
  direccion, direccion_en, contacto, contacto_en, telefono, sitio_web, imagen,
  costo_estimado, dias_atencion, dias_atencion_en, hora_apertura, hora_cierre,
  recomendaciones, recomendaciones_en, estado, latitud, longitud, rango_edad
)
SELECT
  'Centro Histórico de San Miguel',
  'San Miguel Historic Center',
  6,
  $d$Corazón urbano de la capital oriental: Catedral Nuestra Señora de la Paz, Parque David J. Guzmán y el legado de Carnaval. Punto de partida para leer San Miguel antes de subir al volcán o bajar al mar.$d$,
  $d$Urban heart of the eastern capital: Cathedral of Our Lady of Peace, David J. Guzmán Park, and Carnival heritage. Starting point to read San Miguel before the volcano or the sea.$d$,
  'San Miguel, San Miguel',
  'San Miguel, San Miguel',
  'San Miguel',
  'San Miguel',
  'Parque David J. Guzmán y Catedral, centro de San Miguel.',
  'David J. Guzmán Park and Cathedral, downtown San Miguel.',
  'Casa de la cultura / información municipal',
  'House of culture / municipal information',
  '2661-0000',
  NULL,
  'images/centro_historico_alegria.jpeg',
  0.00,
  'Todos los días',
  'Every day',
  '08:00',
  '20:00',
  $d$Caminar de día, probar pupusas en el centro y partir temprano si se continúa al Chaparrastique o a El Cuco.$d$,
  $d$Walk during the day, try pupusas downtown, and leave early if continuing to Chaparrastique or El Cuco.$d$,
  true,
  13.4812000,
  -88.1773000,
  ARRAY['Niñez', 'Adolescencia', 'Adultez', 'Adulto Mayor']::text[]
WHERE NOT EXISTS (
  SELECT 1 FROM public.destinos WHERE nombre = 'Centro Histórico de San Miguel'
);

-- Rangos de edad: San Miguel (pitch) + resto del catálogo.
UPDATE public.destinos SET rango_edad = ARRAY['Niñez', 'Adolescencia', 'Adultez', 'Adulto Mayor']
WHERE nombre IN ('Playa El Cuco', 'Centro Histórico de San Miguel', 'Turicentro Flor del Río', 'Hostal y Parque Acuático El Edén de Brizuela');

UPDATE public.destinos SET rango_edad = ARRAY['Adolescencia', 'Adultez']
WHERE nombre IN ('Volcán Chaparrastique', 'Laguna Seca El Pacayal');

UPDATE public.destinos SET rango_edad = ARRAY['Niñez', 'Adolescencia', 'Adultez', 'Adulto Mayor']
WHERE nombre = 'Restaurante Mirador Oriental';

UPDATE public.destinos SET rango_edad = ARRAY['Adultez', 'Adulto Mayor']
WHERE nombre = 'Hotel Vista Azul';

UPDATE public.destinos SET rango_edad = ARRAY['Niñez', 'Adolescencia', 'Adultez', 'Adulto Mayor']
WHERE nombre IN ('Playa El Tunco', 'Suchitoto', 'Lago de Coatepeque', 'Lago de Ilopango', 'Centro Histórico de Alegría', 'Laguna de Alegría');

UPDATE public.destinos SET rango_edad = ARRAY['Adolescencia', 'Adultez', 'Adulto Mayor']
WHERE nombre IN ('Volcán El Boquerón', 'Joya de Cerén', 'Golfo de Fonseca');

-- -----------------------------------------------------------------------------
-- 3) emprendimientos  (comercio local anclado a un destino)
--    user_id puede ser NULL en filas curadas por el equipo (semilla).
--    Nombre ASCII: comunidad_resenas (sin ñ) para que PostgREST no falle.
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.emprendimientos (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id uuid REFERENCES public.profiles (id) ON DELETE SET NULL,
  destino_id bigint NOT NULL REFERENCES public.destinos (id) ON DELETE CASCADE,
  nombre text NOT NULL,
  descripcion text NOT NULL,
  logo_url text,
  fotos text[] NOT NULL DEFAULT ARRAY[]::text[],
  costo_estimado numeric(8, 2) NOT NULL DEFAULT 0,
  keywords text[] NOT NULL DEFAULT ARRAY[]::text[],
  redes_sociales jsonb NOT NULL DEFAULT '{}'::jsonb,
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  updated_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (destino_id, nombre)
);

CREATE INDEX IF NOT EXISTS emprendimientos_destino_id_idx ON public.emprendimientos (destino_id);
CREATE INDEX IF NOT EXISTS emprendimientos_user_id_idx ON public.emprendimientos (user_id);
CREATE INDEX IF NOT EXISTS emprendimientos_keywords_idx ON public.emprendimientos USING GIN (keywords);

DROP TRIGGER IF EXISTS emprendimientos_set_updated_at ON public.emprendimientos;
CREATE TRIGGER emprendimientos_set_updated_at
BEFORE UPDATE ON public.emprendimientos
FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

ALTER TABLE public.emprendimientos ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "emprendimientos_public_read" ON public.emprendimientos;
CREATE POLICY "emprendimientos_public_read"
ON public.emprendimientos FOR SELECT
USING (true);

DROP POLICY IF EXISTS "emprendimientos_insert_own" ON public.emprendimientos;
CREATE POLICY "emprendimientos_insert_own"
ON public.emprendimientos FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "emprendimientos_update_own" ON public.emprendimientos;
CREATE POLICY "emprendimientos_update_own"
ON public.emprendimientos FOR UPDATE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin())
WITH CHECK (auth.uid() = user_id OR public.is_admin());

DROP POLICY IF EXISTS "emprendimientos_delete_own" ON public.emprendimientos;
CREATE POLICY "emprendimientos_delete_own"
ON public.emprendimientos FOR DELETE
TO authenticated
USING (auth.uid() = user_id OR public.is_admin());

GRANT SELECT ON public.emprendimientos TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.emprendimientos TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.emprendimientos_id_seq TO authenticated;

-- Semilla comercio local · San Miguel (placeholders, sin APIs de pago)
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
      'Minutas Don Juan',
      'Minutas, frescos y elotes frente a la playa. Punto de encuentro familiar después del mar.',
      'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80',
        'https://images.unsplash.com/photo-1473116763249-2faaef81ccda?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      3.50,
      ARRAY['comida', 'familia', 'niños', 'playa']::text[],
      '{"facebook":"https://facebook.com/","instagram":"https://instagram.com/"}'::jsonb
    ),
    (
      'Playa El Cuco',
      'Artesanías Las Olas',
      'Conchas, collares y hamacas hechas en Chirilagua. Compra directa a familias de la costa.',
      'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1452860606245-08befc0ff44b?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      12.00,
      ARRAY['artesanías', 'souvenirs', 'comunidad']::text[],
      '{"instagram":"https://instagram.com/","whatsapp":"https://wa.me/50370000000"}'::jsonb
    ),
    (
      'Playa El Cuco',
      'Mariscos La Concha',
      'Cócteles, conchas y pescado frito del día. Cocina de la orilla, precio de mercado.',
      'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1559339352-11d035aa65de?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      14.00,
      ARRAY['comida', 'mariscos', 'familia']::text[],
      '{"facebook":"https://facebook.com/"}'::jsonb
    ),
    (
      'Volcán Chaparrastique',
      'Guías del Chaparrastique',
      'Ascenso con guías locales de San Miguel. Ritmo para adultos y adolescentes con buena condición.',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      18.00,
      ARRAY['guía', 'aventura', 'volcán']::text[],
      '{"whatsapp":"https://wa.me/50370000001"}'::jsonb
    ),
    (
      'Volcán Chaparrastique',
      'Café El Mirador',
      'Café de altura y pupusas después de la caminata. Vista al cono del Chaparrastique.',
      'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      6.00,
      ARRAY['comida', 'café', 'familia']::text[],
      '{"instagram":"https://instagram.com/"}'::jsonb
    ),
    (
      'Centro Histórico de San Miguel',
      'Pupusas La Catedral',
      'Pupusas revueltas y horchata a dos cuadras de la Catedral. Mesa de plástico, receta de casa.',
      'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      2.50,
      ARRAY['comida', 'familia', 'niños', 'cultura']::text[],
      '{"facebook":"https://facebook.com/"}'::jsonb
    ),
    (
      'Centro Histórico de San Miguel',
      'Tour Carnaval y Centro',
      'Recorrido a pie: catedral, parque y murales. Ideal para quien llega a San Miguel por primera vez.',
      'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      8.00,
      ARRAY['cultura', 'guía', 'familia', 'adulto mayor']::text[],
      '{"whatsapp":"https://wa.me/50370000002"}'::jsonb
    ),
    (
      'Turicentro Flor del Río',
      'Cocina de la vertiente',
      'Sopa de gallina y frescos junto a las piscinas de agua de nacimiento. Cocina de Moncagua.',
      'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      7.00,
      ARRAY['comida', 'familia', 'niños']::text[],
      '{"facebook":"https://facebook.com/"}'::jsonb
    ),
    (
      'Laguna Seca El Pacayal',
      'Guías del Pacayal',
      'Caminata por la caldera seca y cafetales. Obligatorio ir con guía local de Chinameca.',
      'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      15.00,
      ARRAY['guía', 'naturaleza', 'café']::text[],
      '{"whatsapp":"https://wa.me/50370000003"}'::jsonb
    ),
    (
      'Hotel Vista Azul',
      'Tours a El Cuco',
      'Traslados y salidas al atardecer desde el hotel hacia la playa. Para huéspedes y visitantes.',
      'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=400&q=80',
      ARRAY[
        'https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=800&q=80'
      ]::text[],
      10.00,
      ARRAY['transporte', 'playa', 'familia']::text[],
      '{"instagram":"https://instagram.com/"}'::jsonb
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

-- -----------------------------------------------------------------------------
-- 4) comunidad_resenas  (reseñas de viajeros · sin ñ para la API)
-- -----------------------------------------------------------------------------

CREATE TABLE IF NOT EXISTS public.comunidad_resenas (
  id bigint GENERATED BY DEFAULT AS IDENTITY PRIMARY KEY,
  user_id uuid NOT NULL REFERENCES public.profiles (id) ON DELETE CASCADE,
  destino_id bigint NOT NULL REFERENCES public.destinos (id) ON DELETE CASCADE,
  comentario text NOT NULL,
  estrellas integer NOT NULL CHECK (estrellas BETWEEN 1 AND 5),
  fotos text[] NOT NULL DEFAULT ARRAY[]::text[],
  created_at timestamptz NOT NULL DEFAULT timezone('utc', now()),
  UNIQUE (user_id, destino_id)
);

CREATE INDEX IF NOT EXISTS comunidad_resenas_destino_id_idx ON public.comunidad_resenas (destino_id);
CREATE INDEX IF NOT EXISTS comunidad_resenas_created_at_idx ON public.comunidad_resenas (created_at DESC);

ALTER TABLE public.comunidad_resenas ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "comunidad_resenas_public_read" ON public.comunidad_resenas;
CREATE POLICY "comunidad_resenas_public_read"
ON public.comunidad_resenas FOR SELECT
USING (true);

DROP POLICY IF EXISTS "comunidad_resenas_insert_own" ON public.comunidad_resenas;
CREATE POLICY "comunidad_resenas_insert_own"
ON public.comunidad_resenas FOR INSERT
TO authenticated
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comunidad_resenas_update_own" ON public.comunidad_resenas;
CREATE POLICY "comunidad_resenas_update_own"
ON public.comunidad_resenas FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "comunidad_resenas_delete_own" ON public.comunidad_resenas;
CREATE POLICY "comunidad_resenas_delete_own"
ON public.comunidad_resenas FOR DELETE
TO authenticated
USING (auth.uid() = user_id);

GRANT SELECT ON public.comunidad_resenas TO anon, authenticated;
GRANT INSERT, UPDATE, DELETE ON public.comunidad_resenas TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.comunidad_resenas_id_seq TO authenticated;

-- Reseñas de demo (solo si existe el usuario de prueba)
INSERT INTO public.comunidad_resenas (user_id, destino_id, comentario, estrellas, fotos)
SELECT
  p.id,
  d.id,
  v.comentario,
  v.estrellas,
  v.fotos
FROM public.profiles p
CROSS JOIN (
  VALUES
    (
      'Playa El Cuco',
      'Llegamos en familia. Las minutas frente al mar y el atardecer valen el viaje desde San Miguel.',
      5,
      ARRAY['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80']::text[]
    ),
    (
      'Volcán Chaparrastique',
      'Subida exigente. Fuimos con guía local y el paisaje del oriente se entiende desde arriba.',
      4,
      ARRAY[]::text[]
    ),
    (
      'Centro Histórico de San Miguel',
      'El parque y la catedral son el mejor punto de partida. Pupusas a dos cuadras, sin prisa.',
      5,
      ARRAY[]::text[]
    )
) AS v(destino_nombre, comentario, estrellas, fotos)
JOIN public.destinos d ON d.nombre = v.destino_nombre
WHERE p.email = 'usuario@geoturismosv.com'
ON CONFLICT (user_id, destino_id) DO NOTHING;

-- =============================================================================
-- Comprobación rápida (opcional): deberías ver 3 roles, columna rango_edad,
-- emprendimientos > 0 y reseñas si el usuario de prueba existe.
-- =============================================================================
-- SELECT DISTINCT rol FROM public.profiles;
-- SELECT nombre, departamento, rango_edad FROM public.destinos WHERE departamento = 'San Miguel';
-- SELECT COUNT(*) FROM public.emprendimientos;
-- SELECT COUNT(*) FROM public.comunidad_resenas;
