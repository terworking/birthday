<script context="module" lang="ts">
	import type { BirthdayTarget } from '$lib/types';

	export interface CountdownData {
		target: { key: string } & BirthdayTarget;
	}
</script>

<script lang="ts">
	import { calculateNextBirthdayDate } from '$lib/util';
	import { formatDuration, intervalToDuration } from 'date-fns';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	export let data: CountdownData;
	export let birthdayAge: number;

	const time = getContext('time') as Readable<Date>;

	$: birthDate = new Date(data.target.year, data.target.month - 1, data.target.date);
	$: nextBirthdayDate = calculateNextBirthdayDate(data.target, { now: $time });
	$: birthdayAge = intervalToDuration({ start: birthDate, end: nextBirthdayDate }).years!;
	$: durationToNextBirthdayDate = formatDuration(
		intervalToDuration({ start: $time, end: nextBirthdayDate }),
		{ format: ['months', 'days', 'hours', 'minutes', 'seconds'], zero: true }
	).replace(/(days?) /, '$1\n'); // add a newline after days
</script>

<p><span> {data.target.name} </span> turns <span> {birthdayAge} </span></p>
<p>in <span> {durationToNextBirthdayDate} </span></p>

<style lang="less">
	p {
		--uno: 'text-center';

		> :global(span) {
			--uno: 'font-bold';
			white-space: pre-line;
		}
	}
</style>
