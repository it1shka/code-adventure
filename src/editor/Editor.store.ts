import { defineStore } from 'pinia'
import { ref } from 'vue'

const FontSizeSettings = Object.freeze({
  min: 12,
  initial: 16,
  max: 30,
})

export const useEditorStore = defineStore('editor', () => {
  const sourceCode = ref('')
  const setSourceCode = (code: string) => {
    sourceCode.value = code
  }

  const vimMode = ref(false)
  const toggleVimMode = () => {
    vimMode.value = !vimMode.value
  }

  const fontSize = ref<number>(FontSizeSettings.initial)
  const increaseFontSize = () => {
    fontSize.value = Math.min(
      FontSizeSettings.max, 
      fontSize.value + 1,
    )
  }
  const decreaseFontSize = () => {
    fontSize.value = Math.max(
      FontSizeSettings.min,
      fontSize.value - 1,
    )
  }

  return {
    sourceCode,
    setSourceCode,
    vimMode,
    toggleVimMode,
    fontSize,
    increaseFontSize,
    decreaseFontSize
  }
})
