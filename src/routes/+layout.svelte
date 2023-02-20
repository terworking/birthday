<script lang="ts">
	import AppClock from '$lib/AppClock.svelte';
	import AppFooter from '$lib/AppFooter.svelte';
	import type { State } from '$lib/types';
	import { utcToZonedTime } from 'date-fns-tz';
	import { setContext } from 'svelte';
	import { readable, writable } from 'svelte/store';

	const state = writable<State>({
		disableInteraction: false,
		selectedKey: '',
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
<slot />
<AppFooter />

<style uno:preflights global>
	:global(body) {
		background-color: var(--t-bg-color);
		color: var(--t-color);
	}

	:global(.t-icon) {
		color: var(--t-color);
		width: 1.75rem;
		height: 1.75rem;
	}

	:global(.t-icon:hover) {
		color: var(--t-color-alt);
	}

	@media (prefers-color-scheme: light) {
		:root {
			--t-bg-color: #fdf6e3;
			--t-bg-color-alt: #eee8d5;
			--t-color: #839496;
			--t-color-alt: #93a1a1;
		}
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--t-bg-color: #002b36;
			--t-bg-color-alt: #073642;
			--t-color: #657b83;
			--t-color-alt: #586e75;
		}
	}
</style>
