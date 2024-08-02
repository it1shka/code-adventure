<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useEditorStore } from './Editor.store'
import { ref } from 'vue'

const editorStore = useEditorStore()
const {
  vimMode,
  fontSize,
} = storeToRefs(editorStore)
const {
  increaseFontSize,
  decreaseFontSize,
  toggleVimMode,
} = editorStore

const showFontSize = ref(false)
const timeout = ref<number | undefined>()
const onFontUpdate = () => {
  clearTimeout(timeout.value)
  showFontSize.value = true
  timeout.value = setTimeout(() => {
    showFontSize.value = false
  }, 500)
}
</script>

<template>
  <div class="controls-container">
    <p 
      class="font-display"
      v-if="showFontSize" 
      v-text="fontSize + 'px'"
    />
    <button
      class="font-button"
      @click="increaseFontSize(); onFontUpdate()"
    >+</button>
    <button 
      class="font-button"
      @click="decreaseFontSize(); onFontUpdate()"
    >-</button>
    <button 
      :class="{ 'vim-button': true, enabled: vimMode }"
      @click="toggleVimMode"
    >VIM</button>
  </div>
</template>

<style scoped lang="scss">
  .controls-container {
    z-index: 5;
    position: absolute;
    top: 8px;
    right: 8px;
    display: flex;
    align-items: center;
    opacity: 0.5;
    transition: 0.1s opacity ease-in-out;
    &:hover {
      opacity: 1;
    }
    & > * + * {
      margin-left: 4px;
    }
  }

  @mixin controls-button {
    height: 20px;
    border: 1px solid #ccc;
    background-color: rgba(0, 0, 0, 0.1);
    cursor: pointer;
    &:hover {
      background-color: rgba(0, 0, 0, 0.2);
    }
  }

  .font-button {
    width: 20px;
    @include controls-button;
  }

  .vim-button {
    padding: 0 5px;
    transition: 0.1s all ease-in-out;
    transition-property: background-color, border;
    @include controls-button;
    &.enabled {
      background-color: #81c784;
      border: 1px solid #388e3c;
    }
  }
</style>
