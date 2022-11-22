<script setup lang="ts">
import BirthdaySelect from './BirthdaySelect.vue'
import SubscribtionButton from './SubscribtionButton.vue'

import { useNow } from '@vueuse/core'
import { format, formatDistance } from 'date-fns'
import { calculateNextBirthdayDate } from '~utils/birthday'

const { options } = defineProps<{ options: BirthdayData[] }>()

let disabled = $ref(false)
let selected = $ref(
  options
    .slice()
    .sort(
      (a, b) =>
        calculateNextBirthdayDate(a).valueOf() -
        calculateNextBirthdayDate(b).valueOf()
    )
    .shift()!
)

const now = $(useNow({ interval: 1000 }))
const birthDate = $computed(() => {
  const date =
    selected === undefined
      ? new Date(0)
      : new Date(selected.year, selected.month - 1, selected.date)

  return format(date, 'd/M/yyyy')
})

const nextBirthdayDate = $computed(() =>
  calculateNextBirthdayDate(selected, now)
)

const distanceToNextBirthdayDate = $computed(() =>
  formatDistance(nextBirthdayDate, now, { addSuffix: true })
)

const upcomingBirthdayDates = $computed(() =>
  Array.from({ length: 2 }, (_, index) =>
    format(
      new Date(
        nextBirthdayDate.getFullYear() + index,
        nextBirthdayDate.getMonth(),
        nextBirthdayDate.getDate()
      ),
      'd/M/yyyy'
    )
  )
)
</script>

<template>
  <div class="birthday-content">
    <BirthdaySelect
      :options="options"
      :disabled="disabled"
      v-model:selected="selected"
    />

    <div class="selected-value">
      <p class="selected-date-value">
        {{ birthDate }} &gt; {{ upcomingBirthdayDates.join(', ') }}, ...
      </p>
      <p>Next notification in {{ distanceToNextBirthdayDate }}</p>
    </div>

    <SubscribtionButton :target="selected" v-model:pending="disabled" />
  </div>
</template>

<style scoped>
.birthday-content {
  height: 80%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
}

.selected-value {
  text-align: center;
}

.selected-date-value {
  font-size: 1rem;
  font-weight: 600;
}
</style>
