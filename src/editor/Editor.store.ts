import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STORAGE_KEY = 'editor-code'
const AUTOSAVE_TIME = 500

const FontSizeSettings = Object.freeze({
  min: 12,
  initial: 16,
  max: 30,
})

const loadFromStorage = () => {
  const code = window
    .localStorage
    .getItem(STORAGE_KEY)
  return code ?? ''
}

export const useEditorStore = defineStore('editor', () => {
  const sourceCode = ref(loadFromStorage())
  const setSourceCode = (code: string) => {
    sourceCode.value = code
  }

  const timeout = ref<ReturnType<typeof setTimeout>>()
  watch(sourceCode, () => {
    clearTimeout(timeout.value)
    timeout.value = setTimeout(() => {
      window.localStorage.setItem(STORAGE_KEY, sourceCode.value)
    }, AUTOSAVE_TIME)
  })

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
