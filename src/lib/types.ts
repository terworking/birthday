import type { PushSubscription } from 'cf-webpush';

export interface SubscriptionPayload {
	/**
	 * The target is the *target's* key that client wants to **subscribe** to.
	 */
	readonly target: string;
	/**
	 * The timeZone is the client's timeZone according to [IANA](https://www.iana.org/time-zones)
	 */
	readonly timeZone: string;
	/**
	 * The subscription is the `PushSubscription` object from the client's browser.
	 */
	readonly subscription: PushSubscription;
}

export type { PushSubscription };

export interface BirthdayTarget {
	name: string;
	date: number;
	month: number;
	year: number;
}

export interface NotificationPayload {
	readonly title: string;
	readonly body: string;
}

export interface State {
	disableInteraction: boolean;
	selectedKey: string;
	selectedTimeZone: string;
}
