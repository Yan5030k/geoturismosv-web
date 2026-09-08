export const EQUIPO = [
  'Jhoan Mauricio Ortega Ventura',
  'Alejandra María Baires Campos',
  'Francisca Del Carmen Bonilla Argueta',
  'Roberto Antonio López Ramírez',
  'Flor Guadalupe Villatoro Vásquez',
  'Lilian Amaraly Perla Arias',
  'Katia Marilin Santos Avelar',
  'Gerardo Eliseo Guevara Reyes',
];

export function iniciales(nombre) {
  const partes = nombre.trim().split(/\s+/);
  return `${partes[0][0]}${partes[partes.length - 1][0]}`.toUpperCase();
}
