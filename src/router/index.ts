
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';
import TestMain from '../views/TestMain.vue';
import TTestMain from '../views/TTestMain.vue';


const routes: Array<RouteRecordRaw> = [
  {
    path: '/test',
    alias: '/',
    name: 'TestMain',
    component: TestMain,
  },
  {
    path: '/test2',
    name: 'TTestMain',
    component: TTestMain,
  },
];


const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
