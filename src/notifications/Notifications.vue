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
        <h3 v-text="notification.content.title" />
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
    z-index: 1000;
    left: 50%;
    transform: translateX(-50%);
    background-color: white;
    padding: 0.5em 1em;
    box-shadow: rgba(0, 0, 0, 0.05) 0px 6px 24px 0px, rgba(0, 0, 0, 0.08) 0px 0px 0px 1px;
    transition: 0.5s all ease;

    div {
      display: flex;
      align-items: center;
      color: #212121;
      & > * + * {
        margin-left: 0.5em;
      }
    }

    img {
      width: 30px;
      height: auto;
    }
  }

  .notification.enter {
    top: -100%;
  }

  .notification.active {
    top: 10px;
  }

  .notification.leave {
    top: -100%;
    opacity: 0;
  }
</style>
