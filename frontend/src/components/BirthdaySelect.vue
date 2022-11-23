<script setup lang="ts">
import { getTimeZones } from '@vvo/tzdb'

interface Properties {
  options: BirthdayData[]
  disabled: boolean
  target: BirthdayData
  timeZone: string
}

const { options } = defineProps<Properties>()
defineEmits(['update:target', 'update:timeZone'])

const keyedOptions = $computed(() =>
  Object.fromEntries(options.map((value) => [value.key, value] as const))
)

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
        $emit(
          'update:target',
          keyedOptions[($event.target as HTMLSelectElement).value]
        )
      "
    >
      <option value="" disabled>Pilih nama</option>
      <option
        v-for="{ key, name } of options"
        :selected="target.key === key"
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
