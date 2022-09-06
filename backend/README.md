# Birthday notify backend (Cloudflare Workers)

The backend handles the subscription (subscribe/unsubscribe) and (scheduling/sending) notifications.

## Setup

> Don't hesitate to open an issue if something is unclear in the instructions.

1. Replace the vars variable at `wrangler.example.toml`. (optional but recommended)

2. Rename `wrangler.example.toml` to `wrangler.toml`. (required)

3. [Create a new Workers KV](https://developers.cloudflare.com/workers/wrangler/workers-kv/#create-a-kv-namespace-with-wrangler) named `BIRTHDAY_SUBSCRIPTIONS` and add the binding to your `wrangler.toml`. (required)

4. Edit the `targets` variable at [`src/data.ts`](./src/data.ts). (required)

5. [Publish!](https://developers.cloudflare.com/workers/wrangler/commands/#publish).

## Development

Run `yarn dev`
