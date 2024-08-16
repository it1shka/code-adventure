<script setup lang="ts">
import Levels, { Direction, nextLevel } from '@/console/levels'
import useLevelPickerStore from '@/console/LevelPicker.store'
import { storeToRefs } from 'pinia'
import { computed, watch } from 'vue'
import FieldGrid from './FieldGrid.vue'
import { useCodeRunnerStore } from '@/console/CodeRunner.store'
import useNotificationsStore from '@/notifications/Notifications.store'

const CELL_SIZE = 50

const levelPickerStore = useLevelPickerStore()
const { current: levelName, completed } = storeToRefs(levelPickerStore)

const level = computed(() => {
  const output = Levels.find(({ name }) => { 
    return name === levelName.value
  })
  return output!
})

const isCompleted = computed(() => {
  return completed.value.includes(levelName.value)
})

const codeRunnerStore = useCodeRunnerStore()
const { instructions, pointer } = storeToRefs(codeRunnerStore)

const snapshots = computed(() => {
  const output = [level.value]
  let last = level.value
  for (const instr of instructions.value) {
    const next = nextLevel(last, instr)
    output.push(next)
    last = next
  }
  return output
})

const snapshot = computed(() => {
  return snapshots.value[pointer.value]
})

const robotRotation = computed(() => {
  switch (snapshot.value.robot.direction) {
    case Direction.up: return 0
    case Direction.right: return 90
    case Direction.down: return 180
    default: return 270
  }
})

const { addNotification } = useNotificationsStore()
const { markAsCompleted } = levelPickerStore
watch(snapshot, () => {
  if (!snapshot.value.completed || pointer.value < snapshots.value.length - 1) return
  if (!isCompleted.value) {
    addNotification({
      variant: 'success',
      title: 'Level is completed',
    })
  } else {
    addNotification({
      variant: 'info',
      title: 'You completed the level one more time!'
    })
  }
  markAsCompleted(levelName.value)
})
</script>

<template>
  <div class="robot-container">
    <div :class="{ 'level-name': true, completed: isCompleted }">
      <p>{{ levelName }}</p>
      <img 
        v-if="isCompleted"
        src="/check.png"
        alt="Completed"
      />
    </div>
    <div class="centered">
      <FieldGrid 
        :cellSize="CELL_SIZE"
        :rows="level.rows"
        :columns="level.columns"
        :walls="level.walls"
        :checkpoints="level.checkpoints"
      />
      <div
        class="robot"
        :style="{
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          position: 'absolute',
          top: `${CELL_SIZE * snapshot.robot.position.row}px`,
          left: `${CELL_SIZE * snapshot.robot.position.column}px`,
          transform: `rotate(${robotRotation}deg)`,
        }"
      />
      <div
        class="box"
        v-for="box in snapshot.boxes"
        :key="box.id"
        :style="{
          width: `${CELL_SIZE}px`,
          height: `${CELL_SIZE}px`,
          position: 'absolute',
          top: `${CELL_SIZE * box.position.row}px`,
          left: `${CELL_SIZE * box.position.column}px`,
        }"
      />
    </div>
  </div>
</template>

<style scoped lang="scss">
  @mixin sprite($image) {
    background-image: url($image);
    background-size: cover;
    transition: 0.3s all ease;
  }

  .box {
    @include sprite("/box.png");
  }

  .robot {
    @include sprite("/robot.png");
  }

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
      display: flex;
      align-items: center;
      img {
        width: 15px;
        height: auto;
        transform: translateY(-2px);
      }
      &.completed {
        box-shadow: #81c784 0px 1.5px 6px 0px, #81c784 0px 0px 0px 1px;
      }
      & > * + * {
        margin-left: 0.25em;
      }
    }
  }
</style>
