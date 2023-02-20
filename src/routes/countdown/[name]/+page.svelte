<script lang="ts">
	import type { State } from '$lib/types';
	import { calculateNextBirthdayDate } from '$lib/util';
	import { formatDuration, intervalToDuration } from 'date-fns';
	import { getContext } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = getContext('state') as Writable<State>;
	$state.selectedKey = data.key;
	const time = getContext('time') as Readable<Date>;

	const birthDate = new Date(data.value.year, data.value.month - 1, data.value.date);

	$: nextBirthdayDate = calculateNextBirthdayDate(data.value, { now: $time });
	$: birhtdayAge = intervalToDuration({ start: birthDate, end: nextBirthdayDate }).years!;
	$: durationToNextBirthdayDate = formatDuration(
		intervalToDuration({ start: $time, end: nextBirthdayDate }),
		{ format: ['months', 'days', 'hours', 'minutes', 'seconds'], zero: true }
	);
</script>

<div>
	<p><span> {data.value.name} </span> turns <span> {birhtdayAge} </span> in</p>
	<p><span> {durationToNextBirthdayDate} </span></p>
</div>

<style>
	div {
		text-align: center;
	}

	div span {
		font-weight: 700;
	}
</style>
