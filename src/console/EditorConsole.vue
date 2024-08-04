<script setup lang="ts">
import { ref } from 'vue'
import { VueComponent as Documentation } from './docs.md'

const enum Tab {
  code = 'Code',
  docs = 'Docs',
  levels = 'Levels',
}

const tabs = Object.freeze([
  Tab.code,
  Tab.docs,
  Tab.levels
])

const currentTab = ref(Tab.code)
</script>

<template>
  <div class="console-container">
    <nav class="console-tabs">
      <div 
        v-for="tab in tabs" 
        :key="tab" 
        v-text="tab"
        @click="currentTab = tab"
        :class="{ tab: true, chosen: tab === currentTab }"
      />
    </nav>
    <aside class="console-content"><div>
      <div 
        v-if="currentTab === Tab.docs"
        class="styled-markdown"
      ><Documentation/></div>
    </div></aside>
  </div>
</template>

<style scoped lang="scss">
  $light-color: #e3f2fd;
  $dark-color: #42a5f5;

  .styled-markdown {
    padding: 2em 1.5em;
    & > * + * {
      margin-top: 0.5em;
    }
  }

  .console-container {
    width: 100%;
    height: 100%;
    display: flex;

    .console-tabs {
      width: 100px;
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
      height: 100%;
      flex: 1;
      display: flex;
      flex-direction: column;

      & > * {
        flex: 1 1 0;
        overflow-y: auto;
        min-height: 0px;
      }
    }
  }
</style>
