<script lang="ts">
	import type { BirthdayTarget } from '$lib/types';
	import BirthdayContent from './BirthdayContent.svelte';
	import BirthdaySelect from './BirthdaySelect.svelte';
	import BirthdaySubscribe from './BirthdaySubscribe.svelte';

	export let targetMap: Record<string, BirthdayTarget>;
	export let timeZoneMap: Record<string, string>;
</script>

<main>
	<BirthdaySelect {targetMap} {timeZoneMap} />
	<BirthdayContent {targetMap} />
	<BirthdaySubscribe />
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
