<script setup lang="ts">
import IconPanLeft from '~icons/mdi/pan-left'
import IconPanRight from '~icons/mdi/pan-right'

import { data, timeZones } from '~stores/data'
import { sortedByDistanceData, state } from '~stores/state'
import { useStore } from '@nanostores/vue'
import { useCycleList } from '@vueuse/core'
import { watch } from 'vue'

const $data = $(useStore(data))
const $state = $(useStore(state))

const {
  next: nextKey,
  prev: prevKey,
  state: selected,
} = useCycleList(
  sortedByDistanceData.get().map(([key]) => key),
  { initialValue: state.get().selected }
)

const {
  next: nextTimeZone,
  prev: prevTimeZone,
  state: timeZone,
} = useCycleList(
  timeZones.get().map(({ name }) => name),
  { initialValue: state.get().timeZone }
)

watch(selected, (v) => state.setKey('selected', v))
watch(timeZone, (v) => state.setKey('timeZone', v))
</script>

<template>
  <div class="birthday-select">
    <label for="birthday">Pilih nama</label>
    <div class="select-container">
      <button @click="prevKey()">
        <IconPanLeft />
      </button>
      <select
        :disabled="$state.disableInteraction"
        aria-labelledby="Pilih nama"
        name="birthday"
        v-model="selected"
      >
        <option value="" disabled>Pilih nama</option>
        <option
          v-for="([key, { name }], i) of Object.entries($data)"
          :value="key"
        >
          {{ i + 1 }} - {{ name }}
        </option>
      </select>
      <button @click="nextKey()">
        <IconPanRight />
      </button>
    </div>

    <label for="timezone">Pilih zona waktu</label>
    <div class="select-container">
      <button @click="prevTimeZone()">
        <IconPanLeft />
      </button>
      <select
        :disabled="$state.disableInteraction"
        aria-labelledby="Pilih zona waktu"
        name="timezone"
        v-model="timeZone"
      >
        <option value="" disabled>Pilih zona waktu</option>
        <option
          v-for="{ abbreviation, name, offset } of timeZones.get()"
          :value="name"
        >
          {{ name }} ({{ abbreviation }}, UTC{{ offset }})
        </option>
      </select>
      <button @click="nextTimeZone()">
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
