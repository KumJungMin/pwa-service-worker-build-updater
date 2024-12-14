import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

const app = createApp(App);

app.use(router);
app.mount('#app');

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
      .register('/src/helpers/sw.ts')
      .then((registration) => {
        console.log('Service Worker registered with scope:', registration.scope);
      })
      .catch((error) => {
        console.error('Service Worker registration failed:', error);
      });

      navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
      if (event.data.type === 'ROUTE_UPDATED') {
        const updatedRoute: string = event.data.route;
        // 상태 관리 또는 이벤트 버스를 사용하여 Vue 컴포넌트에 알림 전달 가능
        // 여기서는 단순히 alert을 사용
        alert(`${updatedRoute} 라우트 관련 파일이 업데이트되었습니다!`);
      }
    });
  });
}
