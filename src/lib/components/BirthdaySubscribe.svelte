<script lang="ts">
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { State } from '../types';
	import {
		askNotificationPermission,
		checkWebpushCompability,
		generateSubscriptionPayload
	} from '../webpush';
	import type { BirthdayData } from './Birthday.svelte';

	export let data: BirthdayData;
	const { publicKey } = data;
	const state = getContext('state') as Writable<State>;

	const subscribe = async () => {
		$state.disableInteraction = true;

		try {
			checkWebpushCompability();
			const permission = await askNotificationPermission();
			if (permission !== 'granted') {
				throw new Error('Unable to get notification permission.');
			}

			const payload = await generateSubscriptionPayload(
				$state.selectedKey,
				$state.selectedTimeZone,
				publicKey
			);

			const response = await fetch('/api/subscribe', {
				body: JSON.stringify(payload),
				method: 'POST'
			});

			const text = await response.text();
			if (response.ok) {
				alert('Successfully subscribed.');
			} else {
				throw new Error(text);
			}
		} catch (error) {
			alert(error);
		} finally {
			$state.disableInteraction = false;
		}
	};

	const unsubscribe = async () => {
		$state.disableInteraction = true;

		try {
			const payload = await generateSubscriptionPayload(
				$state.selectedKey,
				$state.selectedTimeZone,
				publicKey
			);
			const response = await fetch('/api/subscribe', {
				body: JSON.stringify(payload),
				method: 'DELETE'
			});

			const text = await response.text();
			if (response.ok) {
				alert('Successfully unsubscribed.');
			} else {
				throw new Error(text);
			}
		} catch (error) {
			alert(error);
		} finally {
			$state.disableInteraction = false;
		}
	};
</script>

<div class="w-full flex justify-evenly">
	<button on:click={subscribe} disabled={$state.disableInteraction}> Subscribe </button>
	<button on:click={unsubscribe} disabled={$state.disableInteraction}> Unsubscribe </button>
</div>

<style lang="less">
	button {
		--uno: 'bg-$t-bg-color-alt color-inherit border border-solid border-current px-2 py-1.5';

		&:not([disabled]) {
			--uno: 'cursor-pointer';
		}

		&:disabled {
			filter: opacity(0.7);
		}
	}
</style>
