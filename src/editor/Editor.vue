<script setup lang="ts">
import { Codemirror } from 'vue-codemirror'
import { useEditorStore } from './Editor.store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue';
import { vim } from '@replit/codemirror-vim'
import EditorControls from './EditorControls.vue'

const editorStore = useEditorStore()
const { 
  sourceCode, 
  vimMode,
  fontSize,
} = storeToRefs(editorStore)

const codemirrorStyling = computed(() => Object.freeze({
  height: '100%',
  fontSize: `${fontSize.value}px`,
}))

const codemirrorExtensions = computed(() => {
  const extensions = []
  if (vimMode.value) {
    const vimExtension = vim({ 
      status: true,
    })
    extensions.push(vimExtension)
  }
  return Object.freeze(extensions)
})

</script>

<template>
  <div class="editor-container">
    <Codemirror
      v-model="sourceCode"
      placeholder="Type here your commands..."
      :style="codemirrorStyling"
      :extensions="codemirrorExtensions"
    />
    <EditorControls />
  </div>
</template>

<style scoped lang="scss">
  .editor-container {
    width: 100%; height: 100%;
    position: relative;
    background-color: white;
  }
</style>
