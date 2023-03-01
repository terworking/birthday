<script lang="ts">
	import { state, stateSelectedName } from '$lib/stores';
	import {
		askNotificationPermission,
		checkWebpushCompability,
		generateSubscriptionPayload,
	} from '../webpush';
	import type { BirthdayData } from './Birthday.svelte';

	export let data: Pick<BirthdayData, 'publicKey'>;
	const { publicKey } = data;
	$: disabled = $state.disableInteraction;

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
				publicKey,
			);

			const response = await fetch('/api/subscribe', {
				body: JSON.stringify(payload),
				method: 'POST',
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
				publicKey,
			);
			const response = await fetch('/api/subscribe', {
				body: JSON.stringify(payload),
				method: 'DELETE',
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
	<button
		{disabled}
		aria-label={`Subscribe to "${$stateSelectedName}" push notification`}
		on:click={subscribe}
		class="hint--bottom hint--bounce"
	>
		Subscribe
	</button>
	<button
		{disabled}
		aria-label={`Unsubscribe from "${$stateSelectedName}" push notification`}
		on:click={unsubscribe}
		class="hint--bottom hint--bounce"
	>
		Unsubscribe
	</button>
</div>

<style>
	button {
		--uno: 'bg-$t-bg-color-alt color-inherit border border-solid border-current px-2 py-1.5';
	}
</style>
