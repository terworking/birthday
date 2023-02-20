<script lang="ts">
	import Birthday from '$lib/components/Birthday.svelte';
	import type { State } from '$lib/types';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = getContext('state') as Writable<State>;
	$state.selectedKey = Object.keys(data.targetMap)[0];
</script>

<Birthday {data} />
