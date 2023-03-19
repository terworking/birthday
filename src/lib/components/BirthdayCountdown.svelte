<script context="module" lang="ts">
	import type { BirthdayTarget } from '$lib/types';

	export interface CountdownData {
		target: { key: string } & BirthdayTarget;
	}
</script>

<script lang="ts">
	import { formatDuration } from 'date-fns';

	export let data: CountdownData;
	export let birthdayAge: number;
	export let durationToNextBirthdayDate: Duration;

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
