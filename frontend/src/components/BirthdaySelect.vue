<script setup lang="ts">
import { data } from '~stores/data'
import { disableInteraction, state } from '~stores/state'
import { getTimeZones } from '@vvo/tzdb'
import { useStore, useVModel } from '@nanostores/vue'

const $data = $(useStore(data))
const $disableInteraction = $(useStore(disableInteraction))

const selected = useVModel(state, 'selected')
const timeZone = useVModel(state, 'timeZone')

const timeZones = getTimeZones({ includeUtc: true }).sort(
  ({ name: a }, { name: b }) => a.localeCompare(b)
)
</script>

<template>
  <div class="birthday-select">
    <label for="birthday">Pilih nama</label>
    <select
      :disabled="$disableInteraction"
      aria-labelledby="Pilih nama"
      name="birthday"
      v-model="selected"
    >
      <option value="" disabled>Pilih nama</option>
      <option v-for="[key, { name }] of Object.entries($data)" :value="key">
        {{ name }}
      </option>
    </select>

    <label for="timezone">Pilih zona waktu</label>
    <select
      :disabled="$disableInteraction"
      aria-labelledby="Pilih zona waktu"
      name="timezone"
      v-model="timeZone"
    >
      <option value="" disabled>Pilih zona waktu</option>
      <option v-for="{ abbreviation, name } of timeZones" :value="name">
        {{ name }} ({{ abbreviation }})
      </option>
    </select>
  </div>
</template>

<style scoped>
.birthday-select {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.birthday-select > select {
  background-color: var(--t-bg-color-alt);
  color: inherit;
  border: 1px solid currentColor;
  padding: 8px 6px;
  margin: 8px 0;
  border-radius: 8px;
  width: 75%;
}

.birthday-select > select:disabled {
  filter: opacity(0.7);
}
</style>
