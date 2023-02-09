<script lang="ts">
	import { getContext } from 'svelte';
	import { page } from '$app/stores';
	import type { Writable } from 'svelte/store';
	import type { State } from '../types';
	import {
		askNotificationPermission,
		checkWebpushCompability,
		generateSubscriptionPayload
	} from '../webpush';

	const { publicKey } = $page.data;
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

<div class="subscription-button-container">
	<button on:click={subscribe} disabled={$state.disableInteraction}> Subscribe </button>
	<button on:click={unsubscribe} disabled={$state.disableInteraction}> Unsubscribe </button>
</div>

<style>
	.subscription-button-container {
		width: 100%;
		display: flex;
		justify-content: space-evenly;
	}

	.subscription-button-container > button {
		background-color: var(--t-bg-color-alt);
		color: inherit;
		border: 1px solid currentColor;
		padding: 6px 8px;
	}

	.subscription-button-container > button:not([disabled]) {
		cursor: pointer;
	}

	.subscription-button-container > button:disabled {
		filter: opacity(0.7);
	}
</style>
