import type { Command } from '@/language/compiler'
import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

const STEP_TIME = 500

export const useCodeRunnerStore = defineStore('codeRunner', () => {
  const instructions = ref<Command[]>([])
  const errors = ref<string[]>([])
  const pointer = ref(0)
  const running = ref(false)

  const setInstructions = (newInstructions: Command[]) => {
    errors.value = []
    pointer.value = 0
    running.value = false
    instructions.value = newInstructions
  }

  const setErrors = (newErrors: string[]) => {
    running.value = false
    errors.value = newErrors
  }

  const pointerNext = () => {
    pointer.value = Math.min(
      pointer.value + 1,
      instructions.value.length,
    )
    if (pointer.value >= instructions.value.length) {
      running.value = false
    }
  }

  const pointerPrev = () => {
    pointer.value = Math.max(
      pointer.value - 1,
      0
    )
  }

  const run = () => {
    pointer.value = 0
    running.value = true
  }

  const stop = () => {
    running.value = false
  }

  const interval = ref<ReturnType<typeof setInterval>>()
  watch(running, () => {
    if (!running.value) {
      clearInterval(interval.value)
      return
    }
    interval.value = setInterval(
      pointerNext,
      STEP_TIME,
    )
  })

  return {
    instructions,
    errors,
    pointer,
    running,
    setInstructions,
    setErrors,
    pointerNext,
    pointerPrev,
    run,
    stop,
  }
})
