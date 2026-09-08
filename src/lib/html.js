export function esc(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function getLocale() {
  return localStorage.getItem('locale') === 'en' ? 'en' : 'es';
}

export function setLocale(locale) {
  localStorage.setItem('locale', locale);
}

export function tDb(model, field) {
  if (!model) return '';
  if (getLocale() === 'en' && model[`${field}_en`]) {
    return model[`${field}_en`];
  }
  return model[field] || '';
}

export function isDark() {
  return document.documentElement.classList.contains('dark');
}

export function applyTheme() {
  const stored = localStorage.theme;
  const dark =
    stored === 'dark' ||
    (!stored && window.matchMedia('(prefers-color-scheme: dark)').matches);
  document.documentElement.classList.toggle('dark', dark);
}

export function toggleTheme() {
  const next = isDark() ? 'light' : 'dark';
  localStorage.theme = next;
  document.documentElement.classList.toggle('dark', next === 'dark');
}
