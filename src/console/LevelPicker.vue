<script setup lang="ts">
import Levels from './levels'
import { storeToRefs } from 'pinia'
import useLevelPickerStore from './LevelPicker.store'

const levelNames = Levels.map(({ name }) => name)

const levelPickerStore = useLevelPickerStore()
const { completed, current } = storeToRefs(levelPickerStore)
const { setCurrent } = levelPickerStore
</script>

<template>
  <div class="levels">
    <button
      :class="{ 
        level: true, 
        chosen: level === current,
        completed: completed.includes(level)
      }"
      v-for="level in levelNames"
      :key="level"
      @click="setCurrent(level)"
    >
      <p>{{ level }}</p>
      <img 
        v-if="completed.includes(level)"
        alt="Completed"
        src="/check.png"
      />
    </button>
  </div>
</template>

<style scoped lang="scss">
.levels {
  padding: 0.5em;
  display: flex;
  flex-wrap: wrap;

  $hover-shadow: #4fc3f7;
  $chosen-shadow: #ffb74d;
  $completed-shadow: #81c784;

  @mixin juicy($color) {
    scale: 1.05;
    box-shadow: $color 0px 1.5px 6px 0px, $color 0px 0px 0px 1px;
  }

  .level {
    position: relative;
    user-select: none;
    font-size: 1.05em;
    margin: 0.5em;
    border: none;
    padding: 0.5em 1em;
    background-color: white;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    cursor: pointer;

    transition: 0.2s all ease-in-out;
    transition-property: scale, box-shadow;
    
    &:hover {
      @include juicy($hover-shadow);
    }

    &.completed {
      @include juicy($completed-shadow);
    }

    &.chosen {
      @include juicy($chosen-shadow);
    }

    img {
      position: absolute;
      width: 15px;
      height: auto;
      top: 0; right: 0;
      transform: translate(40%, -40%);
    }
  }
}
</style>
