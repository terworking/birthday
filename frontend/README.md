# Birthday notify frontend (Astro @ Cloudflare Pages)

Using Astro here because ... uh well, why not?

## Setup

> You **need** to [deploy the backend](../backend/README.md#setup) before deploying the frontend because Astro needs to fetch the data from your backend at build-time.

1. Change `PUBLIC_BACKEND_SERVER` at [`.env.example`](.env.example) into your backend. (required)

2. Follow [Astro deployment guide for Cloudflare Pages](https://docs.astro.build/en/guides/deploy/cloudflare/). (required)

## Development

> You also **need** to run the backend (in development mode) for the same reason as [Setup](#setup).

Run `yarn dev`
