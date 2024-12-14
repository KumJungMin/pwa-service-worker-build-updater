
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

<script lang="ts">
import { defineComponent, ref, onMounted } from 'vue';
import UpdateModal from './components/UpdateModal.vue';

export default defineComponent({
  name: 'App',
  components: {
    UpdateModal,
  },
  setup() {
    const showUpdateModal = ref(false);
    const updatedRoute = ref('');

    onMounted(() => {
      if ('serviceWorker' in navigator) {
        navigator.serviceWorker.addEventListener('message', (event: MessageEvent) => {
          if (event.data.type === 'ROUTE_UPDATED') {
            updatedRoute.value = event.data.route;
            showUpdateModal.value = true;
          }
        });
      }
    });

    return {
      showUpdateModal,
      updatedRoute,
    };
  },
});
</script>

<style>
/* 전역 스타일링 (필요시 추가) */
</style>
