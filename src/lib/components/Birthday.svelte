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

<main class="w-full flex flex-col justify-center items-center">
	<BirthdaySelect {data} />
	<BirthdayContent {data} />
	<BirthdaySubscribe {data} />
</main>
