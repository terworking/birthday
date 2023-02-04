<script lang="ts">
	import { getContext } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';
	import IconPanLeft from '~icons/mdi/pan-left';
	import IconPanRight from '~icons/mdi/pan-right';
	import type { BirthdayTarget, State } from '$lib/types';

	export let data: Record<string, BirthdayTarget>;
	export let timeZones: Record<string, string>;

	const state = getContext('state') as Writable<State>;
	const sortedTarget = getContext('sorted-target') as Readable<[string, BirthdayTarget][]>;

	$: keyIndex = 0;
	keyIndex = $sortedTarget?.findIndex(([key]) => key === $state.selectedKey);
	$: state.update((state) => ({ ...state, selectedKey: $sortedTarget[keyIndex][0] }));
	const nextKey = () => (keyIndex = (keyIndex + 1) % $sortedTarget.length);
	const prevKey = () => (keyIndex = (keyIndex + $sortedTarget.length - 1) % $sortedTarget.length);

	$: timeZonesArray = Object.entries(timeZones);
	$: timeZoneIndex = 0;
	timeZoneIndex = timeZonesArray?.findIndex(([key]) => key === $state.selectedTimeZone);
	$: state.update((state) => ({ ...state, selectedTimeZone: timeZonesArray[timeZoneIndex][0] }));
	const nextTimeZone = () => (timeZoneIndex = (timeZoneIndex + 1) % timeZonesArray.length);
	const prevTimeZone = () =>
		(timeZoneIndex = (timeZoneIndex + timeZonesArray.length - 1) % timeZonesArray.length);
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
			{#each Object.entries(data) as [key, { name }], i}
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
			{#each timeZonesArray as [key, value]}
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
