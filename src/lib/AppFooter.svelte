<script lang="ts">
	import { page } from '$app/stores';
	import { state, stateSelectedName } from './stores';

	interface FooterLink {
		icon: string;
		title: string;
		href: string;
	}

	const links = <FooterLink[]>[
		{
			icon: 'discord',
			title: 'Discord server invite',
			href: 'https://discord.gg/BMESwz5wE4',
		},
		{
			icon: 'github',
			title: 'Source code (GitHub)',
			href: 'https://github.com/terworking/birthday',
		},
		{
			icon: 'instagram',
			title: 'Instagram account',
			href: 'https://www.instagram.com/terworking/',
		},
		{
			icon: 'youtube',
			title: 'Youtube channel',
			href: 'https://www.youtube.com/@terworking',
		},
	];

	$: other = (
		$page.route.id === '/'
			? {
					icon: 'countdown',
					title: `${$stateSelectedName} countdown page`,
					href: `/countdown/${$stateSelectedName.replaceAll(' ', '-').toLowerCase()}`,
			  }
			: {
					icon: 'home',
					title: 'Index page',
					href: `/?select=${$state.selectedKey}`,
			  }
	) satisfies FooterLink;
</script>

<footer aria-label="Terworking links" class="flex flex-col items-center">
	<div class="w-full flex justify-around">
		<a href={other.href} aria-label={other.title} class="hint--top hint--bounce">
			<div class="t-icon {other.icon}" />
		</a>

		{#each links as { icon, href, title }}
			<a {href} rel="noreferrer" target="_blank" aria-label={title} class="hint--top hint--bounce">
				<div class="t-icon {icon}" />
			</a>
		{/each}
	</div>
</footer>

<style>
	.countdown {
		--uno: 'i-lucide-timer';
	}

	.home {
		--uno: 'i-lucide-home';
	}

	.discord {
		--uno: 'i-simple-icons-discord';
	}

	.github {
		--uno: 'i-simple-icons-github';
	}

	.instagram {
		--uno: 'i-simple-icons-instagram';
	}

	.youtube {
		--uno: 'i-simple-icons-youtube';
	}
</style>
