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

	const time = getContext('time') as Readable<Date>;

	const birthDate = new Date(data.target.year, data.target.month - 1, data.target.date);

	$: nextBirthdayDate = calculateNextBirthdayDate(data.target, { now: $time });
	$: birthdayAge = intervalToDuration({ start: birthDate, end: nextBirthdayDate }).years!;
	$: durationToNextBirthdayDate = formatDuration(
		intervalToDuration({ start: $time, end: nextBirthdayDate }),
		{ format: ['months', 'days', 'hours', 'minutes', 'seconds'], zero: true }
	);
</script>

<p><span> {data.target.name} </span> turns <span> {birthdayAge} </span> in</p>
<p><span> {durationToNextBirthdayDate} </span></p>

<style>
	p {
		text-align: center;
	}

	p > span {
		font-weight: 700;
	}
</style>
