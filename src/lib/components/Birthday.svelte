<script lang="ts">
	import BirthdayContent from './BirthdayContent.svelte';
	import BirthdaySelect from './BirthdaySelect.svelte';
	import BirthdaySubscribe from './BirthdaySubscribe.svelte';
</script>

<main>
	<BirthdaySelect />
	<BirthdayContent />
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
