<script lang="ts">
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { State } from './types';

	interface FooterLink {
		icon: string;
		title: string;
		href: string;
	}

	const links = <FooterLink[]>[
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

	const state = getContext('state') as Writable<State>;
	$: other = (
		$page.route.id === '/'
			? {
					icon: 'counter',
					title: 'Counter page',
					href: `/countdown/${$state.selectedKey.split(':')[0].replaceAll('_', '-')}`
			  }
			: {
					icon: 'home',
					title: 'Index page',
					href: `/?select=${$state.selectedKey}`
			  }
	) satisfies FooterLink;
</script>

<footer class="flex flex-col items-center">
	<div class="w-full flex justify-around">
		<a href={other.href} title={other.title}>
			<div class={`t-icon ${other.icon}`} />
		</a>

		{#each links as { icon, href, title }}
			<a rel="noreferrer" target="_blank" {title} {href}> <div class={`t-icon ${icon}`} /> </a>
		{/each}
	</div>
</footer>

<style>
	.counter {
		--uno: 'i-simple-icons-counterstrike';
	}

	.home {
		--uno: 'i-mdi-home';
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
