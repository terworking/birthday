<script lang="ts">
	import { goto } from '$app/navigation';
	import BirthdayCountdown from '$lib/components/BirthdayCountdown.svelte';
	import BirthdaySubscribe from '$lib/components/BirthdaySubscribe.svelte';
	import type { State } from '$lib/types';
	import { asOrdinalNumber } from '$lib/util';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = getContext('state') as Writable<State>;
	$: $state.selectedKey = data.target.key;

	const navigate = async (to: 'next' | 'previous') => {
		await goto(`/countdown/${data[to]}`, { replaceState: true, noScroll: true });
	};

	let birthdayAge: number = 0;
</script>

<svelte:head>
	<title>{data.target.name}'s {asOrdinalNumber(birthdayAge)} birthday countdown</title>
</svelte:head>

<div class="flex items-center justify-between">
	<button on:click={() => navigate('previous')} class="t-icon i-mdi-pan-left" />
	<div class="flex-1">
		<BirthdayCountdown bind:birthdayAge {data} />
		<BirthdaySubscribe {data} />
	</div>
	<button on:click={() => navigate('next')} class="t-icon i-mdi-pan-right" />
</div>