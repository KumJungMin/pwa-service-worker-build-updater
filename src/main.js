import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.mount('#app');

// VitePWA가 자동으로 서비스 워커를 등록하므로, 기존 등록 코드를 제거합니다.
