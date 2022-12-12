<script setup lang="ts">
import { now } from '~stores/state'
import { useStore } from '@nanostores/vue'
import { format } from 'date-fns'

const $now = $(useStore(now))
const value = $computed(() => format($now, 'do MMMM, yyyy hh:mm:ss a'))
</script>

<template>
  <p class="clock">{{ value }}</p>
</template>

<style scoped>
.clock {
  font-weight: 600;
}
</style>
