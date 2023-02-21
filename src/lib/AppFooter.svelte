<script lang="ts">
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { State } from './types';

	interface FooterIcon {
		icon: string;
		title: string;
		href: string;
	}

	const state = getContext('state') as Writable<State>;

	$: ({ selectedKey } = $state);
	$: icons = <FooterIcon[]>[
		$page.route.id === '/'
			? {
					icon: 'counter',
					title: 'Counter page',
					href: `/countdown/${selectedKey}`
			  }
			: {
					icon: 'home',
					title: 'Index page',
					href: `/?select=${selectedKey}`
			  },
		{
			icon: 'discord',
			title: 'Discord server invite',
			href: 'https://discord.gg/BMESwz5wE4'
		},
		{
			icon: 'git',
			title: 'Source code',
			href: 'https://github.com/terworking/birthday-notify'
		},
		{
			icon: 'instagram',
			title: 'Instagram account',
			href: 'https://www.instagram.com/terworking/'
		},
		{
			icon: 'youtube',
			title: 'Youtube channel',
			href: 'https://www.youtube.com/@terworking'
		}
	];
</script>

<footer class="flex flex-col items-center">
	<div class="w-full flex justify-around">
		{#each icons as { icon, href, title }}
			{@const [rel, target] = href.startsWith('https') ? ['noreferrer', '_blank'] : []}
			<a {rel} {target} {title} {href}> <div class={`t-icon ${icon}`} /> </a>
		{/each}
	</div>
</footer>

<style>
	.home {
		--uno: 'i-mdi-home';
	}

	.counter {
		--uno: 'i-simple-icons-counterstrike';
	}

	.discord {
		--uno: 'i-simple-icons-discord';
	}

	.git {
		--uno: 'i-simple-icons-git';
	}

	.instagram {
		--uno: 'i-simple-icons-instagram';
	}

	.youtube {
		--uno: 'i-simple-icons-youtube';
	}
</style>
