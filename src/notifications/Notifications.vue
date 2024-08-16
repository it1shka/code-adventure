<script setup lang="ts">
import { storeToRefs } from 'pinia'
import useNotificationsStore, { NotificationState } from './Notifications.store'

const IconMapping = Object.freeze({
  info:    '/info.png',
  success: '/check.png',
  error:   '/error.png',
  warning: '/warning.png'
})

const notificationsStore = useNotificationsStore()
const { notification } = storeToRefs(notificationsStore)
</script>

<template>
  <Teleport to="body">
    <aside
      v-if="notification !== null"
      :class="{ 
        notification: true,
        enter: notification.state === NotificationState.enter,
        active: notification.state === NotificationState.active,
        leave: notification.state === NotificationState.leave,
      }"
    >
      <div v-if="notification.content.title">
        <img 
          :alt="notification.content.variant" 
          :src="IconMapping[notification.content.variant ?? 'info']"
        />
        <h2 v-text="notification.content.title" />
      </div>
      <p
        v-if="notification.content.message"
        v-text="notification.content.message"
      />
    </aside>
  </Teleport>
</template>

<style scoped lang="scss">
  .notification {
    position: fixed;
    top: 0;
    z-index: 1000;
  }
</style>
