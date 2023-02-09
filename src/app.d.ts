/// <reference types="@sveltejs/kit" />
/// <reference types="unplugin-icons/types/svelte" />

import type { BirthdayTarget } from '$lib/types';
import type { KVNamespace } from '@cloudflare/workers-types';

// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		interface Locals {
			jwk: JsonWebKey;
		}
		interface PageData {
			publicKey: string;
			targetMap: Record<string, BirthdayTarget>;
			timeZoneMap: Record<string, string>;
		}
		interface Platform {
			env?: {
				BIRTHDAY_STORE: KVNamespace;
			};
		}
	}
}

export {};
