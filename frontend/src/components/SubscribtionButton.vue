<script setup lang="ts">
import {
  addSubscription,
  removeSubscription,
  subscriptions,
} from '~subscriptionStore'
import { useStore } from '@nanostores/vue'
import { fetchBirthdayNotificationServer } from '~utils/backend'
import {
  checkWebpushCompability,
  askNotificationPermission,
  generateSubscriptionPayload,
} from '~utils/webpush'

interface Properties {
  target: string | undefined
  timeZone: string
  pending: boolean
}

const { target: key, timeZone } = defineProps<Properties>()
const emit = defineEmits(['update:pending'])
const $subscriptions = $(useStore(subscriptions))

const subscribed = $computed(() => $subscriptions.has(key ?? ''))

const subscribe = async () => {
  emit('update:pending', true)

  try {
    if (key === undefined) {
      throw new Error('You have not selected a target.')
    }

    checkWebpushCompability()
    const permission = await askNotificationPermission()
    if (permission !== 'granted') {
      throw new Error('Unable to get notification permission.')
    }

    const payload = await generateSubscriptionPayload(key, timeZone)
    const response = await fetchBirthdayNotificationServer('subscribe', {
      body: JSON.stringify(payload),
      method: 'POST',
    })

    const text = await response.text()
    if (response.status === 201 && text.includes('SUBSCRIBED')) {
      addSubscription(key)
      alert('Successfully subscribed.')
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
    if (key === undefined) {
      throw new Error('You have not selected a target.')
    }

    if (subscribed) {
      const payload = await generateSubscriptionPayload(key, timeZone)
      const response = await fetchBirthdayNotificationServer('unsubscribe', {
        body: JSON.stringify(payload),
        method: 'POST',
      })

      const text = await response.text()
      if (response.status === 200 && text.includes('UNSUBSCRIBED')) {
        removeSubscription(key)
        alert('Successfully unsubscribed.')
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
