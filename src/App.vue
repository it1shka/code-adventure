<script setup lang="ts">
import { ref } from 'vue'
import {clamp} from './lib';

const layout = ref<HTMLDivElement | null>(null)
const layoutCenter = ref(0.5)
const isDragging = ref(false)

const handleDrag = (event: MouseEvent) => {
  if (!isDragging.value || !layout.value) return
  const layoutWidth = layout.value.getBoundingClientRect().width
  const center = event.clientX / layoutWidth
  layoutCenter.value = clamp(0.2, 0.8, center);
}

</script>

<template>
  <main 
    ref="layout"
    @mousemove.stop.prevent="handleDrag"
    @mouseup="isDragging = false"
  >
    <aside 
      class="editor-container"
      :style="{ flex: layoutCenter }"
    >

    </aside>
    <div class="drag-handle">
      <div @mousedown="isDragging = true" />
    </div>
    <aside 
      class="display-container"
      :style="{ flex: 1 - layoutCenter }"
    >

    </aside>
  </main>
</template>

<style lang="scss">
  main {
    height: 100vh;
    width: 100vw;
    display: flex;
    background-color: white;
  }

  aside { 
    flex: 1; 
    background-color: #ddd;
  }

  .editor-container {
    border-right: 1px solid #bbb;
  }

  .drag-handle {
    flex: 0;
    position: relative;
    & > div {
      position: absolute;
      top: 0; bottom: 0;
      width: 10px;
      cursor: grab;
      transform: translateX(-50%);
    }
  }
</style>
