<!-- src/App.vue -->
<template>
  <div id="app">
    <router-view></router-view>
    <UpdateModal
      v-if="showUpdateModal"
      :route="updatedRoute"
      @close="showUpdateModal = false"
    />
    <button @click="checkBuildUpdate">
      빌드 업데이트 체크
      </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import UpdateModal from './components/UpdateModal.vue';

const updatedRoute = ref('');
const showUpdateModal = ref(false);

onCreated();

function onCreated() {
  checkRouteUpdate();
}

function checkBuildUpdate() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.controller?.postMessage({
      type: 'CHECK_FOR_BUILD_UPDATE',
    });
  }
}

function checkRouteUpdate() {
  if ('serviceWorker' in navigator) {
      navigator.serviceWorker.addEventListener('message', (event) => {
        if (event.data.type === 'ROUTE_UPDATED') {
          const updatedRoute = event.data.route;
          showUpdateModal.value = true;
          updatedRoute.value = updatedRoute;
        }
      });
    }
}
</script>