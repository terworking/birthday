<script setup lang="ts">
interface Properties {
  options: BirthdayData[]
  disabled: boolean
  selected: BirthdayData
}

const { options } = defineProps<Properties>()
defineEmits<{ 'update:selected': (value: BirthdayData) => void }>()

const keyedOptions = $computed(() =>
  Object.fromEntries(options.map((value) => [value.key, value] as const))
)
</script>

<template>
  <div class="birthday-select-container">
    <label for="birthday-select">Pilih nama</label>
    <select
      :disabled="disabled"
      aria-labelledby="Pilih nama"
      name="birthday-select"
      class="birthday-select"
      @input="
        $emit(
          'update:selected',
          keyedOptions[($event.target as HTMLSelectElement).value]
        )
      "
    >
      <option value="" disabled>Pilih nama</option>
      <option
        v-for="{ key, name } of options"
        :selected="selected.key === key"
        :value="key"
      >
        {{ name }}
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

.birthday-select {
  background-color: var(--t-bg-color-alt);
  color: inherit;
  border: 1px solid currentColor;
  padding: 8px 6px;
  margin: 8px 0;
  border-radius: 8px;
  width: 75%;
}

.birthday-select:disabled {
  filter: opacity(0.7);
}
</style>
