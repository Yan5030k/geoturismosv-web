import { createApp } from 'vue';
import App from './App.vue';
import router from './router';
import i18n from './i18n';
import { initAuth } from './composables/useAuth';
import './style.css';

async function boot() {
  await initAuth();

  const app = createApp(App);
  app.use(router);
  app.use(i18n);
  app.mount('#app');
}

boot();
