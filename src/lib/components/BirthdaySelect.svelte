<script lang="ts">
	import { getContext, onMount } from 'svelte';
	import type { Readable, Writable } from 'svelte/store';
	import type { State } from '$lib/types';
	import { calculateNextBirthdayDate } from '$lib/util';
	import type { BirthdayData } from './Birthday.svelte';

	export let data: Pick<BirthdayData, 'targetMap' | 'timeZoneMap'>;
	const { targetMap, timeZoneMap } = data;
	const state = getContext('state') as Writable<State>;
	const time = getContext('time') as Readable<Date>;

	$: sortedTargets = Object.entries(targetMap).sort(
		([_, a], [__, b]) =>
			calculateNextBirthdayDate(a, { now: $time }).valueOf() -
			calculateNextBirthdayDate(b, { now: $time }).valueOf(),
	);
	onMount(() => {
		if ($state.selectedKey === '') {
			$state.selectedKey = sortedTargets[0][0];
		}
	});

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
	<div>
		<button on:click={prevKey}>
			<div class="t-icon i-mdi-pan-left" />
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
			<div class="t-icon i-mdi-pan-right" />
		</button>
	</div>

	<label for="timezone">Pilih zona waktu</label>
	<div>
		<button on:click={prevTimeZone}>
			<div class="t-icon i-mdi-pan-left" />
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
			<div class="t-icon i-mdi-pan-right" />
		</button>
	</div>
</div>

<style lang="less" global>
	.birthday-select {
		--uno: 'w-full flex flex-col items-center';

		> div {
			--uno: 'flex justify-between';
		}

		select {
			--uno: 'bg-$t-bg-color-alt color-inherit w-3/4 rounded-lg border border-solid border-current px-1.5 py-2 mx-0 my-2';

			&:disabled {
				filter: opacity(0.7);
			}
		}

		button {
			--uno: 'bg-transparent border-0';
		}
	}
</style>
