<script context="module" lang="ts">
	import type { BirthdayTarget } from '$lib/types';

	export interface CountdownData {
		target: { key: string } & BirthdayTarget;
	}
</script>

<script lang="ts">
	import { calculateNextBirthdayDate } from '$lib/util';
	import { time } from '$lib/stores';
	import { formatDuration, intervalToDuration } from 'date-fns';

	export let data: CountdownData;
	export let birthdayAge: number = 0;
	export let durationToNextBirthdayDate: Duration = {};

	$: birthDate = new Date(data.target.year, data.target.month - 1, data.target.date);
	$: nextBirthdayDate = calculateNextBirthdayDate(data.target, { now: $time });
	$: birthdayAge = intervalToDuration({ start: birthDate, end: nextBirthdayDate }).years!;
	$: durationToNextBirthdayDate = intervalToDuration({ start: $time, end: nextBirthdayDate });

	let content: string;
	$: {
		const format = ['hours', 'minutes', 'seconds'];
		for (const k of ['days', 'months'] as const) {
			if (durationToNextBirthdayDate[k]) {
				format.unshift(k);
			}
		}

		const re = format.includes('months')
			? /(day|hour)s? / // append a newline after days? if month is not removed
			: /(hours?) /; // otherwise, append one after hours?
		content = formatDuration(durationToNextBirthdayDate, {
			format,
			zero: true,
		}).replace(re, '$&\n');
	}
</script>

<p><span> {data.target.name} </span> turns <span> {birthdayAge} </span></p>
<p>in <span> {content} </span></p>

<style lang="less">
	p {
		--uno: 'text-center';

		> :global(span) {
			--uno: 'font-bold';
			white-space: pre-line;
		}
	}
</style>
