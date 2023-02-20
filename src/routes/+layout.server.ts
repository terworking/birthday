import { getPublicKeyFromJwk } from 'cf-webpush';
import type { LayoutServerLoad } from './$types';

export const load = (({ locals: { jwk } }) => {
	return { publicKey: getPublicKeyFromJwk(jwk) };
}) satisfies LayoutServerLoad;
