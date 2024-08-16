import { sleep } from '@/lib'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export type NotificationContent = Partial<{
  variant: 'info' | 'success' | 'error' | 'warning'
  title: string
  message: string
}>

export const enum NotificationState {
  enter = 'enter',
  active = 'active',
  leave = 'leave'
}

export type Notification = {
  content: NotificationContent,
  state: NotificationState,
}

const StateDuration = Object.freeze({
  [NotificationState.enter]: 100,
  [NotificationState.active]: 2000,
  [NotificationState.leave]: 1000,
})

const useNotificationsStore = defineStore('notifications', () => {
  const notifications = ref<NotificationContent[]>([])

  const notification = ref<Notification | null>(null)

  const update = async () => {
    while (notification.value === null && notifications.value.length > 0) {
      const content = notifications.value.shift()!
      notification.value = {
        content,
        state: NotificationState.enter
      }
      for (const [state, duration] of Object.entries(StateDuration)) {
        notification.value.state = state as NotificationState
        await sleep(duration)
      }
      notification.value = null
    }
  }

  const addNotification = (notification: NotificationContent) => {
    notifications.value.push(notification)
    update()
  }

  return { notification, addNotification }
})

export default useNotificationsStore
