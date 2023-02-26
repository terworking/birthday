<script lang="ts">
	import AppClock from '$lib/AppClock.svelte';
	import AppFooter from '$lib/AppFooter.svelte';
	import type { State } from '$lib/types';
	import { utcToZonedTime } from 'date-fns-tz';
	import { setContext } from 'svelte';
	import { derived, writable } from 'svelte/store';

	import '$lib/assets/normalize.css';

	const state = writable<State>({
		disableInteraction: false,
		selectedKey: '',
		selectedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone,
	});

	let timer: NodeJS.Timer | undefined = undefined;
	const time = derived(
		state,
		($state, set) => {
			const updateTime = () => {
				set(utcToZonedTime(new Date(), $state.selectedTimeZone));
			};

			// reset the timer whenever state is updated
			updateTime();
			clearInterval(timer);
			timer = setInterval(updateTime, 1000);

			return () => {
				clearInterval(timer);
			};
		},
		new Date(),
	);

	setContext('state', state);
	setContext('time', time);
</script>

<AppClock />
<slot />
<AppFooter />

<style uno:preflights global>
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

	body {
		--uno: 'font-sans bg-$t-bg-color text-$t-color';
	}

	.__root {
		--uno: 'flex flex-col items-center justify-between h-100vh p-8';
	}

	.__root > :not(.clock) {
		--uno: 'w-full max-w-sm';
	}

	.t-icon {
		--uno: '!text-$t-color !h-6 md:!h-8 !w-6 md:!w-8';
	}

	.t-icon:hover {
		--uno: '!text-$t-color-alt';
	}

	button:not([disabled]) {
		--uno: 'cursor-pointer';
	}

	button[disabled] {
		--uno: 'cursor-not-allowed';
	}
</style>
