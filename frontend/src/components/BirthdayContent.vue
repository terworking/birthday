<script setup lang="ts">
import { data } from '~stores/data'
import { now, state } from '~stores/state'
import { format, formatDistance } from 'date-fns'
import { calculateNextBirthdayDate } from '~utils/birthday'
import { useStore } from '@nanostores/vue'

const $data = $(useStore(data))
const $state = $(useStore(state))
const target = $computed(() => $data[$state.selected])

const $now = $(useStore(now))
const birthDate = $computed(() => {
  const date =
    target === undefined
      ? new Date(0)
      : new Date(target.year, target.month - 1, target.date)

  return format(date, 'd/M/yyyy')
})

const nextBirthdayDate = $computed(() =>
  calculateNextBirthdayDate(target, $state.timeZone, $now)
)

const distanceToNextBirthdayDate = $computed(() =>
  formatDistance(nextBirthdayDate, $now, { addSuffix: true })
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
    <p class="upcoming-birthday">
      {{ birthDate }} &gt; {{ upcomingBirthdayDates.join(', ') }}, ...
    </p>
    <p>Next notification {{ distanceToNextBirthdayDate }}</p>
  </div>
</template>

<style scoped>
.birthday-content {
  text-align: center;
}

.upcoming-birthday {
  font-size: 1rem;
  font-weight: 600;
}
</style>
