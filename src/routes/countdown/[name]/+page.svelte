<script lang="ts">
	import { goto } from '$app/navigation';
	import BirthdayCountdown from '$lib/components/BirthdayCountdown.svelte';
	import BirthdaySubscribe from '$lib/components/BirthdaySubscribe.svelte';
	import type { State } from '$lib/types';
	import { asOrdinalNumber } from '$lib/util';
	import { getContext, onMount, type SvelteComponent } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = getContext('state') as Writable<State>;
	$: $state.selectedKey = data.target.key;

	let Confetti: typeof SvelteComponent;

	let birthdayAge: number = 0;

	const navigate = async (to: 'next' | 'previous') => {
		await goto(`/countdown/${data[to]}`, { replaceState: true, noScroll: true });
	};

	onMount(async () => {
		Confetti = (await import('$lib/components/BirthdayCountdownConfetti.svelte')).default;

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
		class="t-icon i-mdi-pan-left"
	/>
	<div class="flex-1">
		<BirthdayCountdown bind:birthdayAge {data} />
		<BirthdaySubscribe {data} />
	</div>
	<button
		disabled={$state.disableInteraction}
		on:click={() => navigate('next')}
		class="t-icon i-mdi-pan-right"
	/>
</div>

<svelte:component this={Confetti} />
