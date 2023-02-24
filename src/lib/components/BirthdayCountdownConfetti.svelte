<script lang="ts">
	import Particles from 'svelte-particles';
	import { loadConfettiPreset } from 'tsparticles-preset-confetti';

	let screenWidth: number;
	$: desktop = screenWidth >= 1024;

	type Option = Record<'x' | 'y', number> & { direction: string };
	$: options = (
		desktop
			? [
					// show particles from above the body
					{ direction: 'top', x: 20, y: -5 },
					{ direction: 'top', x: 80, y: -5 },
			  ]
			: [
					// show particles from left and right side of the body
					{ direction: 'top-right', x: -5, y: 20 },
					{ direction: 'top-left', x: 105, y: 20 },
			  ]
	) satisfies [Option, Option];

	$: rate = (
		desktop
			? // show more particles on desktop
			  { delay: 0.1, quantity: 10 }
			: { delay: 0.2, quantity: 5 }
	) satisfies Record<'delay' | 'quantity', number>;

	$: emitters = options.map(({ direction, ...position }) => ({
		particles: { move: { direction } },
		position,
		rate,
		life: { count: 0 }, // show indefinitely
	}));
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="absolute">
	<Particles
		id="tsparticles"
		options={{ preset: 'confetti', emitters }}
		particlesInit={loadConfettiPreset}
	/>
</div>
