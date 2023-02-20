<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import type { State } from '$lib/types';
	import { format, formatDistance } from 'date-fns';
	import { calculateNextBirthdayDate } from '$lib/util';
	import { getContext } from 'svelte';
	import type { BirthdayData } from './Birthday.svelte';

	export let data: BirthdayData;
	const state = getContext('state') as Writable<State>;
	const time = getContext('time') as Readable<Date>;

	$: target = data.targetMap[$state.selectedKey];
	$: birthDate = format(new Date(target.year, target.month - 1, target.date), 'd/M/yyyy');

	$: nextBirthdayDate = calculateNextBirthdayDate(target, { now: $time });
	$: distanceToNextBirthdayDate = formatDistance(nextBirthdayDate, $time, { addSuffix: true });
	$: upcomingBirthdayDates = Array.from({ length: 2 }, (_, index) =>
		format(
			new Date(
				nextBirthdayDate.getFullYear() + index,
				nextBirthdayDate.getMonth(),
				nextBirthdayDate.getDate()
			),
			'd/M/yyyy'
		)
	);
</script>

<div class="text-center">
	<p class="font-semibold">
		{birthDate} &gt; {upcomingBirthdayDates.join(', ')}, ...
	</p>
	<p>Next notification {distanceToNextBirthdayDate}</p>
</div>
