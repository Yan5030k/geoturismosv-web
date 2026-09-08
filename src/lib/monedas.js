export const CURRENCIES = [
  { code: 'USD', name: 'Dólar estadounidense', symbol: '$' },
  { code: 'EUR', name: 'Euro', symbol: '€' },
  { code: 'GTQ', name: 'Quetzal', symbol: 'Q' },
  { code: 'HNL', name: 'Lempira', symbol: 'L' },
  { code: 'NIO', name: 'Córdoba', symbol: 'C$' },
  { code: 'CRC', name: 'Colón costarricense', symbol: '₡' },
  { code: 'MXN', name: 'Peso mexicano', symbol: '$' },
  { code: 'COP', name: 'Peso colombiano', symbol: '$' },
  { code: 'CAD', name: 'Dólar canadiense', symbol: '$' },
  { code: 'GBP', name: 'Libra esterlina', symbol: '£' },
  { code: 'BRL', name: 'Real brasileño', symbol: 'R$' },
  { code: 'ARS', name: 'Peso argentino', symbol: '$' },
  { code: 'CLP', name: 'Peso chileno', symbol: '$' },
  { code: 'PEN', name: 'Sol peruano', symbol: 'S/' },
  { code: 'JPY', name: 'Yen japonés', symbol: '¥' },
  { code: 'CNY', name: 'Yuan chino', symbol: '¥' },
];

const FALLBACK_RATES = {
  USD: 1,
  EUR: 0.92,
  GTQ: 7.75,
  HNL: 24.7,
  NIO: 36.6,
  CRC: 510,
  MXN: 17.2,
  COP: 4100,
  CAD: 1.36,
  GBP: 0.78,
  BRL: 5.1,
  ARS: 980,
  CLP: 940,
  PEN: 3.75,
  JPY: 149,
  CNY: 7.2,
};

export function monedaGuardada() {
  const code = localStorage.getItem('geo_moneda') || 'USD';
  return CURRENCIES.some((c) => c.code === code) ? code : 'USD';
}

export function guardarMoneda(code) {
  localStorage.setItem('geo_moneda', code);
}

export async function cargarTasas() {
  try {
    const res = await fetch('https://open.er-api.com/v6/latest/USD');
    const json = await res.json();
    if (json?.rates) return { ...FALLBACK_RATES, ...json.rates };
  } catch {
    /* el pitch no depende de la API */
  }
  return { ...FALLBACK_RATES };
}

export function formatearPrecio(usd, code, rates) {
  const cur = CURRENCIES.find((c) => c.code === code) || CURRENCIES[0];
  const rate = Number(rates?.[code] ?? FALLBACK_RATES[code] ?? 1);
  const value = Number(usd || 0) * rate;
  const digits = rate >= 100 ? 0 : 2;
  return `${cur.symbol}${value.toFixed(digits)} ${cur.code}`;
}

export function opcionesMoneda(selected) {
  return CURRENCIES.map(
    (c) => `<option value="${c.code}" ${c.code === selected ? 'selected' : ''}>${c.code} — ${c.name}</option>`,
  ).join('');
}
