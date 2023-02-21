<script lang="ts">
	import { goto } from '$app/navigation';
	import { page } from '$app/stores';
	import { getContext } from 'svelte';
	import type { Writable } from 'svelte/store';
	import type { State } from './types';

	interface FooterLink {
		icon: string;
		title: string;
		href: string;
	}

	$: links = <FooterLink[]>[
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

	$: isIndex = $page.route.id === '/';
	const navigate = async () => {
		const url = new URL($page.url);
		const key = $state.selectedKey;

		if (isIndex) {
			url.pathname = `/countdown/${key}`;
		} else {
			url.pathname = '/';
			url.searchParams.set('select', key);
		}

		await goto(url);
	};
</script>

<footer class="flex flex-col items-center">
	<div class="w-full flex justify-around">
		<button
			on:click={() => navigate()}
			class:i-simple-icons-counterstrike={isIndex}
			class:i-mdi-home={!isIndex}
			class="t-icon cursor-pointer"
			title={`${isIndex ? 'Counter' : 'Index'} page`}
		/>
		{#each links as { icon, href, title }}
			<a rel="noreferrer" target="_blank" {title} {href}> <div class={`t-icon ${icon}`} /> </a>
		{/each}
	</div>
</footer>

<style>
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
