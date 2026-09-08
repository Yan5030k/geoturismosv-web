import './style.css';
import { applyTheme } from './lib/html.js';
import { initAuth } from './lib/auth.js';
import { go, startRouter } from './lib/router.js';
import { handleChromeClick } from './lib/nav.js';
import { mountGeo } from './lib/geo.js';

const root = document.getElementById('app');

root.addEventListener('click', async (event) => {
  const link = event.target.closest('[data-link]');
  if (link) {
    event.preventDefault();
    const href = link.getAttribute('href') || '#/';
    go(href.replace(/^#/, ''));
    return;
  }
  await handleChromeClick(event);
});

applyTheme();
await initAuth();
mountGeo();
await startRouter(root);
