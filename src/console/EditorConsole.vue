<script setup lang="ts">
import { ref } from 'vue'

const Tabs = Object.freeze([ 'Code', 'Docs', 'Levels' ])

const currentTab = ref<string>('Code')
</script>

<template>
  <div class="console-container">
    <nav class="console-tabs">
      <div 
        v-for="tab in Tabs" 
        :key="tab" 
        v-text="tab"
        @click="currentTab = tab"
        :class="{ tab: true, chosen: tab === currentTab }"
      />
    </nav>
    <aside class="console-content">

    </aside>
  </div>
</template>

<style scoped lang="scss">
  $light-color: #e3f2fd;
  $dark-color: #42a5f5;

  .console-container {
    width: 100%;
    height: 100%;
    display: grid;
    grid-template-columns: 100px 1fr;

    .console-tabs {
      grid-column: 1 / 2;
      border-right: 1px solid #ddd;
      display: flex;
      flex-direction: column;

      .tab {
        cursor: pointer;
        user-select: none;
        text-align: center;
        padding: 0.75em 1em;
        border-bottom: 1px solid #ddd;
        transition: 0.1s all ease;
        transition-property: background-color, color;
        &:hover {
          background-color: $light-color;
        }
        &.chosen {
          color: white;
          background-color: $dark-color;
        }
      }
    }

    .console-content {
      grid-column: 2 / 3;
    }
  }
</style>
