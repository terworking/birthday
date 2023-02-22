export default {
	async scheduled(_, env, ctx) {
		ctx.waitUntil(
			fetch(
				`https://api.github.com/repos/${env.OWNER}/${env.REPO}/actions/workflows/trigger.yaml/dispatches`,
				{
					body: JSON.stringify({ ref: 'main' }),
					method: 'POST',
					headers: {
						Accept: 'application/vnd.github+json; charset=utf-8',
						Authorization: `Bearer ${env.TOKEN}`,
						'X-GitHub-Api-Version': '2022-11-28',
						'User-Agent': 'worker-cron',
					},
				},
			),
		);
	},
};
