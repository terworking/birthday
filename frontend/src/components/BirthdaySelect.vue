<script setup lang="ts">
import { getTimeZones } from '@vvo/tzdb'

interface Properties {
  data: BackendListResponse
  disabled: boolean
  target: string
  timeZone: string
}

const { data } = defineProps<Properties>()
defineEmits(['update:target', 'update:timeZone'])

const timeZones = getTimeZones({ includeUtc: true }).sort(
  ({ name: a }, { name: b }) => a.localeCompare(b)
)
</script>

<template>
  <div class="birthday-select-container">
    <label for="birthday-select">Pilih nama</label>
    <select
      :disabled="disabled"
      aria-labelledby="Pilih nama"
      name="birthday-select"
      @input="
        $emit('update:target', ($event.target as HTMLSelectElement).value)
      "
    >
      <option value="" disabled>Pilih nama</option>
      <option
        v-for="[key, { name }] of Object.entries(data)"
        :selected="target === key"
        :value="key"
      >
        {{ name }}
      </option>
    </select>

    <label for="timezone-select">Pilih zona waktu</label>
    <select
      :disabled="disabled"
      aria-labelledby="Pilih zona waktu"
      name="timezone-select"
      @input="
        $emit('update:timeZone', ($event.target as HTMLSelectElement).value)
      "
    >
      <option value="" disabled>Pilih zona waktu</option>
      <option
        v-for="{ abbreviation, name } of timeZones"
        :selected="name === timeZone"
        :value="name"
      >
        {{ name }} ({{ abbreviation }})
      </option>
    </select>
  </div>
</template>

<style scoped>
.birthday-select-container {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.birthday-select-container > select {
  background-color: var(--t-bg-color-alt);
  color: inherit;
  border: 1px solid currentColor;
  padding: 8px 6px;
  margin: 8px 0;
  border-radius: 8px;
  width: 75%;
}

.birthday-select-container > select:disabled {
  filter: opacity(0.7);
}
</style>
