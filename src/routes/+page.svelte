<script lang="ts">
	import { page } from '$app/stores';
	import Birthday from '$lib/components/Birthday.svelte';
	import { state } from '$lib/stores';
	import { onMount } from 'svelte';
	import type { PageData } from './$types';

	export let data: PageData;

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
