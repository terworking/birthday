<script setup lang="ts">
import { useNow } from '@vueuse/core'
import { format } from 'date-fns'

const now = $(useNow({ interval: 1000 }))
const value = $computed(() => format(now, 'do MMMM, yyyy hh:mm:ss a'))
</script>

<template>
  <p class="clock">{{ value }}</p>
</template>

<style scoped>
.clock {
  text-align: center;
  font-weight: 600;
}
</style>
