<script lang="ts">
	import AppClock from '$lib/AppClock.svelte';
	import AppFooter from '$lib/AppFooter.svelte';

	import '$lib/css/main.less';
</script>

<AppClock />
<slot />
<AppFooter />

<style uno:preflights global></style>
