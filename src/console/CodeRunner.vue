<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useCodeRunnerStore } from './CodeRunner.store'
import { checkErrors, compile } from '@/language/compiler'
import { useEditorStore } from '@/editor/Editor.store'
import { errorMessage } from '@/lib'

const codeRunnerStore = useCodeRunnerStore()
const {
  instructions,
  errors,
  pointer,
  running,
} = storeToRefs(codeRunnerStore)
const {
  setInstructions,
  setErrors,
  pointerNext,
  pointerPrev,
  run,
  resume,
  stop,
  reset,
} = codeRunnerStore

const editorStore = useEditorStore()
const { sourceCode } = storeToRefs(editorStore)
const compileCode = () => {
  try {
    const errors = checkErrors(sourceCode.value)
    if (errors.length > 0) {
      setErrors(errors)
      return
    }
    const instructions = compile(sourceCode.value)
    setInstructions(instructions)
  } catch (error) {
    const message = errorMessage(error)
    setErrors([message])
  }
}

</script>

<template>
  <div class="console-container">

    <div class="code-controls">
      <template v-if="running">
        <button 
          class="stop-button"
          @click="stop"
        >Stop</button>
      </template>
      <template v-else>
        <button 
          class="compile-button"
          @click="compileCode"
        >Compile</button>
        <template v-if="instructions.length > 0 && errors.length <= 0">
          <button 
            v-if="pointer < instructions.length"
            class="next-button"
            @click="pointerNext"
          >Next</button>
          <button
            v-if="pointer > 0"
            class="prev-button"
            @click="pointerPrev"
          >Prev</button>
          <button 
            class="run-button"
            @click="run"
            v-text="pointer > 0 ? 'Restart' : 'Start'"
          />
          <button 
            class="resume-button"
            @click="resume"
            v-if="pointer > 0 && pointer < instructions.length"
          >Resume</button>
        </template>
      </template>
      <button 
        class="reset-button"
        @click="reset"
      >Reset</button>
    </div>

    <div
      v-if="errors.length > 0"
      class="code-errors"
    >
      <h3>Compiled with {{ errors.length }} errors: </h3>
      <div class="errors-list">
        <p
          class="error-description"
          v-for="(error, idx) in errors"
          v-text="error"
          :key="idx"
        />
      </div>
      <div>
        Fix them using instructions in your editor
        and then try to re-compile your code
      </div>
    </div>

    <div
      v-else-if="instructions.length > 0"
      class="code-instructions"
    >
      <p
        v-for="(instr, idx) in instructions"
        :class="{ 'code-instruction': true, running: idx === pointer }"
        v-text="instr"
      />
    </div>

    <div class="no-instructions" v-else>
      No instructions. Try writing a program and compiling it!
    </div>

  </div>
</template>

<style scoped lang="scss">
  .no-instructions {
    color: grey;
    padding: 0.5em 0.75em;
  }

  .console-container {
    width: 100%; height: 100%;
    display: flex;
    flex-direction: column;
  }

  .code-instructions {
    overflow-y: scroll;
    padding: 0 0.5em;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    flex-wrap: wrap;
    .code-instruction {
      cursor: pointer;
      padding: 0.2em 0.5em;
      margin: 0.1em;
      color: grey;
      background-color: #e3f2fd;
      border: 3px solid #42a5f5;
      transition: 0.2s all ease;
      transition-property: background-color, color;
      &.running {
        background-color: #90caf9;
        color: black;
      }
    }
  }

  .code-errors {
    flex: 1;
    overflow-y: scroll;
    padding: 1em;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    color: grey;
    .errors-list {
      display: flex;
      align-items: center;
      flex-wrap: wrap;
      p.error-description {
        cursor: pointer;
        padding: 0.25em 0.5em;
        margin: 0.25em;
        color: white;
        background-color: #e57373;
        border: 3px solid #d32f2f;
        transition: 0.2s scale ease-in-out;
        &:hover {
          scale: 1.05;
        }
      }
    }
    & > * + * {
      margin-top: 0.5em;
    }
  }

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
      min-width: 60px;
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

    .stop-button, .reset-button { 
      @include juicy-button(#f44336, #e57373); 
    }

    .compile-button { 
      @include juicy-button(#ce93d8, #f3e5f5); 
    }

    .run-button, .resume-button { 
      @include juicy-button(#ffa726, #ffb74d); 
    }
  }
</style>
