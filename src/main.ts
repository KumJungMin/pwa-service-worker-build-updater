import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    console.log('Service Worker registered with scope:', registration.scope);
  }).catch((error) => {
    console.error('Service Worker registration failed:', error);
  });
}

app.use(router);
app.mount('#app');