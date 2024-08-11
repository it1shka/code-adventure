<script setup lang="ts">
import { type Position } from '@/console/levels'
import { toRefs } from 'vue'

const props = defineProps<{
  cellSize: number
  rows: number
  columns: number
  walls: readonly Position[]
  checkpoints: readonly Position[]
}>()

const {
  cellSize,
  rows,
  columns,
  walls,
  checkpoints,
} = toRefs(props)

const isWall = (row: number, column: number) => {
  return walls.value.some(wall => {
    return wall.row === row && wall.column === column
  })
}

const isCheckpoint = (row: number, column: number) => {
  return checkpoints.value.some(checkpoint => {
    return checkpoint.row === row && checkpoint.column === column
  })
}
</script>

<template>
  <div :style="{
    display: 'grid',
    gridTemplateRows: `repeat(${rows}, ${cellSize}px)`,
    gridTemplateColumns: `repeat(${columns}, ${cellSize}px)`,
  }">
    <template v-for="(_, row) in rows" :key="row">
      <template v-for="(_, col) in columns" :key="col">
        <div :class="{
          cell: true,
          wall: isWall(row, col),
          checkpoint: isCheckpoint(row, col),
        }" />
      </template>
    </template>
  </div>
</template>

<style scoped lang="scss">
  .cell {
    background-color: #ddd;
    background-size: cover;

    &.wall {
      background-image: url(/wall.png);
    }

    &.checkpoint {
      background-image: url(/red-flag.png);
    }
  }
</style>
