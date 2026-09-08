import es from '../locales/es.json';
import en from '../locales/en.json';
import { getLocale } from './html.js';

const messages = { es, en };

export function t(path) {
  const locale = getLocale();
  const parts = path.split('.');
  let value = messages[locale];
  for (const part of parts) {
    value = value?.[part];
  }
  if (typeof value === 'string') return value;
  let fallback = messages.es;
  for (const part of parts) {
    fallback = fallback?.[part];
  }
  return typeof fallback === 'string' ? fallback : path;
}
