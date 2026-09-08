import L from 'leaflet';

export const geoPin = L.divIcon({
  className: 'geo-pin',
  html: `
    <svg class="geo-pin-svg" viewBox="0 0 32 42" aria-hidden="true">
      <path fill="#168a1a" stroke="#ffffff" stroke-width="2"
        d="M16 2.8c-6.9 0-12.5 5.5-12.5 12.3 0 9.2 12.5 23.4 12.5 23.4S28.5 24.3 28.5 15.1C28.5 8.3 22.9 2.8 16 2.8z"/>
      <circle cx="16" cy="15" r="5.2" fill="#ffffff"/>
    </svg>
  `,
  iconSize: [32, 42],
  iconAnchor: [16, 40],
  popupAnchor: [0, -36],
});

export function popupDestino({ id, title, imageUrl }) {
  return `
    <div class="geo-popup">
      <img src="${imageUrl}" alt="${title}">
      <div class="geo-popup-body">
        <h4>${title}</h4>
        <a class="geo-popup-btn" href="#/destinos/${id}">Ver detalles</a>
      </div>
    </div>
  `;
}
