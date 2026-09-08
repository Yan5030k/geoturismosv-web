import { supabase } from './supabase.js';
import { go } from './router.js';
import { RUTAS } from './rutas.js';

function normalizar(texto) {
  return String(texto || '')
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

const DEPARTAMENTOS = [
  { nombre: 'San Salvador', aliases: ['san salvador', 'la capital', 'capital', 'boqueron', 'ilopango'] },
  { nombre: 'San Miguel', aliases: ['san miguel', 'oriente', 'el cuco', 'cuco', 'chaparrastique', 'chinameca', 'moncagua'] },
  { nombre: 'Santa Ana', aliases: ['santa ana', 'coatepeque'] },
  { nombre: 'La Libertad', aliases: ['la libertad', 'tunco', 'tamanique', 'joya de ceren', 'joya'] },
  { nombre: 'Cuscatlán', aliases: ['cuscatlan', 'suchitoto'] },
  { nombre: 'Usulután', aliases: ['usulutan', 'alegria'] },
  { nombre: 'La Unión', aliases: ['la union', 'fonseca', 'golfo'] },
];

const TEMAS = [
  { id: 'playa', aliases: ['playa', 'mar', 'olas', 'surf', 'costa', 'arenas'] },
  { id: 'volcan', aliases: ['volcan', 'crater', 'cima', 'sendero', 'montana'] },
  { id: 'lago', aliases: ['lago', 'laguna', 'caldera'] },
  { id: 'cultura', aliases: ['cultura', 'centro', 'historico', 'iglesia', 'catedral', 'pueblo', 'colonial'] },
  { id: 'familia', aliases: ['familia', 'ninos', 'nino', 'nina', 'piscina', 'turicentro', 'recreo'] },
  { id: 'comida', aliases: ['comida', 'pupusa', 'restaurante', 'mariscos', 'almuerzo'] },
];

const ALMA = {
  'San Salvador': 'San Salvador no es un listado: es volcán y caldera. El Boquerón es el cráter que la ciudad tiene al lado; Ilopango es el lago que nació de fuego.',
  'San Miguel': 'San Miguel es el oriente: catedral, Chaparrastique y el mar de El Cuco. Otra geografía que la de la capital.',
  'Santa Ana': 'Santa Ana se lee en agua azul. Coatepeque es un lago de origen volcánico, no una postal.',
  'La Libertad': 'La Libertad mira al Pacífico. El Tunco es costa y surf; Joya de Cerén es el pueblo que el volcán enterró y el tiempo devolvió.',
  'Cuscatlán': 'Suchitoto es piedra, lago Suchitlán y calle empedrada. Un pueblo que se camina, no se consume.',
  'Usulután': 'Alegría es altura, niebla y laguna. El oriente también se lee en fresco.',
  'La Unión': 'El Golfo de Fonseca es agua compartida: El Salvador, Honduras y Nicaragua en un mismo horizonte.',
};

const STOP = new Set([
  'lugares',
  'lugar',
  'quiero',
  'busco',
  'buscar',
  'donde',
  'para',
  'unos',
  'unas',
  'algunos',
  'algunas',
  'recomendame',
  'recomienda',
  'destino',
  'destinos',
  'turismo',
  'turistico',
  'turisticos',
  'visitar',
  'visita',
  'ir',
]);

function coincideDepto(destino, nombre) {
  if (!nombre) return false;
  const blob = normalizar([destino.departamento, destino.ubicacion, destino.nombre].join(' '));
  return blob.includes(normalizar(nombre));
}

export function interpretarPedido(texto) {
  const t = normalizar(texto);
  const depto = DEPARTAMENTOS.find((d) => d.aliases.some((a) => t.includes(a)));
  const tema = TEMAS.find((x) => x.aliases.some((a) => t.includes(a)));

  let edad = '';
  if (/nino|nina|familia|bebe|hijo|hijos|familiar/.test(t)) edad = 'Niñez';
  else if (/adolescente|joven|aventura/.test(t)) edad = 'Adolescencia';
  else if (/abuelo|mayor|senior/.test(t)) edad = 'Adulto Mayor';
  else if (/adulto/.test(t)) edad = 'Adultez';

  return {
    departamento: depto?.nombre || '',
    tema: tema?.id || '',
    edad,
    crudo: t,
    original: texto.trim(),
  };
}

function puntuar(destino, pedido, keywordsExtra = []) {
  const blob = normalizar(
    [destino.nombre, destino.descripcion, destino.ubicacion, destino.departamento, ...(destino.rango_edad || []), ...keywordsExtra].join(' '),
  );
  let puntos = 0;
  if (pedido.departamento) {
    puntos += coincideDepto(destino, pedido.departamento) ? 14 : -10;
  }
  if (pedido.edad && (destino.rango_edad || []).includes(pedido.edad)) puntos += 5;
  if (pedido.tema === 'playa' && /playa|mar|cuco|tunco|golfo/.test(blob)) puntos += 8;
  if (pedido.tema === 'volcan' && /volcan|boqueron|chaparrastique|crater/.test(blob)) puntos += 8;
  if (pedido.tema === 'lago' && /lago|laguna|coatepeque|ilopango|alegria/.test(blob)) puntos += 8;
  if (pedido.tema === 'cultura' && /centro|historico|suchitoto|joya|catedral|cultural/.test(blob)) puntos += 8;
  if (pedido.tema === 'familia' && /familia|ninez|piscina|turicentro|eden|cuco/.test(blob)) puntos += 6;
  if (pedido.tema === 'comida' && /restaurante|pupusa|comida|mariscos/.test(blob)) puntos += 6;
  pedido.crudo
    .split(/\s+/)
    .filter((w) => w.length > 4 && !STOP.has(w))
    .forEach((w) => {
      if (blob.includes(w)) puntos += 2;
    });
  return puntos;
}

function redactar(pedido, destinos) {
  const alma = pedido.departamento
    ? ALMA[pedido.departamento]
    : 'El Salvador se lee por geografía: volcán, lago, costa y pueblo. Dime un departamento o un paisaje.';
  const ruta = RUTAS.find((r) => r.region === pedido.departamento);
  const hilo = ruta ? ` Si quieres un hilo para el día, sigue «${ruta.titulo}» en Rutas.` : '';
  if (!destinos.length) {
    return `${alma} No tengo un destino cargado con esas palabras. Prueba con playa, volcán, lago o el nombre de un departamento.`;
  }
  const nombres = destinos.map((d) => d.nombre);
  const lista = nombres.length === 1 ? nombres[0] : `${nombres.slice(0, -1).join(', ')} y ${nombres.at(-1)}`;
  if (pedido.edad === 'Niñez') {
    return `${alma} Para ir con niños te queda bien ${lista}.${hilo}`;
  }
  if (pedido.tema === 'playa') {
    return `${alma} Si buscas mar, te llevo a ${lista}.${hilo}`;
  }
  if (pedido.tema === 'volcan') {
    return `${alma} Para volcán, te recomiendo ${lista}.${hilo}`;
  }
  return `${alma} Te recomiendo ${lista}.${hilo}`;
}

export async function recomendarConGeo(texto) {
  const pedido = interpretarPedido(texto);
  const [{ data: destinos }, { data: comercios }] = await Promise.all([
    supabase.from('destinos').select('id, nombre, departamento, rango_edad, descripcion, ubicacion').eq('estado', true),
    supabase.from('emprendimientos').select('destino_id, keywords, nombre'),
  ]);

  const lista = destinos || [];
  const extra = {};
  (comercios || []).forEach((c) => {
    extra[c.destino_id] = [...(extra[c.destino_id] || []), ...(c.keywords || []), c.nombre];
  });

  const ranked = lista
    .map((d) => ({ d, puntos: puntuar(d, pedido, extra[d.id] || []) }))
    .filter((x) => x.puntos > 0)
    .sort((a, b) => b.puntos - a.puntos);

  const top = (ranked.length ? ranked : lista.map((d) => ({ d, puntos: 0 }))).slice(0, 3).map((x) => x.d);
  const frase = redactar(pedido, ranked.length ? top : []);
  const params = new URLSearchParams();
  if (pedido.departamento) params.set('departamento', pedido.departamento);
  if (pedido.edad) params.set('rango', pedido.edad);
  if (pedido.tema === 'playa') params.set('search', 'playa');
  if (pedido.tema === 'volcan') params.set('search', 'volcán');
  if (pedido.tema === 'lago') params.set('search', 'lago');

  const path = ranked.length === 1 ? `/destinos/${ranked[0].d.id}` : `/destinos${params.toString() ? `?${params}` : ''}`;
  return { frase, pedido, path };
}

function hablar(texto) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const u = new SpeechSynthesisUtterance(texto);
  u.lang = 'es-ES';
  u.rate = 0.95;
  const voces = speechSynthesis.getVoices();
  const es = voces.find((v) => v.lang.startsWith('es'));
  if (es) u.voice = es;
  speechSynthesis.speak(u);
}

