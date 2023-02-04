<script lang="ts">
	import type { Readable, Writable } from 'svelte/store';
	import type { BirthdayTarget, State } from '$lib/types';
	import { format, formatDistance } from 'date-fns';
	import { calculateNextBirthdayDate } from '$lib/util';
	import { getContext } from 'svelte';

	export let data: Record<string, BirthdayTarget>;

	const state = getContext('state') as Writable<State>;
	const time = getContext('time') as Readable<Date>;

	$: target = data[$state.selectedKey];
	$: birthDate = format(new Date(target.year, target.month - 1, target.date), 'd/M/yyyy');
	$: nextBirthdayDate = calculateNextBirthdayDate(target, $time);
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

<div class="birthday-content">
	<p class="upcoming-birthday">
		{birthDate} &gt; {upcomingBirthdayDates.join(', ')}, ...
	</p>
	<p>Next notification {distanceToNextBirthdayDate}</p>
</div>

<style>
	.birthday-content {
		text-align: center;
	}

	.upcoming-birthday {
		font-size: 1rem;
		font-weight: 600;
	}
</style>
