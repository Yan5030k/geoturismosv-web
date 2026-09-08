import { supabase } from './supabase.js';
import { go } from './router.js';

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

export function interpretarPedido(texto) {
  const t = normalizar(texto);
  let edad = '';
  if (/nino|nina|familia|bebe|hijo|hijos|familiar/.test(t)) edad = 'Niñez';
  else if (/adolescente|joven|aventura|sendero/.test(t)) edad = 'Adolescencia';
  else if (/abuelo|mayor|senior/.test(t)) edad = 'Adulto Mayor';
  else if (/adulto/.test(t)) edad = 'Adultez';

  return {
    departamento: 'San Miguel',
    edad,
    crudo: t,
  };
}

function coincideDestino(destino, pedido, keywordsExtra = []) {
  if (destino.departamento !== 'San Miguel') return false;
  if (pedido.edad) {
    const rangos = destino.rango_edad || [];
    if (!rangos.includes(pedido.edad)) return false;
  }
  const blob = normalizar(
    [destino.nombre, destino.descripcion, destino.ubicacion, ...(destino.rango_edad || []), ...keywordsExtra].join(' '),
  );
  const palabras = pedido.crudo.split(/\s+/).filter((w) => w.length > 3);
  if (!palabras.length) return true;
  const claves = ['playa', 'volcan', 'mar', 'cuco', 'chaparrastique', 'centro', 'familia', 'ninos', 'nino', 'comida', 'piscina', 'hotel'];
  const utiles = palabras.filter((w) => claves.some((c) => w.includes(c) || c.includes(w)));
  if (!utiles.length) return true;
  return utiles.some((w) => blob.includes(w));
}

export async function recomendarConGeo(texto) {
  const pedido = interpretarPedido(texto);
  const [{ data: destinos }, { data: comercios }] = await Promise.all([
    supabase.from('destinos').select('id, nombre, departamento, rango_edad, descripcion, ubicacion').eq('estado', true),
    supabase.from('emprendimientos').select('destino_id, keywords, nombre'),
  ]);

  const lista = destinos || [];
  const porDestino = {};
  (comercios || []).forEach((c) => {
    porDestino[c.destino_id] = [...(porDestino[c.destino_id] || []), ...(c.keywords || []), c.nombre];
  });

  let matches = lista.filter((d) => coincideDestino(d, pedido, porDestino[d.id] || []));
  if (!matches.length) {
    matches = lista.filter((d) => d.departamento === 'San Miguel');
    if (pedido.edad) {
      const conEdad = matches.filter((d) => (d.rango_edad || []).includes(pedido.edad));
      if (conEdad.length) matches = conEdad;
    }
  }

  const top = matches.slice(0, 3);
  const nombres = top.map((d) => d.nombre);
  const frase =
    nombres.length === 0
      ? 'En San Miguel todavía no encontré un destino con ese filtro. Prueba con familia, volcán o playa.'
      : pedido.edad === 'Niñez'
        ? `En San Miguel te recomiendo ${nombres.join(', ')}. Ideal para toda la familia.`
        : `Te recomiendo visitar ${nombres.join(', ')}, en San Miguel.`;

  const params = new URLSearchParams({ departamento: 'San Miguel' });
  if (pedido.edad) params.set('rango', pedido.edad);

  return { frase, nombres, path: `/destinos?${params}` };
}

function hablar(texto) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'es-SV';
  u.rate = 1;
  speechSynthesis.speak(u);
}

function SpeechCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

export function mountGeo() {
  if (document.getElementById('geo-fab')) return;

  const wrap = document.createElement('div');
  wrap.id = 'geo-root';
  wrap.innerHTML = `
    <button type="button" id="geo-fab" class="geo-fab" aria-label="Hablar con Geo">
      <span class="geo-fab-icon" aria-hidden="true">
        <svg viewBox="0 0 32 32" width="28" height="28" fill="none">
          <circle cx="16" cy="16" r="12" stroke="currentColor" stroke-width="2"/>
          <path d="M16 6v4M16 22v4M6 16h4M22 16h4" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
          <circle cx="16" cy="16" r="3" fill="currentColor"/>
        </svg>
      </span>
      <span class="geo-fab-label">Hablar con Geo</span>
    </button>
    <div id="geo-panel" class="geo-panel" hidden>
      <p class="geo-panel-kicker">Asistente Geo</p>
      <h3>¿Qué territorio buscas?</h3>
      <p id="geo-status" class="geo-panel-status">Di “familia”, “niños”, “volcán” o “playa”. Si nombras otro departamento, te llevo a San Miguel.</p>
      <form id="geo-form" class="geo-panel-form">
        <input id="geo-input" type="text" placeholder="Ej. un lugar para niños en Ahuachapán" autocomplete="off">
        <button type="submit">Pedir</button>
      </form>
      <button type="button" id="geo-mic" class="geo-mic">Escuchar</button>
    </div>
  `;
  document.body.appendChild(wrap);

  const fab = wrap.querySelector('#geo-fab');
  const panel = wrap.querySelector('#geo-panel');
  const status = wrap.querySelector('#geo-status');
  const input = wrap.querySelector('#geo-input');
  const mic = wrap.querySelector('#geo-mic');
  const form = wrap.querySelector('#geo-form');

  const setStatus = (msg) => {
    status.textContent = msg;
  };

  const pedir = async (texto) => {
    if (!texto.trim()) {
      setStatus('Dime un destino, una edad o una palabra: familia, volcán, playa.');
      return;
    }
    setStatus('Geo está leyendo el territorio…');
    try {
      const result = await recomendarConGeo(texto);
      setStatus(result.frase);
      hablar(result.frase);
      go(result.path);
      panel.hidden = true;
    } catch {
      const fallback = 'Te recomiendo visitar el Centro Histórico, ideal para toda la familia.';
      setStatus(fallback);
      hablar(fallback);
      go('/destinos?departamento=San Miguel&rango=Niñez');
    }
  };

  fab.addEventListener('click', () => {
    panel.hidden = !panel.hidden;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    pedir(input.value);
  });

  mic.addEventListener('click', () => {
    const Ctor = SpeechCtor();
    if (!Ctor) {
      input.focus();
      setStatus('Este navegador no escucha voz. Escribe tu pedido y pulsa Pedir.');
      return;
    }
    const rec = new Ctor();
    rec.lang = 'es-SV';
    rec.interimResults = false;
    rec.maxAlternatives = 1;
    fab.classList.add('is-listening');
    setStatus('Te escucho…');
    rec.onresult = (event) => {
      const said = event.results?.[0]?.[0]?.transcript || '';
      input.value = said;
      pedir(said);
    };
    rec.onerror = () => {
      setStatus('No pude escucharte. Escríbelo y pulsa Pedir.');
      input.focus();
    };
    rec.onend = () => fab.classList.remove('is-listening');
    rec.start();
  });
}
