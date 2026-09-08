import { supabase } from '../lib/supabase.js';
import { destinoImagen } from '../lib/imagen.js';
import { esc, getLocale, tDb } from '../lib/html.js';
import { t } from '../lib/i18n.js';
import { publicNav } from '../lib/nav.js';
import { auth, isLoggedIn } from '../lib/auth.js';
import { cargarTasas, formatearPrecio, monedaGuardada } from '../lib/monedas.js';
import { COMERCIO_FALLBACK, estrellasHtml } from '../lib/comercio.js';

function iconoClima(codigo) {
  if (codigo === 0) return '☀️ Despejado';
  if (codigo >= 1 && codigo <= 3) return '⛅ Parcialmente nublado';
  if (codigo >= 45 && codigo <= 48) return '🌫️ Niebla';
  if (codigo >= 51 && codigo <= 67) return '🌧️ Lluvia';
  if (codigo >= 71 && codigo <= 77) return '❄️ Nieve';
  if (codigo >= 80 && codigo <= 82) return '🌦️ Chubascos';
  if (codigo >= 95) return '⛈️ Tormenta';
  return '🌥️ Nublado';
}

export async function render(root, route) {
  const { data, error } = await supabase
    .from('destinos')
    .select('*, categoria:categorias(*)')
    .eq('id', route.destId)
    .eq('estado', true)
    .maybeSingle();

  if (error || !data) {
    root.innerHTML = `${publicNav()}<main class="mx-auto max-w-5xl px-6 py-10"><p>Destino no encontrado.</p></main>`;
    return;
  }

  const [{ data: favRow }, { data: comerciosDb }, { data: resenasDb }, rates] = await Promise.all([
    auth.user
      ? supabase.from('favoritos').select('id').eq('user_id', auth.user.id).eq('destino_id', data.id).maybeSingle()
      : Promise.resolve({ data: null }),
    supabase.from('emprendimientos').select('*').eq('destino_id', data.id),
    supabase
      .from('comunidad_resenas')
      .select('*, perfil:profiles(nombre)')
      .eq('destino_id', data.id)
      .order('created_at', { ascending: false }),
    cargarTasas(),
  ]);

  const esFavorito = Boolean(favRow);
  const moneda = monedaGuardada();
  const comercios = (comerciosDb && comerciosDb.length ? comerciosDb : COMERCIO_FALLBACK[data.nombre] || []).slice(0, 8);
  const resenas = resenasDb || [];

  let clima = null;
  try {
    let lat = data.latitud;
    let lon = data.longitud;
    if (!lat || !lon) {
      const query = encodeURIComponent(`${data.nombre}, El Salvador`);
      const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${query}&count=1&language=es&format=json`);
      const geoData = await geoRes.json();
      lat = geoData.results?.[0]?.latitude ?? 13.6929;
      lon = geoData.results?.[0]?.longitude ?? -89.2182;
    }
    const weatherRes = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true`);
    const weatherData = await weatherRes.json();
    clima = weatherData.current_weather || null;
  } catch {
    clima = null;
  }

  const climaHtml = clima
    ? `<div class="flex items-center gap-4"><div class="text-5xl">${iconoClima(clima.weathercode).split(' ')[0]}</div>
         <div><p class="text-4xl font-black text-white">${clima.temperature}°C</p>
         <p class="text-sm text-white/90">${esc(iconoClima(clima.weathercode).split(' ').slice(1).join(' '))}</p></div></div>`
    : `<p class="text-white/90 text-sm">${esc(t('detail.weather_loading'))}</p>`;

  const maps = data.latitud && data.longitud
    ? `<a href="https://www.google.com/maps/dir/?api=1&destination=${data.latitud},${data.longitud}" target="_blank" rel="noopener" class="inline-flex rounded-xl bg-[#4285F4] px-6 py-3 font-semibold text-white">${esc(t('detail.google_maps'))}</a>`
    : '';

  const favBlock = isLoggedIn()
    ? `<div class="mt-8 rounded-2xl bg-slate-100 dark:bg-gray-700 p-5">
        <h2 class="text-xl font-bold text-gray-900 dark:text-white">${esc(t('detail.interested'))}</h2>
        <p class="mt-1 text-gray-600 dark:text-gray-300">${esc(t('detail.interested_desc'))}</p>
        <button type="button" id="fav-btn" class="mt-4 rounded-full px-5 py-3 font-semibold text-white ${esFavorito ? 'bg-red-600' : 'bg-[#168a1a]'}">${esc(esFavorito ? t('detail.remove_favorite') : t('detail.save_favorite'))}</button>
      </div>`
    : `<div class="mt-8 rounded-2xl border border-yellow-200 bg-yellow-50 dark:bg-yellow-900/20 dark:border-yellow-700 p-5 text-yellow-800 dark:text-yellow-200">
        <h2 class="font-bold">${esc(t('detail.login_favorite'))}</h2>
        <p class="mt-1">${esc(t('detail.login_desc'))}</p>
        <a href="#/entrar" data-link class="mt-4 inline-block rounded-full bg-[#f4a000] px-5 py-2 font-semibold text-white">${esc(t('detail.login_btn'))}</a>
      </div>`;

  const comercioHtml = comercios.length
    ? `<section class="mt-10">
        <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Comercio local</h2>
        <p class="mt-1 text-gray-600 dark:text-gray-300">Quien habita el destino: comida, artesanías y guías.</p>
        <div class="geo-carousel mt-5">
          ${comercios
            .map(
              (c) => `
            <article class="geo-comercio">
              <img src="${esc(c.logo_url || destinoImagen(data.imagen))}" alt="${esc(c.nombre)}">
              <div class="p-4">
                <h3 class="font-bold text-gray-900 dark:text-white">${esc(c.nombre)}</h3>
                <p class="mt-2 text-sm text-gray-600 dark:text-gray-300">${esc(c.descripcion)}</p>
                <p class="mt-3 text-sm font-bold text-[#0b6fb3]">${esc(formatearPrecio(c.costo_estimado, moneda, rates))}</p>
              </div>
            </article>`,
            )
            .join('')}
        </div>
      </section>`
    : '';

  const reviewForm = isLoggedIn()
    ? `<form id="review-form" class="geo-review-form mt-6 space-y-3">
        <label class="block text-sm text-gray-700 dark:text-gray-300">Estrellas
          <select name="estrellas" class="mt-1">
            ${[5, 4, 3, 2, 1].map((n) => `<option value="${n}">${n}</option>`).join('')}
          </select>
        </label>
        <label class="block text-sm text-gray-700 dark:text-gray-300">Tu visita
          <textarea name="comentario" required rows="3" placeholder="¿Qué viste, a quién conociste?"></textarea>
        </label>
        <p id="review-msg" class="text-sm text-[#168a1a]"></p>
        <button class="rounded-full bg-[#168a1a] px-5 py-2 font-bold text-white">Publicar reseña</button>
      </form>`
    : `<p class="mt-4 text-gray-600 dark:text-gray-300">Inicia sesión para dejar tu reseña. <a href="#/entrar" data-link class="text-[#0b6fb3] font-bold">Entrar</a></p>`;

  root.innerHTML = `
    <div class="min-h-screen bg-slate-50 dark:bg-gray-900">
      ${publicNav()}
      <main class="mx-auto max-w-5xl px-6 py-10">
        <a href="#/destinos" data-link class="font-semibold text-[#0b6fb3]">${esc(t('detail.back'))}</a>
        <article class="mt-6 overflow-hidden rounded-2xl bg-white dark:bg-gray-800 shadow-lg">
          <div class="relative">
            <img src="${esc(destinoImagen(data.imagen))}" alt="${esc(tDb(data, 'nombre'))}" class="h-96 w-full object-cover">
            <div class="absolute bottom-6 right-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/20 p-5">${climaHtml}</div>
          </div>
          <div class="p-8">
            <p class="font-semibold text-[#168a1a]">${esc(tDb(data.categoria, 'nombre'))}</p>
            <h1 class="mt-2 text-4xl font-bold text-gray-900 dark:text-white">${esc(tDb(data, 'nombre'))}</h1>
            <p class="mt-2 text-gray-600 dark:text-gray-300">${esc(tDb(data, 'ubicacion'))}</p>
            <div class="mt-4">${(data.rango_edad || []).map((r) => `<span class="geo-chip">${esc(r)}</span>`).join('')}</div>
            <div class="mt-6 grid gap-4 md:grid-cols-3">
              <div class="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-4"><strong class="text-[#0b6fb3]">${esc(t('detail.cost'))}</strong><p class="mt-1 text-gray-900 dark:text-white">${esc(formatearPrecio(data.costo_estimado, moneda, rates))}</p></div>
              <div class="rounded-xl bg-green-50 dark:bg-green-950/40 p-4"><strong class="text-[#168a1a]">${esc(t('detail.hours'))}</strong><p class="mt-1 text-gray-900 dark:text-white">${esc(tDb(data, 'dias_atencion') || t('detail.hours_unspecified'))}</p><p class="text-gray-600 dark:text-gray-300">${data.hora_apertura && data.hora_cierre ? `${esc(data.hora_apertura)} - ${esc(data.hora_cierre)}` : esc(t('detail.time_unspecified'))}</p></div>
              <div class="rounded-xl bg-orange-50 dark:bg-orange-950/40 p-4"><strong class="text-[#f4a000]">${esc(t('detail.status'))}</strong><p class="mt-1 text-gray-900 dark:text-white">${esc(data.estado ? t('detail.available') : t('detail.unavailable'))}</p></div>
            </div>
            <section class="mt-8">
              <div class="flex items-center justify-between gap-4">
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${esc(t('detail.description'))}</h2>
                <button type="button" id="tts" class="rounded-full bg-[#e7f3eb] px-4 py-2 text-sm font-semibold text-[#168a1a]">${esc(t('detail.listen'))}</button>
              </div>
              <p class="mt-4 leading-relaxed text-gray-700 dark:text-gray-300 whitespace-pre-wrap">${esc(tDb(data, 'descripcion'))}</p>
            </section>
            <section class="mt-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${esc(t('detail.location'))}</h2>
              <div class="mt-3 grid gap-4 md:grid-cols-2">
                <div class="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-4"><strong class="text-[#0b6fb3]">${esc(t('detail.department'))}</strong><p class="text-gray-900 dark:text-white">${esc(data.departamento || t('detail.unspecified'))}</p></div>
                <div class="rounded-xl bg-green-50 dark:bg-green-950/40 p-4"><strong class="text-[#168a1a]">${esc(t('detail.municipality'))}</strong><p class="text-gray-900 dark:text-white">${esc(data.municipio || t('detail.unspecified'))}</p></div>
              </div>
              <div class="mt-4 rounded-xl bg-slate-100 dark:bg-gray-700 p-4"><strong class="text-gray-900 dark:text-white">${esc(t('detail.address'))}</strong><p class="text-gray-600 dark:text-gray-300">${esc(tDb(data, 'direccion') || t('detail.address_unspecified'))}</p></div>
              <div class="mt-6">${maps}</div>
            </section>
            <section class="mt-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${esc(t('detail.contact_info'))}</h2>
              <div class="mt-3 grid gap-4 md:grid-cols-3">
                <div class="rounded-xl bg-blue-50 dark:bg-blue-950/40 p-4"><strong class="text-[#0b6fb3]">${esc(t('detail.contact'))}</strong><p class="text-gray-900 dark:text-white">${esc(tDb(data, 'contacto') || t('detail.unspecified'))}</p></div>
                <div class="rounded-xl bg-green-50 dark:bg-green-950/40 p-4"><strong class="text-[#168a1a]">${esc(t('detail.phone'))}</strong><p class="text-gray-900 dark:text-white">${esc(data.telefono || t('detail.unspecified'))}</p></div>
                <div class="rounded-xl bg-orange-50 dark:bg-orange-950/40 p-4"><strong class="text-[#f4a000]">${esc(t('detail.website'))}</strong>${data.sitio_web ? `<a href="${esc(data.sitio_web)}" class="text-[#0b6fb3] underline" target="_blank" rel="noopener">${esc(t('detail.visit_website'))}</a>` : `<p class="text-gray-900 dark:text-white">${esc(t('detail.unspecified'))}</p>`}</div>
              </div>
            </section>
            <section class="mt-6">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">${esc(t('detail.recommendations'))}</h2>
              <p class="mt-2 whitespace-pre-wrap text-gray-700 dark:text-gray-300">${esc(tDb(data, 'recomendaciones'))}</p>
            </section>
            ${comercioHtml}
            <section class="mt-10">
              <h2 class="text-2xl font-bold text-gray-900 dark:text-white">Reseñas de la comunidad</h2>
              <div class="mt-4 space-y-4">
                ${
                  resenas.length
                    ? resenas
                        .map(
                          (r) => `
                  <article class="rounded-2xl bg-slate-50 dark:bg-gray-700 p-4">
                    <p class="text-sm font-bold text-gray-900 dark:text-white">${esc(r.perfil?.nombre || 'Viajero')}</p>
                    <div class="mt-1">${estrellasHtml(r.estrellas)}</div>
                    <p class="mt-2 text-gray-700 dark:text-gray-200">${esc(r.comentario)}</p>
                  </article>`,
                        )
                        .join('')
                    : `<p class="text-gray-500">Sé el primero en contar esta visita.</p>`
                }
              </div>
              ${reviewForm}
            </section>
            ${favBlock}
          </div>
        </article>
      </main>
    </div>
  `;

  const ttsBtn = root.querySelector('#tts');
  let playing = false;
  ttsBtn?.addEventListener('click', () => {
    if (!('speechSynthesis' in window)) return;
    if (playing) {
      speechSynthesis.cancel();
      playing = false;
      ttsBtn.textContent = t('detail.listen');
      return;
    }
    let texto = tDb(data, 'descripcion') || '';
    const depto = data.departamento;
    const muni = data.municipio;
    const en = getLocale() === 'en';
    if (depto && muni) texto += en ? ` It is located in the department of ${depto}, municipality of ${muni}.` : ` Se encuentra ubicado en el departamento de ${depto}, municipio de ${muni}.`;
    const u = new SpeechSynthesisUtterance(texto);
    u.lang = en ? 'en-US' : 'es-ES';
    u.onend = () => {
      playing = false;
      ttsBtn.textContent = t('detail.listen');
    };
    playing = true;
    ttsBtn.textContent = t('detail.stop_listening');
    speechSynthesis.speak(u);
  });

  const favBtn = root.querySelector('#fav-btn');
  let fav = esFavorito;
  favBtn?.addEventListener('click', async () => {
    if (!auth.user) return;
    if (fav) {
      await supabase.from('favoritos').delete().eq('user_id', auth.user.id).eq('destino_id', data.id);
      fav = false;
    } else {
      await supabase.from('favoritos').insert({ user_id: auth.user.id, destino_id: data.id });
      fav = true;
    }
    favBtn.textContent = fav ? t('detail.remove_favorite') : t('detail.save_favorite');
    favBtn.classList.toggle('bg-red-600', fav);
    favBtn.classList.toggle('bg-[#168a1a]', !fav);
  });

  const reviewFormEl = root.querySelector('#review-form');
  reviewFormEl?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!auth.user) return;
    const fd = new FormData(e.target);
    const msg = root.querySelector('#review-msg');
    const { error: revErr } = await supabase.from('comunidad_resenas').upsert(
      {
        user_id: auth.user.id,
        destino_id: data.id,
        comentario: String(fd.get('comentario') || '').trim(),
        estrellas: Number(fd.get('estrellas')),
      },
      { onConflict: 'user_id,destino_id' },
    );
    if (revErr) {
      msg.textContent = revErr.message;
      return;
    }
    msg.textContent = 'Reseña publicada.';
    window.dispatchEvent(new Event('hashchange'));
  });

  return () => {
    if ('speechSynthesis' in window) speechSynthesis.cancel();
  };
}
