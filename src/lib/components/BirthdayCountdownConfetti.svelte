<script lang="ts">
	import Particles from 'svelte-particles';
	import { loadConfettiPreset } from 'tsparticles-preset-confetti';
</script>

<Particles
	id="tsparticles"
	options={{
		preset: 'confetti',
		emitters: [
			{
				life: { count: 0 },
				position: { x: 5, y: 20 },
				particles: {
					move: { direction: 'top-right' },
				},
				rate: { delay: 0.2, quantity: 5 },
			},
			{
				life: { count: 0 },
				position: { x: 95, y: 20 },
				particles: {
					move: { direction: 'top-left' },
				},
				rate: { delay: 0.2, quantity: 5 },
			},
		],
	}}
	particlesInit={loadConfettiPreset}
/>

<style global>
	#tsparticles {
		position: absolute;
	}
</style>
