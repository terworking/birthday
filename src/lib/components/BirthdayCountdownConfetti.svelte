<script lang="ts">
	import Particles from 'svelte-particles';
	import { loadConfettiPreset } from 'tsparticles-preset-confetti';
	import type { Container, RecursivePartial } from 'tsparticles-engine';
	import type { Emitters } from 'tsparticles-plugin-emitters/types/Emitters';
	import type { Emitter } from 'tsparticles-plugin-emitters/types/Options/Classes/Emitter';

	export let enabled = false;

	let particlesContainer: Container | undefined;
	const handleParticlesLoaded = ({ detail }: CustomEvent<{ particles?: Container }>) => {
		particlesContainer = detail.particles;
	};

	$: {
		const emitters = particlesContainer?.plugins.get('emitters');
		if (emitters !== undefined) {
			// https://github.com/matteobruni/tsparticles/issues/1184#issuecomment-1233153193
			for (const emitter of (emitters as Emitters).array) {
				if (enabled) {
					emitter.play();
				} else {
					emitter.pause();
				}
			}
		}
	}

	let screenWidth: number;
	$: desktop = screenWidth >= 1024;

	$: rate = (
		desktop
			? // show more particles on desktop
			  { delay: 0.1, quantity: 10 }
			: { delay: 0.2, quantity: 5 }
	) satisfies Record<'delay' | 'quantity', number>;

	type PartialEmitter = Record<'x' | 'y', number> & { direction: string };
	$: emitters = (
		(desktop
			? [
					// show particles from above the body
					{ direction: 'top', x: 20, y: -5 } as const,
					{ direction: 'top', x: 80, y: -5 } as const,
			  ]
			: [
					// show particles from left and right side of the body
					{ direction: 'top-right', x: -5, y: 20 } as const,
					{ direction: 'top-left', x: 105, y: 20 } as const,
			  ]) satisfies [PartialEmitter, PartialEmitter]
	).map(({ direction, ...position }): RecursivePartial<Emitter> => {
		return {
			particles: { move: { direction } },
			position,
			rate,
			life: { count: 0 }, // show indefinitely
		};
	});
</script>

<svelte:window bind:innerWidth={screenWidth} />

<div class="absolute">
	<Particles
		id="tsparticles"
		on:particlesLoaded={handleParticlesLoaded}
		options={{ preset: 'confetti', emitters }}
		particlesInit={loadConfettiPreset}
	/>
</div>
