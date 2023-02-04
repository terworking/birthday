<script lang="ts">
	import AppClock from '$lib/AppClock.svelte';
	import AppFooter from '$lib/AppFooter.svelte';
	import BirthdayContent from '$lib/components/BirthdayContent.svelte';
	import BirthdaySelect from '$lib/components/BirthdaySelect.svelte';
	import SubscriptionButton from '$lib/components/SubscriptionButton.svelte';
	import type { BirthdayTarget, State } from '$lib/types';
	import { calculateNextBirthdayDate } from '$lib/util';
	import { setContext } from 'svelte';
	import { readable, writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = writable<State>({
		disableInteraction: false,
		selectedKey: '',
		selectedTimeZone: Intl.DateTimeFormat().resolvedOptions().timeZone
	});

	const time = readable(new Date(), (set) => {
		const update = () => {
			return setInterval(() => {
				set(new Date());
			}, 1000);
		};

		let interval = update();
		state.subscribe(() => {
			clearInterval(interval);
			interval = update();
		});

		return () => clearInterval(interval);
	});

	const sortedTarget = readable<[string, BirthdayTarget][]>([], (set) => {
		time.subscribe((time) => {
			set(
				Object.entries(data.targets).sort(
					([_, a], [__, b]) =>
						calculateNextBirthdayDate(a, time).valueOf() -
						calculateNextBirthdayDate(b, time).valueOf()
				)
			);
		});
	});
	state.set({ ...$state, selectedKey: $sortedTarget[0][0] });

	setContext('state', state);
	setContext('sorted-target', sortedTarget);
	setContext('time', time);
</script>

<div class="content">
	<AppClock />
	<main>
		<BirthdaySelect data={data.targets} timeZones={data.timeZones} />
		<BirthdayContent data={data.targets} />
		<SubscriptionButton />
	</main>
	<AppFooter />
</div>

<style>
	.content {
		padding: 32px 16px;
		height: 100vh;
		display: flex;
		align-items: center;
		flex-direction: column;
		justify-content: space-between;
	}

	.content > :global(:not(p)) {
		width: 100%;
		max-width: 350px;
	}

	.content > main {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
