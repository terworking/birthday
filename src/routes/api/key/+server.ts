import { text, type RequestHandler } from '@sveltejs/kit';
import { getPublicKeyFromJwk } from 'cf-webpush';

export const GET = (({ locals: { jwk } }) =>
	text(getPublicKeyFromJwk(jwk))) satisfies RequestHandler;
