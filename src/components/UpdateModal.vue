<!-- src/components/UpdateModal.vue -->
<template>
  <div class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <h3>업데이트 알림</h3>
      <p>{{ message }}</p>
      <div class="modal-actions">
        <button @click="reload">새로고침</button>
        <button @click="close">취소</button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent, computed } from 'vue';

export default defineComponent({
  name: 'UpdateModal',
  props: {
    route: {
      type: String,
      required: true,
    },
  },
  setup(props, { emit }) {
    const message = computed(() => {
      return `${props.route} 라우트 관련 파일이 업데이트되었습니다! 새로고침하시겠습니까?`;
    });

    const reload = () => {
      window.location.reload();
    };

    const close = () => {
      emit('close');
    };

    return {
      message,
      reload,
      close,
    };
  },
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
}
.modal-content {
  background: white;
  padding: 20px;
  border-radius: 8px;
  width: 90%;
  max-width: 400px;
}
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 10px;
  margin-top: 20px;
}
button {
  padding: 8px 16px;
  cursor: pointer;
}
</style>
