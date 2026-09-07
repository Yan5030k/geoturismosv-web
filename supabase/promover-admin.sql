-- Ejecuta esto si ya corriste schema.sql y los usuarios de Auth ya existían.
-- No borra ni recrea usuarios. Solo crea/actualiza profiles.

INSERT INTO public.profiles (id, nombre, email, rol)
SELECT
  u.id,
  COALESCE(
    u.raw_user_meta_data->>'nombre',
    u.raw_user_meta_data->>'name',
    split_part(u.email, '@', 1)
  ),
  u.email,
  CASE
    WHEN lower(u.email) = 'admin@geoturismosv.com' THEN 'admin'
    ELSE 'usuario'
  END
FROM auth.users u
ON CONFLICT (id) DO UPDATE
  SET email = EXCLUDED.email;

UPDATE public.profiles
SET rol = 'admin',
    nombre = 'Administrador GeoTurismoSV'
WHERE lower(email) = 'admin@geoturismosv.com';

UPDATE public.profiles
SET nombre = 'Usuario Turista'
WHERE lower(email) = 'usuario@geoturismosv.com';
