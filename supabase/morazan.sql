-- Additive: Morazán (destinos + emprendimientos). Se puede volver a ejecutar.
-- Eje del departamento: el barro negro de Guatajiagua, la Ruta de Paz y el agua del norte.

INSERT INTO public.destinos (
  nombre, nombre_en, categoria_id, descripcion, descripcion_en,
  ubicacion, ubicacion_en, departamento, municipio,
  direccion, direccion_en, contacto, contacto_en, telefono, imagen,
  costo_estimado, dias_atencion, dias_atencion_en, hora_apertura, hora_cierre,
  recomendaciones, recomendaciones_en, estado, latitud, longitud, rango_edad
) VALUES
(
  'Guatajiagua', 'Guatajiagua', 6,
  'Pueblo alfarero del oriente, conocido como la cuna del barro negro. Las piezas se levantan a mano, se pulen con piedra y se tiñen con la cáscara del nacascolo, que al cocerse deja ese color negro profundo. Es un oficio de raíz lenca-potón que se hereda de madre a hija y todavía sostiene a decenas de familias del municipio.',
  'Pottery town in eastern El Salvador, known as the cradle of black clay. Pieces are shaped by hand, polished with stone, and dyed with nacascolo bark, which turns deep black when fired. It is a Lenca-Potón craft passed from mother to daughter that still supports dozens of families in town.',
  'Guatajiagua, Morazán', 'Guatajiagua, Morazán', 'Morazán', 'Guatajiagua',
  'Casco urbano y talleres de alfarería, Guatajiagua.', 'Town center and pottery workshops, Guatajiagua.', 'Casa de la cultura de Guatajiagua', 'Guatajiagua house of culture', '2600-0201', 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=800&q=80',
  0.00, 'Todos los días', 'Every day', '08:00', '17:00',
  'Ir entre semana para encontrar los talleres trabajando. Llevar efectivo: la compra directa a la alfarera vale más que el recuerdo de tienda.',
  'Come on a weekday to find the workshops at work. Bring cash: buying directly from the potter is worth more than a shop souvenir.',
  true, 13.6631, -88.2019, ARRAY['Niñez', 'Adolescencia', 'Adultez', 'Adulto Mayor']::text[]
),
(
  'Perquín', 'Perquín', 6,
  'Pueblo de montaña sobre los mil metros, corazón de la Ruta de Paz. Aquí está el Museo de la Revolución Salvadoreña y una red de guías que fueron parte de la historia que cuentan. Pinos, clima fresco y calles cortas para caminar sin prisa.',
  'Mountain town above one thousand meters, the heart of the Peace Route. Home to the Salvadoran Revolution Museum and a network of guides who lived the history they tell. Pines, cool weather, and short streets to walk without rushing.',
  'Perquín, Morazán', 'Perquín, Morazán', 'Morazán', 'Perquín',
  'Casco urbano de Perquín, norte de Morazán.', 'Perquín town center, northern Morazán.', 'Información turística municipal', 'Municipal tourist information', '2600-0202', 'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=800&q=80',
  3.00, 'Todos los días', 'Every day', '08:00', '17:00',
  'Llevar abrigo ligero: de noche baja la temperatura. El museo se entiende mejor acompañado de un guía local.',
  'Bring a light jacket: temperatures drop at night. The museum makes more sense with a local guide.',
  true, 13.9578, -88.1567, ARRAY['Adolescencia', 'Adultez', 'Adulto Mayor']::text[]
),
(
  'El Mozote', 'El Mozote', 6,
  'Caserío de Meanguera donde se levanta el monumento a las víctimas de la masacre de 1981. Es un sitio de memoria, no un atractivo: se visita con respeto y acompañado por guías de la propia comunidad, que conservan los nombres y la historia del lugar.',
  'Hamlet in Meanguera where the memorial to the victims of the 1981 massacre stands. It is a place of memory, not an attraction: visit with respect and alongside guides from the community itself, who keep the names and the history of the place.',
  'Meanguera, Morazán', 'Meanguera, Morazán', 'Morazán', 'Meanguera',
  'Caserío El Mozote, Meanguera, Morazán.', 'El Mozote hamlet, Meanguera, Morazán.', 'Guías de la comunidad de El Mozote', 'El Mozote community guides', '2600-0203', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80',
  0.00, 'Todos los días', 'Every day', '08:00', '16:00',
  'Guardar silencio en el monumento, pedir permiso antes de fotografiar y escuchar a los guías de la comunidad.',
  'Keep silence at the memorial, ask permission before taking photos, and listen to the community guides.',
  true, 13.8925, -88.1483, ARRAY['Adolescencia', 'Adultez', 'Adulto Mayor']::text[]
),
(
  'Cascada El Perol', 'El Perol Waterfall', 2,
  'Salto de agua entre pinos a poca distancia de Perquín. La bajada es corta pero de piedra suelta y la poza se mantiene fría todo el año. Se llega con guía del lugar, que conoce el paso cuando el camino está mojado.',
  'Waterfall among pine trees a short distance from Perquín. The descent is short but loose underfoot, and the pool stays cold year round. Reach it with a local guide who knows the path when it is wet.',
  'Perquín, Morazán', 'Perquín, Morazán', 'Morazán', 'Perquín',
  'Cantón cercano a Perquín, norte de Morazán.', 'Hamlet near Perquín, northern Morazán.', 'Guías locales de Perquín', 'Local guides from Perquín', '2600-0204', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80',
  3.00, 'Todos los días', 'Every day', '07:00', '16:00',
  'Calzado con tracción, ropa que se pueda mojar y no bajar solo. Después de lluvia la piedra queda resbalosa.',
  'Shoes with grip, clothes you can get wet, and never go down alone. After rain the rock gets slippery.',
  true, 13.9694, -88.1519, ARRAY['Adolescencia', 'Adultez']::text[]
),
(
  'Río Sapo', 'Sapo River', 2,
  'Uno de los ríos más limpios del país, dentro del área natural de Arambala. Pozas de agua clara, piedra blanca y bosque de pino y roble. Se puede acampar coordinando con la comunidad, que es la que cuida el sitio.',
  'One of the cleanest rivers in the country, inside the Arambala natural area. Clear pools, white rock, and pine and oak forest. Camping is possible by coordinating with the community that looks after the site.',
  'Arambala, Morazán', 'Arambala, Morazán', 'Morazán', 'Arambala',
  'Área natural del Río Sapo, Arambala.', 'Sapo River natural area, Arambala.', 'Guías comunitarios de Arambala', 'Arambala community guides', '2600-0205', 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=800&q=80',
  5.00, 'Todos los días', 'Every day', '07:00', '17:00',
  'Sacar la basura que se lleve, no usar jabón en el río y coordinar la acampada con los guías de Arambala.',
  'Take your trash out, do not use soap in the river, and arrange camping with the Arambala guides.',
  true, 13.9236, -88.1075, ARRAY['Niñez', 'Adolescencia', 'Adultez']::text[]
),
(
  'Cerro Cacahuatique', 'Cacahuatique Hill', 2,
  'Montaña de café al norte de Morazán, con cafetales viejos, neblina de tarde y vista larga hacia todo el oriente del país. El camino es de tierra y se sube desde Osicala o Chilanga.',
  'Coffee mountain in northern Morazán, with old plantations, afternoon fog, and a long view over the whole east of the country. The road is dirt and the climb starts from Osicala or Chilanga.',
  'Osicala, Morazán', 'Osicala, Morazán', 'Morazán', 'Osicala',
  'Camino de tierra al Cerro Cacahuatique, Osicala.', 'Dirt road to Cacahuatique Hill, Osicala.', 'Información turística municipal', 'Municipal tourist information', '2600-0206', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80',
  5.00, 'Todos los días', 'Every day', '06:00', '16:00',
  'Subir en vehículo alto o con transporte local. El amanecer suele estar despejado y la tarde se cierra con neblina.',
  'Go up in a high vehicle or with local transport. Sunrise is usually clear and the afternoon closes in with fog.',
  true, 13.7594, -88.1006, ARRAY['Adolescencia', 'Adultez', 'Adulto Mayor']::text[]
)
ON CONFLICT (nombre) DO UPDATE
SET
  descripcion = EXCLUDED.descripcion,
  descripcion_en = EXCLUDED.descripcion_en,
  imagen = EXCLUDED.imagen,
  costo_estimado = EXCLUDED.costo_estimado,
  recomendaciones = EXCLUDED.recomendaciones,
  latitud = EXCLUDED.latitud,
  longitud = EXCLUDED.longitud,
  rango_edad = EXCLUDED.rango_edad;

