<script lang="ts">
	import BirthdaySubscribe from '$lib/components/BirthdaySubscribe.svelte';
	import type { State } from '$lib/types';
	import { calculateNextBirthdayDate } from '$lib/util';
	import { formatDuration, intervalToDuration } from 'date-fns';
	import { getContext } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = getContext('state') as Writable<State>;
	$state.selectedKey = data.target.key;
	const time = getContext('time') as Readable<Date>;

	const birthDate = new Date(data.target.year, data.target.month - 1, data.target.date);

	$: nextBirthdayDate = calculateNextBirthdayDate(data.target, { now: $time });
	$: birhtdayAge = intervalToDuration({ start: birthDate, end: nextBirthdayDate }).years!;
	$: durationToNextBirthdayDate = formatDuration(
		intervalToDuration({ start: $time, end: nextBirthdayDate }),
		{ format: ['months', 'days', 'hours', 'minutes', 'seconds'], zero: true }
	);
</script>

<div>
	<p><span> {data.target.name} </span> turns <span> {birhtdayAge} </span> in</p>
	<p><span> {durationToNextBirthdayDate} </span></p>
	<BirthdaySubscribe {data} />
</div>

<style>
	div {
		text-align: center;
	}

	div > p > span {
		font-weight: 700;
	}
</style>
