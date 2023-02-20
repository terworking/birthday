<script lang="ts">
	import IconDiscord from '~icons/simple-icons/discord';
	import IconGit from '~icons/simple-icons/git';
	import IconInstagram from '~icons/simple-icons/instagram';
	import IconRss from '~icons/simple-icons/rss';
	import IconYoutube from '~icons/simple-icons/youtube';

	interface FooterIcon {
		Icon: any;
		title: string;
		href: string;
	}

	const icons: FooterIcon[] = [
		{
			Icon: IconRss,
			title: 'RSS feed',
			href: '/rss.xml'
		},
		{
			Icon: IconDiscord,
			title: 'Discord server invite',
			href: 'https://discord.gg/BMESwz5wE4'
		},
		{
			Icon: IconGit,
			title: 'Source code',
			href: 'https://github.com/terworking/birthday-notify'
		},
		{
			Icon: IconInstagram,
			title: 'Instagram account',
			href: 'https://www.instagram.com/terworking/'
		},
		{
			Icon: IconYoutube,
			title: 'Youtube channel',
			href: 'https://www.youtube.com/@terworking'
		}
	];
</script>

<footer class="flex flex-col items-center">
	<div class="w-full flex justify-around">
		{#each icons as { Icon, href, title }}
			{@const [rel, target] = href.startsWith('https') ? ['noreferrer', '_blank'] : []}
			<a {rel} {target} {title} {href}>
				<Icon />
			</a>
		{/each}
	</div>
</footer>
