<script lang="ts">
	import AppClock from '$lib/AppClock.svelte';
	import AppFooter from '$lib/AppFooter.svelte';

	import 'modern-normalize';
	import 'hint.css';
</script>

<AppClock />
<slot />
<AppFooter />

<style uno:preflights global>
	@media (prefers-color-scheme: light) {
		:root {
			--t-bg-color: #fdf6e3;
			--t-bg-color-alt: #eee8d5;
			--t-color: #839496;
			--t-color-alt: #93a1a1;
		}
	}

	@media (prefers-color-scheme: dark) {
		:root {
			--t-bg-color: #002b36;
			--t-bg-color-alt: #073642;
			--t-color: #657b83;
			--t-color-alt: #586e75;
		}
	}

	body {
		--uno: 'font-sans bg-$t-bg-color text-$t-color';
	}

	.__root {
		--uno: 'flex flex-col items-center justify-between h-100vh p-8';
	}

	.__root > :not(.clock) {
		--uno: 'w-full max-w-sm';
	}

	.t-icon {
		--uno: '!text-$t-color !h-6 md:!h-8 !w-6 md:!w-8';
	}

	.t-icon:hover {
		--uno: '!text-$t-color-alt';
	}

	button {
		--uno: 'cursor-pointer bg-transparent border-0';
	}

	button:disabled {
		--uno: 'cursor-not-allowed';
		filter: opacity(0.8);
	}

	button[class*='hint--']:disabled::after {
		/* hint--error */
		background-color: #b34e4d;
		text-shadow: 0 -1px 0px #592726;

		/* hint--no-animate */
		-webkit-transition-duration: 0ms;
		-moz-transition-duration: 0ms;
		transition-duration: 0ms;
	}

	button[class*='hint--']:disabled::before {
		/* hint--no-animate */
		-webkit-transition-duration: 0ms;
		-moz-transition-duration: 0ms;
		transition-duration: 0ms;
	}
</style>
