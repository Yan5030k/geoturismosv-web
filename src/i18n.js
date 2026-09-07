import { createI18n } from 'vue-i18n';
import es from './locales/es.json';
import en from './locales/en.json';

const savedLocale = localStorage.getItem('locale');
const defaultLocale = savedLocale || 'es';

const i18n = createI18n({
  legacy: false,
  globalInjection: true,
  locale: defaultLocale,
  fallbackLocale: 'en',
  messages: { es, en },
});

export default i18n;
