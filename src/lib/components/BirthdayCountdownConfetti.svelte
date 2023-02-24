<script lang="ts">
	import Particles from 'svelte-particles';
	import { loadConfettiPreset } from 'tsparticles-preset-confetti';

	let screenWidth: number;
	$: rate = (
		screenWidth > 1024
			? // show more particles on desktop
			  { delay: 0.1, quantity: 10 }
			: { delay: 0.2, quantity: 5 }
	) satisfies Record<'delay' | 'quantity', number>;

	$: emitters = [
		{ positionX: 5, moveDirection: 'top-right' },
		{ positionX: 95, moveDirection: 'top-left' },
	].map(({ positionX, moveDirection }) => {
		return {
			rate,
			life: { count: 0 },
			position: { x: positionX, y: 20 },
			particles: {
				move: { direction: moveDirection },
			},
		};
	});
</script>

<svelte:window bind:innerWidth={screenWidth} />

<Particles
	id="tsparticles"
	options={{ preset: 'confetti', emitters }}
	particlesInit={loadConfettiPreset}
/>

<style global>
	#tsparticles {
		position: absolute;
	}
</style>
