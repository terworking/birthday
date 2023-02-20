<script lang="ts">
	import BirthdayCountdown from '$lib/components/BirthdayCountdown.svelte';
	import BirthdaySubscribe from '$lib/components/BirthdaySubscribe.svelte';
	import type { State } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = getContext('state') as Writable<State>;
	$state.selectedKey = data.target.key;
</script>

<div>
	<BirthdayCountdown {data} />
	<BirthdaySubscribe {data} />
</div>
