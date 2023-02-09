<script lang="ts">
	import AppClock from '$lib/AppClock.svelte';
	import AppFooter from '$lib/AppFooter.svelte';
	import Birthday from '$lib/components/Birthday.svelte';
	import type { State } from '$lib/types';
	import { utcToZonedTime } from 'date-fns-tz';
	import { setContext } from 'svelte';
	import { readable, writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = writable<State>({
		disableInteraction: false,
		selectedKey: Object.keys(data.targetMap)[0],
		selectedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
	});

	const time = readable(new Date(), (set) => {
		const update = (timeZone: string) => {
			set(utcToZonedTime(new Date(), timeZone));
		};

		let interval: NodeJS.Timer;
		state.subscribe(({ selectedTimeZone }) => {
			update(selectedTimeZone);
			clearInterval(interval);
			interval = setInterval(() => update(selectedTimeZone), 1000);
		});

		return () => clearInterval(interval);
	});

	setContext('state', state);
	setContext('time', time);
</script>

<AppClock />
<Birthday />
<AppFooter />
