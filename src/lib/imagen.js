export function asset(path) {
  if (!path) {
    return `${import.meta.env.BASE_URL}img/logo-geoturismosv.png`;
  }

  if (String(path).startsWith('http')) {
    return path;
  }

  const clean = String(path).replace(/^\//, '');
  return `${import.meta.env.BASE_URL}${clean}`;
}

export function destinoImagen(imagen) {
  if (!imagen) {
    return asset('img/logo-geoturismosv.png');
  }

  if (String(imagen).startsWith('http')) {
    return imagen;
  }

  const clean = String(imagen).replace(/^\//, '');

  if (clean.startsWith('storage/')) {
    return asset(clean);
  }

  return asset(clean);
}
