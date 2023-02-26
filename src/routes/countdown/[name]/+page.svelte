<script lang="ts">
	import { browser } from '$app/environment';
	import { afterNavigate, goto, preloadData } from '$app/navigation';
	import BirthdayCountdown from '$lib/components/BirthdayCountdown.svelte';
	import BirthdaySubscribe from '$lib/components/BirthdaySubscribe.svelte';
	import { state } from '$lib/stores';
	import { asOrdinalNumber } from '$lib/util';
	import { onMount, type SvelteComponent } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;
	$: $state.selectedKey = data.target.key;

	let Confetti: typeof SvelteComponent | undefined = undefined;

	let birthdayAge: number = 0;
	let durationToNextBirthdayDate: Duration = {};
	$: enableConfetti = durationToNextBirthdayDate.months === 0;

	$: if (browser && enableConfetti && Confetti === undefined) {
		import('$lib/components/BirthdayCountdownConfetti.svelte').then((it) => {
			Confetti = it.default;
		});
	}

	const navigate = async (to: 'next' | 'previous') => {
		await goto(`/countdown/${data[to]}`, { replaceState: true, noScroll: true });
	};

	afterNavigate(async () => {
		await Promise.all(
			// preload previous and next page data
			[data.previous, data.next].map((it) => preloadData(`/countdown/${it}`)),
		);
	});

	onMount(() => {
		// ref: https://code.whatever.social/questions/37187288/changing-where-the-back-button-leads-to#37189260
		const popstateCallback = async () => {
			// automatically select current target when navigating back
			await goto(`/?select=${$state.selectedKey}`, { replaceState: true, noScroll: true });
		};

		window.addEventListener('popstate', popstateCallback);
		return () => window.removeEventListener('popstate', popstateCallback);
	});
</script>

<svelte:head>
	<title>{data.target.name}'s {asOrdinalNumber(birthdayAge)} birthday countdown</title>
</svelte:head>

<div class="flex items-center justify-between">
	<button
		disabled={$state.disableInteraction}
		on:click={() => navigate('previous')}
		class="t-icon i-lucide-chevron-left"
	/>
	<div class="flex-1">
		<BirthdayCountdown bind:birthdayAge bind:durationToNextBirthdayDate {data} />
		<BirthdaySubscribe {data} />
	</div>
	<button
		disabled={$state.disableInteraction}
		on:click={() => navigate('next')}
		class="t-icon i-lucide-chevron-right"
	/>
</div>

<svelte:component this={Confetti} enabled={enableConfetti} />