function SpeechCtor() {
  return window.SpeechRecognition || window.webkitSpeechRecognition || null;
}

const ERRORES_MIC = {
  'not-allowed': 'Chrome bloqueó el micrófono. Toca el candado de la barra y permite el micrófono para este sitio.',
  'no-speech': 'No capté voz. Acércate al micrófono y vuelve a pulsar Hablar con Geo.',
  network: 'Chrome no pudo usar el micrófono aquí. Escríbelo abajo y pulsa Pedir; en Chrome de tu PC, permite el micrófono.',
  'language-not-supported': 'Este navegador no tiene español de voz. Escribe tu pedido abajo.',
  aborted: 'Dejé de escuchar.',
};

export function mountGeo() {
  document.getElementById('geo-root')?.remove();

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
      <button type="button" id="geo-close" class="geo-close" aria-label="Cerrar Geo">×</button>
      <p class="geo-panel-kicker">Asistente Geo</p>
      <h3>Dime el territorio</h3>
      <p id="geo-status" class="geo-panel-status">Pulsa Hablar con Geo. Te escucho en español. También puedes escribir: San Salvador, playa, volcán o familia.</p>
      <p id="geo-heard" class="geo-heard"></p>
      <form id="geo-form" class="geo-panel-form">
        <input id="geo-input" type="text" placeholder="Ej. lugares en San Salvador" autocomplete="off">
        <button type="submit">Pedir</button>
      </form>
    </div>
  `;
  document.body.appendChild(wrap);

  const fab = wrap.querySelector('#geo-fab');
  const panel = wrap.querySelector('#geo-panel');
  const status = wrap.querySelector('#geo-status');
  const heard = wrap.querySelector('#geo-heard');
  const input = wrap.querySelector('#geo-input');
  const form = wrap.querySelector('#geo-form');

  let rec = null;
  let stopTimer = null;
  let finalText = '';
  let failed = false;

  const setStatus = (msg) => {
    status.textContent = msg;
  };

  const pedir = async (texto) => {
    if (!texto.trim()) {
      setStatus('Dime un departamento, un paisaje o con quién viajas: San Salvador, playa, volcán, niños.');
      return;
    }
    setStatus('Estoy leyendo el mapa…');
    try {
      const result = await recomendarConGeo(texto);
      setStatus(result.frase);
      hablar(result.frase);
      go(result.path);
    } catch {
      const fallback = 'Tuve un tropiezo leyendo el mapa. Prueba otra vez con el nombre de un departamento.';
      setStatus(fallback);
      hablar(fallback);
    }
  };

  const detener = () => {
    if (stopTimer) {
      clearTimeout(stopTimer);
      stopTimer = null;
    }
    try {
      rec?.stop();
    } catch {
      /* ya cerrado */
    }
    rec = null;
    fab.classList.remove('is-listening');
    fab.querySelector('.geo-fab-label').textContent = 'Hablar con Geo';
  };

  const escuchar = async () => {
    const Ctor = SpeechCtor();
    if (!Ctor) {
      panel.hidden = false;
      input.focus();
      setStatus('Este navegador no escucha voz. En Chrome sí. Mientras, escríbeme el pedido.');
      return;
    }

    panel.hidden = false;
    finalText = '';
    failed = false;
    heard.textContent = '';
    setStatus('Te escucho en español. Habla ahora.');

    detener();
    rec = new Ctor();
    rec.lang = 'es-ES';
    rec.interimResults = true;
    rec.continuous = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      fab.classList.add('is-listening');
      fab.querySelector('.geo-fab-label').textContent = 'Te escucho…';
      setStatus('Habla ahora. Tienes unos segundos.');
    };

    rec.onresult = (event) => {
      let interim = '';
      for (let i = event.resultIndex; i < event.results.length; i += 1) {
        const piece = event.results[i][0].transcript;
        if (event.results[i].isFinal) finalText += `${piece} `;
        else interim += piece;
      }
      const live = `${finalText} ${interim}`.trim();
      input.value = live;
      heard.textContent = live ? `Te oí: “${live}”` : '';
    };

    rec.onerror = (event) => {
      failed = true;
      setStatus(ERRORES_MIC[event.error] || 'No pude escucharte. Escríbelo y pulsa Pedir.');
      input.focus();
    };

    rec.onend = () => {
      fab.classList.remove('is-listening');
      fab.querySelector('.geo-fab-label').textContent = 'Hablar con Geo';
      const dicho = (finalText || input.value).trim();
      rec = null;
      if (!failed && dicho) pedir(dicho);
    };

    try {
      rec.start();
      stopTimer = setTimeout(() => {
        try {
          rec?.stop();
        } catch {
          /* ignore */
        }
      }, 8000);
    } catch {
      setStatus('No pude arrancar el micrófono. Recarga en Chrome y permite el permiso.');
    }
  };

  fab.addEventListener('click', () => {
    if (fab.classList.contains('is-listening')) {
      detener();
      return;
    }
    escuchar();
  });

  wrap.querySelector('#geo-close').addEventListener('click', () => {
    detener();
    failed = true;
    panel.hidden = true;
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    failed = true;
    detener();
    pedir(input.value);
  });

  if ('speechSynthesis' in window) {
    speechSynthesis.getVoices();
    speechSynthesis.addEventListener('voiceschanged', () => speechSynthesis.getVoices());
  }
}