INSERT INTO public.emprendimientos (
  destino_id, nombre, descripcion, logo_url, costo_estimado, keywords, redes_sociales
)
SELECT d.id, v.nombre, v.descripcion, v.logo_url, v.costo_estimado, v.keywords, v.redes_sociales
FROM (
  VALUES
    ('Guatajiagua', 'Alfarería de barro negro Las Comaleras', 'Comales, ollas y jarros levantados a mano y teñidos con nacascolo. El oficio pasa de madre a hija y la venta es directa desde el taller.', 'https://images.unsplash.com/photo-1493106641515-6b5631de4bb9?auto=format&fit=crop&w=800&q=80', 8.00, ARRAY['barro negro', 'artesanía', 'cultura', 'souvenirs']::text[], '{"whatsapp":"https://wa.me/50370002001"}'::jsonb),
    ('Guatajiagua', 'Taller de barro El Nacascolo', 'Demostración del torno y del teñido con cáscara de nacascolo. El visitante moldea su propia pieza y se la lleva.', 'https://images.unsplash.com/photo-1565193566173-7a0ee3dbe261?auto=format&fit=crop&w=800&q=80', 5.00, ARRAY['barro negro', 'taller', 'cultura', 'familia']::text[], '{"facebook":"https://facebook.com/"}'::jsonb),
    ('Guatajiagua', 'Comedor La Comalera', 'Pupusas y tortillas cocidas en comal de barro de Guatajiagua. El sabor no es el mismo que sale del comal de metal.', 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80', 3.00, ARRAY['comida', 'pupusas', 'familia']::text[], '{"facebook":"https://facebook.com/"}'::jsonb),
    ('Guatajiagua', 'Barro para la casa Doña Tila', 'Tinajas, macetas y ollas para cocinar. Las piezas grandes se hacen por encargo y se empacan para viajar.', 'https://images.unsplash.com/photo-1610701596007-11502861dcfa?auto=format&fit=crop&w=800&q=80', 10.00, ARRAY['barro negro', 'artesanía', 'souvenirs']::text[], '{"whatsapp":"https://wa.me/50370002002"}'::jsonb),
    ('Perquín', 'Guías de la Ruta de Paz', 'Recorrido del pueblo y del museo con guías que vivieron la historia que cuentan. Grupos pequeños, en español.', 'https://images.unsplash.com/photo-1520962880247-cfaf541c8724?auto=format&fit=crop&w=800&q=80', 10.00, ARRAY['guía', 'historia', 'cultura', 'comunidad']::text[], '{"whatsapp":"https://wa.me/50370002003"}'::jsonb),
    ('Perquín', 'Café de altura de Perquín', 'Café de montaña cortado y tostado en el pueblo. Taza caliente en la mesa y libra para llevar.', 'https://images.unsplash.com/photo-1442512595331-e89e73853f31?auto=format&fit=crop&w=800&q=80', 4.00, ARRAY['café', 'comida']::text[], '{"instagram":"https://instagram.com/"}'::jsonb),
    ('Perquín', 'Tejidos de henequén Perquín', 'Hamacas, matates y bolsos tejidos en fibra de henequén por familias del norte de Morazán.', 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=800&q=80', 12.00, ARRAY['artesanía', 'henequén', 'souvenirs']::text[], '{"facebook":"https://facebook.com/"}'::jsonb),
    ('El Mozote', 'Guías de memoria de El Mozote', 'Recorrido del caserío y el monumento con guías de la comunidad, que conservan los nombres y la historia del lugar.', 'https://images.unsplash.com/photo-1470071459604-3b5ec3a7fe05?auto=format&fit=crop&w=800&q=80', 8.00, ARRAY['guía', 'historia', 'memoria', 'comunidad']::text[], '{"whatsapp":"https://wa.me/50370002004"}'::jsonb),
    ('Río Sapo', 'Guías y acampada del Río Sapo', 'Sendero a las pozas y acampada coordinada con la comunidad de Arambala. El pago sostiene el cuido del área.', 'https://images.unsplash.com/photo-1437482078695-73f5ca6c96e2?auto=format&fit=crop&w=800&q=80', 7.00, ARRAY['guía', 'naturaleza', 'aventura', 'comunidad']::text[], '{"whatsapp":"https://wa.me/50370002005"}'::jsonb),
    ('Cascada El Perol', 'Guías de El Perol', 'Bajada a la cascada con guía del lugar. Grupos pequeños y ritmo para quien va por primera vez.', 'https://images.unsplash.com/photo-1432405972618-c60b0225b8f9?auto=format&fit=crop&w=800&q=80', 5.00, ARRAY['guía', 'naturaleza', 'aventura']::text[], '{"whatsapp":"https://wa.me/50370002006"}'::jsonb),
    ('Cerro Cacahuatique', 'Finca de café Cacahuatique', 'Recorrido del cafetal, corte de la cereza y taza al final. Café de altura del norte de Morazán.', 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80', 12.00, ARRAY['café', 'finca', 'naturaleza', 'comunidad']::text[], '{"instagram":"https://instagram.com/"}'::jsonb)
) AS v(destino_nombre, nombre, descripcion, logo_url, costo_estimado, keywords, redes_sociales)
JOIN public.destinos d ON d.nombre = v.destino_nombre
ON CONFLICT (destino_id, nombre) DO UPDATE
SET
  descripcion = EXCLUDED.descripcion,
  logo_url = EXCLUDED.logo_url,
  costo_estimado = EXCLUDED.costo_estimado,
  keywords = EXCLUDED.keywords,
  redes_sociales = EXCLUDED.redes_sociales;
