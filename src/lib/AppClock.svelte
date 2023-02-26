<script lang="ts">
	import { format } from 'date-fns';
	import { time } from './stores';

	$: value = format($time, 'do MMMM, yyyy hh:mm:ss a');
</script>

<p class="font-semibold text-center">{value}</p>
