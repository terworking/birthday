<script lang="ts">
	import { format, formatDistance } from 'date-fns';
	import { calculateNextBirthdayDate } from '$lib/util';
	import { state, time } from '$lib/stores';
	import type { BirthdayData } from './Birthday.svelte';

	export let data: Pick<BirthdayData, 'targetMap'>;

	$: target = data.targetMap[$state.selectedKey || Object.keys(data.targetMap)[0]];
	$: birthDate = format(new Date(target.year, target.month - 1, target.date), 'd/M/yyyy');

	$: nextBirthdayDate = calculateNextBirthdayDate(target, { now: $time });
	$: distanceToNextBirthdayDate = formatDistance(nextBirthdayDate, $time, { addSuffix: true });
	$: upcomingBirthdayDates = Array.from({ length: 2 }, (_, index) =>
		format(
			new Date(
				nextBirthdayDate.getFullYear() + index,
				nextBirthdayDate.getMonth(),
				nextBirthdayDate.getDate(),
			),
			'd/M/yyyy',
		),
	);
</script>

<div class="text-center">
	<p class="font-semibold">
		{birthDate} &gt; {upcomingBirthdayDates.join(', ')}, ...
	</p>
	<p>Next notification {distanceToNextBirthdayDate}</p>
</div>
