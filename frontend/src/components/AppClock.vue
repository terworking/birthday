<script setup lang="ts">
import { state } from '~stores/state'
import { useNow } from '@vueuse/core'
import { useStore } from '@nanostores/vue'
import utcToZonedTime from 'date-fns-tz/esm/utcToZonedTime'
import { format } from 'date-fns'

const now = $(useNow({ interval: 1000 }))
const $state = $(useStore(state))
const value = $computed(() =>
  format(utcToZonedTime(now, $state.timeZone), 'do MMMM, yyyy hh:mm:ss a')
)
</script>

<template>
  <p class="clock">{{ value }}</p>
</template>

<style scoped>
.clock {
  font-weight: 600;
}
</style>
