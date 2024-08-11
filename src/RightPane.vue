<script setup lang="ts">
import { onMounted, onUnmounted, ref } from 'vue'
import { clamp } from '@/lib'
import EditorConsole from '@/console/EditorConsole.vue'
import RobotDisplay from './robot/RobotDisplay.vue'

const layout = ref<HTMLDivElement | null>(null)
const layoutCenter = ref(0.7)
const isDragging = ref(false)

const handleDragStart = () => {
  isDragging.value = true
}

const handleDrag = (event: MouseEvent) => {
  if (!isDragging.value || !layout.value) return
  const layoutHeight = layout.value.getBoundingClientRect().height
  const center = event.clientY / layoutHeight
  layoutCenter.value = clamp(0.5, 0.8, center)
}

const handleDragEnd = () => {
  isDragging.value = false
}

onMounted(() => {
  window.addEventListener('mousemove', handleDrag)
  window.addEventListener('mouseup', handleDragEnd)
})

onUnmounted(() => {
  window.removeEventListener('mousemove', handleDrag)
  window.removeEventListener('mouseup', handleDragEnd)
})
</script>

<template>
  <div 
    ref="layout"
    class="right-pane-container"
  >
    <div 
      class="top-part"
      :style="{ flex: layoutCenter }"
    >
      <RobotDisplay />
    </div>
    <div class="horizontal-drag-handle">
      <div @mousedown="handleDragStart"/>
    </div>
    <div 
      class="bottom-part"
      :style="{ flex: 1 - layoutCenter }"
    >
      <EditorConsole />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .right-pane-container {
    width: 100%; 
    height: 100%;
    display: flex;
    flex-direction: column;
  }

  .top-part {
    flex: 0.7;
  }

  .bottom-part {
    flex: 0.3;
    background-color: white;
    border-top: 1px solid #ddd;
  }

  .horizontal-drag-handle {
    flex: 0;
    position: relative;
    & > div {
      position: absolute;
      right: 0; left: 0;
      height: 10px;
      cursor: grab;
      transform: translateY(-50%);
    }
  }
</style>
