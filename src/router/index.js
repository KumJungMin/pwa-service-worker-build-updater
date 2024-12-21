// src/router/index.js
import { createRouter, createWebHistory } from 'vue-router';

const routes = [
  {
    path: '/test',
    name: 'TestMain',
    component: () => import('../views/TestMain.vue'),
  },
  {
    path: '/ttest',
    name: 'TTestMain',
    component: () => import('../views/TTestMain.vue'),
  },
  // 기타 라우트
];

const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
