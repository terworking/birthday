<script context="module" lang="ts">
	export interface BirthdayData {
		publicKey: string;
		targetMap: Record<string, BirthdayTarget>;
		timeZoneMap: Record<string, string>;
	}
</script>

<script lang="ts">
	import type { BirthdayTarget } from '$lib/types';
	import BirthdayContent from './BirthdayContent.svelte';
	import BirthdaySelect from './BirthdaySelect.svelte';
	import BirthdaySubscribe from './BirthdaySubscribe.svelte';

	export let data: BirthdayData;
</script>

<main>
	<BirthdaySelect {data} />
	<BirthdayContent {data} />
	<BirthdaySubscribe {data} />
</main>

<style>
	main {
		display: flex;
		width: 100%;
		flex-direction: column;
		justify-content: center;
		align-items: center;
	}
</style>
