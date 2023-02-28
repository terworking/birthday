<script lang="ts">
	import { onMount } from 'svelte';
	import { calculateNextBirthdayDate } from '$lib/util';
	import type { BirthdayData } from './Birthday.svelte';
	import { state, time } from '$lib/stores';

	export let data: Pick<BirthdayData, 'targetMap' | 'timeZoneMap'>;
	const { targetMap, timeZoneMap } = data;

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
		<button
			aria-label="Select previous name"
			disabled={$state.disableInteraction}
			on:click={prevKey}
			class="t-icon i-lucide-chevron-left"
		/>
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
		<button
			aria-label="Select next name"
			disabled={$state.disableInteraction}
			on:click={nextKey}
			class="t-icon i-lucide-chevron-right"
		/>
	</div>

	<label for="timezone">Pilih zona waktu</label>
	<div>
		<button
			aria-label="Select previous time zone"
			disabled={$state.disableInteraction}
			on:click={prevTimeZone}
			class="t-icon i-lucide-chevron-left"
		/>
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
		<button
			aria-label="Select next time zone"
			disabled={$state.disableInteraction}
			on:click={nextTimeZone}
			class="t-icon i-lucide-chevron-right"
		/>
	</div>
</div>

<style lang="less" global>
	.birthday-select {
		--uno: 'w-full flex flex-col items-center';

		> div {
			--uno: 'flex items-center justify-between';
		}

		select {
			--uno: 'bg-$t-bg-color-alt color-inherit w-3/4 rounded-lg border border-solid border-current px-1.5 py-2 mx-0 my-2';

			&:disabled {
				filter: opacity(0.7);
			}
		}
	}
</style>
