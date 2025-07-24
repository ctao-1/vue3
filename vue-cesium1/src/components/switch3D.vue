<template>
    <button class="toggle-mode-btn" @click="toggleSceneMode" 
    :title="is3D ? '2D' : '3D'">
        {{ is3D ? '3D' : '2D' }}
    </button>
</template>
<script setup lang="ts">
import { ref, inject, Ref } from 'vue';
import { SceneMode, Viewer } from 'cesium';

const viewer = inject<Ref<Viewer | undefined>>('viewer')
const is3D = ref(true); // 默认是3D模式

const toggleSceneMode = () => {
  if (!viewer.value) return;
  if (is3D.value) {
    viewer.value.scene.mode = SceneMode.SCENE2D;
    is3D.value = false;
  } else {
    viewer.value.scene.mode = SceneMode.SCENE3D;
    is3D.value = true;
  }
};
</script>

<style scoped>
.toggle-mode-btn {
  position: absolute;
  bottom: 32px;
  right: 2px;
  z-index: 1002;
  background: rgba(0, 0, 0, 0.4);
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 4px 4px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
.toggle-mode-btn:hover {
  background: rgba(0, 0, 0, 0.7);
}
</style>