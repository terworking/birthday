<script lang="ts">
	import { onMount } from 'svelte';
	import { calculateNextBirthdayDate } from '$lib/util';
	import type { BirthdayData } from './Birthday.svelte';
	import { state, time } from '$lib/stores';

	export let data: Pick<BirthdayData, 'targetMap' | 'timeZoneMap'>;
	const { targetMap, timeZoneMap } = data;
	$: disabled = $state.disableInteraction;

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
	$: [previousTarget, nextTarget] = [-1, 1].map((it) => {
		const target = sortedTargets[(it + keyIndex + sortedTargets.length) % sortedTargets.length];
		return { key: target[0], ...target[1] };
	});

	$: timeZones = Object.entries(timeZoneMap);
	$: timeZoneIndex = timeZones.findIndex(([key]) => key === $state.selectedTimeZone);
	$: nextTimeZone = timeZones[(timeZoneIndex + 1) % timeZones.length][0];
	$: previousTimeZone = timeZones[(timeZoneIndex + timeZones.length - 1) % timeZones.length][0];
</script>

<div class="birthday-select">
	<label for="birthday">Pilih nama</label>
	<div>
		<button
			{disabled}
			aria-label={`Select previous name (${previousTarget.name})`}
			on:click={() => ($state.selectedKey = previousTarget.key)}
			class="hint--top hint--bounce"><div class="t-icon i-lucide-chevron-left" /></button
		>
		<select id="birthday" {disabled} bind:value={$state.selectedKey}>
			<option value="" disabled>Pilih nama</option>
			<option value="all">0 - SEMUA</option>
			{#each Object.entries(targetMap) as [key, { name }], i}
				<option value={key}>{i + 1} - {name}</option>
			{/each}
		</select>
		<button
			{disabled}
			aria-label={`Select next name (${nextTarget.name})`}
			on:click={() => ($state.selectedKey = nextTarget.key)}
			class="hint--top hint--bounce"><div class="t-icon i-lucide-chevron-right" /></button
		>
	</div>

	<label for="timezone">Pilih zona waktu</label>
	<div>
		<button
			{disabled}
			aria-label={`Select previous time zone (${previousTimeZone})`}
			on:click={() => ($state.selectedTimeZone = previousTimeZone)}
			class="hint--top hint--bounce"><div class="t-icon i-lucide-chevron-left" /></button
		>
		<select id="timezone" {disabled} bind:value={$state.selectedTimeZone}>
			<option value="" disabled>Pilih zona waktu</option>
			{#each timeZones as [key, value]}
				<option value={key}>{value}</option>
			{/each}
		</select>
		<button
			{disabled}
			aria-label={`Select next time zone (${nextTimeZone})`}
			on:click={() => ($state.selectedTimeZone = nextTimeZone)}
			class="hint--top hint--bounce"><div class="t-icon i-lucide-chevron-right" /></button
		>
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
