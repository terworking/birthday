<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import { page } from '$app/stores';
	import type { Readable, Writable } from 'svelte/store';
	import IconPanLeft from '~icons/mdi/pan-left';
	import IconPanRight from '~icons/mdi/pan-right';
	import type { State } from '$lib/types';
	import { calculateNextBirthdayDate } from '$lib/util';

	const { targetMap, timeZoneMap } = $page.data;
	const state = getContext('state') as Writable<State>;
	const time = getContext('time') as Readable<Date>;

	$: sortedTargets = Object.entries(targetMap).sort(
		([_, a], [__, b]) =>
			calculateNextBirthdayDate(a, { now: $time }).valueOf() -
			calculateNextBirthdayDate(b, { now: $time }).valueOf()
	);
	onMount(() => ($state.selectedKey = sortedTargets[0][0]));

	$: keyIndex = sortedTargets.findIndex(([key]) => key === $state.selectedKey);
	const nextKey = () =>
		($state.selectedKey = sortedTargets[(keyIndex + 1) % sortedTargets.length][0]);
	const prevKey = () =>
		($state.selectedKey =
			sortedTargets[(keyIndex + sortedTargets.length - 1) % sortedTargets.length][0]);

	$: timeZones = Object.entries(timeZoneMap);
	$: timeZoneIndex = timeZones.findIndex(([key]) => key === $state.selectedTimeZone) ?? 0;
	const nextTimeZone = () =>
		($state.selectedTimeZone = timeZones[(timeZoneIndex + 1) % timeZones.length][0]);
	const prevTimeZone = () =>
		($state.selectedTimeZone =
			timeZones[(timeZoneIndex + timeZones.length - 1) % timeZones.length][0]);
</script>

<div class="birthday-select">
	<label for="birthday">Pilih nama</label>
	<div class="select-container">
		<button on:click={prevKey}>
			<IconPanLeft />
		</button>
		<select
			disabled={$state.disableInteraction}
			aria-labelledby="Pilih nama"
			name="birthday"
			bind:value={$state.selectedKey}
		>
			<option value="" disabled>Pilih nama</option>
			<option value="all">0 - SEMUA</option>
			{#each Object.entries(targetMap) as [key, { name }], i}
				<option value={key}>{i + 1} - {name}</option>
			{/each}
		</select>
		<button on:click={nextKey}>
			<IconPanRight />
		</button>
	</div>

	<label for="timezone">Pilih zona waktu</label>
	<div class="select-container">
		<button on:click={prevTimeZone}>
			<IconPanLeft />
		</button>
		<select
			disabled={$state.disableInteraction}
			aria-labelledby="Pilih zona waktu"
			name="timezone"
			bind:value={$state.selectedTimeZone}
		>
			<option value="" disabled>Pilih zona waktu</option>
			{#each timeZones as [key, value]}
				<option value={key}>{value}</option>
			{/each}
		</select>
		<button on:click={nextTimeZone}>
			<IconPanRight />
		</button>
	</div>
</div>

<style>
	.birthday-select {
		width: 100%;
		display: flex;
		flex-direction: column;
		align-items: center;
	}

	.birthday-select select {
		background-color: var(--t-bg-color-alt);
		color: inherit;
		border: 1px solid currentColor;
		padding: 8px 6px;
		margin: 8px 0;
		border-radius: 8px;
		width: 75%;
	}

	.birthday-select select:disabled {
		filter: opacity(0.7);
	}

	.select-container {
		display: flex;
		justify-content: space-between;
	}

	.select-container > button {
		background-color: transparent;
		border: 0;
		cursor: pointer;
	}
</style>
