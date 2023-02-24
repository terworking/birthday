<script lang="ts">
	import Particles from 'svelte-particles';
	import type { ParticlesEvents } from 'svelte-particles';
	import { loadConfettiPreset } from 'tsparticles-preset-confetti';

	export let enabled = false;

	let particlesContainer: ParticlesEvents['particlesLoaded']['detail']['particles'];
	const onParticlesLoaded = ({ detail }: ParticlesEvents['particlesLoaded']) => {
		particlesContainer = detail.particles;
		particlesContainer?.stop();
	};

	$: if (enabled) {
		particlesContainer?.refresh();
	} else {
		// @ts-expect-error https://github.com/matteobruni/tsparticles/issues/1184#issuecomment-1233153193
		const emitters = particlesContainer?.plugins.get('emitters')?.array;
		if (emitters !== undefined) {
			for (const emitter of emitters) {
				emitter.pause();
			}
		}
	}

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
		on:particlesLoaded={onParticlesLoaded}
		options={{ preset: 'confetti', emitters }}
		particlesInit={loadConfettiPreset}
	/>
</div>
