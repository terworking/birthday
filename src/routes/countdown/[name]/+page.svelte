<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import BirthdayCountdown from '$lib/components/BirthdayCountdown.svelte';
	import BirthdaySubscribe from '$lib/components/BirthdaySubscribe.svelte';
	import type { State } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = getContext('state') as Writable<State>;
	$state.selectedKey = data.target.key;

	const navigate = async (to: 'next' | 'previous') => {
		const url = new URL($page.url);
		url.searchParams.set(to, '1');
		await goto(url);
	};
</script>

<div class="flex items-center justify-between">
	<button on:click={() => navigate('previous')} class="t-icon i-mdi-pan-left" />
	<div class="flex-1">
		<BirthdayCountdown {data} />
		<BirthdaySubscribe {data} />
	</div>
	<button on:click={() => navigate('next')} class="t-icon i-mdi-pan-right" />
</div>

<style>
	button {
		--uno: 'cursor-pointer';
	}
</style>
