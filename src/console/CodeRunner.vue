<script setup lang="ts">
import {storeToRefs} from 'pinia';
import { useCodeRunnerStore } from './CodeRunner.store'
import {Command} from '@/language/compiler';

const store = useCodeRunnerStore()
const {
  instructions,
  errors,
  pointer,
  running,
} = storeToRefs(store)
const {
  setInstructions,
  setErrors,
  pointerNext,
  pointerPrev,
  run,
  stop,
} = store

setInstructions([Command.move])
</script>

<template>
  <div class="code-controls">
    <template v-if="running">
      <button class="stop-button">Stop</button>
    </template>
    <template v-else>
      <button class="compile-button">Compile</button>
      <template v-if="instructions.length > 0 && errors.length <= 0">
        <button
          v-if="pointer > 0"
          class="prev-button"
        >Prev</button>
        <template v-if="pointer < instructions.length - 1">
          <button class="run-button">Run</button>
          <button class="next-button">Next</button>
        </template>
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .code-controls {
    & > * + * {
      margin-left: 0.5em;
    }
  }

  .code-controls {
    display: flex;
    align-items: center;
    padding: 0.5em;

    @mixin juicy-button($bg-color, $shadow-color) {
      border: none;
      background-color: transparent;
      padding: 0.5em 0.75em;
      box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
      cursor: pointer;
      transition: 0.2s all ease-in-out;
      &:hover {
        border-radius: 15px;
        background-color: $bg-color;
        box-shadow: $shadow-color 0px 6px 24px 0px, $shadow-color 0px 0px 0px 1px;
        color: white;
      }
    }
    
    .prev-button, .next-button {
      @include juicy-button(#29b6f6, #4fc3f7);
    }

    .stop-button { 
      @include juicy-button(#f44336, #e57373); 
    }

    .compile-button { 
      @include juicy-button(#ce93d8, #f3e5f5); 
    }

    .run-button { 
      @include juicy-button(#ffa726, #ffb74d); 
    }
  }
</style>
