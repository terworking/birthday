<script setup lang="ts">
import IconPanLeft from '~icons/mdi/pan-left'
import IconPanRight from '~icons/mdi/pan-right'

import { data } from '~stores/data'
import { disableInteraction, sortedByDistanceData, state } from '~stores/state'
import { useStore, useVModel } from '@nanostores/vue'
import { useCycleList } from '@vueuse/core'
import { getTimeZones } from '@vvo/tzdb'

const $data = $(useStore(data))
const $disableInteraction = $(useStore(disableInteraction))

const selected = $(useVModel(state, 'selected'))
const timeZone = $(useVModel(state, 'timeZone'))

const sortedData = $(useStore(sortedByDistanceData))
const { next: nextKey, prev: prevKey } = useCycleList(
  sortedData.map(([key]) => key),
  { initialValue: selected }
)

const timeZones = getTimeZones({ includeUtc: true }).sort(
  ({ name: a }, { name: b }) => a.localeCompare(b)
)
const { next: nextTimeZone, prev: prevTimeZone } = useCycleList(
  timeZones.map(({ name }) => name),
  { initialValue: timeZone }
)
</script>

<template>
  <div class="birthday-select">
    <label for="birthday">Pilih nama</label>
    <div class="select-container">
      <button @click="selected = prevKey()">
        <IconPanLeft />
      </button>
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
      <button @click="selected = nextKey()">
        <IconPanRight />
      </button>
    </div>

    <label for="timezone">Pilih zona waktu</label>
    <div class="select-container">
      <button @click="timeZone = prevTimeZone()">
        <IconPanLeft />
      </button>
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
      <button @click="timeZone = nextTimeZone()">
        <IconPanRight />
      </button>
    </div>
  </div>
</template>

<style scoped>
.birthday-select {
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.birthday-select select {
  background-color: var(--t-bg-color-alt);
  color: inherit;
  border: 1px solid currentColor;
  padding: 8px 6px;
  margin: 8px 0;
  border-radius: 8px;
  width: 75%;
}

.birthday-select select:disabled {
  filter: opacity(0.7);
}

.select-container {
  display: flex;
  justify-content: space-between;
}

.select-container > button {
  background-color: transparent;
  border: 0;
  cursor: pointer;
}
</style>
