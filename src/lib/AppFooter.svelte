<script lang="ts">
	interface FooterIcon {
		icon: string;
		title: string;
		href: string;
	}

	const icons: FooterIcon[] = [
		{
			icon: 'rss',
			title: 'RSS feed',
			href: '/rss.xml'
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
	.rss {
		--uno: 'i-simple-icons-rss';
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
