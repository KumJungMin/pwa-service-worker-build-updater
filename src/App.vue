<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view></router-view>
    <UpdateModal
      v-if="showUpdateModal"
      :route="updatedRoute"
      @close="showUpdateModal = false"
    />
  </div>
</template>

<script>
import UpdateModal from './components/UpdateModal.vue';

export default {
  name: 'App',
  components: {
    UpdateModal,
  },
  data() {
    return {
      showUpdateModal: false,
      updatedRoute: '',
    };
  },
  created() {
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        console.log('Received a message from service worker: ', event.data);
        if (event.data.type === 'ROUTE_UPDATED') {
          const updatedRoute = event.data.route;
          this.updatedRoute = updatedRoute;
          this.showUpdateModal = true;
        }
      });
    }
  },
};
</script>

<style>
/* 전역 스타일링 (필요시 추가) */
</style>
