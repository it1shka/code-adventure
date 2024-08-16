import { defineStore } from 'pinia'
import Levels from './levels'
import {ref} from 'vue'
import { useCodeRunnerStore } from './CodeRunner.store'

const STORAGE_KEY = 'levels'

type State = {
  completed: string[]
  current: string
}

const emptyState: State = Object.freeze({
  completed: [],
  current: Levels[0].name,
})

const assertStateType = (maybeState: any): maybeState is State => {
  if (['completed', 'current'].some(field => !(field in maybeState))) {
    return false
  }
  const { completed, current } = maybeState
  return completed instanceof Array &&
    typeof current === 'string'
}

const getInitialState = () => {
  try {
    const rawContent = window.localStorage.getItem(STORAGE_KEY)
    if (rawContent === null) {
      return emptyState
    }
    const state = JSON.parse(rawContent)
    if (!assertStateType(state)) {
      return emptyState
    }
    if (!Levels.find(({ name }) => name === state.current)) {
      state.current = Levels[0].name
    }
    return Object.freeze(state)
  } catch {
    return emptyState
  }
}

const useLevelPickerStore = defineStore('levelPicker', () => {
  const codeRunnerStore = useCodeRunnerStore()
  const { reset } = codeRunnerStore

  const initialState = getInitialState()
  const completed = ref(initialState.completed)
  const current = ref(initialState.current)

  const saveToStorage = () => {
    try {
      const state: State = Object.freeze({
        completed: completed.value,
        current: current.value,
      })
      const rawState = JSON.stringify(state)
      window.localStorage.setItem(STORAGE_KEY, rawState)
    } catch (error) {
      console.error(error)
    }
  }

  const setCurrent = (levelName: string) => {
    reset()
    current.value = levelName
    saveToStorage()
  }

  const markAsCompleted = (levelName: string) => {
    if (completed.value.includes(levelName)) return
    completed.value.push(levelName)
    saveToStorage()
  }

  return {
    completed,
    current,
    setCurrent,
    markAsCompleted,
  }
})

export default useLevelPickerStore
