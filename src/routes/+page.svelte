<script lang="ts">
	import { page } from '$app/stores';
	import Birthday from '$lib/components/Birthday.svelte';
	import type { State } from '$lib/types';
	import { getContext, onMount } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { PageData } from './$types';

	export let data: PageData;

	const state = getContext('state') as Writable<State>;

	onMount(() => {
		const selectQuery = $page.url.searchParams.get('select');
		if (selectQuery !== null) {
			$state.selectedKey = selectQuery;
		}
	});
</script>

<svelte:head>
	<title>Terworking birthday</title>
</svelte:head>

<Birthday {data} />
