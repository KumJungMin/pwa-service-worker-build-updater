
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    alias: '/',
    name: 'TestMain',
    component: () => import(/* @vite-ignore */ '../views/TestMain.vue'),
  },
  {
    path: '/test2',
    name: 'TTestMain',
    component: () => import(/* @vite-ignore */ '../views/TTestMain.vue'),
  },
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
