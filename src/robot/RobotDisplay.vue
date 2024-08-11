<script setup lang="ts">
import Levels from '@/console/levels'
import useLevelPickerStore from '@/console/LevelPicker.store'
import { storeToRefs } from 'pinia'
import { computed } from 'vue'
import FieldGrid from './FieldGrid.vue'

const levelPickerStore = useLevelPickerStore()
const { current: levelName } = storeToRefs(levelPickerStore)
const level = computed(() => {
  const output = Levels.find(({ name }) => { 
    return name === levelName.value
  })
  return output!
})
</script>

<template>
  <div class="robot-container">
    <div 
      class="level-name"
      v-text="levelName"
    />
    <div class="centered">
      <FieldGrid 
        :cellSize="50"
        :rows="level.rows"
        :columns="level.columns"
        :walls="level.walls"
        :checkpoints="level.checkpoints"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  .robot-container {
    position: relative;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    .centered {
      position: relative;
    }

    .level-name {
      position: absolute;
      top: 0; right: 0;
      background-color: white;
      font-size: 1.2em;
      padding: 0.5em;
      border-radius: 0 0 0 15px;
      box-shadow: #ffb74d 0px 1.5px 6px 0px, #ffb74d 0px 0px 0px 1px;
    }
  }
</style>
