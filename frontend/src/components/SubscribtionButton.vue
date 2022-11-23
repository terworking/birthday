<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core'
import { fetchBirthdayNotificationServer } from '~utils/backend'
import {
  checkWebpushCompability,
  askNotificationPermission,
  generateSubscriptionPayload,
} from '~utils/webpush'

interface Properties {
  target: BirthdayData | undefined
  timeZone: string
  pending: boolean
}

const { target, timeZone } = defineProps<Properties>()
const emit = defineEmits(['update:pending'])
const subscriptions = $(
  useLocalStorage<Set<string>>('subscriptions', new Set([]))
)

const subscribed = $computed(() => subscriptions.has(target?.key ?? ''))

const subscribe = async () => {
  emit('update:pending', true)

  try {
    if (target === undefined) {
      throw new Error('You have not selected a target.')
    }

    checkWebpushCompability()
    const permission = await askNotificationPermission()
    if (permission !== 'granted') {
      throw new Error('Unable to get notification permission.')
    }

    const payload = await generateSubscriptionPayload(target.key, timeZone)
    const response = await fetchBirthdayNotificationServer('subscribe', {
      body: JSON.stringify(payload),
      method: 'POST',
    })

    const text = await response.text()
    if (response.status === 201 && text.includes('SUBSCRIBED')) {
      subscriptions.add(target.key)
      alert(`Successfully subscribed to ${target.name}.`)
    } else {
      throw new Error(text)
    }
  } catch (error) {
    alert(error)
  } finally {
    emit('update:pending', false)
  }
}

const unsubscribe = async () => {
  emit('update:pending', true)

  try {
    if (target === undefined) {
      throw new Error('You have not selected a target.')
    }

    if (subscribed) {
      const payload = await generateSubscriptionPayload(target.key, timeZone)
      const response = await fetchBirthdayNotificationServer('unsubscribe', {
        body: JSON.stringify(payload),
        method: 'POST',
      })

      const text = await response.text()
      if (response.status === 200 && text.includes('UNSUBSCRIBED')) {
        subscriptions.delete(target.key)
        alert(`Successfully unsubscribed from ${target.name}.`)
      } else {
        throw new Error(text)
      }
    }
  } catch (error) {
    alert(error)
  } finally {
    emit('update:pending', false)
  }
}
</script>

<template>
  <div class="subscription-button-container">
    <button @click="subscribe" :disabled="subscribed || pending">
      Subscribe
    </button>
    <button @click="unsubscribe" :disabled="!subscribed || pending">
      Unsubscribe
    </button>
  </div>
</template>

<style scoped>
.subscription-button-container {
  width: 100%;
  display: flex;
  justify-content: space-evenly;
}

.subscription-button-container > button {
  background-color: var(--t-bg-color-alt);
  color: inherit;
  border: 1px solid currentColor;
  padding: 6px 8px;
}

.subscription-button-container > button:not([disabled]) {
  cursor: pointer;
}

.subscription-button-container > button:disabled {
  filter: opacity(0.7);
}
</style>
