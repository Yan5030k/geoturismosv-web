# GeoTurismoSV (versión web)

Plataforma turística de El Salvador. Esta carpeta es la versión **web** (HTML + JavaScript + Supabase + GitHub Pages). El proyecto Laravel original en `Progra4` no se modifica.

## 1. Crear el proyecto en Supabase

1. Entra a [supabase.com](https://supabase.com) y crea un proyecto.
2. Nombre sugerido: **geoturismosv**.
3. Authentication → Providers → Email: actívalo.
4. Desactiva **Confirm email** mientras pruebas (si no, el login pide confirmar el correo).
5. SQL Editor → New query → pega **todo** el archivo `supabase/schema.sql` → Run.
6. Authentication → Users → Add user (Auto Confirm User):
   - `admin@geoturismosv.com` / `12345678`
   - `usuario@geoturismosv.com` / `12345678`
7. Si el admin no quedó con rol `admin`, corre `supabase/promover-admin.sql`.

## 2. Claves del frontend

Copia `.env.example` a `.env` y pega:

- Project Settings → API → **Project URL** → `VITE_SUPABASE_URL`
- **anon public** → `VITE_SUPABASE_ANON_KEY`

En Authentication → URL Configuration:

- Site URL: `http://localhost:5173`
- Redirect URLs: `http://localhost:5173/**` y, cuando publiques, la URL de GitHub Pages.

## 3. Correr en local

```bash
npm install
npm run dev
```

Abre `http://localhost:5173`. Las rutas usan hash (`/#/destinos`) para que GitHub Pages funcione.

## 4. Subir a GitHub Pages

```bash
npm run build
```

Publica la carpeta `dist/` (Settings → Pages → GitHub Actions o carpeta `/docs`). Cuando tengas el nombre del repo, se ajusta el `base` de Vite si hace falta.

## Credenciales de prueba

| Rol | Correo | Contraseña |
|---|---|---|
| Admin | admin@geoturismosv.com | 12345678 |
| Usuario | usuario@geoturismosv.com | 12345678 |
