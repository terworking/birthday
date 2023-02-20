<script lang="ts">
	import { format } from 'date-fns';
	import { getContext } from 'svelte';
	import type { Readable } from 'svelte/store';

	const time = getContext('time') as Readable<Date>;
	$: value = format($time, 'do MMMM, yyyy hh:mm:ss a');
</script>

<p class="font-semibold text-center">{value}</p>
